import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface TextRevealProps {
  text: string
  className?: string
  /** delay before the first word */
  delay?: number
  /** seconds between words */
  stagger?: number
  as?: 'h1' | 'h2' | 'p' | 'span'
  /** when false, waits (used to sync with loader) */
  start?: boolean
}

/**
 * Word-by-word masked reveal for headlines.
 */
export function TextReveal({ text, className, delay = 0, stagger = 0.06, as = 'span', start = true }: TextRevealProps) {
  const reduced = useReducedMotion()
  const Tag = as
  const words = text.split(' ')
  return (
    <Tag className={cn('inline', className)} aria-label={text}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <motion.span
            aria-hidden
            className="inline-block will-change-transform"
            initial={reduced ? false : { y: '110%', opacity: 0 }}
            animate={start ? { y: '0%', opacity: 1 } : {}}
            transition={{ duration: reduced ? 0 : 1, delay: reduced ? 0 : delay + i * stagger, ease: [0.16, 1, 0.3, 1] }}
          >
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}
