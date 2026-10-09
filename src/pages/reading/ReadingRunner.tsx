import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getReadingExam } from '../../data/reading'
import { Timer } from '../../components/Timer'
import { addAttempt } from '../../lib/storage'
import { isShortAnswerCorrect } from '../../lib/answerMatch'
import type { ReadingQuestion } from '../../types'

function isAnswerCorrect(userAnswer: string, correct: string | string[]): boolean {
  return isShortAnswerCorrect(userAnswer, correct)
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
      <div className="card p-8 text-center">
        <p className="text-gray-600">Øvelsen blev ikke fundet.</p>
        <Link to="/reading" className="text-dk-red font-semibold underline mt-2 inline-block">
          ← Tilbage til Reading
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
  const answeredCount = scorable.filter((q) => (answers[q.id] ?? '').trim().length > 0).length

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <Link to="/reading" className="text-sm text-gray-500 hover:text-dk-red font-medium">
            ← Reading
          </Link>
          <h1 className="text-xl font-extrabold text-gray-900 mt-1">
            {exam.exam.label} · Opgave {task.opgaveNumber}
          </h1>
          <p className="text-gray-500 text-sm">{task.title}</p>
        </div>
        {task.timeMinutes && (
          <div className="card px-3 py-2">
            <Timer minutes={task.timeMinutes} />
          </div>
        )}
      </div>

      {!submitted && (
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-dk-red h-full rounded-full transition-all"
              style={{ width: `${scorable.length ? (answeredCount / scorable.length) * 100 : 0}%` }}
            />
          </div>
          <span className="shrink-0 font-medium">
            {answeredCount}/{scorable.length} besvaret
          </span>
        </div>
      )}

      <div className="bg-amber-50 border border-amber-200/70 rounded-xl p-3.5 text-sm text-amber-900 flex gap-2">
        <span className="shrink-0">📋</span>
        <span>{task.instructions}</span>
      </div>

      {task.sourceText && (
        <details className="card overflow-hidden" open>
          <summary className="cursor-pointer select-none px-4 py-3 font-bold text-gray-800 bg-gray-50/80 flex items-center gap-2">
            <span>📄</span> Tekst
          </summary>
          <div className="px-4 py-4 whitespace-pre-wrap text-[15px] text-gray-700 leading-relaxed max-h-[32rem] overflow-y-auto">
            {task.sourceText}
          </div>
        </details>
      )}

      <div className="card divide-y divide-gray-100">
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
        <button onClick={handleSubmit} className="btn-primary w-full sm:w-auto px-6 py-3 rounded-xl">
          Aflever og se facit
        </button>
      ) : (
        <div className="card bg-emerald-50 border-emerald-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-2xl shrink-0">
              {totalPoints > 0 && earned / totalPoints >= 0.8 ? '🎉' : totalPoints > 0 && earned / totalPoints >= 0.5 ? '👍' : '💪'}
            </div>
            <div>
              <div className="font-extrabold text-emerald-800 text-lg">
                {earned} / {totalPoints} point ({totalPoints > 0 ? Math.round((earned / totalPoints) * 100) : 0}%)
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
    <div className={`p-4 transition-colors ${submitted ? (correct ? 'bg-emerald-50/60' : 'bg-red-50/50') : ''}`}>
      <div className="flex items-start gap-3">
        <span
          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
            submitted
              ? correct
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-red-100 text-red-600'
              : isExample
                ? 'bg-gray-100 text-gray-500'
                : 'bg-dk-red-light text-dk-red'
          }`}
        >
          {submitted ? (correct ? '✓' : '✗') : question.number}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-800 font-medium">{question.prompt}</p>
          {isExample ? (
            <p className="text-xs text-gray-400 italic mt-1">(Eksempel — ikke en del af pointsummen)</p>
          ) : question.options && question.options.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {question.options.map((opt) => (
                <button
                  key={opt}
                  disabled={submitted}
                  onClick={() => onChange(opt)}
                  className={`min-w-[2.5rem] text-sm px-3 py-1.5 rounded-full border-2 font-semibold transition-all ${
                    value === opt
                      ? 'bg-dk-red text-white border-dk-red'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-dk-red'
                  } disabled:opacity-60 disabled:hover:border-gray-200`}
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
              className="mt-2.5 w-full max-w-md border-2 border-gray-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-dk-red disabled:bg-gray-50 transition-colors"
            />
          )}
          {submitted && !isExample && (
            <p className={`text-xs mt-2 font-medium ${correct ? 'text-emerald-700' : 'text-red-700'}`}>
              {correct ? 'Korrekt!' : `Rigtigt svar: ${Array.isArray(question.answer) ? question.answer[0] : question.answer}`}
              {question.note && <span className="text-gray-500 font-normal"> — {question.note}</span>}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
