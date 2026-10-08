/**
 * ──────────────────────────────────────────────────────────────
 * SOCIAL LINKS — single source of truth for every link on the site.
 * [REPLACE_WITH_REAL_DATA] Update the URLs below.
 * ──────────────────────────────────────────────────────────────
 */
export interface SocialLink {
  id: 'github' | 'linkedin' | 'email'
  label: string
  /** What's shown next to the label (handle / address) */
  handle: string
  href: string
}

export const socials: SocialLink[] = [
  {
    id: 'github',
    label: 'GitHub',
    handle: '@chiragtilwani',
    href: 'https://github.com/chiragtilwani',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    handle: '/in/chiragtilwani',
    href: 'https://www.linkedin.com/in/chiragtilwani',
  },
  {
    id: 'email',
    label: 'Email',
    handle: 'chirag@example.com', // [REPLACE_WITH_REAL_DATA]
    href: 'mailto:chirag@example.com',
  },
]

export const socialById = Object.fromEntries(socials.map((s) => [s.id, s])) as Record<SocialLink['id'], SocialLink>
