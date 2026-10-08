// Lightweight spaced-repetition (Leitner-box style) scheduler for the
// vocabulary trainer. Simpler than full SM-2, but effective for flashcards.
import type { VocabSrsState } from '../types'

const BOX_INTERVALS_DAYS = [0, 1, 2, 4, 7, 14, 30] // index = box number (0-6)
const DAY_MS = 24 * 60 * 60 * 1000

export function initSrsState(key: string): VocabSrsState {
  return { key, box: 0, dueAt: Date.now() }
}

export function isDue(state: VocabSrsState): boolean {
  return state.dueAt <= Date.now()
}

export function reviewCard(state: VocabSrsState, result: 'again' | 'good' | 'easy'): VocabSrsState {
  let box = state.box
  if (result === 'again') {
    box = 0
  } else if (result === 'good') {
    box = Math.min(box + 1, BOX_INTERVALS_DAYS.length - 1)
  } else {
    box = Math.min(box + 2, BOX_INTERVALS_DAYS.length - 1)
  }
  const intervalDays = BOX_INTERVALS_DAYS[box]
  return {
    key: state.key,
    box,
    dueAt: Date.now() + intervalDays * DAY_MS,
    lastResult: result,
  }
}

export function sortByDue(states: VocabSrsState[]): VocabSrsState[] {
  return [...states].sort((a, b) => a.dueAt - b.dueAt)
}
