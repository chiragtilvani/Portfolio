import { motion, type Variants } from 'motion/react'
import type { ReactNode } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface RevealProps {
  children: ReactNode
  delay?: number
  duration?: number
  y?: number
  once?: boolean
  className?: string
  /** amount of element that must be visible before revealing */
  amount?: number
}

/**
 * Scroll reveal: fades + translates children into view once.
 * Respects prefers-reduced-motion (renders instantly).
 */
export function Reveal({ children, delay = 0, duration = 0.9, y = 24, once = true, className, amount = 0.2 }: RevealProps) {
  const reduced = useReducedMotion()
  const variants: Variants = {
    hidden: { opacity: 0, y: reduced ? 0 : y, filter: reduced ? 'none' : 'blur(6px)' },
    show: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: reduced ? 0 : duration, delay: reduced ? 0 : delay, ease: [0.16, 1, 0.3, 1] },
    },
  }
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount, margin: '0px 0px -8% 0px' }}
    >
      {children}
    </motion.div>
  )
}

/** Stagger container for lists of Reveal-like children. */
export function Stagger({
  children,
  className,
  stagger = 0.08,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  stagger?: number
  delay?: number
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15, margin: '0px 0px -8% 0px' }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
    >
      {children}
    </motion.div>
  )
}
