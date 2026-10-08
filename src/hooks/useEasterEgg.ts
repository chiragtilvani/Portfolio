import { useEffect, useState, useCallback } from 'react'
import { EASTER_EGG_PHRASE } from '@/lib/constants'

/**
 * Listens for the visitor typing a secret phrase anywhere on the page
 * (outside of inputs) and exposes an `open` flag.
 * Other components can also dispatch `window.dispatchEvent(new Event('easter-egg'))`.
 */
export function useEasterEgg() {
  const [open, setOpen] = useState(false)
  const trigger = useCallback(() => setOpen(true), [])
  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    let buffer = ''
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      const tag = target?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || target?.isContentEditable) return
      if (e.key.length !== 1) return
      buffer = (buffer + e.key.toLowerCase()).slice(-EASTER_EGG_PHRASE.length)
      if (buffer === EASTER_EGG_PHRASE) {
        buffer = ''
        setOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    const onCustom = () => setOpen(true)
    window.addEventListener('easter-egg', onCustom)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('easter-egg', onCustom)
    }
  }, [])

  return { open, trigger, close }
}
