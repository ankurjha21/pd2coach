// Shared heuristics for the Dashboard's "Eksamensklar-status" (exam
// readiness) summary: turns raw attempt counts/scores into a simple
// traffic-light verdict per module, so a learner can see at a glance where
// to spend their remaining study time instead of guessing from raw numbers.
import type { ReadinessItem } from '../components/ExamReadinessSummary'

export function scoreBasedVerdict(attemptsCount: number, coverage: number, avgScore: number | null): ReadinessItem['verdict'] {
  if (attemptsCount === 0) return 'not-started'
  if (avgScore != null && avgScore >= 80 && coverage >= 0.5) return 'ready'
  if ((avgScore != null && avgScore >= 60) || coverage >= 0.3) return 'ok'
  return 'needs-work'
}

export function countBasedVerdict(attemptsCount: number): ReadinessItem['verdict'] {
  if (attemptsCount === 0) return 'not-started'
  if (attemptsCount >= 7) return 'ready'
  if (attemptsCount >= 3) return 'ok'
  return 'needs-work'
}

export function vocabVerdict(reviewedCount: number, total: number, dueCount: number): ReadinessItem['verdict'] {
  if (reviewedCount === 0) return 'not-started'
  if (dueCount > total * 0.3) return 'needs-work'
  if (reviewedCount >= total * 0.7) return 'ready'
  return 'ok'
}

export function formatPct(n: number | null): string {
  return n != null ? `${Math.round(n)}%` : '–'
}
