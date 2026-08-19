import { useState } from 'react'
import { AnimatePresence, MotionConfig } from 'framer-motion'
import { SoundProvider } from './hooks/useSound.jsx'
import SoundToggle from './components/SoundToggle'
import Landing from './pages/Landing'
import Quiz from './pages/Quiz'
import Scan from './pages/Scan'
import Results from './pages/Results'

/** Soft pastel background: a gradient, three blurred blobs, a faint dot grid. */
function Backdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-gradient-to-br from-blush-50 via-white to-lav-50" />
      <div className="absolute -left-24 -top-28 h-[26rem] w-[26rem] rounded-full bg-blush-100/60 blur-3xl" />
      <div className="absolute -bottom-32 -right-24 h-[30rem] w-[30rem] rounded-full bg-lav-100/70 blur-3xl" />
      <div className="absolute right-1/4 top-1/3 h-64 w-64 rounded-full bg-peach-100/50 blur-3xl" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'radial-gradient(#DCD8E2 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      />
      <span className="absolute left-[12%] top-[22%] h-1.5 w-1.5 animate-float rounded-full bg-blush-300/70 motion-reduce:animate-none" />
      <span
        className="absolute right-[14%] top-[64%] h-2 w-2 animate-float rounded-full bg-lav-300/60 motion-reduce:animate-none"
        style={{ animationDelay: '2.2s' }}
      />
    </div>
  )
}

export default function App() {
  const [stage, setStage] = useState('landing')
  // Bumped on "Run test again" so every page remounts with fresh state.
  const [run, setRun] = useState(0)

  const restart = () => {
    setRun((n) => n + 1)
    setStage('landing')
  }

  return (
    <SoundProvider>
      <MotionConfig reducedMotion="user">
        <div className="relative min-h-[100svh] w-full">
          <Backdrop />
          <SoundToggle />

          <div className="relative z-10 flex min-h-[100svh] flex-col px-4 py-14 sm:px-6 sm:py-16">
            <AnimatePresence mode="wait">
              {stage === 'landing' && <Landing key={`landing-${run}`} onEnter={() => setStage('quiz')} />}
              {stage === 'quiz' && <Quiz key={`quiz-${run}`} onComplete={() => setStage('scan')} />}
              {stage === 'scan' && <Scan key={`scan-${run}`} onDone={() => setStage('results')} />}
              {stage === 'results' && <Results key={`results-${run}`} onRestart={restart} />}
            </AnimatePresence>
          </div>
        </div>
      </MotionConfig>
    </SoundProvider>
  )
}
