import { useEffect, useState } from 'react'
import { detectCapabilities, type DeviceCapabilities } from '@/lib/device'

export function useDeviceCapabilities(): DeviceCapabilities {
  const [caps, setCaps] = useState<DeviceCapabilities>(() => detectCapabilities())

  useEffect(() => {
    let frame = 0
    const onResize = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => setCaps(detectCapabilities()))
    }
    window.addEventListener('resize', onResize)
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    mq.addEventListener('change', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      mq.removeEventListener('change', onResize)
      cancelAnimationFrame(frame)
    }
  }, [])

  return caps
}
