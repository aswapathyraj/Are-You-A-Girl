import { motion } from 'framer-motion'
import { Flame, Hourglass, SearchX, Zap } from 'lucide-react'

const ICONS = {
  flame: Flame,
  hourglass: Hourglass,
  zap: Zap,
  search: SearchX,
}

const VALUE_TONE = {
  percent: 'text-ink-900',
  overflow: 'text-lav-500',
  error: 'text-blush-600',
}

/**
 * One analysed metric. `compact` collapses it to a single line once the final
 * result takes over the screen.
 */
export default function ResultCard({ metric, compact = false }) {
  const Icon = ICONS[metric.icon] ?? Flame
  const glitchy = metric.kind !== 'percent'

  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`rounded-2xl border border-ink-100 bg-white/70 transition-all duration-500 ${
        compact ? 'px-4 py-2.5' : 'p-4 sm:p-5'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <Icon className="h-4 w-4 shrink-0 text-blush-400" aria-hidden="true" />
          <span className="truncate text-sm font-semibold text-ink-700">{metric.label}</span>
        </div>

        <span
          className={`tabular shrink-0 font-mono font-semibold ${VALUE_TONE[metric.kind]} ${
            compact ? 'text-sm' : 'text-base sm:text-xl'
          }`}
        >
          {glitchy ? (
            <span className="glitch" data-text={metric.value}>
              {metric.value}
            </span>
          ) : (
            metric.value
          )}
        </span>
      </div>

      {!compact && (
        <>
          <div className="relative mt-3.5 h-2 overflow-hidden rounded-full bg-ink-100">
            {metric.kind === 'error' ? (
              <div
                className="absolute inset-0 opacity-70"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(90deg, #FCD4E2 0 6px, transparent 6px 14px)',
                }}
              />
            ) : (
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-blush-300 via-blush-400 to-lav-400"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, metric.percent)}%` }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
              >
                {metric.kind === 'overflow' && (
                  <>
                    <div
                      className="absolute inset-0 animate-stripes opacity-40"
                      style={{
                        backgroundImage:
                          'repeating-linear-gradient(115deg, rgba(255,255,255,0.9) 0 6px, transparent 6px 12px)',
                      }}
                    />
                    <span className="absolute right-1.5 top-1/2 -translate-y-1/2 font-mono text-[0.6rem] leading-none text-white/90">
                      ∞
                    </span>
                  </>
                )}
              </motion.div>
            )}

            {metric.kind === 'percent' && (
              <div className="absolute inset-0 overflow-hidden">
                <div className="h-full w-1/3 animate-shimmer bg-gradient-to-r from-transparent via-white/45 to-transparent" />
              </div>
            )}
          </div>

          <p className="mt-2.5 text-xs leading-relaxed text-ink-500">{metric.note}</p>
        </>
      )}
    </motion.div>
  )
}
