// Local persistence layer. Everything runs client-side in the browser via
// localStorage — no backend/server needed to use this app. PD2 and PD3
// (Prøve i Dansk 3, a separate, higher-level exam) attempts/progress share
// this same mechanism; the exam-level toggle just controls which track the
// nav/dashboard focuses on.
import type { AttemptRecord, ExamLevel, MistakeRecord, VocabSrsState } from '../types'

const ATTEMPTS_KEY = 'pd2coach.attempts'
const SRS_KEY = 'pd2coach.srs'
const SETTINGS_KEY = 'pd2coach.settings'
const EXAM_LEVEL_KEY = 'pd2coach.examLevel'
const MISTAKES_KEY = 'pd2coach.mistakes'

export interface Settings {
  openAiApiKey?: string
  dailyGoalMinutes?: number
  examDate?: string // ISO yyyy-mm-dd, the user's own exam date (used for the Dashboard countdown/study plan)
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeJson(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // localStorage may be unavailable (private mode, quota) — fail silently
  }
}

// ---------------- Attempts / Progress ----------------

export function getAttempts(): AttemptRecord[] {
  return readJson<AttemptRecord[]>(ATTEMPTS_KEY, [])
}

export function addAttempt(record: Omit<AttemptRecord, 'id' | 'timestamp'>): AttemptRecord {
  const full: AttemptRecord = {
    ...record,
    id: `${record.module}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: Date.now(),
  }
  const all = getAttempts()
  all.push(full)
  writeJson(ATTEMPTS_KEY, all)
  return full
}

export function clearAttempts() {
  writeJson(ATTEMPTS_KEY, [])
}

// ---------------- Vocab SRS ----------------

export function getSrsState(): Record<string, VocabSrsState> {
  return readJson<Record<string, VocabSrsState>>(SRS_KEY, {})
}

export function saveSrsState(state: Record<string, VocabSrsState>) {
  writeJson(SRS_KEY, state)
}

// ---------------- Settings ----------------

export function getSettings(): Settings {
  return readJson<Settings>(SETTINGS_KEY, {})
}

export function saveSettings(settings: Settings) {
  writeJson(SETTINGS_KEY, settings)
}

export function resetAllData() {
  localStorage.removeItem(ATTEMPTS_KEY)
  localStorage.removeItem(SRS_KEY)
  localStorage.removeItem(MISTAKES_KEY)
  // settings (incl. API key) intentionally preserved on "reset progress"
}

// ---------------- Mistake review ----------------

export function getMistakes(): Record<string, MistakeRecord> {
  return readJson<Record<string, MistakeRecord>>(MISTAKES_KEY, {})
}

// Records (or re-records) a missed question. Called every time a quiz is
// submitted with a wrong answer; if the same question was already missed
// before, bumps timesMissed/lastMissedAt instead of duplicating it.
export function recordMistake(m: Omit<MistakeRecord, 'firstMissedAt' | 'lastMissedAt' | 'timesMissed'>) {
  const all = getMistakes()
  const existing = all[m.id]
  all[m.id] = {
    ...m,
    firstMissedAt: existing?.firstMissedAt ?? Date.now(),
    lastMissedAt: Date.now(),
    timesMissed: (existing?.timesMissed ?? 0) + 1,
  }
  writeJson(MISTAKES_KEY, all)
}

// Removes a mistake from the queue — called both when a user answers it
// correctly inside the dedicated Review page, and automatically whenever a
// quiz is re-submitted and that specific question is now answered right.
export function resolveMistake(id: string) {
  const all = getMistakes()
  if (all[id]) {
    delete all[id]
    writeJson(MISTAKES_KEY, all)
  }
}

export function clearAllMistakes() {
  writeJson(MISTAKES_KEY, {})
}

// ---------------- Exam level (PD2 / PD3) ----------------

export function getExamLevel(): ExamLevel {
  try {
    const raw = localStorage.getItem(EXAM_LEVEL_KEY)
    return raw === 'pd3' ? 'pd3' : 'pd2'
  } catch {
    return 'pd2'
  }
}

export function setExamLevel(level: ExamLevel) {
  try {
    localStorage.setItem(EXAM_LEVEL_KEY, level)
  } catch {
    // ignore
  }
}
