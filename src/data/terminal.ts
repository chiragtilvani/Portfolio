/**
 * ──────────────────────────────────────────────────────────────
 * TERMINAL — commands for the interactive terminal in the About section.
 * The intro `script` auto-plays once; afterwards visitors can type commands.
 * ──────────────────────────────────────────────────────────────
 */
export interface TerminalCommand {
  cmd: string
  output: string[]
  hidden?: boolean
}

export const terminalCommands: TerminalCommand[] = [
  { cmd: 'whoami', output: ['chirag@developer'] },
  { cmd: 'focus', output: ['Full-Stack Development', 'Software Engineering', 'Creative Technology'] },
  { cmd: 'stack', output: ['Java', 'Spring Boot', 'Angular', 'React', 'Node.js', 'TypeScript'] },
  { cmd: 'status', output: ['Always building.', 'Always learning.'] },
  { cmd: 'location', output: ['Ahmedabad, Gujarat, India', '23.0225° N, 72.5714° E'] },
  { cmd: 'projects', output: ['finflow  marketnest  techprice', 'campushub  devboard  libraryx', '', 'Scroll to 03 — Selected Work to explore.'] },
  { cmd: 'contact', output: ['Use `08 — Contact` below, or type:', 'open github | open linkedin | open email'] },
  {
    cmd: 'help',
    output: ['Available commands:', 'whoami  focus  stack  status  location', 'projects  contact  clear  help'],
  },
  { cmd: 'sudo hire chirag', output: ['ACCESS GRANTED ✓'], hidden: true },
]

/** Commands auto-typed on first view. */
export const terminalScript = ['whoami', 'focus', 'stack', 'status']
