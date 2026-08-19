import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Check, Loader2, X } from 'lucide-react'
import ProgressBar from './ProgressBar'
import FakeCursor from './FakeCursor'

const BTN_H = 56
const GAP = 18
const AREA_H_STACKED = 208
const AREA_H_ROW = 172
const STACK_BREAKPOINT = 430

const clamp = (v, min, max) => (min > max ? (min + max) / 2 : Math.max(min, Math.min(max, v)))

/**
 * One question, two answers, and a NO button that has its own opinions.
 *
 * All positioning is measured from the answer area itself rather than from
 * media queries, so the NO button can never escape the card or push the page
 * sideways on any screen size.
 */
export default function QuizCard({
  question,
  index,
  total,
  phase,
  noState,
  taunt,
  forcing,
  onAnswer,
  onNoAttempt,
  onNoHover,
  onForceStart,
}) {
  const reduce = useReducedMotion()
  const areaRef = useRef(null)
  const [width, setWidth] = useState(0)

  const [cursor, setCursor] = useState(null)
  const [glow, setGlow] = useState(false)
  const [clicking, setClicking] = useState(false)

  // Latest-callback refs keep the forced-answer timeline out of the effect deps,
  // so a resize mid-animation can never cancel it.
  const onAnswerRef = useRef(onAnswer)
  const onForceStartRef = useRef(onForceStart)
  onAnswerRef.current = onAnswer
  onForceStartRef.current = onForceStart

  useLayoutEffect(() => {
    const el = areaRef.current
    if (!el) return
    const measure = () => setWidth(el.clientWidth)
    measure()
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measure)
      return () => window.removeEventListener('resize', measure)
    }
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const geo = useMemo(() => {
    const w = width
    const stacked = w < STACK_BREAKPOINT
    const bw = stacked ? clamp(w * 0.62, 172, 260) : 176
    const areaH = stacked ? AREA_H_STACKED : AREA_H_ROW
    const yes = stacked
      ? { cx: w / 2, cy: areaH / 2 - (BTN_H + GAP) / 2 }
      : { cx: w / 2 - (bw + GAP) / 2, cy: areaH / 2 }
    const no = stacked
      ? { cx: w / 2, cy: areaH / 2 + (BTN_H + GAP) / 2 }
      : { cx: w / 2 + (bw + GAP) / 2, cy: areaH / 2 }
    return { stacked, bw, areaH, yes, no }
  }, [width])

  const geoRef = useRef(geo)
  geoRef.current = geo
  const widthRef = useRef(width)
  widthRef.current = width

  /** NO's requested offset, clamped inside the area and away from YES. */
  const offset = useMemo(() => {
    const { stacked, bw, areaH, yes, no } = geo
    if (!width) return { x: 0, y: 0 }
    const scale = noState.scale ?? 1
    const halfW = (bw * scale) / 2
    const halfH = (BTN_H * scale) / 2

    let minX = halfW + 2 - no.cx
    let maxX = width - halfW - 2 - no.cx
    let minY = halfH + 2 - no.cy
    let maxY = areaH - halfH - 2 - no.cy

    if (stacked) minY = Math.max(minY, yes.cy + BTN_H / 2 + 12 + halfH - no.cy)
    else minX = Math.max(minX, yes.cx + bw / 2 + 12 + halfW - no.cx)

    return {
      x: clamp(noState.fx * width, minX, maxX),
      y: clamp(noState.fy * areaH, minY, maxY),
    }
  }, [geo, width, noState.fx, noState.fy, noState.scale])

  // Reset the takeover whenever a new question loads.
  useEffect(() => {
    setCursor(null)
    setGlow(false)
    setClicking(false)
  }, [question.id])

  // The takeover itself: cursor glides in, YES lights up, YES gets "clicked".
  useEffect(() => {
    if (!forcing) return
    const { yes, no, areaH } = geoRef.current
    const w = widthRef.current
    const from = {
      x: Math.min(Math.max(w - 14, 0), no.cx + 26),
      y: Math.min(areaH - 10, no.cy + 46),
    }
    const to = { x: yes.cx + 26, y: yes.cy + 16 }
    setCursor({ from, to })
    onForceStartRef.current?.()

    const glide = reduce ? 160 : 950
    const timers = [
      setTimeout(() => setGlow(true), glide),
      setTimeout(() => setClicking(true), glide + 320),
      setTimeout(() => onAnswerRef.current?.({ forced: true }), glide + 520),
    ]
    return () => timers.forEach(clearTimeout)
  }, [forcing, question.id, reduce])

  const asking = phase === 'asking'
  const progress = (index + (asking ? 0 : 1)) / total
  const shakeFrames = noState.vanishing ? [0, -9, 9, -7, 7, -4, 0] : [0, -5, 5, -3, 3, 0]
  const noSlot = {
    left: geo.no.cx - geo.bw / 2,
    top: geo.no.cy - BTN_H / 2,
    width: geo.bw,
    height: BTN_H,
  }

  return (
    <div className="card p-5 sm:p-7">
      <div className="flex items-center justify-between gap-4">
        <span className="label-mono text-ink-500">
          Question {index + 1} / {total}
        </span>
        <span className="label-mono hidden text-ink-300 sm:inline">{question.tag}</span>
      </div>

      <ProgressBar value={progress} className="mt-3" />

      <div className="relative mt-7 h-28 sm:h-24">
        <AnimatePresence mode="wait">
          <motion.h2
            key={question.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 flex items-center justify-center text-balance text-center text-xl
              font-semibold leading-snug tracking-tight text-ink-900 sm:text-2xl"
          >
            {question.text}
          </motion.h2>
        </AnimatePresence>
      </div>

      <div ref={areaRef} className="relative" style={{ height: geo.areaH }} aria-live="polite">
        <AnimatePresence mode="wait">
          {asking ? (
            <motion.div
              key="answers"
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: width ? 1 : 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {/* YES */}
              <motion.button
                type="button"
                onClick={() => onAnswer({ forced: false })}
                style={{
                  left: geo.yes.cx - geo.bw / 2,
                  top: geo.yes.cy - BTN_H / 2,
                  width: geo.bw,
                  height: BTN_H,
                }}
                className={`btn-base absolute text-[0.95rem] uppercase tracking-[0.14em] bg-gradient-to-b
                  from-blush-400 to-blush-500 text-white shadow-btn hover:from-blush-300
                  ${glow ? 'ring-4 ring-blush-300/70' : ''}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0, scale: glow ? [1, 1.05, 1.02] : 1 }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.32 }}
              >
                <Check className="h-4 w-4" aria-hidden="true" />
                Yes
              </motion.button>

              {/* NO — never actually selectable */}
              <AnimatePresence>
                {!noState.gone && (
                  <motion.div
                    key="no-slot"
                    className="absolute"
                    style={noSlot}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{
                      opacity: noState.disabled ? 0.55 : 1,
                      x: offset.x,
                      y: offset.y,
                      scale: noState.scale,
                    }}
                    exit={{ opacity: 0, scale: 0.4, filter: 'blur(3px)' }}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 24,
                      opacity: { duration: 0.25 },
                    }}
                  >
                    <motion.div
                      key={noState.shakeKey}
                      className="h-full w-full"
                      animate={noState.shakeKey === 0 ? undefined : { x: shakeFrames }}
                      transition={{ duration: noState.vanishing ? 0.42 : 0.3, ease: 'easeInOut' }}
                    >
                      <button
                        type="button"
                        onClick={onNoAttempt}
                        onPointerEnter={(e) => {
                          if (e.pointerType === 'mouse') onNoHover()
                        }}
                        aria-disabled={noState.disabled || undefined}
                        title={noState.disabled ? 'Option unavailable' : undefined}
                        className={`btn-base h-full w-full border text-[0.95rem] uppercase tracking-[0.14em]
                          ${
                            noState.disabled
                              ? 'cursor-not-allowed border-ink-200 bg-ink-100/70 text-ink-400'
                              : 'border-ink-200 bg-white text-ink-600 hover:border-blush-200 hover:text-ink-800'
                          }`}
                      >
                        <X className="h-4 w-4 shrink-0" aria-hidden="true" />
                        <span className="truncate">{noState.label}</span>
                      </button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* The slot NO used to occupy */}
              {noState.gone && (
                <motion.div
                  className="absolute flex items-center justify-center rounded-2xl border border-dashed
                    border-ink-200 bg-white/40"
                  style={noSlot}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  <span className="label-mono text-ink-300">No · removed</span>
                </motion.div>
              )}

              <FakeCursor
                visible={Boolean(cursor)}
                from={cursor?.from ?? { x: 0, y: 0 }}
                to={cursor?.to ?? { x: 0, y: 0 }}
                clicking={clicking}
              />
            </motion.div>
          ) : (
            <motion.div
              key={phase}
              className="absolute inset-0 flex flex-col items-center justify-center gap-3"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.24 }}
            >
              {phase === 'analyzing' ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin text-blush-400" aria-hidden="true" />
                  <p className="label-mono text-ink-400">Analyzing...</p>
                </>
              ) : (
                <p className="text-lg font-medium text-ink-700 sm:text-xl">Interesting.</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-1 flex h-6 items-center justify-center">
        <AnimatePresence mode="wait">
          {taunt && (
            <motion.p
              key={taunt.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
              className="font-mono text-xs text-blush-500"
            >
              {taunt.text}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
