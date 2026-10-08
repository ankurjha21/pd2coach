// Core domain types for the PD2 Coach app.
// "PD2" = Prøve i Dansk 2, a Danish B1-level language exam with three parts:
// Reading (Læseforståelse), Writing (Skriftlig fremstilling), and Speaking (Mundtlig kommunikation).

export type Season = 'Sommer' | 'Vinter'

export interface ExamMeta {
  year: number
  season: Season
  label: string // e.g. "Maj-juni 2023"
}

// ---------------- Reading ----------------

export type ReadingTaskType =
  | 'short-answer' // find factual info, answer in a few words
  | 'matching' // match ads/paragraphs to clues
  | 'cloze' // fill in missing word from a word bank
  | 'sentence-gap' // fill in missing sentence from a list A-H
  | 'paragraph-match' // match question to paragraph A-H

export interface ReadingQuestion {
  id: string
  number: number
  prompt: string
  type: ReadingTaskType
  options?: string[] // for matching/cloze word banks or letter options
  answer: string | string[] // accepted answer(s)
  points: number
  note?: string // examiner remark, e.g. alternate accepted answers
}

export interface ReadingTask {
  id: string
  opgaveNumber: number
  part: 'Delprøve 1' | 'Delprøve 2'
  title: string
  type: ReadingTaskType
  instructions: string
  sourceText?: string // the reading passage(s), plain text
  timeMinutes?: number
  questions: ReadingQuestion[]
}

export interface ReadingExam {
  id: string
  exam: ExamMeta
  tasks: ReadingTask[]
}

// ---------------- Writing ----------------

export type WritingGenreKey =
  | 'opslag'
  | 'invitation'
  | 'jobansoegning'
  | 'klage'
  | 'takkebrev'
  | 'anbefaling'
  | 'laeserbrev'
  | 'efterlysning'
  | 'email'

export interface WritingPrompt {
  id: string
  genre: WritingGenreKey
  exam: ExamMeta
  situation: string
  bullets: string[]
  minWords?: number
  note?: string
}

export interface WritingModelAnswer {
  id: string
  promptId: string
  text: string
  grade?: string // e.g. "10", "7", "4" on the 7-trins scale, if known
  examinerComment?: string
}

export interface WritingGenreInfo {
  key: WritingGenreKey
  label: string
  description: string
  openingPhrases: string[]
  closingPhrases: string[]
  usefulPhrases: string[]
  structureTips: string[]
}

// ---------------- Speaking ----------------

export interface SpeakingPicturePrompt {
  participant: 1 | 2
  imageDescription: string
  describeCue: string
  opinionQuestion: string
  experienceQuestion: string
}

export interface SpeakingTopic {
  id: string
  letter: string // A, B, C...
  title: string
  exam?: ExamMeta
  source: 'official' | 'practice' // official = verbatim/adapted from a real examiner script
  pictures: SpeakingPicturePrompt[]
  discussionPrompt: string
  discussionPointsFor: string[]
  discussionPointsAgainst: string[]
}

// ---------------- Vocab ----------------

export type VerbClass = 'b1' | 'b2' | 'uv' | ''

export interface VerbEntry {
  infinitive: string
  present: string
  past: string
  presentPerfect: string
  pastPerfect: string
  imperative: string
  verbClass: VerbClass
}

export interface AdjectiveEntry {
  nForm: string
  tForm: string
  eForm: string
  comparative: string
  superlative: string
}

// ---------------- Grammar ----------------

export interface GrammarQuestion {
  id: string
  prompt: string
  options: string[]
  answerIndex: number
  explanation: string
}

export interface GrammarTopic {
  id: string
  title: string
  summary: string
  points: string[]
  examples: { da: string; note: string }[]
  quiz: GrammarQuestion[]
}

// ---------------- Progress ----------------

export type ModuleKey = 'reading' | 'writing' | 'speaking' | 'grammar' | 'vocab'

export interface AttemptRecord {
  id: string
  module: ModuleKey
  refId: string // exercise/exam/topic id
  label: string
  timestamp: number
  scorePercent?: number
  details?: Record<string, unknown>
}

export interface VocabSrsState {
  key: string // infinitive or nForm
  box: number // 0-5 leitner box
  dueAt: number
  lastResult?: 'again' | 'good' | 'easy'
}
