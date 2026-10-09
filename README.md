# 🇩🇰 PD2 & PD3 Coach

A local, offline-first study app for **Prøve i Dansk 2 (PD2)** and
**Prøve i Dansk 3 (PD3)** — the Danish B1- and B2-level exams for foreign
residents. Built around real past exam content for Reading, Writing, and
Speaking, plus a Grammar Engine, a Vocab trainer with spaced repetition, a
Progress tracker, and an AI Coach. Use the **PD2 / PD3 switcher** at the top
of the app to move between the two exam tracks — each has its own set of
modules, but they share the same Progress history and Settings.

Everything runs **entirely in your browser** — no backend, no account, no
data leaves your machine (unless you opt in to the AI Coach's "bring your
own OpenAI key" feature, see below).

## Modules

### PD2 (B1)

| Module | What it does |
|---|---|
| 📖 **Reading** | Full practice exams (Læseforståelse) with real exam timers, auto-scored against the official answer keys |
| ✍️ **Writing** | 9 letter/email genres, real exam prompts, genre phrase-banks, a heuristic writing checker, and real graded student model answers |
| 🗣️ **Speaking** | Picture-description + opinion + experience + paired-discussion prompts, with optional mic recording and live (best-effort) transcription |
| 🧩 **Grammar** | Explanations + quizzes on the B1 grammar points PD2 tests most (word order, article/adjective agreement, tenses, modal verbs, prepositions) |
| 🗂️ **Vocab** | Flashcard drills for the 500 most common Danish verbs (full conjugations) and 250 adjectives, scheduled with a Leitner-style spaced-repetition algorithm |

### PD3 (B2)

| Module | What it does |
|---|---|
| 📖 **Reading** | Læseforståelse 1 (search-and-scan) and 2 (multiple choice, paragraph-matching, cloze), auto-scored against the official answer keys |
| ✍️ **Writing** | An e-mail reply task plus a choice between two argumentative essay tasks per exam, with the same AI-feedback and self-check tools as PD2 |
| 🗣️ **Speaking** | Topic cards reproducing the real examiner script's obligatory questions and follow-ups, for both picture situations per topic |
| 🧩 **Grammar** | B2 topics building on PD2's foundation: passive voice, relative clauses, subordinate-clause word order, participles as adjectives, and reported speech |
| 🗂️ **Vocab** | Flashcard drills for B2 "glue language" — argumentative sentence connectives (fx *ikke desto mindre*, *til gengæld*) and common idioms |

### Shared

| Module | What it does |
|---|---|
| 🗓️ **Study plan** | A Dashboard countdown + personalized weekly focus, defaulting to the official 2026 PD2/PD3 exam dates (editable in Settings) |
| 📊 **Exam readiness** | A traffic-light summary per module (Reading/Writing/Speaking/Grammar/Vocab) so you know where to spend your remaining study time |
| 🔁 **Review mistakes** | Every wrong answer from a Reading or Grammar quiz is saved for targeted re-drilling, instead of re-doing the whole exercise |
| 🖨️ **Cheat sheet** | A printable/PDF-able one-page summary (exam facts, grading scale, top phrases/connectives, condensed grammar) for last-minute review |
| 💡 **Tips & Tricks** | Exam facts and strategy tips — content switches automatically between PD2 and PD3 based on the active exam level |
| 📊 **Progress** | Local history of every attempt/score, across both PD2 and PD3 modules |
| 🤖 **AI Coach** | A floating chat widget giving study tips based on your own progress stats, plus direct verb/adjective-conjugation lookups — works fully offline; optionally upgrade to real conversational AI with your own API key |

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

### PD2 (2013–2023)

The Reading and Writing content is adapted from official **Prøve i Dansk 2**
past exams spanning **2013–2023**, sourced from the exam booklets and their
accompanying censor/eksaminator answer-key booklets in `../source-papers`
(not committed to version control — see below). Used here strictly for
personal exam preparation.

- **Reading**: 21 full practice exams (2013–2023, every sitting except
  2023 Vinter, which doesn't exist in the source archive).
  - All 5 task types are included for every exam: Opgave 1 (scanning),
    Opgave 2 (ad matching), Opgave 3 (cloze), Opgave 4 (sentence-gap), and
    Opgave 5 (paragraph-match) — each auto-scored against the real
    official censor/eksaminator answer keys.
  - 2019 Sommer only has Opgave 1-2 (the source archive is missing the
    Opgave 3-5 booklet for that sitting).
  - 2023 Vinter is not included (no exam was found in the source archive
    for that sitting).
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

### PD3 (2018–2024)

The PD3 Reading, Writing, and Speaking content is adapted the same way,
from official **Prøve i Dansk 3** past exams spanning **2018–2024** (13
sessions). Earlier PD3 years back to 2004 exist in the source collection,
but 2016–2017 are scanned-image PDFs with no extractable text, so the
automated pipeline currently covers 2018 onward.

- **Reading**: 13 full practice exams, each split into two papers:
  - *Læseforståelse 1* (Delprøve 1): a directory-style search-and-scan
    task, auto-scored against the official short-answer key.
  - *Læseforståelse 2*: Delprøve 2A (multiple choice), plus either
    Delprøve 2B as a cloze test (2018–2021) or Delprøve 2B (paragraph
    matching) + Delprøve 3 (cloze) in the newer exam format (2022
    onward) — the exam's own structure changed partway through this
    range, and both formats are supported.
- **Writing**: every session's e-mail task (Delprøve 1) plus both choice-A
  and choice-B argumentative essay tasks (Delprøve 2).
- **Speaking**: every available session's 3 topics (A/B/C), each with the
  real examiner script's obligatory questions and follow-ups for both
  picture situations (2022 Sommer has no speaking booklet in the source
  archive, so that one session is reading/writing only).
- **Grammar** and **Vocab**: written from scratch for this app (not sourced
  from the exam papers), covering B2-level topics that build on PD2's B1
  foundation.

### Reproducing/extending the archives

The `scripts/` folder contains the Python extraction pipelines used to turn
the raw exam PDFs into structured data.

**PD2** → `src/data/reading.ts` / `src/data/readingArchive.ts`:

- `pdf_column_extract.py` / `pdf_grid_extract.py` — column/grid-aware PDF
  text extraction helpers (handles the 2-column directory-style reading
  passages).
- `extract_all_reading.py` — the core extraction library: locates the right
  PDF per year/season, extracts each task type (scanning, cloze,
  sentence-gap, paragraph-match), and parses the official answer key.
- `generate_reading_archive.py` — runs the pipeline across all available
  years and emits `reading_archive_ts_content.txt`, converted into
  `src/data/readingArchive.ts`.

**PD3** → `src/data/pd3Reading.ts` / `pd3Writing.ts` / `pd3Speaking.ts`:

- `pd3_common.py` — shared helpers (session list, fuzzy filename lookup,
  boilerplate/junk-line filtering).
- `extract_pd3_reading.py` / `extract_pd3_writing.py` /
  `extract_pd3_speaking.py` — per-module extraction, each writing a JSON
  file to `scripts/pd3_json/`.
- `generate_pd3_archive.py` — runs all three PD3 extractors, then converts
  the JSON into the three `src/data/pd3*.ts` files. Run with:
  `python3 scripts/generate_pd3_archive.py`.

Re-running either pipeline requires the original source PDFs (kept outside
version control under `../source-papers`), plus `pdfplumber`
(`pip install pdfplumber`).

## Visitor analytics

The app includes a privacy-friendly (cookieless, no consent banner needed)
analytics snippet from [GoatCounter](https://www.goatcounter.com/) in
`index.html`, plus SPA route tracking in `src/lib/analytics.ts` so each
module (Reading, Writing, Speaking, ...) shows up as its own pageview.

**To activate it** (one-time, ~30 seconds, free, no credit card):
1. Go to https://www.goatcounter.com/signup
2. Enter the site code **`pd2coach-ankurjha21`** (must match exactly — it's
   already baked into `index.html`) and your email.
3. Click the magic link GoatCounter emails you.
4. View stats anytime at `https://pd2coach-ankurjha21.goatcounter.com`.

Until step 1-3 are done, the script just silently no-ops (the count pixel
404s harmlessly) — it never breaks the app either way.

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
