// Local persistence layer. Everything runs client-side in the browser via
// localStorage — no backend/server needed to use this app.
import type { AttemptRecord, VocabSrsState } from '../types'

const ATTEMPTS_KEY = 'pd2coach.attempts'
const SRS_KEY = 'pd2coach.srs'
const SETTINGS_KEY = 'pd2coach.settings'

export interface Settings {
  openAiApiKey?: string
  dailyGoalMinutes?: number
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
  // settings (incl. API key) intentionally preserved on "reset progress"
}
