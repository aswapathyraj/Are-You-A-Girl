import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { MousePointer2 } from 'lucide-react'

/**
 * A fake cursor drawn *inside* the page. The real system cursor is never
 * touched or hidden — this is just an icon that glides between two points
 * expressed in the answer area's own coordinate space.
 */
export default function FakeCursor({ visible, from, to, duration = 0.95, clicking = false }) {
  const reduce = useReducedMotion()
  const glide = reduce ? 0.12 : duration

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="pointer-events-none absolute left-0 top-0 z-30"
          initial={{ x: from.x, y: from.y, opacity: 0, scale: 0.85 }}
          animate={{ x: to.x, y: to.y, opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{
            x: { duration: glide, ease: [0.22, 1, 0.36, 1] },
            y: { duration: glide, ease: [0.22, 1, 0.36, 1] },
            opacity: { duration: 0.22 },
            scale: { duration: 0.28 },
          }}
        >
          <motion.div
            animate={clicking ? { scale: [1, 0.82, 1] } : { scale: 1 }}
            transition={{ duration: 0.28 }}
            className="relative"
          >
            <MousePointer2
              className="h-5 w-5 fill-white text-ink-800 drop-shadow-[0_2px_4px_rgba(35,31,40,0.35)]"
              strokeWidth={1.75}
              aria-hidden="true"
            />
            <AnimatePresence>
              {clicking && !reduce && (
                <motion.span
                  className="absolute left-1 top-1 -ml-4 -mt-4 h-8 w-8 rounded-full border border-blush-400/70"
                  initial={{ scale: 0.3, opacity: 0.8 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.55, ease: 'easeOut' }}
                />
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
