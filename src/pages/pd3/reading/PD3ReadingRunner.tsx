import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getPD3ReadingExam } from '../../../data/pd3'
import { Timer } from '../../../components/Timer'
import { addAttempt } from '../../../lib/storage'
import { isShortAnswerCorrect } from '../../../lib/answerMatch'
import type {
  PD3ClozeItem,
  PD3GapMatchItem,
  PD3McqQuestion,
  PD3ReadingSection,
  PD3ShortAnswerQuestion,
} from '../../../types'

// Splits a passage containing [[n]] gap markers into alternating text/gap segments.
function splitOnGaps(text: string): Array<{ type: 'text'; value: string } | { type: 'gap'; number: number }> {
  const parts: Array<{ type: 'text'; value: string } | { type: 'gap'; number: number }> = []
  const re = /\[\[(\d+)\]\]/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push({ type: 'text', value: text.slice(last, m.index) })
    parts.push({ type: 'gap', number: Number(m[1]) })
    last = m.index + m[0].length
  }
  if (last < text.length) parts.push({ type: 'text', value: text.slice(last) })
  return parts
}

export function PD3ReadingRunner() {
  const { examId, paperId, sectionId } = useParams()
  const exam = examId ? getPD3ReadingExam(examId) : undefined
  const paper = exam?.papers.find((p) => p.id === paperId)
  const section = paper?.sections.find((s) => s.id === sectionId)

  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  const { earned, total } = useMemo(() => {
    if (!section) return { earned: 0, total: 0 }
    return scoreSection(section, answers)
  }, [section, answers])

  if (!exam || !paper || !section) {
    return (
      <div className="card p-8 text-center">
        <p className="text-gray-600">Øvelsen blev ikke fundet.</p>
        <Link to="/pd3/reading" className="text-dk-red font-semibold underline mt-2 inline-block">
          ← Tilbage til PD3 Reading
        </Link>
      </div>
    )
  }

  function setAnswer(key: string, value: string) {
    setAnswers((a) => ({ ...a, [key]: value }))
  }

  function handleSubmit() {
    setSubmitted(true)
    const { earned: e, total: t } = scoreSection(section!, answers)
    const scorePercent = t > 0 ? (e / t) * 100 : 0
    addAttempt({
      module: 'pd3-reading',
      refId: `${exam!.id}/${paper!.id}/${section!.id}`,
      label: `${exam!.exam.label} — ${paper!.title} · ${section!.letter}`,
      scorePercent,
      details: { earned: e, total: t },
    })
  }

  const answeredCount = Object.values(answers).filter((v) => v && v.trim().length > 0).length
  const totalQuestions = countQuestions(section)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <Link to="/pd3/reading" className="text-sm text-gray-500 hover:text-dk-red font-medium">
            ← PD3 Reading
          </Link>
          <h1 className="text-xl font-extrabold text-gray-900 mt-1">
            {exam.exam.label} · {paper.title} · {section.letter}
          </h1>
          <p className="text-gray-500 text-sm">{section.title}</p>
        </div>
        {section.timeMinutes && (
          <div className="card px-3 py-2">
            <Timer minutes={section.timeMinutes} />
          </div>
        )}
      </div>

      {!submitted && totalQuestions > 0 && (
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-dk-red h-full rounded-full transition-all"
              style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
            />
          </div>
          <span className="shrink-0 font-medium">
            {answeredCount}/{totalQuestions} besvaret
          </span>
        </div>
      )}

      <div className="bg-amber-50 border border-amber-200/70 rounded-xl p-3.5 text-sm text-amber-900 flex gap-2">
        <span className="shrink-0">📋</span>
        <span>{section.instructions}</span>
      </div>

      {section.type === 'short-answer' && (
        <ShortAnswerSection section={section} answers={answers} setAnswer={setAnswer} submitted={submitted} />
      )}
      {section.type === 'mcq' && (
        <McqSection section={section} answers={answers} setAnswer={setAnswer} submitted={submitted} />
      )}
      {section.type === 'gap-match' && (
        <GapMatchSection section={section} answers={answers} setAnswer={setAnswer} submitted={submitted} />
      )}
      {section.type === 'cloze' && (
        <ClozeSection section={section} answers={answers} setAnswer={setAnswer} submitted={submitted} />
      )}

      {!submitted ? (
        <button onClick={handleSubmit} className="btn-primary w-full sm:w-auto px-6 py-3 rounded-xl">
          Aflever og se facit
        </button>
      ) : (
        <div className="card bg-emerald-50 border-emerald-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-2xl shrink-0">
              {total > 0 && earned / total >= 0.8 ? '🎉' : total > 0 && earned / total >= 0.5 ? '👍' : '💪'}
            </div>
            <div>
              <div className="font-extrabold text-emerald-800 text-lg">
                {earned} / {total} point ({total > 0 ? Math.round((earned / total) * 100) : 0}%)
              </div>
              <button
                onClick={() => {
                  setSubmitted(false)
                  setAnswers({})
                }}
                className="text-sm text-dk-red font-semibold underline mt-1"
              >
                Prøv igen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ---------------- scoring ----------------

function scoreSection(section: PD3ReadingSection, answers: Record<string, string>): { earned: number; total: number } {
  let earned = 0
  let total = 0
  if (section.type === 'short-answer') {
    for (const q of section.shortAnswerQuestions ?? []) {
      total += q.points
      if (isShortAnswerCorrect(answers[`q${q.number}`] ?? '', q.answer)) earned += q.points
    }
  } else if (section.type === 'mcq') {
    for (const q of section.mcqQuestions ?? []) {
      total += q.points
      if ((answers[`q${q.number}`] ?? '') === q.correct) earned += q.points
    }
  } else if (section.type === 'gap-match') {
    const pointsPer = (section.gapMatches?.length ?? 0) > 0 ? section.points / section.gapMatches!.length : 0
    for (const m of section.gapMatches ?? []) {
      total += pointsPer
      if ((answers[`g${m.number}`] ?? '') === m.correct) earned += pointsPer
    }
  } else if (section.type === 'cloze') {
    const pointsPer = (section.clozeItems?.length ?? 0) > 0 ? section.points / section.clozeItems!.length : 0
    for (const c of section.clozeItems ?? []) {
      total += pointsPer
      if ((answers[`c${c.number}`] ?? '') === c.correct) earned += pointsPer
    }
  }
  return { earned: Math.round(earned), total: Math.round(total) }
}

function countQuestions(section: PD3ReadingSection): number {
  if (section.type === 'short-answer') return section.shortAnswerQuestions?.length ?? 0
  if (section.type === 'mcq') return section.mcqQuestions?.length ?? 0
  if (section.type === 'gap-match') return section.gapMatches?.length ?? 0
  if (section.type === 'cloze') return section.clozeItems?.length ?? 0
  return 0
}

// ---------------- section renderers ----------------

function ShortAnswerSection({
  section,
  answers,
  setAnswer,
  submitted,
}: {
  section: PD3ReadingSection
  answers: Record<string, string>
  setAnswer: (key: string, value: string) => void
  submitted: boolean
}) {
  const questions = section.shortAnswerQuestions ?? []
  let lastHeading = ''
  return (
    <div className="space-y-4">
      {section.sourceText && (
        <details className="card overflow-hidden" open>
          <summary className="cursor-pointer select-none px-4 py-3 font-bold text-gray-800 bg-gray-50/80 flex items-center gap-2">
            <span>📄</span> Tekstsamling
          </summary>
          <div className="px-4 py-4 whitespace-pre-wrap text-[15px] text-gray-700 leading-relaxed max-h-[32rem] overflow-y-auto">
            {section.sourceText}
          </div>
        </details>
      )}
      <div className="card divide-y divide-gray-100">
        {questions.map((q: PD3ShortAnswerQuestion) => {
          const key = `q${q.number}`
          const correct = submitted ? isShortAnswerCorrect(answers[key] ?? '', q.answer) : null
          const showHeading = q.groupHeading && q.groupHeading !== lastHeading
          if (showHeading) lastHeading = q.groupHeading!
          return (
            <div key={q.number}>
              {showHeading && (
                <div className="px-4 pt-3 pb-1 text-xs font-bold text-dk-red/80 uppercase tracking-wide bg-dk-red-light/30">
                  {q.groupHeading}
                </div>
              )}
              <div className={`p-4 transition-colors ${submitted ? (correct ? 'bg-emerald-50/60' : 'bg-red-50/50') : ''}`}>
                <div className="flex items-start gap-3">
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                      submitted ? (correct ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600') : 'bg-dk-red-light text-dk-red'
                    }`}
                  >
                    {submitted ? (correct ? '✓' : '✗') : q.number}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 font-medium">{q.prompt}</p>
                    <input
                      type="text"
                      disabled={submitted}
                      value={answers[key] ?? ''}
                      onChange={(e) => setAnswer(key, e.target.value)}
                      placeholder="Dit svar…"
                      className="mt-2.5 w-full max-w-md border-2 border-gray-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-dk-red disabled:bg-gray-50 transition-colors"
                    />
                    {submitted && (
                      <p className={`text-xs mt-2 font-medium ${correct ? 'text-emerald-700' : 'text-red-700'}`}>
                        Facit: {q.answer}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function McqSection({
  section,
  answers,
  setAnswer,
  submitted,
}: {
  section: PD3ReadingSection
  answers: Record<string, string>
  setAnswer: (key: string, value: string) => void
  submitted: boolean
}) {
  const questions = section.mcqQuestions ?? []
  return (
    <div className="space-y-4">
      {section.passage && (
        <details className="card overflow-hidden" open>
          <summary className="cursor-pointer select-none px-4 py-3 font-bold text-gray-800 bg-gray-50/80 flex items-center gap-2">
            <span>📄</span> Tekst
          </summary>
          <div className="px-4 py-4 whitespace-pre-wrap text-[15px] text-gray-700 leading-relaxed max-h-[32rem] overflow-y-auto">
            {section.passage}
          </div>
        </details>
      )}
      <div className="card divide-y divide-gray-100">
        {questions.map((q: PD3McqQuestion) => {
          const key = `q${q.number}`
          const value = answers[key] ?? ''
          const correct = submitted ? value === q.correct : null
          return (
            <div key={q.number} className={`p-4 transition-colors ${submitted ? (correct ? 'bg-emerald-50/60' : 'bg-red-50/50') : ''}`}>
              <div className="flex items-start gap-3">
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                    submitted ? (correct ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600') : 'bg-dk-red-light text-dk-red'
                  }`}
                >
                  {submitted ? (correct ? '✓' : '✗') : q.number}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 font-medium">{q.prompt}</p>
                  <div className="mt-2.5 space-y-1.5">
                    {q.options.map((opt) => {
                      const selected = value === opt.label
                      const isCorrectOpt = submitted && opt.label === q.correct
                      return (
                        <button
                          key={opt.label}
                          disabled={submitted}
                          onClick={() => setAnswer(key, opt.label)}
                          className={`w-full text-left text-sm px-3.5 py-2 rounded-xl border-2 font-medium transition-all flex gap-2 ${
                            submitted
                              ? isCorrectOpt
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                                : selected
                                  ? 'bg-red-50 border-red-300 text-red-700'
                                  : 'bg-white border-gray-100 text-gray-500'
                              : selected
                                ? 'bg-dk-red text-white border-dk-red'
                                : 'bg-white text-gray-700 border-gray-200 hover:border-dk-red'
                          } disabled:cursor-default`}
                        >
                          <span className="font-bold">{opt.label}.</span>
                          <span>{opt.text}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function GapMatchSection({
  section,
  answers,
  setAnswer,
  submitted,
}: {
  section: PD3ReadingSection
  answers: Record<string, string>
  setAnswer: (key: string, value: string) => void
  submitted: boolean
}) {
  const segments = splitOnGaps(section.textWithGaps ?? '')
  const matchMap = new Map<number, PD3GapMatchItem>((section.gapMatches ?? []).map((m) => [m.number, m]))
  const options = section.gapOptions ?? []

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-bold text-gray-800 mb-2 text-sm">📄 Tekst med huller</h3>
        <p className="text-[15px] text-gray-700 leading-relaxed whitespace-pre-wrap">
          {segments.map((seg, i) =>
            seg.type === 'text' ? (
              <span key={i}>{seg.value}</span>
            ) : (
              <GapSelect
                key={i}
                value={answers[`g${seg.number}`] ?? ''}
                onChange={(v) => setAnswer(`g${seg.number}`, v)}
                options={options.map((o) => o.label)}
                number={seg.number}
                submitted={submitted}
                correct={matchMap.get(seg.number)?.correct}
              />
            ),
          )}
        </p>
      </div>
      <div className="card p-4">
        <h3 className="font-bold text-gray-800 mb-2 text-sm">Tekstdele A–{options[options.length - 1]?.label ?? 'G'}</h3>
        <div className="space-y-2">
          {options.map((opt) => (
            <div key={opt.label} className="text-sm text-gray-700 flex gap-2">
              <span className="font-bold shrink-0">{opt.label}.</span>
              <span>{opt.text}</span>
            </div>
          ))}
        </div>
      </div>
      {submitted && (
        <div className="card p-4 bg-gray-50/60">
          <h3 className="font-bold text-gray-800 mb-2 text-sm">Facit</h3>
          <div className="flex flex-wrap gap-2 text-xs font-medium">
            {(section.gapMatches ?? []).map((m) => (
              <span key={m.number} className="bg-white border border-gray-200 rounded-full px-2.5 py-1">
                ({m.number}) → {m.correct}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function ClozeSection({
  section,
  answers,
  setAnswer,
  submitted,
}: {
  section: PD3ReadingSection
  answers: Record<string, string>
  setAnswer: (key: string, value: string) => void
  submitted: boolean
}) {
  const segments = splitOnGaps(section.textWithGaps ?? '')
  const itemMap = new Map<number, PD3ClozeItem>((section.clozeItems ?? []).map((c) => [c.number, c]))

  return (
    <div className="card p-4">
      <h3 className="font-bold text-gray-800 mb-2 text-sm">📄 Tekst med huller</h3>
      <p className="text-[15px] text-gray-700 leading-relaxed whitespace-pre-wrap">
        {segments.map((seg, i) => {
          if (seg.type === 'text') return <span key={i}>{seg.value}</span>
          const item = itemMap.get(seg.number)
          return (
            <GapSelect
              key={i}
              value={answers[`c${seg.number}`] ?? ''}
              onChange={(v) => setAnswer(`c${seg.number}`, v)}
              options={item?.options.map((o) => o.label) ?? []}
              optionLabels={item?.options}
              number={seg.number}
              submitted={submitted}
              correct={item?.correct}
            />
          )
        })}
      </p>
      {submitted && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <h3 className="font-bold text-gray-800 mb-2 text-sm">Facit</h3>
          <div className="flex flex-wrap gap-2 text-xs font-medium">
            {(section.clozeItems ?? []).map((c) => (
              <span key={c.number} className="bg-gray-50 border border-gray-200 rounded-full px-2.5 py-1">
                ({c.number}) → {c.correct}. {c.options.find((o) => o.label === c.correct)?.text}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function GapSelect({
  value,
  onChange,
  options,
  optionLabels,
  number,
  submitted,
  correct,
}: {
  value: string
  onChange: (v: string) => void
  options: string[]
  optionLabels?: { label: string; text: string }[]
  number: number
  submitted: boolean
  correct?: string
}) {
  const isCorrect = submitted ? value === correct : null
  return (
    <select
      value={value}
      disabled={submitted}
      onChange={(e) => onChange(e.target.value)}
      className={`inline-block mx-1 px-2 py-0.5 rounded-lg border-2 text-sm font-bold align-baseline ${
        submitted
          ? isCorrect
            ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
            : 'bg-red-50 border-red-300 text-red-700'
          : 'bg-dk-red-light border-dk-red/40 text-dk-red'
      }`}
    >
      <option value="">({number})</option>
      {options.map((label) => (
        <option key={label} value={label}>
          {optionLabels ? `${label}. ${optionLabels.find((o) => o.label === label)?.text.slice(0, 20)}…` : label}
        </option>
      ))}
    </select>
  )
}
