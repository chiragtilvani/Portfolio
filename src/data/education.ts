/**
 * ──────────────────────────────────────────────────────────────
 * EDUCATION
 * [REPLACE_WITH_REAL_DATA] Add institution name, CGPA, achievements.
 * ──────────────────────────────────────────────────────────────
 */
export interface Education {
  degree: string
  field: string
  institution: string
  location: string
  start: number
  end: number
  highlights: string[]
  coursework: { name: string; code: string }[]
}

export const education: Education = {
  degree: 'Bachelor of Technology',
  field: 'Computer Science Engineering',
  institution: '[REPLACE_WITH_REAL_DATA] University Name',
  location: 'Ahmedabad, Gujarat, India',
  start: 2023,
  end: 2027,
  highlights: [
    'Focus on software engineering, systems and web technologies',
    'Hands-on project work alongside coursework',
    '[REPLACE_WITH_REAL_DATA] CGPA / honours / achievements',
  ],
  coursework: [
    { name: 'Data Structures & Algorithms', code: 'DSA' },
    { name: 'Object-Oriented Programming', code: 'OOP' },
    { name: 'Database Management', code: 'DBMS' },
    { name: 'Operating Systems', code: 'OS' },
    { name: 'Computer Networks', code: 'CN' },
    { name: 'Web Development', code: 'WEB' },
    { name: 'Software Engineering', code: 'SE' },
  ],
}
