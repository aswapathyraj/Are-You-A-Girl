import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import ScanAnimation from '../components/ScanAnimation'
import ProgressBar from '../components/ProgressBar'
import { SCAN_STATUSES } from '../data/results'
import { useSound } from '../hooks/useSound.jsx'

/** [target %, duration ms] — deliberately uneven so it feels like real work. */
const TIMELINE = [
  [18, 900],
  [36, 1050],
  [52, 900],
  [60, 1250],
  [77, 1000],
  [88, 1050],
  [96, 900],
  [100, 700],
]

const TOTAL_MS = TIMELINE.reduce((sum, [, ms]) => sum + ms, 0)

export default function Scan({ onDone }) {
  const { play, startScan, stopScan } = useSound()
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  useEffect(() => {
    startScan()
    return () => stopScan()
  }, [startScan, stopScan])

  useEffect(() => {
    let raf = 0
    let start = null

    const tick = (now) => {
      if (start === null) start = now
      const elapsed = now - start

      let acc = 0
      let from = 0
      let value = 100
      for (const [to, ms] of TIMELINE) {
        if (elapsed < acc + ms) {
          value = from + (to - from) * ((elapsed - acc) / ms)
          break
        }
        acc += ms
        from = to
        value = to
      }

      setProgress(Math.min(100, Math.max(0, value)))
      if (elapsed < TOTAL_MS) raf = requestAnimationFrame(tick)
      else {
        setProgress(100)
        setDone(true)
      }
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    if (!done) return
    stopScan()
    play('complete')
    const id = setTimeout(() => onDoneRef.current(), 1150)
    return () => clearTimeout(id)
  }, [done, play, stopScan])

  const statusIndex = Math.min(SCAN_STATUSES.length - 1, Math.floor(progress / 20))
  const status = done ? 'Analysis complete.' : SCAN_STATUSES[statusIndex]

  return (
    <motion.main
      className="m-auto w-full max-w-[34rem]"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mb-6 text-center sm:mb-8">
        <p className="label-mono">Step 03 · Processing</p>
        <h1 className="mt-2.5 text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
          Analyzing Results
        </h1>
        <p className="mt-2 text-sm text-ink-500">Please wait...</p>
      </div>

      <div className="card px-6 py-9 sm:px-10 sm:py-11">
        <ScanAnimation progress={progress} done={done} />

        <div className="mt-8 flex h-6 items-center justify-center" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.p
              key={status}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28 }}
              className={`font-mono text-sm ${done ? 'text-ink-800' : 'text-ink-500'}`}
            >
              {status}
            </motion.p>
          </AnimatePresence>
        </div>

        <ProgressBar value={progress / 100} className="mt-6" />

        <div className="mt-3 flex items-center justify-between">
          <span className="label-mono text-ink-300">Verification System v4.04</span>
          <span className="label-mono tabular text-ink-300">{Math.round(progress)}%</span>
        </div>
      </div>
    </motion.main>
  )
}
