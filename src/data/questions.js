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
  { id: 1, tag: 'Baseline', text: 'Are you 100% sure you’re a girl?', noMode: 'evade' },
  { id: 2, tag: 'Energy analysis', text: 'Can you honestly say, “I’m not a boy”?', noMode: 'evade' },
  { id: 3, tag: 'Linguistic sample', text: 'Have you ever been mistaken for a boy?', noMode: 'evade' },
  { id: 4, tag: 'Social simulation', text: "If someone called you a boy, would you get offended?", noMode: 'shrink' },
  { id: 5, tag: 'Physical data', text: 'Is there even a 1% chance you’re secretly a boy?', noMode: 'shrink' },
  { id: 6, tag: 'Cultural fluency', text: 'Can you prove you’re a girl without saying “I am”?', noMode: 'flee' },
  {
    id: 7,
    tag: 'Behavioural history',
    text: 'If I asked your friends whether you’re a girl, would they all agree?',
    noMode: 'relabel',
  },
  { id: 8, tag: 'Confidence index', text: 'Are you absolutely certain you’re not a boy?', noMode: 'disabled' },
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
