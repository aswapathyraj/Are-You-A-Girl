/**
 * All quiz content lives here.
 *
 * IMPORTANT — every question is force-answered YES.
 * The system never lets NO through, so each question must be phrased so that
 * "yes" is the incriminating answer. Write them as things she'd instinctively
 * want to deny: the comedy comes from reaching for NO, being refused, and
 * having the confession logged anyway. A question where "yes" means "I'm a
 * girl" breaks the ending, because the report then contradicts its own
 * evidence.
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
  { id: 2, tag: 'Energy analysis', text: 'Do you have moustache (Meesha)?', noMode: 'evade' },
  {
    id: 3,
    tag: 'Linguistic sample',
    text: 'Bro, do you have any feelings for girls ?',
    noMode: 'evade',
  },
  {
    id: 4,
    tag: 'Volume calibration',
    text: 'TBH, does your family know you\'re a boy?',
    noMode: 'shrink',
  },
  {
    id: 5,
    tag: 'Physical data',
    text: 'Have you ever peed standing up, just to see if you could?',
    noMode: 'shrink',
  },
  { id: 6, tag: 'Final confirmation', text: 'Are you definitely, unquestionably a boy?', noMode: 'none' },
  { id: 7, tag: 'Consent', text: 'Are you ready to accept the results?', noMode: 'none' },
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
