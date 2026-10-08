import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  label: string
  className?: string
}

/**
 * Full-screen modal with focus trap, ESC to close, scroll lock.
 */
export function Modal({ open, onClose, children, label, className }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const lastFocused = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return
    lastFocused.current = document.activeElement as HTMLElement
    document.body.classList.add('menu-open')
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab' && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
        )
        if (!focusables.length) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    const t = setTimeout(() => panelRef.current?.querySelector<HTMLElement>('button')?.focus(), 50)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.classList.remove('menu-open')
      clearTimeout(t)
      lastFocused.current?.focus?.()
    }
  }, [open, onClose])

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          role="dialog"
          aria-modal="true"
          aria-label={label}
        >
          <button
            aria-label="Close"
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            tabIndex={-1}
          />
          <motion.div
            ref={panelRef}
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              'relative z-10 max-h-[92dvh] w-full overflow-y-auto overscroll-contain rounded-t-3xl border border-white/10 bg-bg-2 sm:max-h-[88dvh] sm:max-w-5xl sm:rounded-3xl',
              className,
            )}
          >
            <button
              onClick={onClose}
              data-cursor="hover"
              aria-label="Close dialog"
              className="sticky top-4 z-20 ml-auto mr-4 mt-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-bg-2/80 text-muted backdrop-blur transition-colors hover:border-white/30 hover:text-fg"
            >
              <X size={16} />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
