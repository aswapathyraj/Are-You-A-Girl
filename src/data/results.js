/** Statuses shown while the (entirely fictional) analysis runs. */
export const SCAN_STATUSES = [
  'Analyzing personality...',
  'Measuring drama...',
  'Calculating patience...',
  'Evaluating attitude...',
  'Searching for common sense...',
]

/**
 * kind:
 *   percent  — normal animated bar
 *   overflow — bar fills past the end of its own track
 *   error    — bar never fills; the resource is missing
 */
export const METRICS = [
  {
    key: 'drama',
    icon: 'flame',
    label: 'Drama',
    value: '97%',
    percent: 97,
    note: 'Significantly above normal.',
    kind: 'percent',
  },
  {
    key: 'patience',
    icon: 'hourglass',
    label: 'Patience',
    value: '3%',
    percent: 3,
    note: 'Critical levels detected.',
    kind: 'percent',
  },
  {
    key: 'attitude',
    icon: 'zap',
    label: 'Attitude',
    value: 'OVERFLOW',
    percent: 100,
    note: 'The system cannot calculate this much attitude.',
    kind: 'overflow',
  },
  {
    key: 'sense',
    icon: 'search',
    label: 'Common Sense',
    value: '404 NOT FOUND',
    percent: 0,
    note: 'Resource unavailable.',
    kind: 'error',
  },
]

/** Final summary rows. */
export const SUMMARY = [
  { label: 'Gender', value: 'Boy' },
  { label: 'Drama', value: '97%' },
  { label: 'Patience', value: '3%' },
  { label: 'Attitude', value: 'OVERFLOW' },
  { label: 'Common Sense', value: '404 NOT FOUND' },
]
