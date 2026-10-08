import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { profile } from '@/data/profile'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface LoaderProps {
  onDone: () => void
}

/**
 * Short premium loading sequence (~1.2s). Counts to 100 while the 3D scene
 * warms up behind it, then slides away.
 */
export function Loader({ onDone }: LoaderProps) {
  const reduced = useReducedMotion()
  const [progress, setProgress] = useState(0)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    if (reduced) {
      setProgress(100)
      const t = setTimeout(() => {
        setExiting(true)
        onDone()
      }, 150)
      return () => clearTimeout(t)
    }
    const start = performance.now()
    const duration = 1100
    let raf = 0
    let finished = false
    const finish = () => {
      if (finished) return
      finished = true
      setProgress(100)
      setExiting(true)
      onDone()
    }
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      // ease-out so it rushes early and settles at the end
      const eased = 1 - Math.pow(1 - t, 3)
      setProgress(Math.round(eased * 100))
      if (t < 1) raf = requestAnimationFrame(tick)
      else setTimeout(finish, 180)
    }
    raf = requestAnimationFrame(tick)
    // Hard ceiling: never hold the page hostage if rAF is throttled.
    const guard = setTimeout(finish, 2600)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(guard)
    }
  }, [onDone, reduced])

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-bg"
          exit={{ y: '-100%', transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } }}
          aria-live="polite"
          aria-label="Loading"
        >
          <div className="relative flex flex-col items-center">
            <motion.span
              className="font-mono text-[11px] tracking-[0.3em] text-muted"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {profile.shortName}
            </motion.span>
            <motion.span
              className="mt-3 text-[clamp(1.6rem,4vw,2.6rem)] font-medium tracking-[-0.03em] text-fg"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              Creative Developer
            </motion.span>
            <motion.span
              className="mt-6 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Initializing experience…
            </motion.span>
          </div>

          <div className="absolute bottom-10 left-5 right-5 flex items-end justify-between sm:left-10 sm:right-10 md:bottom-12">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-2">v1.0 · {profile.coordinates}</span>
            <span className="font-mono text-[clamp(2.4rem,8vw,5rem)] leading-none tracking-[-0.04em] text-fg tabular-nums">
              {progress}
              <span className="text-muted-2">%</span>
            </span>
          </div>
          <div className="absolute bottom-0 left-0 h-px w-full bg-white/10">
            <div className="h-full bg-accent transition-[width] duration-100 ease-linear" style={{ width: `${progress}%` }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
