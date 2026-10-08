import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getReadingExam } from '../../data/reading'
import { Timer } from '../../components/Timer'
import { addAttempt } from '../../lib/storage'
import type { ReadingQuestion } from '../../types'

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip accents for lenient compare (but keep æøå via custom map below)
    .trim()
}

// Re-apply Danish letters that NFD-stripping would otherwise mangle (æ/ø/å
// have no precomposed diacritic decomposition in the way e.g. é does, so
// they survive the above; this helper mainly strips stray accents on loanwords).
function isAnswerCorrect(userAnswer: string, correct: string | string[]): boolean {
  const options = Array.isArray(correct) ? correct : [correct]
  const userNorm = normalize(userAnswer).replace(/[.,!?]/g, '')
  return options.some((opt) => {
    const optNorm = normalize(opt).replace(/[.,!?]/g, '')
    if (userNorm === optNorm) return true
    // allow matching one of multiple comma/"og"-separated accepted answers loosely
    if (optNorm.length > 6 && userNorm.length > 3 && optNorm.includes(userNorm)) return true
    return false
  })
}

export function ReadingRunner() {
  const { examId, taskId } = useParams()
  const exam = examId ? getReadingExam(examId) : undefined
  const task = exam?.tasks.find((t) => t.id === taskId)

  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  const scorable = useMemo(() => task?.questions.filter((q) => q.points > 0) ?? [], [task])

  if (!exam || !task) {
    return (
      <div>
        <p>Øvelsen blev ikke fundet.</p>
        <Link to="/reading" className="text-dk-red underline">
          Tilbage til Reading
        </Link>
      </div>
    )
  }

  function setAnswer(qId: string, value: string) {
    setAnswers((a) => ({ ...a, [qId]: value }))
  }

  function handleSubmit() {
    setSubmitted(true)
    const totalPoints = scorable.reduce((sum, q) => sum + q.points, 0)
    const earned = scorable.reduce((sum, q) => sum + (isAnswerCorrect(answers[q.id] ?? '', q.answer) ? q.points : 0), 0)
    const scorePercent = totalPoints > 0 ? (earned / totalPoints) * 100 : 0
    addAttempt({
      module: 'reading',
      refId: `${exam!.id}/${task!.id}`,
      label: `${exam!.exam.label} — Opg. ${task!.opgaveNumber}`,
      scorePercent,
      details: { earned, totalPoints },
    })
  }

  const totalPoints = scorable.reduce((sum, q) => sum + q.points, 0)
  const earned = submitted
    ? scorable.reduce((sum, q) => sum + (isAnswerCorrect(answers[q.id] ?? '', q.answer) ? q.points : 0), 0)
    : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <Link to="/reading" className="text-sm text-gray-500 hover:text-dk-red">
            ← Reading
          </Link>
          <h1 className="text-xl font-bold text-gray-900 mt-1">
            {exam.exam.label} · {task.part} · Opgave {task.opgaveNumber}
          </h1>
          <p className="text-gray-600 text-sm">{task.title}</p>
        </div>
        {task.timeMinutes && <Timer minutes={task.timeMinutes} />}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-900">
        {task.instructions}
      </div>

      {task.sourceText && (
        <details className="bg-white rounded-xl border border-gray-200" open>
          <summary className="cursor-pointer select-none px-4 py-3 font-medium text-gray-800">Tekst</summary>
          <div className="px-4 pb-4 whitespace-pre-wrap text-sm text-gray-700 leading-relaxed max-h-[32rem] overflow-y-auto">
            {task.sourceText}
          </div>
        </details>
      )}

      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        {task.questions.map((q) => (
          <QuestionRow
            key={q.id}
            question={q}
            value={answers[q.id] ?? ''}
            onChange={(v) => setAnswer(q.id, v)}
            submitted={submitted}
          />
        ))}
      </div>

      {!submitted ? (
        <button
          onClick={handleSubmit}
          className="bg-dk-red text-white font-medium px-5 py-2.5 rounded-lg hover:bg-dk-red-dark transition-colors"
        >
          Aflever og se facit
        </button>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="font-semibold text-green-800">
            Resultat: {earned} / {totalPoints} point ({totalPoints > 0 ? Math.round((earned / totalPoints) * 100) : 0}%)
          </div>
          <button
            onClick={() => {
              setSubmitted(false)
              setAnswers({})
            }}
            className="mt-3 text-sm text-dk-red underline"
          >
            Prøv igen
          </button>
        </div>
      )}
    </div>
  )
}

function QuestionRow({
  question,
  value,
  onChange,
  submitted,
}: {
  question: ReadingQuestion
  value: string
  onChange: (v: string) => void
  submitted: boolean
}) {
  const correct = submitted ? isAnswerCorrect(value, question.answer) : null
  const isExample = question.points === 0

  return (
    <div className={`p-4 ${submitted ? (correct ? 'bg-green-50/50' : 'bg-red-50/50') : ''}`}>
      <div className="flex items-start gap-3">
        <span className="text-xs font-mono bg-gray-100 text-gray-500 rounded px-1.5 py-0.5 mt-0.5">{question.number}</span>
        <div className="flex-1">
          <p className="text-sm text-gray-800">{question.prompt}</p>
          {isExample ? (
            <p className="text-xs text-gray-400 italic mt-1">(Eksempel — ikke en del af pointsummen)</p>
          ) : question.options && question.options.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {question.options.map((opt) => (
                <button
                  key={opt}
                  disabled={submitted}
                  onClick={() => onChange(opt)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                    value === opt
                      ? 'bg-dk-red text-white border-dk-red'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-dk-red'
                  } disabled:opacity-70`}
                >
                  {opt}
                </button>
              ))}
            </div>
          ) : (
            <input
              type="text"
              disabled={submitted}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Dit svar…"
              className="mt-2 w-full max-w-md border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-dk-red disabled:bg-gray-50"
            />
          )}
          {submitted && !isExample && (
            <p className={`text-xs mt-1.5 ${correct ? 'text-green-700' : 'text-red-700'}`}>
              {correct ? '✓ Korrekt' : `✗ Rigtigt svar: ${Array.isArray(question.answer) ? question.answer[0] : question.answer}`}
              {question.note && <span className="text-gray-500"> — {question.note}</span>}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
