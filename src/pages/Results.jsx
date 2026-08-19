import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Loader2, RotateCcw, Users } from 'lucide-react'
import ResultCard from '../components/ResultCard'
import { METRICS, SUMMARY } from '../data/results'
import { useSound } from '../hooks/useSound.jsx'

/**
 * Delay before each step, in order:
 * 1-4 metrics · 5 dim + "Final Result" · 6 "Unfortunately..." · 7 the reveal
 */
const SCHEDULE = [400, 780, 780, 780, 1500, 900, 1350]

const SECOND_OPINION_MS = 2000
const SECOND_REVEAL_MS = 750

export default function Results({ onRestart }) {
  const { play } = useSound()
  const [step, setStep] = useState(0)
  const [view, setView] = useState('analysis')
  const [second, setSecond] = useState('idle')

  const playRef = useRef(play)
  playRef.current = play
  const opinionTimers = useRef([])

  useEffect(() => {
    let acc = 0
    const timers = SCHEDULE.map((ms, i) => {
      acc += ms
      return setTimeout(() => setStep(i + 1), acc)
    })
    return () => timers.forEach(clearTimeout)
  }, [])

  useEffect(
    () => () => {
      opinionTimers.current.forEach(clearTimeout)
      opinionTimers.current = []
    },
    [],
  )

  useEffect(() => {
    if (step === 0) return
    if (step <= METRICS.length) playRef.current('tick')
    else if (step === 7) playRef.current('reveal')
  }, [step])

  const askSecondOpinion = () => {
    if (second !== 'idle') return
    play('click')
    setSecond('loading')
    opinionTimers.current.push(
      setTimeout(() => {
        setSecond('received')
        opinionTimers.current.push(
          setTimeout(() => {
            setSecond('final')
            playRef.current('reveal')
          }, SECOND_REVEAL_MS),
        )
      }, SECOND_OPINION_MS),
    )
  }

  const accept = () => {
    play('click')
    setView('complete')
  }

  const dimmed = step >= 5

  return (
    <motion.main
      className="m-auto w-full max-w-[34rem]"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <AnimatePresence mode="wait">
        {view === 'analysis' ? (
          <motion.div
            key="analysis"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
          >
            <div className="mb-6 text-center sm:mb-8">
              <p className="label-mono">Step 04 · Report</p>
              <h1 className="mt-2.5 text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
                Personality Analysis
              </h1>
              <p className="mt-2 text-sm text-ink-500">Results are final and non-negotiable.</p>
            </div>

            <div className="card p-5 sm:p-7">
              <motion.div
                animate={{ opacity: dimmed ? 0.35 : 1 }}
                transition={{ duration: 0.7 }}
                className={`space-y-3 ${dimmed ? 'pointer-events-none' : ''}`}
              >
                {METRICS.map((metric, i) => (
                  <AnimatePresence key={metric.key}>
                    {step >= i + 1 && <ResultCard metric={metric} compact={dimmed} />}
                  </AnimatePresence>
                ))}
              </motion.div>

              <AnimatePresence>
                {step >= 5 && (
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="mt-7 border-t border-ink-100 pt-7 text-center"
                  >
                    <p className="label-mono text-ink-500">Final Result</p>

                    <div className="mt-4 min-h-[2rem]">
                      <AnimatePresence mode="wait">
                        {step === 6 && (
                          <motion.p
                            key="unfortunately"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="text-base text-ink-500"
                          >
                            Unfortunately...
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    <AnimatePresence>
                      {step >= 7 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <motion.h2
                            initial={{ opacity: 0, scale: 0.97 }}
                            animate={{ opacity: 1, scale: 1, x: [0, -7, 6, -4, 2, 0] }}
                            transition={{
                              duration: 0.5,
                              ease: 'easeOut',
                              x: { duration: 0.5, times: [0, 0.15, 0.3, 0.5, 0.72, 1] },
                            }}
                            className="text-[1.75rem] font-bold leading-tight tracking-tight text-ink-900 sm:text-5xl"
                          >
                            <span className="glitch glitch-fast" data-text="YOU ARE A BOY">
                              YOU ARE A BOY
                            </span>{' '}
                            <span aria-hidden="true">💀</span>
                          </motion.h2>

                          <motion.p
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45, delay: 0.45 }}
                            className="mx-auto mt-4 max-w-xs text-xs leading-relaxed text-ink-400"
                          >
                            According to our highly questionable scientific analysis.
                          </motion.p>

                          <motion.button
                            type="button"
                            onClick={accept}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45, delay: 0.7 }}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            className="btn-primary mt-7 h-14 w-full px-8 text-[0.9rem] uppercase
                              tracking-[0.16em] sm:w-auto"
                          >
                            Accept Result
                          </motion.button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="complete"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="card p-6 sm:p-9">
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
                  className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-blush-100 bg-blush-50"
                >
                  <CheckCircle2 className="h-5 w-5 text-blush-400" aria-hidden="true" />
                </motion.div>
                <h1 className="mt-4 text-[1.6rem] font-semibold tracking-tight text-ink-900 sm:text-4xl">
                  Verification Complete
                </h1>
              </div>

              <dl className="mt-7 divide-y divide-ink-100 overflow-hidden rounded-2xl border border-ink-100 bg-white/60">
                {SUMMARY.map((row, i) => (
                  <motion.div
                    key={row.label}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: 0.18 + i * 0.08 }}
                    className="flex items-center justify-between gap-4 px-4 py-3"
                  >
                    <dt className="text-sm text-ink-500">{row.label}</dt>
                    <dd className="tabular font-mono text-sm font-semibold text-ink-900">{row.value}</dd>
                  </motion.div>
                ))}
              </dl>

              <p className="mt-6 text-center text-sm text-ink-500">Thank you for participating.</p>

              <AnimatePresence mode="wait">
                {second === 'loading' && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6 flex flex-col items-center gap-3 rounded-2xl border border-ink-100 bg-white/60 p-6"
                  >
                    <Loader2 className="h-5 w-5 animate-spin text-lav-400" aria-hidden="true" />
                    <p className="font-mono text-sm text-ink-500">Consulting another system...</p>
                  </motion.div>
                )}

                {second === 'received' && (
                  <motion.div
                    key="received"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6 rounded-2xl border border-lav-200 bg-lav-50/70 p-6 text-center"
                  >
                    <p className="label-mono text-lav-500">Second opinion received.</p>
                  </motion.div>
                )}

                {second === 'final' && (
                  <motion.div
                    key="final"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mt-6 rounded-2xl border border-lav-200 bg-lav-50/70 p-6 text-center"
                  >
                    <p className="label-mono text-lav-500">Second opinion received.</p>
                    <motion.h2
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1, x: [0, -5, 4, -2, 0] }}
                      transition={{ duration: 0.45, x: { duration: 0.45, times: [0, 0.2, 0.4, 0.7, 1] } }}
                      className="mt-3 text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl"
                    >
                      <span className="glitch" data-text="Still a boy.">
                        Still a boy.
                      </span>{' '}
                      <span aria-hidden="true">💀</span>
                    </motion.h2>
                    <p className="mt-3 text-xs text-ink-400">
                      Unfortunately, the results are consistent.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-7 flex flex-col items-center gap-3">
                <motion.button
                  type="button"
                  onClick={onRestart}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary h-14 w-full px-8 text-[0.9rem] uppercase tracking-[0.16em] sm:w-auto"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  Run Test Again
                </motion.button>

                <AnimatePresence>
                  {second === 'idle' && (
                    <motion.button
                      type="button"
                      onClick={askSecondOpinion}
                      exit={{ opacity: 0, height: 0 }}
                      whileTap={{ scale: 0.98 }}
                      className="btn-ghost h-11 px-5 text-xs font-medium tracking-wide"
                    >
                      <Users className="h-3.5 w-3.5" aria-hidden="true" />
                      Get a Second Opinion
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              <p className="label-mono mt-7 text-center text-ink-300">Verification System v4.04</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
  )
}
