import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getGenreInfo, getModelAnswersForPrompt, writingPrompts } from '../../data/writing'
import { analyzeWriting } from '../../lib/writingAnalyzer'
import { addAttempt } from '../../lib/storage'
import { askCoach, computeStats } from '../../lib/coach'
import { getAttempts, getSrsState } from '../../lib/storage'
import { isDue } from '../../lib/srs'

export function WritingPractice() {
  const { genre, promptId } = useParams()
  const prompt = writingPrompts.find((p) => p.id === promptId)
  const info = genre ? getGenreInfo(genre) : undefined
  const modelAnswers = promptId ? getModelAnswersForPrompt(promptId) : []

  const [text, setText] = useState('')
  const [showModel, setShowModel] = useState(false)
  const [aiFeedback, setAiFeedback] = useState<string | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const analysis = useMemo(() => analyzeWriting(text, { prompt, genre: info }), [text, prompt, info])

  if (!prompt || !info) {
    return (
      <div>
        <p>Opgaven blev ikke fundet.</p>
        <Link to="/writing" className="text-dk-red underline">
          Tilbage
        </Link>
      </div>
    )
  }

  function handleSave() {
    addAttempt({
      module: 'writing',
      refId: prompt!.id,
      label: `${info!.label} — ${prompt!.exam.label}`,
      details: { wordCount: analysis.wordCount },
    })
    setSaved(true)
  }

  async function handleAiFeedback() {
    setAiLoading(true)
    try {
      const attempts = getAttempts()
      const dueCount = Object.values(getSrsState()).filter(isDue).length
      const stats = computeStats(attempts, dueCount)
      const question = `Giv konstruktiv feedback på denne danske tekst (genre: ${info!.label}). Fremhæv 2-3 styrker og 2-3 konkrete forbedringer (grammatik, ordvalg, struktur). Teksten:\n\n${text}`
      const answer = await askCoach(question, stats)
      setAiFeedback(answer)
    } finally {
      setAiLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Link to={`/writing/${genre}`} className="text-sm text-gray-500 hover:text-dk-red">
          ← {info.label}
        </Link>
        <h1 className="text-xl font-bold text-gray-900 mt-1">{prompt.exam.label}</h1>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-900 space-y-2">
        <p className="font-medium">Situation: {prompt.situation}</p>
        <p>Du skal fortælle/skrive om:</p>
        <ul className="list-disc list-inside space-y-0.5">
          {prompt.bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
        {prompt.minWords && <p className="font-medium">Minimum {prompt.minWords} ord.</p>}
      </div>

      <details className="card">
        <summary className="cursor-pointer select-none px-4 py-3 font-medium text-gray-800">
          Nyttige vendinger til "{info.label}"
        </summary>
        <div className="px-4 pb-4 text-sm text-gray-700 space-y-3">
          <div>
            <div className="font-medium text-gray-600 text-xs uppercase tracking-wide mb-1">Indledning</div>
            <ul className="list-disc list-inside">
              {info.openingPhrases.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>
          <div>
            <div className="font-medium text-gray-600 text-xs uppercase tracking-wide mb-1">Nyttige vendinger</div>
            <ul className="list-disc list-inside">
              {info.usefulPhrases.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>
          <div>
            <div className="font-medium text-gray-600 text-xs uppercase tracking-wide mb-1">Afslutning</div>
            <ul className="list-disc list-inside">
              {info.closingPhrases.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>
        </div>
      </details>

      <div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={14}
          placeholder="Skriv din besvarelse her…"
          className="w-full border-2 border-gray-200 rounded-2xl p-4 text-[15px] leading-relaxed focus:outline-none focus:border-dk-red transition-colors font-sans shadow-soft"
        />
        <div className="flex items-center justify-between mt-3 text-sm text-gray-500 flex-wrap gap-2">
          <span className="font-semibold">
            {analysis.wordCount} ord · {analysis.sentenceCount} sætninger
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleAiFeedback}
              disabled={aiLoading || text.trim().length < 10}
              className="text-xs bg-gray-100 hover:bg-gray-200 px-3.5 py-2 rounded-full font-semibold disabled:opacity-50 transition-colors"
            >
              {aiLoading ? 'Spørger AI Coach…' : '🤖 Få AI-feedback'}
            </button>
            <button
              onClick={handleSave}
              disabled={text.trim().length < 5}
              className="text-xs btn-primary px-3.5 py-2 rounded-full disabled:opacity-50"
            >
              {saved ? 'Gemt ✓' : 'Gem forsøg'}
            </button>
          </div>
        </div>
      </div>

      {aiFeedback && (
        <div className="card bg-indigo-50 border-indigo-200 p-4 text-sm text-indigo-900 whitespace-pre-wrap">
          <div className="font-bold mb-1.5 flex items-center gap-1.5">🤖 AI Coach feedback</div>
          {aiFeedback}
        </div>
      )}

      <div className="card p-4">
        <h2 className="font-semibold text-gray-900 mb-3">Automatisk tjek</h2>
        <ul className="space-y-2">
          {analysis.feedback.map((f, i) => (
            <li
              key={i}
              className={`text-sm flex gap-2 ${
                f.level === 'good' ? 'text-green-700' : f.level === 'warning' ? 'text-amber-700' : 'text-red-700'
              }`}
            >
              <span>{f.level === 'good' ? '✓' : f.level === 'warning' ? '⚠' : '✗'}</span>
              <span>{f.message}</span>
            </li>
          ))}
        </ul>
        {analysis.bulletsCovered.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Punkter i opgaven</div>
            <ul className="space-y-1">
              {analysis.bulletsCovered.map((b, i) => (
                <li key={i} className={`text-sm flex gap-2 ${b.covered ? 'text-green-700' : 'text-gray-400'}`}>
                  <span>{b.covered ? '✓' : '○'}</span>
                  <span>{b.bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {modelAnswers.length > 0 && (
        <div className="card p-4">
          <button onClick={() => setShowModel((s) => !s)} className="font-semibold text-gray-900 flex items-center gap-2">
            <span>{showModel ? '▼' : '▶'}</span> Se ægte elevbesvarelse {modelAnswers[0].grade && `(karakter: ${modelAnswers[0].grade})`}
          </button>
          {showModel &&
            modelAnswers.map((m) => (
              <div key={m.id} className="mt-3 pt-3 border-t border-gray-100 whitespace-pre-wrap text-sm text-gray-700">
                {m.text}
                {m.examinerComment && (
                  <p className="mt-2 text-xs text-gray-500 italic">Censor-kommentar: {m.examinerComment}</p>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  )
}
