# 🇩🇰 PD2 Coach

A local, offline-first study app for **Prøve i Dansk 2 (PD2)** — the Danish
B1-level exam for foreign residents. Built around real past exam content for
Reading, Writing, and Speaking, plus a Grammar Engine, a Vocab trainer with
spaced repetition, a Progress tracker, and an AI Coach.

Everything runs **entirely in your browser** — no backend, no account, no
data leaves your machine (unless you opt in to the AI Coach's "bring your
own OpenAI key" feature, see below).

## Modules

| Module | What it does |
|---|---|
| 📖 **Reading** | Full practice exams (Læseforståelse) with real exam timers, auto-scored against the official answer keys |
| ✍️ **Writing** | 9 letter/email genres, real exam prompts, genre phrase-banks, a heuristic writing checker, and real graded student model answers |
| 🗣️ **Speaking** | Picture-description + opinion + experience + paired-discussion prompts, with optional mic recording and live (best-effort) transcription |
| 🧩 **Grammar** | Explanations + quizzes on the B1 grammar points PD2 tests most (word order, article/adjective agreement, tenses, modal verbs, prepositions) |
| 🗂️ **Vocab** | Flashcard drills for the 500 most common Danish verbs (full conjugations) and 250 adjectives, scheduled with a Leitner-style spaced-repetition algorithm |
| 📊 **Progress** | Local history of every attempt/score, per module |
| 🤖 **AI Coach** | A floating chat widget giving study tips based on your own progress stats — works fully offline; optionally upgrade to real conversational AI with your own API key |

## Running locally

### Prerequisites

- **Node.js 20+** (check with `node --version`). Get it from
  [nodejs.org](https://nodejs.org) or via `nvm install 20` if you use nvm.
- **npm** (ships with Node).

No database, Docker, or `.env` file is required.

### Quick start

```bash
# 1. Go into the app folder
cd pd2-coach-app

# 2. Install dependencies (first time only, or after pulling new changes)
npm install

# 3. Start the local dev server
npm run dev
```

Vite will print a local URL, typically:

```
➜  Local:   http://localhost:5173/
```

Open that URL in your browser — the app loads instantly with all content
already bundled (no sign-up, no setup wizard). To stop the server, press
`Ctrl+C` in the terminal.

### Verifying it's working

- The **Oversigt** (dashboard) page should show module cards with live
  counts (e.g. "19 eksamenssæt" under Reading).
- Try `/reading` → pick an exam → answer a question → "Aflever og se facit"
  should show a score.
- Everything you do is saved to your browser's `localStorage`; refreshing
  the page won't lose your progress.

### Building for production

```bash
npm run build      # outputs static files to dist/
npm run preview     # serve the production build locally to sanity-check it
```

`dist/` is a plain static site — you can also deploy it to any static host
(Netlify, Vercel, GitHub Pages, S3, etc.) if you ever want it outside your
machine, with no server-side changes needed.

### Troubleshooting

- **`npm install` fails with a 401/authentication error** — this usually
  means your global npm config (`~/.npmrc`) points at a private/corporate
  registry. This project ships its own `pd2-coach-app/.npmrc` pinned to the
  public npm registry, which should take precedence automatically as long
  as you run `npm install` **from inside the `pd2-coach-app` folder**. If
  it still fails, run `npm install --registry=https://registry.npmjs.org/`
  explicitly.
- **Port 5173 already in use** — stop whatever else is using it, or run
  `npm run dev -- --port 5174` to pick a different port.
- **Blank page / console errors after pulling new changes** — delete
  `node_modules` and `package-lock.json` and re-run `npm install`.
- **Want to reset your saved progress/flashcards?** Go to **Settings** in
  the app and use "Nulstil fremgang", or just clear your browser's site
  data for `localhost:5173`.

## Hosting (free, on GitHub Pages)

This repo is pre-configured to deploy automatically to **GitHub Pages**
every time you push to `main`:

- `vite.config.ts` sets `base: '/pd2coach/'` so built asset URLs resolve
  correctly under `https://<your-username>.github.io/pd2coach/`.
- The app uses React Router's `HashRouter` (URLs like `#/reading`) instead
  of `BrowserRouter`, since plain GitHub Pages can't rewrite deep links
  (e.g. a direct visit or refresh on `/reading`) to `index.html` — hash
  routing sidesteps that entirely with zero server config.
- `.github/workflows/deploy.yml` builds the app and publishes `dist/` via
  GitHub's official Pages Actions on every push to `main`.

**One-time setup** (only needed once per repo):
1. Push to `main` (the workflow runs automatically).
2. On GitHub: **Settings → Pages → Build and deployment → Source** → select
   **GitHub Actions**.
3. Wait for the "Deploy to GitHub Pages" workflow to finish (**Actions**
   tab) — your site will then be live at
   `https://<your-username>.github.io/pd2coach/`.

If you rename the repo or deploy under a different path, update the
`base` value in `vite.config.ts` to match.

## Content sources & coverage

The Reading and Writing content is adapted from official **Prøve i Dansk 2**
past exams spanning **2013–2022**, sourced from the exam booklets and their
accompanying censor/eksaminator answer-key booklets in `../source-papers`
(not committed to version control — see below). Used here strictly for
personal exam preparation.

- **Reading**: 19 full or partial practice exams.
  - Opgave 1 (scanning for facts) and Opgave 3–5 (cloze / sentence-gap /
    paragraph-match) are included for nearly every year/season from
    2013–2022.
  - Opgave 2 (ad-matching) is only included for the two most recent,
    hand-verified exams (2022 and 2023 Sommer) — older years use PDF
    layouts too inconsistent to extract reliably by script, so it was
    intentionally left out rather than risk shipping wrong answers.
  - 2019 Sommer only has Opgave 1 (the source archive is missing the
    Opgave 3-5 booklet for that sitting).
  - 2016 Sommer and 2023 Vinter are not included (source files missing or
    unreadable).
- **Writing**: 8 letter genres (opslag, invitation, jobansøgning, klage,
  takkebrev, anbefaling, læserbrev, efterlysning) plus the email genre,
  with real prompts spanning 2012–2023 and several real, graded student
  model answers.
- **Speaking**: 5 topics reproduce real examiner scripts (2022–2023); ~40
  more real PD2 topic titles (2013–2023) are included with original
  practice material in the same exam format (clearly labeled "practice"
  vs. "official" in the app).
- **Grammar**: written from scratch for this app (not sourced from the
  exam papers).
- **Vocab**: the verb and adjective tables are parsed from public study
  lists in the source material.

### Reproducing/extending the Reading archive

The `scripts/` folder contains the Python extraction pipeline used to turn
the raw exam PDFs into the structured data in `src/data/reading.ts` and
`src/data/readingArchive.ts`:

- `pdf_column_extract.py` / `pdf_grid_extract.py` — column/grid-aware PDF
  text extraction helpers (handles the 2-column directory-style reading
  passages).
- `extract_all_reading.py` — the core extraction library: locates the right
  PDF per year/season, extracts each task type (scanning, cloze,
  sentence-gap, paragraph-match), and parses the official answer key.
- `generate_reading_archive.py` — runs the pipeline across all available
  years and emits `reading_archive_ts_content.txt`, converted into
  `src/data/readingArchive.ts`.

Re-running these requires the original source PDFs (kept outside version
control under `../source-papers`), plus `pdfplumber` (`pip install
pdfplumber`).

## AI Coach & your data

- All progress, flashcard scheduling, and settings are stored in your
  browser's `localStorage` — nothing is sent anywhere by default.
- The AI Coach gives useful, rule-based tips out of the box, fully offline.
- If you want richer, conversational feedback, go to **Settings** and paste
  in your own OpenAI API key. It's stored only in your browser and used to
  call the OpenAI API directly from your browser — this app has no backend
  that ever sees it.

## Tech stack

Vite + React 19 + TypeScript + React Router + Tailwind CSS v4. No backend.
