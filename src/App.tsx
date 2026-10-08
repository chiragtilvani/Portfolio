import { lazy, Suspense, useCallback, useState } from 'react'
import { Loader } from '@/components/Loader'
import { Navbar } from '@/components/Navbar'
import { CustomCursor } from '@/components/CustomCursor'
import { Footer } from '@/components/Footer'
import { EasterEgg } from '@/components/EasterEgg'
import { Fallback2D } from '@/components/3d/Fallback2D'
import { Marquee } from '@/components/ui/Marquee'
import { coreStack } from '@/data/skills'
import { Hero } from '@/sections/Hero'
import { About } from '@/sections/About'
import { Skills } from '@/sections/Skills'
import { Projects } from '@/sections/Projects'
import { Experience } from '@/sections/Experience'
import { Education } from '@/sections/Education'
import { GitHub } from '@/sections/GitHub'
import { Contact } from '@/sections/Contact'
import { useDeviceCapabilities } from '@/hooks/useDeviceCapabilities'
import { useSceneController } from '@/hooks/useSceneController'
import { useEasterEgg } from '@/hooks/useEasterEgg'

const Scene = lazy(() => import('@/components/3d/Scene'))
const Lab = lazy(() => import('@/sections/Lab'))

export default function App() {
  const caps = useDeviceCapabilities()
  const [ready, setReady] = useState(false)
  const onLoaded = useCallback(() => setReady(true), [])
  const egg = useEasterEgg()

  useSceneController(caps.webgl)

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      {/* persistent 3D layer */}
      {caps.webgl ? (
        <Suspense fallback={null}>
          <Scene caps={caps} />
        </Suspense>
      ) : (
        <Fallback2D />
      )}

      <Loader onDone={onLoaded} />
      <Navbar visible={ready} />
      {!caps.isTouch && <CustomCursor />}

      <main id="main" className="relative z-10">
        <Hero ready={ready} />
        <Marquee items={coreStack} />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Education />
        <GitHub />
        <Suspense fallback={<div className="min-h-[60vh]" aria-hidden />}>
          <Lab />
        </Suspense>
        <Contact />
      </main>

      <div className="relative z-10">
        <Footer />
      </div>

      <EasterEgg open={egg.open} onClose={egg.close} />
      <div className="noise" aria-hidden />
    </>
  )
}
