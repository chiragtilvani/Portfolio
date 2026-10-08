import { useEffect } from 'react'
import { pointer, scrollState, story, STORY_ANCHORS, type StoryAnchor } from '@/lib/scene-store'
import { clamp } from '@/lib/utils'

interface PositionedAnchor extends StoryAnchor {
  mid: number
  top: number
  bottom: number
}

/**
 * Feeds pointer + scroll + section data into the frame-rate store that the
 * Three.js scene reads from. Mounted once at the app root.
 */
export function useSceneController(enabled = true) {
  useEffect(() => {
    if (!enabled) return

    const onPointer = (e: PointerEvent) => {
      pointer.sx = e.clientX
      pointer.sy = e.clientY
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }

    let lastY = window.scrollY
    let ticking = false

    const updateStory = () => {
      const vh = window.innerHeight
      const center = window.scrollY + vh * 0.5
      const positions: PositionedAnchor[] = []
      for (const a of STORY_ANCHORS) {
        const el = document.getElementById(a.id)
        if (!el) continue
        const rect = el.getBoundingClientRect()
        const top = rect.top + window.scrollY
        positions.push({ ...a, mid: top + rect.height * 0.5, top, bottom: top + rect.height })
      }
      if (!positions.length) return

      let active = positions[0]
      for (const p of positions) if (center >= p.top) active = p
      story.section = active.id

      // Interpolate towards the next anchor as we move from this mid to the next mid.
      const idx = positions.indexOf(active)
      const next = positions[idx + 1]
      if (next) {
        const t = clamp((center - active.mid) / (next.mid - active.mid))
        const ease = t * t * (3 - 2 * t)
        // Opacity rises late and falls early so the object is only prominent
        // when its target section is actually on screen.
        const rising = next.opacity > active.opacity
        const oEase = rising ? Math.pow(ease, 2.2) : 1 - Math.pow(1 - ease, 2.2)
        story.stage = active.stage + (next.stage - active.stage) * ease
        story.x = active.x + (next.x - active.x) * ease
        story.y = active.y + (next.y - active.y) * ease
        story.scale = active.scale + (next.scale - active.scale) * ease
        story.opacity = active.opacity + (next.opacity - active.opacity) * oEase
      } else {
        story.stage = active.stage
        story.x = active.x
        story.y = active.y
        story.scale = active.scale
        story.opacity = active.opacity
      }
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const y = window.scrollY
        const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
        scrollState.velocity = y - lastY
        lastY = y
        scrollState.y = y
        scrollState.progress = clamp(y / max)
        updateStory()
        ticking = false
      })
    }

    window.addEventListener('pointermove', onPointer, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    onScroll()
    const t = setTimeout(onScroll, 400)
    return () => {
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      clearTimeout(t)
    }
  }, [enabled])
}
