export const NAV_ITEMS = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'work', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
] as const

export const SECTION_IDS = [
  'hero',
  'about',
  'skills',
  'work',
  'experience',
  'education',
  'github',
  'lab',
  'contact',
] as const
export type SectionId = (typeof SECTION_IDS)[number]

export const EASTER_EGG_PHRASE = 'sudo hire chirag'
