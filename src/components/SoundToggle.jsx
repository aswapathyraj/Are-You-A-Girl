import { motion } from 'framer-motion'
import { Volume2, VolumeX } from 'lucide-react'
import { useSound } from '../hooks/useSound.jsx'

export default function SoundToggle() {
  const { enabled, toggle } = useSound()

  return (
    <motion.button
      type="button"
      onClick={toggle}
      aria-pressed={enabled}
      title={enabled ? 'Turn sound off' : 'Turn sound on'}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.94 }}
      className="fixed right-4 top-4 z-50 flex items-center gap-2 rounded-full border border-white/80 bg-white/70
        px-3 py-2 text-ink-500 shadow-soft backdrop-blur-md transition-colors hover:text-ink-800 sm:right-6 sm:top-6"
    >
      {enabled ? <Volume2 className="h-4 w-4" aria-hidden="true" /> : <VolumeX className="h-4 w-4" aria-hidden="true" />}
      <span className="label-mono hidden text-ink-400 sm:inline">{enabled ? 'Sound on' : 'Sound off'}</span>
      <span className="sr-only">{enabled ? 'Turn sound off' : 'Turn sound on'}</span>
    </motion.button>
  )
}
