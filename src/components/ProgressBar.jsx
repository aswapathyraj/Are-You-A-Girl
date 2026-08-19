import { motion } from 'framer-motion'

/**
 * Thin progress bar. `value` is 0–1.
 */
export default function ProgressBar({ value, className = '' }) {
  const pct = Math.max(0, Math.min(1, value)) * 100

  return (
    <div
      className={`relative h-1.5 w-full overflow-hidden rounded-full bg-ink-100 ${className}`}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
    >
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-blush-300 via-blush-400 to-lav-400"
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      />
    </div>
  )
}
