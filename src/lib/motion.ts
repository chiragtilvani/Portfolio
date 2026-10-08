import type { Variants } from 'motion/react'

/** Shared easing used across the site (expo-out). */
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const

/** Child variant for `<Stagger>` containers. */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_OUT_EXPO } },
}
