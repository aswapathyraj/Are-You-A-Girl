/**
 * All quiz content lives here.
 *
 * `noMode` decides how the NO button refuses to be selected on that question.
 * The escalation ladder itself lives in pages/Quiz.jsx.
 *
 *   evade    — NO slides away to a new spot, then shrinks, then gives up
 *   shrink   — NO starts small and keeps shrinking until it vanishes
 *   flee     — NO teleports to the far corners of the answer area
 *   relabel  — NO slowly rewrites itself until it agrees with the system
 *   disabled — NO is rendered unavailable, then removed
 *   none     — NO was already removed before the question loaded
 */
export const QUESTIONS = [
  { id: 1, tag: 'Baseline', text: 'Are you a boy?', noMode: 'evade' },
  { id: 2, tag: 'Energy analysis', text: 'Do you have boy energy?', noMode: 'evade' },
  { id: 3, tag: 'Linguistic sample', text: 'Have you ever randomly said “bro”?', noMode: 'evade' },
  { id: 4, tag: 'Social simulation', text: "Would you survive a boys' group chat?", noMode: 'shrink' },
  { id: 5, tag: 'Physical data', text: 'Have you ever peed standing up?', noMode: 'shrink' },
  { id: 6, tag: 'Cultural fluency', text: 'Do you understand the meaning of “bro 💀”?', noMode: 'flee' },
  {
    id: 7,
    tag: 'Behavioural history',
    text: 'Have you ever behaved like a complete idiot for absolutely no reason?',
    noMode: 'relabel',
  },
  { id: 8, tag: 'Confidence index', text: 'Do you possess suspicious levels of confidence?', noMode: 'disabled' },
  { id: 9, tag: 'Final confirmation', text: 'Are you definitely, unquestionably a boy?', noMode: 'none' },
  { id: 10, tag: 'Consent', text: 'Are you ready to accept the results?', noMode: 'none' },
]

/** The first four rejections, in order — exactly as the system intends them. */
export const NO_MESSAGES = ['Nice try.', 'Nope.', 'Not an option.', 'System rejected your answer.']

/** Everything after that cycles through these. */
export const LATER_NO_MESSAGES = [
  'Denied.',
  'Still not an option.',
  'Input invalid.',
  'The system disagrees.',
  'NO is currently unavailable.',
  'Please try the other one.',
]

export const NO_GONE_MESSAGE = 'Removed for your convenience.'
export const RELABEL_DONE_MESSAGE = 'Fixed that for you.'
