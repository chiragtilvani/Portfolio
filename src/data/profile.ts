/**
 * ──────────────────────────────────────────────────────────────
 * PROFILE / IDENTITY
 * Edit this file to change the hero copy, titles and location.
 * ──────────────────────────────────────────────────────────────
 */
export const profile = {
  name: 'Chirag Tilwani',
  shortName: 'CHIRAG.T',
  firstName: 'Chirag',
  title: 'Full-Stack Developer & Creative Technologist',
  secondaryTitle: 'Computer Science Engineer | Full-Stack Developer | Software Engineer',
  location: 'Ahmedabad, Gujarat, India',
  coordinates: '23.0225° N, 72.5714° E',
  timezone: 'IST (UTC+5:30)',
  availability: 'Available for internships & projects',
  handle: 'chirag@developer',

  hero: {
    headline: 'I build digital experiences that feel alive.',
    altHeadline: 'Code. Design. Experience.',
    subcopy:
      "I'm Chirag Tilwani — a Computer Science Engineer and Full-Stack Developer focused on building scalable applications, thoughtful interfaces and interactive digital experiences.",
    primaryCta: 'Explore My Work',
    secondaryCta: "Let's Connect",
    scrollHint: 'Scroll to explore',
  },

  about: {
    heading: 'More than just code.',
    paragraphs: [
      "I'm a Computer Science Engineering student who enjoys turning ideas into practical digital products. My interests sit at the intersection of software engineering, frontend development, backend systems and visual design.",
      'I enjoy understanding how things work, breaking complex problems into smaller systems, and building interfaces that are both functional and enjoyable to use.',
    ],
    facts: [
      { label: 'Based in', value: 'Ahmedabad, IN' },
      { label: 'Focus', value: 'Full-Stack Development' },
      { label: 'Studying', value: 'B.Tech CSE · 2023 — 2027' },
      { label: 'Currently', value: 'Open to internships' },
    ],
  },

  /** Short positioning line used in the footer and meta. */
  tagline: 'Engineering meets experience.',
  footerLine: 'Designed & built with curiosity.',

  /** [REPLACE_WITH_REAL_DATA] Path to a resume PDF placed in /public (or an external URL). */
  resumeUrl: '#',
} as const
