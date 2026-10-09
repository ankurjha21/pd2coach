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

// PD3-specific vocabulary: B2-level connectives and idiomatic expressions
// (rather than more verbs/adjectives, since PD2 already covers the 500 most
// common ones — PD3's extra challenge is more about argumentative language).
export interface PD3PhraseEntry {
  phrase: string
  meaning: string
  example: string
  category: 'connective' | 'idiom'
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

export type ModuleKey =
  | 'reading'
  | 'writing'
  | 'speaking'
  | 'grammar'
  | 'vocab'
  | 'pd3-reading'
  | 'pd3-writing'
  | 'pd3-speaking'
  | 'pd3-grammar'
  | 'pd3-vocab'

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

// ---------------- PD3 (Prøve i Dansk 3, B2-level) ----------------
// PD3's reading test has a genuinely different shape from PD2: instead of
// one booklet with 5 fixed opgaver, it's split into two separate papers
// (Læseforståelse 1 and 2), each made of a variable number of "Delprøve"
// sections whose task-type also changed between exam years (e.g. the
// paragraph/cloze split only appeared from 2022 onward). We model each
// paper as a flexible array of typed sections rather than fixed fields.

export type PD3SectionType = 'short-answer' | 'mcq' | 'gap-match' | 'cloze'

export interface PD3ShortAnswerQuestion {
  number: number
  prompt: string
  answer: string
  points: number
  groupHeading?: string // e.g. "Søg informationer under Viborg bys historie"
}

export interface PD3McqQuestion {
  number: number
  prompt: string
  options: { label: string; text: string }[]
  correct: string // option label
  points: number
}

export interface PD3GapMatchItem {
  number: number // the blank number in the text
  correct: string // the letter option that fills this blank
}

export interface PD3ClozeItem {
  number: number // blank number
  options: { label: string; text: string }[]
  correct: string
}

export interface PD3ReadingSection {
  id: string
  type: PD3SectionType
  letter?: string // "1", "2A", "2B", "3"
  title: string
  instructions: string
  points: number
  timeMinutes?: number
  // short-answer: directory-style source text (plain text, multiple headed sub-sections)
  sourceText?: string
  shortAnswerQuestions?: PD3ShortAnswerQuestion[]
  // mcq: a single passage + 3 questions
  passage?: string
  mcqQuestions?: PD3McqQuestion[]
  // gap-match: passage with [[n]] markers + lettered text-chunk options (A-G, some unused)
  textWithGaps?: string
  gapOptions?: { label: string; text: string }[]
  gapMatches?: PD3GapMatchItem[]
  // cloze: passage with [[n]] markers + per-gap ABCD word/phrase options
  clozeItems?: PD3ClozeItem[]
}

export interface PD3ReadingPaper {
  id: string // e.g. "laeseforstaaelse-1"
  title: string // "Læseforståelse 1" | "Læseforståelse 2"
  sections: PD3ReadingSection[]
}

export interface PD3ReadingExam {
  id: string
  exam: ExamMeta
  papers: PD3ReadingPaper[]
}

export interface PD3WritingTask {
  id: string
  key: 'email' | 'essay-a' | 'essay-b'
  title: string
  situation: string
  context?: string // supporting text/diagram description for essay tasks
  bullets: string[]
  minWords: number
}

export interface PD3WritingExam {
  id: string
  exam: ExamMeta
  tasks: PD3WritingTask[]
}

export interface PD3SpeakingQuestion {
  intro?: string // examiner's framing sentence
  question: string
  followUp?: string
}

export interface PD3SpeakingSituation {
  label: string // "Emne A", situation label etc.
  description: string
  // Some exam years offer the examiner a choice of alternative first
  // questions for a situation (only one is asked in the real exam); we
  // surface all alternatives here as extra practice material.
  firstQuestions: PD3SpeakingQuestion[]
  secondQuestion?: PD3SpeakingQuestion
}

export interface PD3SpeakingTopic {
  id: string
  letter: string // A, B, C
  title: string
  situations: PD3SpeakingSituation[]
}

export interface PD3SpeakingExam {
  id: string
  exam: ExamMeta
  topics: PD3SpeakingTopic[]
}

export type ExamLevel = 'pd2' | 'pd3'
