import { motion } from 'framer-motion'

const R = 52
const CIRCUMFERENCE = 2 * Math.PI * R

/**
 * Minimalist circular scanner. Purely decorative — nothing is being measured,
 * no camera or microphone is involved.
 */
export default function ScanAnimation({ progress, done }) {
  const clamped = Math.max(0, Math.min(100, progress))
  const offset = CIRCUMFERENCE * (1 - clamped / 100)

  return (
    <div className="relative mx-auto h-48 w-48 sm:h-56 sm:w-56">
      {/* Soft halo */}
      <div className="absolute inset-6 rounded-full bg-gradient-to-br from-blush-100 via-white to-lav-100 blur-2xl" />

      {/* Pulsing rings */}
      <span className="absolute inset-0 rounded-full border border-blush-200/70 motion-reduce:hidden animate-pulse-ring" />
      <span
        className="absolute inset-0 rounded-full border border-lav-200/70 motion-reduce:hidden animate-pulse-ring"
        style={{ animationDelay: '1.3s' }}
      />

      {/* Rotating sweep */}
      <div className="absolute inset-0 animate-spin-slow motion-reduce:animate-none">
        <svg viewBox="0 0 120 120" className="h-full w-full">
          <defs>
            <linearGradient id="sweepGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#F8B4CB" stopOpacity="0" />
              <stop offset="100%" stopColor="#B4A4EF" stopOpacity="0.85" />
            </linearGradient>
          </defs>
          <circle
            cx="60"
            cy="60"
            r={R}
            fill="none"
            stroke="url(#sweepGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={`${CIRCUMFERENCE * 0.28} ${CIRCUMFERENCE}`}
          />
        </svg>
      </div>

      {/* Progress ring */}
      <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full -rotate-90">
        <defs>
          <linearGradient id="scanGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F8B4CB" />
            <stop offset="55%" stopColor="#F291B3" />
            <stop offset="100%" stopColor="#B4A4EF" />
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r={R} fill="none" stroke="#EFEDF3" strokeWidth="5" />
        <circle
          cx="60"
          cy="60"
          r={R}
          fill="none"
          stroke="url(#scanGradient)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 120ms linear' }}
        />
      </svg>

      {/* Readout */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          key={done ? 'done' : 'running'}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="tabular font-mono text-3xl font-medium text-ink-900 sm:text-4xl"
        >
          {Math.round(clamped)}
          <span className="text-lg text-ink-400 sm:text-xl">%</span>
        </motion.span>
        <span className="label-mono mt-1.5 text-ink-300">{done ? 'Complete' : 'Scanning'}</span>
      </div>
    </div>
  )
}
