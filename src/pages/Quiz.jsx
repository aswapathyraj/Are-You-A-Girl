import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import QuizCard from '../components/QuizCard'
import { useSound } from '../hooks/useSound.jsx'
import {
  LATER_NO_MESSAGES,
  NO_GONE_MESSAGE,
  NO_MESSAGES,
  QUESTIONS,
  RELABEL_DONE_MESSAGE,
} from '../data/questions'

const ANALYZING_MS = 680
const INTERESTING_MS = 620
const VANISH_MS = 430
const FORCE_AFTER_VANISH_MS = 520
const FORCE_WHEN_ABSENT_MS = 2400

function initialNoState(question) {
  return {
    local: 0,
    fx: 0,
    fy: 0,
    scale: question.noMode === 'shrink' ? 0.84 : 1,
    label: 'NO',
    gone: question.noMode === 'none',
    disabled: question.noMode === 'disabled',
    vanishing: false,
    shakeKey: 0,
  }
}

/**
 * The refusal ladder. Returns the next NO state plus whether this attempt was
 * the one that finally removes the button.
 */
function escalateNo(question, state) {
  const local = state.local + 1
  const base = { ...state, local, shakeKey: state.shakeKey + 1, vanishing: false }
  const finished = { next: { ...base, vanishing: true }, vanish: true }

  switch (question.noMode) {
    case 'evade':
      if (local === 1) return { next: { ...base, fx: 0.17, fy: -0.2 }, vanish: false }
      if (local === 2) return { next: { ...base, fx: 0.06, fy: 0.3 }, vanish: false }
      if (local === 3) return { next: { ...base, fx: 0.2, fy: -0.28, scale: 0.62 }, vanish: false }
      return finished

    case 'shrink':
      if (local === 1) return { next: { ...base, scale: 0.58, fx: 0.14, fy: -0.16 }, vanish: false }
      if (local === 2) return { next: { ...base, scale: 0.34, fx: -0.1, fy: 0.26 }, vanish: false }
      return finished

    case 'flee':
      if (local === 1) return { next: { ...base, fx: -0.4, fy: -0.32, scale: 0.86 }, vanish: false }
      if (local === 2) return { next: { ...base, fx: 0.4, fy: 0.34, scale: 0.7 }, vanish: false }
      if (local === 3) return { next: { ...base, fx: -0.36, fy: 0.3, scale: 0.55 }, vanish: false }
      return finished

    case 'relabel': {
      const labels = ['NO?', 'N-NO', 'N…O', 'YES']
      const label = labels[Math.min(local, labels.length) - 1]
      const odd = local % 2 === 1
      return {
        next: {
          ...base,
          label,
          fx: odd ? 0.12 : -0.1,
          fy: odd ? 0.18 : -0.16,
          scale: Math.max(0.72, 1 - local * 0.07),
        },
        vanish: false,
      }
    }

    case 'disabled':
      if (local >= 2) return finished
      return { next: { ...base, fx: 0.05, fy: 0 }, vanish: false }

    default:
      return finished
  }
}

export default function Quiz({ onComplete }) {
  const { play } = useSound()
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState('asking')
  const [noState, setNoState] = useState(() => initialNoState(QUESTIONS[0]))
  const [taunt, setTaunt] = useState(null)
  const [attempts, setAttempts] = useState(0)
  const [forcing, setForcing] = useState(false)

  const phaseRef = useRef('asking')
  const timers = useRef([])
  const tauntId = useRef(0)

  const later = useCallback((fn, ms) => {
    const id = setTimeout(fn, ms)
    timers.current.push(id)
    return id
  }, [])

  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout)
      timers.current = []
    },
    [],
  )

  const question = QUESTIONS[index]

  const answer = useCallback(() => {
    if (phaseRef.current !== 'asking') return
    phaseRef.current = 'analyzing'
    setPhase('analyzing')
    setTaunt(null)
    setForcing(false)
    play('click')

    later(() => {
      phaseRef.current = 'interesting'
      setPhase('interesting')
    }, ANALYZING_MS)

    later(() => {
      if (index >= QUESTIONS.length - 1) {
        onComplete()
        return
      }
      setIndex(index + 1)
      setNoState(initialNoState(QUESTIONS[index + 1]))
      phaseRef.current = 'asking'
      setPhase('asking')
    }, ANALYZING_MS + INTERESTING_MS)
  }, [index, later, onComplete, play])

  const handleNoAttempt = useCallback(() => {
    if (phaseRef.current !== 'asking' || noState.gone) return

    // Once the button has rewritten itself into YES, let it do its job.
    if (noState.label === 'YES') {
      answer()
      return
    }

    const attempt = attempts + 1
    setAttempts(attempt)
    play('error')

    const { next, vanish } = escalateNo(question, noState)
    setNoState(next)
    if (vanish) {
      later(() => setNoState((s) => ({ ...s, gone: true, vanishing: false })), VANISH_MS)
    }

    let message
    if (attempt <= NO_MESSAGES.length) message = NO_MESSAGES[attempt - 1]
    else if (question.noMode === 'relabel' && next.label === 'YES') message = RELABEL_DONE_MESSAGE
    else if (vanish) message = NO_GONE_MESSAGE
    else message = LATER_NO_MESSAGES[(attempt - NO_MESSAGES.length - 1) % LATER_NO_MESSAGES.length]

    tauntId.current += 1
    setTaunt({ id: tauntId.current, text: message })
  }, [answer, attempts, later, noState, play, question])

  /** Desktop-only: after the first real attempt, NO also dodges the pointer. */
  const handleNoHover = useCallback(() => {
    if (phaseRef.current !== 'asking') return
    setNoState((s) => {
      if (s.gone || s.local < 1) return s
      const n = s.local + s.shakeKey
      return { ...s, fx: n % 2 === 0 ? 0.14 : -0.12, fy: n % 3 === 0 ? 0.26 : -0.24 }
    })
  }, [])

  // No NO left? The system helpfully answers on the user's behalf.
  useEffect(() => {
    if (phase !== 'asking' || !noState.gone) return
    const delay =
      question.noMode === 'none' && noState.local === 0 ? FORCE_WHEN_ABSENT_MS : FORCE_AFTER_VANISH_MS
    const id = setTimeout(() => setForcing(true), delay)
    return () => clearTimeout(id)
  }, [phase, noState.gone, noState.local, question.noMode])

  const handleForceStart = useCallback(() => play('force'), [play])

  return (
    <motion.main
      className="m-auto w-full max-w-[34rem]"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mb-6 text-center sm:mb-8">
        <p className="label-mono">Personality Verification</p>
        <h1 className="mt-2.5 text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
          Verification Test
        </h1>
        <p className="mt-2 text-sm text-ink-500">Please answer honestly.</p>
      </div>

      <QuizCard
        question={question}
        index={index}
        total={QUESTIONS.length}
        phase={phase}
        noState={noState}
        taunt={taunt}
        forcing={forcing}
        onAnswer={answer}
        onNoAttempt={handleNoAttempt}
        onNoHover={handleNoHover}
        onForceStart={handleForceStart}
      />
    </motion.main>
  )
}
