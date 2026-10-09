// AI Coach: gives personalized study tips based on local progress stats.
// Works fully offline using rule-based heuristics. If the user supplies
// their own OpenAI-compatible API key (Settings page, stored only in
// localStorage on their machine), the coach calls the Chat Completions API
// directly from the browser for richer, conversational feedback — with a
// graceful fallback to the offline tips if no key is set or the request
// fails (e.g. no internet).
import type { AttemptRecord } from '../types'
import { getSettings } from './storage'
import { verbs, adjectives } from '../data/vocab'

export interface CoachStats {
  readingAvg: number | null
  writingAttempts: number
  speakingAttempts: number
  vocabDueCount: number
  grammarAvg: number | null
  totalAttempts: number
}

export function computeStats(attempts: AttemptRecord[], vocabDueCount: number): CoachStats {
  const reading = attempts.filter((a) => a.module === 'reading' && a.scorePercent != null)
  const grammar = attempts.filter((a) => a.module === 'grammar' && a.scorePercent != null)
  const writing = attempts.filter((a) => a.module === 'writing')
  const speaking = attempts.filter((a) => a.module === 'speaking')
  const avg = (arr: AttemptRecord[]) =>
    arr.length ? arr.reduce((sum, a) => sum + (a.scorePercent ?? 0), 0) / arr.length : null

  return {
    readingAvg: avg(reading),
    writingAttempts: writing.length,
    speakingAttempts: speaking.length,
    vocabDueCount,
    grammarAvg: avg(grammar),
    totalAttempts: attempts.length,
  }
}

export function offlineTips(stats: CoachStats): string[] {
  const tips: string[] = []

  if (stats.totalAttempts === 0) {
    return [
      'Velkommen! Start med en læseøvelse (Reading) for at se, hvor du står — det tager kun 30-60 minutter, ligesom til den rigtige eksamen.',
      'Prøv også en skriveopgave (Writing): vælg en genre, skriv, og sammenlign med et rigtigt elevsvar med karakter.',
      'Øv udtale og flow i Speaking-modulet — tag et emne, og optag dig selv, mens du svarer på spørgsmålene.',
    ]
  }

  if (stats.readingAvg != null && stats.readingAvg < 60) {
    tips.push(
      `Din gennemsnitlige læseforståelse-score er ${Math.round(stats.readingAvg)}%. Prøv at læse overskrifter og nøgleord først (skimming), før du leder efter de konkrete svar — PD2's opgave 1 handler om at scanne hurtigt, ikke at læse alt grundigt.`,
    )
  } else if (stats.readingAvg != null && stats.readingAvg >= 85) {
    tips.push(`Flot! ${Math.round(stats.readingAvg)}% i læseforståelse. Prøv nu at tage tiden og se, om du kan være hurtigere.`)
  }

  if (stats.writingAttempts === 0) {
    tips.push('Du har endnu ikke prøvet en skriveopgave. Start med genren "En e-mail" — den fylder altid Delprøve 2 til eksamen.')
  } else if (stats.writingAttempts < 5) {
    tips.push('Prøv at skrive i flere forskellige genrer (opslag, klage, jobansøgning...) — til eksamen ved du ikke, hvilken genre der kommer.')
  }

  if (stats.speakingAttempts === 0) {
    tips.push('Prøv Speaking-modulet: vælg et emne, beskriv billedet højt for dig selv, og øv dig i at begrunde din mening med "fordi...".')
  }

  if (stats.vocabDueCount > 0) {
    tips.push(`Du har ${stats.vocabDueCount} ord/verber klar til repetition i Vocab-træneren. Et par minutter om dagen gør stor forskel.`)
  }

  if (stats.grammarAvg != null && stats.grammarAvg < 70) {
    tips.push(`Din grammatik-score er ${Math.round(stats.grammarAvg)}%. Genbesøg "Ordstilling" og "Adjektiv-bøjning" — det er de emner, der oftest giver fejl hos B1-kursister.`)
  }

  if (tips.length === 0) {
    tips.push('Flot arbejde på tværs af modulerne! Bliv ved med jævnligt at blande læsning, skrivning, tale og ordforråd — det ligner bedst den rigtige eksamensdag.')
  }

  return tips
}

export async function askCoach(question: string, stats: CoachStats, history: { role: 'user' | 'assistant'; content: string }[] = []): Promise<string> {
  const settings = getSettings()
  if (!settings.openAiApiKey) {
    return offlineAnswer(question, stats)
  }

  try {
    const systemPrompt = `Du er en venlig, opmuntrende dansklærer, der hjælper en kursist med at forberede sig til "Prøve i Dansk 2" (PD2), et B1-niveau eksamen i dansk for udlændinge. Eksamen har tre dele: Læseforståelse, Skriftlig fremstilling og Mundtlig kommunikation. Giv korte, konkrete og venlige råd på dansk (med enkelte engelske forklaringer, hvis det hjælper forståelsen). Kursistens aktuelle statistik: ${JSON.stringify(stats)}.`

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${settings.openAiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          ...history,
          { role: 'user', content: question },
        ],
        temperature: 0.6,
        max_tokens: 500,
      }),
    })
    if (!res.ok) throw new Error(`API error ${res.status}`)
    const data = await res.json()
    const content = data?.choices?.[0]?.message?.content
    if (typeof content === 'string' && content.trim()) return content.trim()
    throw new Error('Empty response')
  } catch {
    return offlineAnswer(question, stats) + '\n\n_(Kunne ikke kontakte AI-tjenesten lige nu, så her er et offline-svar i stedet.)_'
  }
}

