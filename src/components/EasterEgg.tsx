import { useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check } from 'lucide-react'

interface EasterEggProps {
  open: boolean
  onClose: () => void
}

/** Shown when the visitor types `sudo hire chirag`. */
export function EasterEgg({ open, onClose }: EasterEggProps) {
  useEffect(() => {
    if (!open) return
    const t = setTimeout(onClose, 5000)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      clearTimeout(t)
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[95] flex items-center justify-center bg-bg/80 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="status"
          aria-live="polite"
        >
          <motion.div
            initial={{ scale: 0.94, y: 12, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="glass relative mx-6 w-full max-w-md rounded-3xl p-8 text-center sm:p-10"
          >
            <span className="absolute left-5 top-5 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-2">root@portfolio</span>
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-success/40 bg-success/10 text-success">
              <Check size={22} />
            </div>
            <p className="font-mono text-[12px] uppercase tracking-[0.3em] text-success">Access granted</p>
            <p className="mt-4 text-2xl font-medium tracking-tight text-fg">Developer detected.</p>
            <p className="mt-2 text-muted">Let&apos;s build something great.</p>
            <span className="mt-8 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-2">esc / click to dismiss</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
