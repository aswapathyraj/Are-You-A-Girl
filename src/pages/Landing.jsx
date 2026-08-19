import { useCallback, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { useSound } from '../hooks/useSound.jsx'

export default function Landing({ onEnter }) {
  const { play } = useSound()
  const leaving = useRef(false)

  const go = useCallback(() => {
    if (leaving.current) return
    leaving.current = true
    play('click')
    onEnter()
  }, [onEnter, play])

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key !== 'Enter' || e.repeat) return
      // Let focused controls handle their own Enter key.
      if (e.target instanceof HTMLElement && e.target.closest('button, a, input, textarea, select')) return
      e.preventDefault()
      go()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [go])

  return (
    <motion.main
      className="m-auto w-full max-w-[34rem]"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16, scale: 0.99 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="card px-6 py-10 text-center sm:px-10 sm:py-14">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="inline-flex items-center gap-2 rounded-full border border-blush-100 bg-blush-50/80 px-3.5 py-1.5"
        >
          <ShieldCheck className="h-3.5 w-3.5 text-blush-400" aria-hidden="true" />
          <span className="label-mono text-blush-500">Personality Verification</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12 }}
          className="mt-7 text-[2.1rem] font-bold leading-[1.1] tracking-tight text-ink-900 sm:text-5xl"
        >
          Are You A Girl?
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-4 text-lg text-ink-600 sm:text-xl"
        >
          Let&apos;s find out.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.28 }}
          className="mx-auto mt-2.5 max-w-xs text-sm leading-relaxed text-ink-400"
        >
          A completely legitimate and definitely accurate test.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.36 }}
          className="mt-9"
        >
          <motion.button
            type="button"
            onClick={go}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
            className="btn-primary group h-14 w-full px-8 text-[0.95rem] uppercase tracking-[0.18em] sm:w-auto"
          >
            Enter
            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </motion.button>

          <p className="mt-4 text-xs text-ink-400">
            or press{' '}
            <kbd className="rounded-md border border-ink-200 bg-white px-1.5 py-0.5 font-mono text-[0.7rem] text-ink-500">
              Enter
            </kbd>
          </p>
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="label-mono mt-6 text-center text-ink-300"
      >
        Verification System v4.04
      </motion.p>
    </motion.main>
  )
}
