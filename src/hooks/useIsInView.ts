import { useEffect, useRef, useState } from 'react'

/** Continuous in-view flag (true while visible). Used to pause expensive canvases offscreen. */
export function useIsInView<T extends HTMLElement>(rootMargin = '100px') {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin })
    io.observe(el)
    return () => io.disconnect()
  }, [rootMargin])
  return { ref, inView }
}
