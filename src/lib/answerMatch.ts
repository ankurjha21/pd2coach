// Shared free-text short-answer matching for the Reading quizzes (PD2 and
// PD3). Mirrors the official exam answer-key conventions, where:
//  - parentheses mark OPTIONAL wording that may be included or omitted
//    (e.g. "(Byens gamle) rådhus" accepts "rådhus" alone, or with "byens
//    gamle" prefixed)
//  - a slash separates fully alternative acceptable answers (e.g. "ja/nej",
//    or "sejle/skib/Margrete I"), and can also appear *inside* parentheses
//    to list alternative optional wording
//
// A student's answer is accepted only if it contains every REQUIRED word
// (i.e. every word outside parentheses) of at least one alternative,
// matched as whole words. This intentionally replaced an earlier
// substring-based check (`correctAnswer.includes(userAnswer)`) that could
// be "tricked" into a false ✓ by typing a short, meaningless fragment that
// merely happened to appear inside a much longer correct answer (e.g.
// typing "dhus" against "rådhus", or "lometer" against "kilometer").

function normalizeWord(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

function wordsOf(s: string): string[] {
  return s
    .replace(/[.,!?():;"/]/g, ' ')
    .split(/\s+/)
    .map(normalizeWord)
    .filter(Boolean)
}

// Splits a raw answer string into top-level alternatives by '/', ignoring
// any '/' nested inside parentheses (those denote alternative *optional*
// wording, not alternative full answers).
function splitTopLevelAlternatives(raw: string): string[] {
  const alts: string[] = []
  let depth = 0
  let current = ''
  for (const ch of raw) {
    if (ch === '(') depth++
    if (ch === ')') depth = Math.max(0, depth - 1)
    if (ch === '/' && depth === 0) {
      alts.push(current)
      current = ''
    } else {
      current += ch
    }
  }
  alts.push(current)
  return alts.map((a) => a.trim()).filter(Boolean)
}

function requiredWords(alternative: string): string[] {
  // Words inside parentheses are optional per the official answer-key
  // convention; only words outside parentheses are required.
  const withoutParens = alternative.replace(/\([^)]*\)/g, ' ')
  return wordsOf(withoutParens)
}

// A required word matches a user word if they're equal, or if the user
// word is a plausible inflected form (shares the required word's full
// stem as a prefix) - this keeps minor suffix differences (e.g. plural
// "-er", "-en") working without reintroducing arbitrary substring matches.
function wordMatches(required: string, userWord: string): boolean {
  if (required === userWord) return true
  if (required.length >= 4 && userWord.startsWith(required)) return true
  if (userWord.length >= 4 && required.startsWith(userWord) && userWord.length >= required.length - 2) return true
  return false
}

export function isShortAnswerCorrect(userAnswer: string, correctRaw: string | string[]): boolean {
  const correctStrings = Array.isArray(correctRaw) ? correctRaw : [correctRaw]
  const userWords = wordsOf(userAnswer)
  if (userWords.length === 0) return false

  for (const correct of correctStrings) {
    for (const alt of splitTopLevelAlternatives(correct)) {
      const required = requiredWords(alt)
      if (required.length === 0) continue
      const allPresent = required.every((rw) => userWords.some((uw) => wordMatches(rw, uw)))
      if (allPresent) return true
    }
  }
  return false
}
