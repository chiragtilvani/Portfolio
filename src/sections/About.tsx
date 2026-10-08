import { profile } from '@/data/profile'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Reveal } from '@/components/ui/Reveal'
import { Terminal } from '@/components/Terminal'
import { CornerMarks, TechLabel } from '@/components/ui/Decor'

export function About() {
  return (
    <section id="about" className="section-pad relative" aria-labelledby="about-heading">
      <div className="container-x">
        <div className="grid grid-cols-12 gap-x-8 gap-y-14 lg:gap-y-0">
          <div className="col-span-12 lg:col-span-6">
            <SectionHeader index="01" label="About" title={<span id="about-heading">{profile.about.heading}</span>} className="mb-10 md:mb-12" />
            <div className="space-y-6 text-base leading-relaxed text-muted md:text-lg">
              {profile.about.paragraphs.map((p, i) => (
                <Reveal key={i} delay={0.1 + i * 0.08}>
                  <p className="text-balance">{p}</p>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.3}>
              <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-7 border-t border-white/[0.08] pt-8">
                {profile.about.facts.map((f) => (
                  <div key={f.label}>
                    <dt className="label mb-2">{f.label}</dt>
                    <dd className="text-[15px] text-fg">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          <div className="col-span-12 lg:col-span-6 lg:pl-8 xl:pl-16">
            <Reveal delay={0.15} y={32} className="relative">
              <div className="relative p-3">
                <CornerMarks />
                <Terminal />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <TechLabel>Interactive — type a command</TechLabel>
                <TechLabel>fig. 01</TechLabel>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
