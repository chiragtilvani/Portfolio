import { useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, Check, Mail } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from '@/components/ui/BrandIcons'
import { socials } from '@/data/socials'
import { profile } from '@/data/profile'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Reveal } from '@/components/ui/Reveal'
import { Button } from '@/components/ui/Button'
import { StatusDot } from '@/components/ui/Decor'
import { cn } from '@/lib/utils'

const ICONS = { github: GithubIcon, linkedin: LinkedinIcon, email: Mail } as const

type Status = 'idle' | 'sending' | 'sent'

export function Contact() {
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const name = String(data.get('name') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const message = String(data.get('message') ?? '').trim()
    const next: Record<string, string> = {}
    if (name.length < 2) next.name = 'Please enter your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Please enter a valid email.'
    if (message.length < 10) next.message = 'Tell me a little more (10+ characters).'
    setErrors(next)
    if (Object.keys(next).length) return
    // Demo submission – no backend. [REPLACE_WITH_REAL_DATA] wire to Formspree / EmailJS / your API.
    setStatus('sending')
    setTimeout(() => setStatus('sent'), 900)
  }

  return (
    <section id="contact" className="section-pad relative" aria-labelledby="contact-heading">
      <div className="container-x">
        <div className="grid grid-cols-12 gap-x-8 gap-y-14">
          <div className="col-span-12 lg:col-span-6">
            <SectionHeader
              index="08"
              label="Contact"
              title={
                <span id="contact-heading">
                  Have an idea?
                  <br />
                  <span className="text-gradient">Let&apos;s build it.</span>
                </span>
              }
              subtitle="Whether it's a product, an experiment, or something completely unexpected — I'd love to hear about it."
              className="mb-10"
            />
            <Reveal delay={0.2}>
              <StatusDot>{profile.availability}</StatusDot>
            </Reveal>

            <Reveal delay={0.3}>
              <ul className="mt-10 divide-y divide-white/[0.08] border-y border-white/[0.08]" role="list">
                {socials.map((s) => {
                  const Icon = ICONS[s.id]
                  return (
                    <li key={s.id}>
                      <a
                        href={s.href}
                        target={s.id === 'email' ? undefined : '_blank'}
                        rel="noreferrer"
                        data-cursor="hover"
                        className="group flex items-center gap-5 py-5 transition-colors"
                      >
                        <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-muted transition-colors group-hover:border-accent/50 group-hover:text-accent">
                          <Icon size={17} />
                        </span>
                        <span className="flex flex-1 flex-col">
                          <span className="label">{s.label}</span>
                          <span className="mt-0.5 text-[15px] text-fg">{s.handle}</span>
                        </span>
                        <ArrowUpRight size={18} className="text-muted transition-all duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg" />
                      </a>
                    </li>
                  )
                })}
              </ul>
            </Reveal>
          </div>

          <Reveal className="col-span-12 lg:col-span-6 lg:pl-8 xl:pl-16" delay={0.15} y={32}>
            <div className="glass-strong relative overflow-hidden rounded-3xl p-6 sm:p-9">
              <AnimatePresence mode="wait">
                {status === 'sent' ? (
                  <motion.div
                    key="sent"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="flex min-h-[26rem] flex-col items-center justify-center text-center"
                    role="status"
                  >
                    <span className="flex h-14 w-14 items-center justify-center rounded-full border border-success/40 bg-success/10 text-success">
                      <Check size={22} />
                    </span>
                    <h3 className="mt-6 text-3xl font-medium tracking-tight text-fg">Message received.</h3>
                    <p className="mt-2 text-muted">I&apos;ll get back to you soon.</p>
                    <button onClick={() => setStatus('idle')} data-cursor="hover" className="link-underline mt-8 font-mono text-[11px] uppercase tracking-[0.2em] text-muted hover:text-fg">
                      Send another
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={onSubmit}
                    noValidate
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex flex-col gap-6"
                    aria-describedby="form-note"
                  >
                    <Field id="name" label="Name" error={errors.name} autoComplete="name" placeholder="Your name" />
                    <Field id="email" label="Email" type="email" error={errors.email} autoComplete="email" placeholder="you@example.com" />
                    <Field id="message" label="Message" textarea error={errors.message} placeholder="Tell me about the idea…" />
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                      <p id="form-note" className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-2">
                        Demo form · no data is sent
                      </p>
                      <Button type="submit" size="lg" disabled={status === 'sending'}>
                        {status === 'sending' ? 'Sending…' : 'Send Message'}
                      </Button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

interface FieldProps {
  id: string
  label: string
  type?: string
  textarea?: boolean
  error?: string
  autoComplete?: string
  placeholder?: string
}

function Field({ id, label, type = 'text', textarea, error, autoComplete, placeholder }: FieldProps) {
  const base =
    'peer w-full rounded-xl border bg-white/[0.02] px-4 text-[15px] text-fg outline-none transition-colors duration-300 placeholder:text-muted-2 focus:border-accent/70 focus:bg-white/[0.04]'
  const border = error ? 'border-red-400/60' : 'border-white/10 hover:border-white/20'
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="label">
        {label}
      </label>
      {textarea ? (
        <textarea id={id} name={id} rows={5} placeholder={placeholder} className={cn(base, border, 'resize-none py-3.5')} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined} />
      ) : (
        <input id={id} name={id} type={type} placeholder={placeholder} autoComplete={autoComplete} className={cn(base, border, 'h-12')} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined} />
      )}
      {error && (
        <span id={`${id}-error`} className="text-[12.5px] text-red-400/90" role="alert">
          {error}
        </span>
      )}
    </div>
  )
}
