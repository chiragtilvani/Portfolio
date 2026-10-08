import { useEffect, useState } from 'react'
import { SECTION_IDS, type SectionId } from '@/lib/constants'

/** Tracks which section currently dominates the viewport (for nav highlighting). */
export function useActiveSection(): SectionId {
  const [active, setActive] = useState<SectionId>('hero')

  useEffect(() => {
    const els = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    if (!els.length) return
    const ratios = new Map<string, number>()
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) ratios.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0)
        let best: SectionId = 'hero'
        let bestRatio = 0
        for (const [id, r] of ratios) {
          if (r > bestRatio) {
            bestRatio = r
            best = id as SectionId
          }
        }
        if (bestRatio > 0) setActive(best)
      },
      { threshold: [0, 0.15, 0.3, 0.5, 0.7, 1], rootMargin: '-10% 0px -40% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return active
}
