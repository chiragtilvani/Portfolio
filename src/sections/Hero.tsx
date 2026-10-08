import { motion } from 'motion/react'
import { ArrowDown } from 'lucide-react'
import { profile } from '@/data/profile'
import { Button } from '@/components/ui/Button'
import { TextReveal } from '@/components/ui/TextReveal'
import { StatusDot, TechLabel } from '@/components/ui/Decor'
import { scrollToId } from '@/lib/utils'

interface HeroProps {
  /** true once the loader has finished – gates the entrance animation */
  ready: boolean
}

export function Hero({ ready }: HeroProps) {
  const fade = (delay: number) => ({
    initial: { opacity: 0, y: 16 },
    animate: ready ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] as const },
  })

  return (
    <section id="hero" className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden pb-10 pt-32 sm:pb-14 md:justify-center md:py-32" aria-labelledby="hero-heading">
      {/* grid + legibility gradient (mobile) */}
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[68%] bg-gradient-to-t from-bg via-bg/92 to-transparent md:hidden" aria-hidden />

      <div className="container-x relative grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 xl:col-span-7">
          <motion.div {...fade(0.1)}>
            <StatusDot>{profile.availability}</StatusDot>
          </motion.div>

          <h1
            id="hero-heading"
            className="mt-7 max-w-[13ch] text-[clamp(2.75rem,8.6vw,7rem)] font-medium leading-[0.95] tracking-[-0.045em] text-fg md:mt-9"
          >
            <TextReveal text={profile.hero.headline} start={ready} delay={0.25} stagger={0.07} />
          </h1>

          <motion.p {...fade(0.75)} className="mt-7 max-w-[34rem] text-balance text-base leading-relaxed text-muted sm:text-lg md:mt-9 md:text-[1.15rem]">
            {profile.hero.subcopy}
          </motion.p>

          <motion.div {...fade(0.9)} className="mt-9 flex flex-wrap items-center gap-3 md:mt-11">
            <Button size="lg" onClick={() => scrollToId('work')}>
              {profile.hero.primaryCta}
            </Button>
            <Button size="lg" variant="outline" icon="none" onClick={() => scrollToId('contact')}>
              {profile.hero.secondaryCta}
            </Button>
          </motion.div>
        </div>
      </div>

      {/* bottom meta row */}
      <motion.div
        {...fade(1.15)}
        className="container-x relative mt-14 flex items-end justify-between md:absolute md:inset-x-0 md:bottom-10 md:mt-0"
      >
        <button
          onClick={() => scrollToId('about')}
          data-cursor="hover"
          className="group flex items-center gap-3 font-mono text-[10.5px] uppercase tracking-[0.25em] text-muted transition-colors hover:text-fg"
          aria-label="Scroll to about section"
        >
          <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-white/10">
            <ArrowDown size={13} className="animate-[bounce_2.2s_infinite]" />
          </span>
          {profile.hero.scrollHint}
        </button>

        <div className="hidden flex-col items-end gap-1 text-right sm:flex">
          <TechLabel>{profile.title}</TechLabel>
          <TechLabel>{profile.location}</TechLabel>
          <TechLabel>{profile.coordinates}</TechLabel>
        </div>
      </motion.div>

      {/* side label */}
      <motion.div
        {...fade(1.2)}
        className="pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 rotate-90 xl:block"
        aria-hidden
      >
        <TechLabel>Digital Core · Ideas → Code</TechLabel>
      </motion.div>
    </section>
  )
}
