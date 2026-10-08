/**
 * ──────────────────────────────────────────────────────────────
 * EXPERIENCE — rendered as a scroll-linked timeline.
 * [REPLACE_WITH_REAL_DATA] Placeholder roles. Replace with real ones.
 * ──────────────────────────────────────────────────────────────
 */
export interface Experience {
  id: string
  period: string
  role: string
  company: string
  location: string
  description: string
  technologies: string[]
  type: 'internship' | 'independent' | 'full-time'
}

export const experience: Experience[] = [
  {
    id: 'proplegit-2026',
    period: '2026',
    role: 'Software Engineering Intern',
    company: 'Proplegit Global Pvt. Ltd.',
    location: 'Ahmedabad, India',
    description:
      'Worked on modern web applications, frontend interfaces, backend workflows and real-world software development practices.',
    technologies: ['Angular', 'JavaScript', 'TypeScript', 'APIs'],
    type: 'internship',
  },
  {
    id: 'studio-2025',
    period: '2025',
    role: 'Frontend Development Intern',
    company: 'Digital Product Studio',
    location: 'Ahmedabad, India',
    description:
      'Contributed to responsive interfaces and frontend components while learning modern development workflows.',
    technologies: ['React', 'HTML', 'CSS', 'JavaScript', 'Git'],
    type: 'internship',
  },
  {
    id: 'independent-2024',
    period: '2024 — Present',
    role: 'Independent Developer',
    company: 'Personal projects',
    location: 'Remote',
    description:
      'Building personal projects across web development, backend systems, databases and machine learning.',
    technologies: ['Java', 'Spring Boot', 'Node.js', 'React', 'Python', 'SQL'],
    type: 'independent',
  },
]
