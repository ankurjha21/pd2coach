// Builds a personalized, time-aware study plan for the Dashboard countdown
// card. Combines "how many days are left until the exam" with "which areas
// are currently weak" (reusing the same stats shape already computed for
// the AI Coach) to produce a short, concrete list of what to focus on.
export interface StudyStats {
  readingAvg: number | null
  writingAttempts: number
  speakingAttempts: number
  vocabDueCount: number
}

export type StudyPhase = 'foundation' | 'practice' | 'intensive' | 'final-days' | 'exam-day' | 'past'

export interface StudyPlan {
  daysLeft: number
  phase: StudyPhase
  phaseLabel: string
  focus: string[]
}

export function daysUntil(examDateISO: string): number {
  const [y, m, d] = examDateISO.split('-').map(Number)
  const exam = new Date(y, (m ?? 1) - 1, d ?? 1)
  const today = new Date()
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  return Math.round((exam.getTime() - todayMidnight.getTime()) / 86400000)
}

function phaseFor(daysLeft: number): { phase: StudyPhase; label: string } {
  if (daysLeft < 0) return { phase: 'past', label: 'Eksamen er overstået' }
  if (daysLeft === 0) return { phase: 'exam-day', label: 'Eksamensdag!' }
  if (daysLeft <= 3) return { phase: 'final-days', label: 'Sidste dage' }
  if (daysLeft <= 10) return { phase: 'intensive', label: 'Intensiv uge' }
  if (daysLeft <= 21) return { phase: 'practice', label: 'Træningsperiode' }
  return { phase: 'foundation', label: 'Opbygningsfase' }
}

export function buildStudyPlan(examDateISO: string, stats: StudyStats): StudyPlan {
  const daysLeft = daysUntil(examDateISO)
  const { phase, label } = phaseFor(daysLeft)
  const focus: string[] = []

  if (phase === 'past') {
    focus.push(
      'Din eksamensdato er overstået — opdater datoen under Settings, hvis du skal til eksamen igen, eller god fornøjelse med resultatet! 🎉',
    )
    return { daysLeft, phase, phaseLabel: label, focus }
  }
  if (phase === 'exam-day') {
    focus.push('Tag det roligt i dag — kig evt. Tips & Tricks igennem én gang, men undgå at proppe nyt stof ind.')
    focus.push('Husk gyldig legitimation og mød op i god tid.')
    return { daysLeft, phase, phaseLabel: label, focus }
  }

  if (phase === 'final-days') {
    focus.push('Tag ét helt, tidsbegrænset Reading-sæt for at øve tempoet én sidste gang.')
    focus.push('Gennemgå dine tidligere forkerte svar i Progress i stedet for at starte på nyt stof.')
    focus.push('Sov godt og undgå at proppe ny grammatik ind i sidste øjeblik.')
  } else if (phase === 'intensive') {
    focus.push('Tag mindst ét helt eksamenssæt i Reading under tidspres hver dag.')
    focus.push('Skriv mindst én komplet besvarelse i Writing, og tjek ordtal + at alle punkter er besvaret.')
    focus.push('Øv Speaking højt (gerne med optagelse) — flow og tempo under tidspres er det, der tæller nu.')
  } else if (phase === 'practice') {
    focus.push('Lav en fast ugeplan: 2-3 Reading-sæt, 2 skriveopgaver og 1-2 Speaking-emner denne uge.')
    focus.push('Brug 10-15 minutter dagligt på Vocab-repetition, så ordforrådet sidder fast.')
  } else {
    focus.push('Byg fundamentet: gennemgå alle Grammar-emner, og lær de mest almindelige verber i Vocab.')
    focus.push('Start roligt med 1 Reading-sæt om ugen for at vænne dig til opgavetyperne.')
  }

  // Personalize using the learner's own stats, appended after the generic
  // phase guidance (skipped during the final days, where the advice above
  // already covers "review, don't learn new things").
  if (phase !== 'final-days') {
    if (stats.readingAvg != null && stats.readingAvg < 60) {
      focus.push(`Din læseforståelse ligger på ${Math.round(stats.readingAvg)}% — prioriter flere Reading-sæt.`)
    }
    if (stats.writingAttempts === 0) {
      focus.push('Du har endnu ikke prøvet en skriveopgave — start med e-mail-genren.')
    } else if (stats.writingAttempts < 3 && (phase === 'intensive' || phase === 'practice')) {
      focus.push(`Du har kun ${stats.writingAttempts} skriveforsøg gemt — skriv mindst én opgave mere denne uge.`)
    }
    if (stats.speakingAttempts === 0 && phase !== 'foundation') {
      focus.push('Du har ikke øvet Speaking endnu — vælg et emne og øv højt, gerne med optagelse.')
    }
    if (stats.vocabDueCount > 20) {
      focus.push(`${stats.vocabDueCount} ord venter på repetition i Vocab — brug 10 minutter på dem i dag.`)
    }
  }

  return { daysLeft, phase, phaseLabel: label, focus: focus.slice(0, 5) }
}
