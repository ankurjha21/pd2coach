// Heuristic (rule-based, fully offline) feedback engine for the Writing
// module. This is not a substitute for a real Danish teacher, but it gives
// immediate, actionable feedback on structure, length, and common B1 errors
// — modeled loosely on the official PD2 assessment criteria (pragmatic,
// discursive, and linguistic competence) found in the censor/eksaminator
// booklets.
import type { WritingGenreInfo, WritingPrompt } from '../types'

export interface WritingFeedbackItem {
  level: 'good' | 'warning' | 'error'
  message: string
}

export interface WritingAnalysis {
  wordCount: number
  sentenceCount: number
  avgSentenceLength: number
  feedback: WritingFeedbackItem[]
  bulletsCovered: { bullet: string; covered: boolean }[]
}

const COMMON_ERROR_PATTERNS: { regex: RegExp; message: string }[] = [
  {
    regex: /\b(kan|skal|vil|må|bør)\s+at\s+\w+/gi,
    message:
      'Modalverber (kan/skal/vil/må/bør) følges IKKE af "at" — skriv fx "kan tale", ikke "kan at tale".',
  },
  {
    regex: /\bi\s+igår\b|\bigår\b/gi,
    message: '"i går" skrives som to ord.',
  },
  {
    regex: /\bjeg\s+er\s+interessering\b/gi,
    message: 'Tjek bøjningen: "interesseret" (ikke "interessering").',
  },
]

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
}

function countWords(text: string): number {
  const matches = text.match(/[\p{L}æøåÆØÅ'-]+/gu)
  return matches ? matches.length : 0
}

function hasDanishChars(text: string): boolean {
  return /[æøåÆØÅ]/.test(text)
}

export function analyzeWriting(
  text: string,
  options: { prompt?: WritingPrompt; genre?: WritingGenreInfo } = {},
): WritingAnalysis {
  const { prompt, genre } = options
  const feedback: WritingFeedbackItem[] = []
  const wordCount = countWords(text)
  const sentences = splitSentences(text)
  const sentenceCount = sentences.length
  const avgSentenceLength = sentenceCount > 0 ? wordCount / sentenceCount : 0

  // Length check
  const minWords = prompt?.minWords
  if (minWords) {
    if (wordCount < minWords) {
      feedback.push({
        level: 'error',
        message: `Du har skrevet ${wordCount} ord. Opgaven kræver minimum ${minWords} ord — skriv mere.`,
      })
    } else {
      feedback.push({ level: 'good', message: `Flot, du opfylder minimumskravet på ${minWords} ord (${wordCount} ord).` })
    }
  } else if (wordCount < 40) {
    feedback.push({
      level: 'warning',
      message: `Teksten er ret kort (${wordCount} ord). Prøv at uddybe dine svar på alle punkterne i opgaven.`,
    })
  }

  // Danish character check
  if (!hasDanishChars(text) && wordCount > 15) {
    feedback.push({
      level: 'warning',
      message: 'Teksten indeholder ingen danske bogstaver (æ, ø, å) — tjek, om det er med vilje, eller om du er kommet til at skrive uden dem.',
    })
  }

  // Sentence length variety
  if (sentenceCount >= 3) {
    if (avgSentenceLength > 25) {
      feedback.push({
        level: 'warning',
        message: `Dine sætninger er i gennemsnit lange (~${Math.round(avgSentenceLength)} ord). Overvej at dele nogle op for bedre læsbarhed.`,
      })
    } else if (avgSentenceLength < 5) {
      feedback.push({
        level: 'warning',
        message: 'Dine sætninger er meget korte. Prøv at binde nogle sammen med "og", "men", "fordi", "så" for mere flydende sprog.',
      })
    } else {
      feedback.push({ level: 'good', message: 'God variation i sætningslængde.' })
    }
  }

  // Opening/closing phrase check (genre-aware)
  if (genre) {
    const lower = text.toLowerCase()
    const hasOpening = genre.openingPhrases.some((p) => {
      const key = p.replace(/[().,]/g, '').split(/\s+/).slice(0, 2).join(' ').toLowerCase()
      return key.length > 2 && lower.includes(key)
    })
    const hasClosing = genre.closingPhrases.some((p) => {
      const key = p.split(/\s+/).slice(0, 3).join(' ').toLowerCase().replace(/[(),.]/g, '')
      return key.length > 3 && lower.includes(key.split(' ')[0])
    })
    if (!hasOpening) {
      feedback.push({
        level: 'warning',
        message: `Husk en passende indledning for genren "${genre.label}" (fx: ${genre.openingPhrases[0]}).`,
      })
    }
    if (!hasClosing) {
      feedback.push({
        level: 'warning',
        message: `Husk en passende afslutning (fx: ${genre.closingPhrases[genre.closingPhrases.length - 1]}).`,
      })
    }
  }

  // Common error pattern scan
  for (const { regex, message } of COMMON_ERROR_PATTERNS) {
    if (regex.test(text)) {
      feedback.push({ level: 'error', message })
    }
  }

  // Bullet point coverage heuristic (keyword overlap)
  const bulletsCovered = (prompt?.bullets ?? []).map((bullet) => {
    const keywords = bullet
      .toLowerCase()
      .replace(/[().,?]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 3 && !['hvad', 'hvor', 'hvem', 'hvornår', 'hvorfor', 'hvordan', 'dine', 'dig', 'selv', 'lidt'].includes(w))
    const lower = text.toLowerCase()
    const hits = keywords.filter((k) => lower.includes(k.slice(0, Math.max(4, k.length - 2))))
    return { bullet, covered: keywords.length === 0 || hits.length >= Math.ceil(keywords.length * 0.3) }
  })

  const uncoveredCount = bulletsCovered.filter((b) => !b.covered).length
  if (prompt && uncoveredCount > 0) {
    feedback.push({
      level: 'warning',
      message: `Du har muligvis ikke besvaret ${uncoveredCount} af punkterne i opgaven endnu — tjek listen nedenfor.`,
    })
  } else if (prompt) {
    feedback.push({ level: 'good', message: 'Du ser ud til at have berørt alle punkterne i opgaven.' })
  }

  if (feedback.length === 0) {
    feedback.push({ level: 'good', message: 'Ser fornuftigt ud! Læs igennem en ekstra gang for stavefejl.' })
  }

  return { wordCount, sentenceCount, avgSentenceLength, feedback, bulletsCovered }
}
