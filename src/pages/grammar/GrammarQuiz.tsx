import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getGrammarTopic } from '../../data/grammar'
import { addAttempt, recordMistake, resolveMistake } from '../../lib/storage'

export function GrammarQuiz() {
  const { topicId } = useParams()
  const topic = topicId ? getGrammarTopic(topicId) : undefined
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [submitted, setSubmitted] = useState(false)

  if (!topic) {
    return (
      <div className="card p-8 text-center">
        <p className="text-gray-600">Emnet blev ikke fundet.</p>
        <Link to="/grammar" className="text-dk-red font-semibold underline mt-2 inline-block">
          ← Tilbage
        </Link>
      </div>
    )
  }

  function handleSubmit() {
    setSubmitted(true)
    const correct = topic!.quiz.filter((q) => answers[q.id] === q.answerIndex).length
    const scorePercent = (correct / topic!.quiz.length) * 100
    addAttempt({
      module: 'grammar',
      refId: topic!.id,
      label: topic!.title,
      scorePercent,
    })

    const linkTo = `/grammar/${topic!.id}`
    for (const q of topic!.quiz) {
      const mistakeId = `grammar:${topic!.id}:${q.id}`
      const chosenIndex = answers[q.id]
      if (chosenIndex === q.answerIndex) {
        resolveMistake(mistakeId)
      } else {
        recordMistake({
          id: mistakeId,
          module: 'grammar',
          context: topic!.title,
          prompt: q.prompt,
          questionType: 'choice',
          options: q.options.map((o) => ({ label: o })),
          correctAnswer: q.options[q.answerIndex],
          userAnswer: chosenIndex != null ? q.options[chosenIndex] : '',
          linkTo,
        })
      }
    }
  }

  const correctCount = topic.quiz.filter((q) => answers[q.id] === q.answerIndex).length

  return (
    <div className="space-y-5">
      <div>
        <Link to="/grammar" className="text-sm text-gray-500 hover:text-dk-red font-medium">
          ← Grammar
        </Link>
        <h1 className="text-xl font-extrabold text-gray-900 mt-1">{topic.title}</h1>
        <p className="text-gray-600 text-sm mt-1">{topic.summary}</p>
      </div>

      <div className="card p-5">
        <h2 className="font-bold text-gray-900 mb-2.5 flex items-center gap-2">
          <span>📘</span> Forklaring
        </h2>
        <ul className="text-sm text-gray-700 space-y-2 list-disc list-inside leading-relaxed">
          {topic.points.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
        <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
          {topic.examples.map((ex, i) => (
            <div key={i} className="text-sm bg-gray-50 rounded-lg px-3 py-2">
              <span className="font-bold text-gray-800">{ex.da}</span>
              <span className="text-gray-500"> — {ex.note}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card divide-y divide-gray-100">
        {topic.quiz.map((q, qi) => (
          <div key={q.id} className="p-4">
            <p className="text-sm font-bold text-gray-800 mb-3 flex items-start gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-50 text-amber-700 text-xs flex items-center justify-center shrink-0 mt-0.5">
                {qi + 1}
              </span>
              {q.prompt}
            </p>
            <div className="grid sm:grid-cols-2 gap-2">
              {q.options.map((opt, oi) => {
                const isSelected = answers[q.id] === oi
                const isCorrect = submitted && oi === q.answerIndex
                const isWrongSelected = submitted && isSelected && oi !== q.answerIndex
                return (
                  <button
                    key={oi}
                    disabled={submitted}
                    onClick={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
                    className={`text-left text-sm px-3.5 py-2.5 rounded-xl border-2 font-medium transition-all ${
                      isCorrect
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                        : isWrongSelected
                          ? 'bg-red-50 border-red-400 text-red-800'
                          : isSelected
                            ? 'bg-dk-red-light border-dk-red text-dk-red'
                            : 'bg-white border-gray-200 hover:border-dk-red/50'
                    } disabled:cursor-default`}
                  >
                    {isCorrect && '✓ '}
                    {isWrongSelected && '✗ '}
                    {opt}
                  </button>
                )
              })}
            </div>
            {submitted && (
              <p className="text-xs text-gray-500 mt-2.5 bg-gray-50 rounded-lg px-3 py-2">{q.explanation}</p>
            )}
          </div>
        ))}
      </div>

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={Object.keys(answers).length < topic.quiz.length}
          className="btn-primary w-full sm:w-auto px-6 py-3 rounded-xl disabled:opacity-40 disabled:pointer-events-none"
        >
          Aflever quiz
        </button>
      ) : (
        <div className="card bg-emerald-50 border-emerald-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-2xl shrink-0">
              {correctCount === topic.quiz.length ? '🎉' : correctCount / topic.quiz.length >= 0.5 ? '👍' : '💪'}
            </div>
            <div>
              <div className="font-extrabold text-emerald-800 text-lg">
                {correctCount} / {topic.quiz.length} rigtige
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
