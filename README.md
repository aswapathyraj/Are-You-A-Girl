# Are You A Girl?

A harmless joke quiz built to look like a real personality-verification site. The
interface stays calm, minimal and pastel while the content quietly stops making sense.

**Live:** https://are-you-a-girl.vercel.app

> Send *that* URL. The immutable deployment URL
> (`are-you-a-girl-<hash>-<team>.vercel.app`) sits behind Vercel Deployment
> Protection and will ask visitors to log in.

## Run it

```bash
npm install
npm run dev
```

Then open the URL Vite prints (it also opens automatically). To build:

```bash
npm run build
npm run preview     # serve the production build, reachable on your local network
```

## The joke

1. **Landing** — "Are You A Girl?" with an `ENTER` button (the keyboard <kbd>Enter</kbd> key works too).
2. **Quiz** — ten yes/no questions where `NO` is never selectable. It escalates:
   moves → moves further → shrinks → shakes and vanishes, with `Nice try.` /
   `Nope.` / `Not an option.` / `System rejected your answer.` underneath. Later
   questions vary it: `NO` flees to the corners, quietly rewrites itself into
   `YES`, arrives already disabled, or was "removed" before the page loaded.
3. **Fake cursor** — once `NO` is gone, a cursor **drawn inside the page** glides to
   `YES`, `YES` lights up, and about 500 ms later it clicks itself. The real system
   cursor is never touched, moved, or hidden.
4. **Scan** — a fake circular analysis, 0 → 100 %. No camera, no microphone, nothing measured.
5. **Results** — Drama 97 %, Patience 3 %, Attitude `OVERFLOW`, Common Sense
   `404 NOT FOUND`, then the deadpan reveal.
6. **Second opinion** — consults another system, which agrees.

## Structure

```
src/
├── components/
│   ├── QuizCard.jsx        question, answers, NO's escape logic, takeover timeline
│   ├── FakeCursor.jsx      in-page cursor element
│   ├── ProgressBar.jsx
│   ├── ScanAnimation.jsx   circular scanner (SVG)
│   ├── ResultCard.jsx      one metric + bar (incl. overflow / 404 states)
│   └── SoundToggle.jsx
├── data/
│   ├── questions.js        all questions + every rejection message
│   └── results.js          scan statuses, metrics, final summary
├── hooks/
│   └── useSound.jsx        Web Audio engine + provider (see Sound)
├── pages/
│   ├── Landing.jsx
│   ├── Quiz.jsx            flow state machine + the NO escalation ladder
│   ├── Scan.jsx
│   └── Results.jsx         staged reveal, final result, completion screen
├── App.jsx                 stage router + background
├── main.jsx
└── index.css               Tailwind layers, component classes, glitch effect
```

`questions.js` holds every question. Each one carries a `noMode` that decides how
`NO` refuses that question; the ladder itself lives in `pages/Quiz.jsx`.

## Sound

Off by default — nothing autoplays. Every effect (click, error, scan hum, reveal
sting) is synthesised with the Web Audio API, so there are no audio files and no
network requests. The `AudioContext` is only created once you press the toggle in
the corner.

## Notes

- No backend, no database, no storage, no analytics. Nothing is collected or sent anywhere.
- No camera or microphone access, and no permission prompts.
- `prefers-reduced-motion` is respected: movement is dropped (via Framer Motion's
  `MotionConfig` plus CSS), while the joke still plays out.
- The `NO` button's position is measured from its container rather than from media
  queries, so it can never escape the card or cause horizontal scrolling on any screen size.

## Stack

React 18 · Vite 6 · Tailwind CSS 3 · Framer Motion 12 · Lucide React

## Redeploy

```bash
npx vercel deploy --prod --yes
```

The project is already linked (`.vercel/project.json`), and `vercel.json` pins the
Vite preset, `dist` output, and a one-year immutable cache on `/assets/*`.