// Extracts a candidate Danish word from a question like 'Hvordan bøjer jeg
// verbet "at løbe"?' or 'bøjning af spise' — strips a leading "at " and any
// surrounding quotes/punctuation.
function extractWordCandidate(question: string): string | null {
  const m = question.match(/[""']?\s*(?:at\s+)?([a-zæøåA-ZÆØÅ]+)\s*[""']?\s*\??\s*$/)
  if (m) return m[1].toLowerCase()
  const words = question
    .toLowerCase()
    .replace(/[""'?.,]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w))
  return words.length ? words[words.length - 1] : null
}

const STOPWORDS = new Set([
  'hvordan', 'bøjer', 'bøjning', 'jeg', 'verbet', 'ordet', 'adjektivet', 'af', 'på', 'i', 'til', 'for',
  'dansk', 'betyder', 'hvad', 'konjugerer', 'konjugation',
])

function formatVerbAnswer(v: { infinitive: string; present: string; past: string; presentPerfect: string; imperative: string }) {
  return `Verbet "${v.infinitive}" bøjes sådan:\n\n• Infinitiv: at ${v.infinitive}\n• Nutid (præsens): ${v.present}\n• Datid (præteritum): ${v.past}\n• Førnutid (perfektum): ${v.presentPerfect}\n• Bydeform (imperativ): ${v.imperative}\n\nØv flere verber i Vocab-modulet med spaced repetition.`
}

function formatAdjectiveAnswer(a: { nForm: string; tForm: string; eForm: string; comparative: string; superlative: string }) {
  return `Adjektivet "${a.nForm}" bøjes sådan:\n\n• N-form (en-ord): ${a.nForm}\n• T-form (et-ord): ${a.tForm}\n• E-form (flertal/bestemt): ${a.eForm}\n• Komparativ: ${a.comparative}\n• Superlativ: ${a.superlative}\n\nØv flere adjektiver i Vocab-modulet.`
}

function offlineAnswer(question: string, stats: CoachStats): string {
  const q = question.toLowerCase()

  // Verb/adjective conjugation lookups — these are asked for very
  // specifically, so a generic tip would feel like a non-answer.
  if (q.includes('bøj') || q.includes('konjuger') || q.includes('datid') || q.includes('nutid') || q.includes('førnutid')) {
    const candidate = extractWordCandidate(question)
    const verb = candidate ? verbs.find((v) => v.infinitive === candidate) : undefined
    if (verb) return formatVerbAnswer(verb)
    const adj = candidate ? adjectives.find((a) => a.nForm === candidate) : undefined
    if (adj) return formatAdjectiveAnswer(adj)
    return `Jeg kunne ikke genkende ordet${candidate ? ` "${candidate}"` : ''} i min ordliste (500 verber + 250 adjektiver). Prøv at skrive det på grundformen (fx "løbe" i stedet for "løber"), eller slå det op direkte i Vocab-modulet, hvor du kan søge og øve med spaced repetition.`
  }

  if (q.includes('skriv') || q.includes('writing') || q.includes('stile')) {
    return 'Til skriftlig fremstilling: svar på ALLE punkterne i opgaven, brug en passende indledning/afslutning for genren, og tjek ordtal i e-mailen (minimum 100 ord). Se en model-besvarelse i Writing-modulet for inspiration.'
  }
  if (q.includes('læs') || q.includes('reading')) {
    return 'Til læseforståelse: start med at læse spørgsmålene FØR teksten, så du ved, hvad du skal lede efter. Opgave 1 handler om at scanne for konkrete fakta — du behøver ikke forstå hvert ord.'
  }
  if (q.includes('tal') || q.includes('speaking') || q.includes('mundtlig')) {
    return 'Til mundtlig kommunikation: øv dig i at begrunde din mening ("...fordi...", "...for mig betyder det..."), og træn i at lytte og svare på din makkers synspunkter i diskussionsdelen.'
  }
  if (q.includes('grammatik') || q.includes('grammar') || q.includes('ordstilling') || q.includes('modalverb')) {
    return 'Se Grammar-modulet for forklaringer og quizzer om ordstilling, bøjning, tider og modalverber — hvert emne har eksempler og en lille test, så du kan tjekke, om du har forstået det.'
  }
  if (q.includes('ordforråd') || q.includes('vocab') || q.includes('gloser') || q.includes('ord ')) {
    return 'Brug Vocab-modulet til at øve ordforråd — det bruger spaced repetition (Leitner-system), så ord, du har svært ved, dukker op oftere, og ord du kan godt, dukker op sjældnere.'
  }

  // Unrecognized question: be explicit about scope instead of silently
  // dumping unrelated generic tips, which otherwise looks like a bug.
  return (
    'Jeg er en offline AI Coach og kan bedst svare på spørgsmål om Reading, Writing, Speaking, Grammar og Vocab (fx "hvordan bøjer jeg verbet at løbe?"). ' +
    'For åbne spørgsmål om alt muligt dansk kan du tilføje din egen OpenAI API-nøgle under Settings for rigtige AI-svar.\n\n' +
    'Her er nogle generelle tips i mellemtiden:\n\n' +
    offlineTips(stats).join('\n\n')
  )
}
