import { useEffect, useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'

const WORDS = ['Estética', 'Atitude', 'Presença']
const DURATION_MS = 2000

type LoadingScreenProps = {
  onComplete: () => void
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [count, setCount] = useState(0)
  const [wordIndex, setWordIndex] = useState(0)

  useEffect(() => {
    let raf = 0
    let timeout = 0
    const start = performance.now()
    const step = (now: number) => {
      const progress = Math.min((now - start) / DURATION_MS, 1)
      setCount(Math.round(progress * 100))
      if (progress < 1) {
        raf = requestAnimationFrame(step)
      } else {
        timeout = window.setTimeout(onComplete, 400)
      }
    }
    raf = requestAnimationFrame(step)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(timeout)
    }
  }, [onComplete])

  useEffect(() => {
    const id = setInterval(
      () => setWordIndex((i) => (i + 1) % WORDS.length),
      650,
    )
    return () => clearInterval(id)
  }, [])

  return (
    <m.div
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      className="fixed inset-0 z-[9999] bg-bg"
    >
      <m.p
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute left-8 top-8 text-xs uppercase tracking-[0.3em] text-muted"
      >
        Rockstar Studio
      </m.p>

      <div className="absolute inset-0 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {count < 100 && (
            <m.span
              key={wordIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="font-display text-4xl italic text-text-primary/80 md:text-6xl lg:text-7xl"
            >
              {WORDS[wordIndex]}
            </m.span>
          )}
        </AnimatePresence>
      </div>

      <p className="absolute bottom-10 right-8 font-display text-6xl tabular-nums text-text-primary md:text-8xl lg:text-9xl">
        {String(count).padStart(3, '0')}
      </p>

      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-stroke/50">
        <div
          className="accent-gradient h-full origin-left"
          style={{
            transform: `scaleX(${count / 100})`,
            boxShadow: '0 0 8px rgba(123, 47, 247, 0.45)',
          }}
        />
      </div>
    </m.div>
  )
}
