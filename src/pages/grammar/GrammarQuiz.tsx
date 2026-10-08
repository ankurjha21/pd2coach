import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getGrammarTopic } from '../../data/grammar'
import { addAttempt } from '../../lib/storage'

export function GrammarQuiz() {
  const { topicId } = useParams()
  const topic = topicId ? getGrammarTopic(topicId) : undefined
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [submitted, setSubmitted] = useState(false)

  if (!topic) {
    return (
      <div>
        <p>Emnet blev ikke fundet.</p>
        <Link to="/grammar" className="text-dk-red underline">
          Tilbage
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
  }

  const correctCount = topic.quiz.filter((q) => answers[q.id] === q.answerIndex).length

  return (
    <div className="space-y-6">
      <div>
        <Link to="/grammar" className="text-sm text-gray-500 hover:text-dk-red">
          ← Grammar
        </Link>
        <h1 className="text-xl font-bold text-gray-900 mt-1">{topic.title}</h1>
        <p className="text-gray-600 text-sm mt-1">{topic.summary}</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h2 className="font-semibold text-gray-900 mb-2">Forklaring</h2>
        <ul className="text-sm text-gray-700 space-y-1.5 list-disc list-inside">
          {topic.points.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
        <div className="mt-3 pt-3 border-t border-gray-100 space-y-1.5">
          {topic.examples.map((ex, i) => (
            <div key={i} className="text-sm">
              <span className="font-medium text-gray-800">{ex.da}</span>
              <span className="text-gray-500"> — {ex.note}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        {topic.quiz.map((q, qi) => (
          <div key={q.id} className="p-4">
            <p className="text-sm font-medium text-gray-800 mb-2">
              {qi + 1}. {q.prompt}
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
                    className={`text-left text-sm px-3 py-2 rounded-lg border transition-colors ${
                      isCorrect
                        ? 'bg-green-100 border-green-400 text-green-800'
                        : isWrongSelected
                          ? 'bg-red-100 border-red-400 text-red-800'
                          : isSelected
                            ? 'bg-dk-red/10 border-dk-red text-dk-red'
                            : 'bg-white border-gray-300 hover:border-dk-red'
                    } disabled:cursor-default`}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>
            {submitted && <p className="text-xs text-gray-500 mt-2">{q.explanation}</p>}
          </div>
        ))}
      </div>

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={Object.keys(answers).length < topic.quiz.length}
          className="bg-dk-red text-white font-medium px-5 py-2.5 rounded-lg hover:bg-dk-red-dark transition-colors disabled:opacity-50"
        >
          Aflever quiz
        </button>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="font-semibold text-green-800">
            Resultat: {correctCount} / {topic.quiz.length} rigtige
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
