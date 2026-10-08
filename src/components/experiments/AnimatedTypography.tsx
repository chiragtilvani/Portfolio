import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { useInViewOnce } from '@/hooks/useInViewOnce'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const WORDS = ['ALIVE', 'DESIGN', 'MOTION', 'SYSTEMS', 'CODE']
const GLYPHS = '!<>-_\\/[]{}—=+*^?#01'

/** Scramble-reveal typography. Click to cycle words; hover letters to lift them. */
export function AnimatedTypography() {
  const { ref, inView } = useInViewOnce<HTMLDivElement>()
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [display, setDisplay] = useState(() => WORDS[0].split(''))
  const [settled, setSettled] = useState<boolean[]>(() => WORDS[0].split('').map(() => false))
  const raf = useRef(0)

  const scrambleTo = useCallback(
    (word: string) => {
      cancelAnimationFrame(raf.current)
      const chars = word.split('')
      if (reduced) {
        setDisplay(chars)
        setSettled(chars.map(() => true))
        return
      }
      const start = performance.now()
      const perChar = 70
      const tick = (now: number) => {
        const t = now - start
        const next = chars.map((c, i) => (t > 160 + i * perChar ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
        const done = chars.map((_, i) => t > 160 + i * perChar)
        setDisplay(next)
        setSettled(done)
        if (!done.every(Boolean)) raf.current = requestAnimationFrame(tick)
      }
      raf.current = requestAnimationFrame(tick)
    },
    [reduced],
  )

  useEffect(() => {
    if (inView) scrambleTo(WORDS[0])
    return () => cancelAnimationFrame(raf.current)
  }, [inView, scrambleTo])

  const cycle = () => {
    const next = (index + 1) % WORDS.length
    setIndex(next)
    scrambleTo(WORDS[next])
  }

  return (
    <div ref={ref} className="flex h-full w-full flex-col items-center justify-center gap-5">
      <button
        onClick={cycle}
        data-cursor="hover"
        aria-label={`Current word ${WORDS[index]}. Click to change word`}
        className="flex items-baseline font-mono text-[clamp(2.4rem,6vw,3.6rem)] font-medium leading-none tracking-[-0.02em] text-fg"
      >
        {display.map((ch, i) => (
          <motion.span
            key={`${index}-${i}`}
            whileHover={reduced ? undefined : { y: -10, color: '#4fc3ff' }}
            transition={{ type: 'spring', stiffness: 380, damping: 18 }}
            className="inline-block min-w-[0.6em] text-center"
            style={{ color: settled[i] ? undefined : '#8b7cf6', opacity: settled[i] ? 1 : 0.7 }}
          >
            {ch}
          </motion.span>
        ))}
      </button>
      <span className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-muted-2">click to scramble · hover letters</span>
    </div>
  )
}
