import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMistakes, resolveMistake, clearAllMistakes } from '../lib/storage'
import { isShortAnswerCorrect } from '../lib/answerMatch'
import type { MistakeRecord, ModuleKey } from '../types'

const MODULE_LABELS: Partial<Record<ModuleKey, string>> = {
  reading: '📖 PD2 Reading',
  grammar: '🧩 PD2 Grammar',
  'pd3-reading': '📖 PD3 Reading',
  'pd3-grammar': '🧩 PD3 Grammar',
}

export function ReviewMistakes() {
  const [, forceRerender] = useState(0)
  const mistakes = useMemo(() => Object.values(getMistakes()), [])
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  const byModule = useMemo(() => {
    const groups: Record<string, MistakeRecord[]> = {}
    for (const m of mistakes) {
      groups[m.module] = groups[m.module] ?? []
      groups[m.module].push(m)
    }
    for (const list of Object.values(groups)) {
      list.sort((a, b) => b.lastMissedAt - a.lastMissedAt)
    }
    return groups
  }, [mistakes])

  function isCorrect(m: MistakeRecord): boolean {
    const userAnswer = answers[m.id] ?? ''
    if (!userAnswer) return false
    if (m.questionType === 'short-answer') return isShortAnswerCorrect(userAnswer, m.correctAnswer)
    return userAnswer === m.correctAnswer
  }

  function handleCheck(m: MistakeRecord) {
    setChecked((c) => ({ ...c, [m.id]: true }))
    if (isCorrect(m)) {
      resolveMistake(m.id)
    }
  }

  function handleClearAll() {
    if (confirm('Fjern alle gemte fejl fra gennemgangs-listen? (Dine karakterer/forsøg i Progress berøres ikke.)')) {
      clearAllMistakes()
      forceRerender((n) => n + 1)
    }
  }

  const totalCount = mistakes.length
  const resolvedCount = mistakes.filter((m) => checked[m.id] && isCorrect(m)).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center text-2xl shrink-0">
            🔁
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Gennemgå fejl</h1>
            <p className="text-gray-600 text-sm mt-0.5">
              Alle spørgsmål, du har svaret forkert på i Reading og Grammar, samlet ét sted — så du kan øve dem
              igen uden at tage hele opgaven om.
            </p>
          </div>
        </div>
        {totalCount > 0 && (
          <button onClick={handleClearAll} className="text-xs text-red-600 font-semibold underline shrink-0">
            Ryd listen
          </button>
        )}
      </div>

      {totalCount === 0 ? (
        <div className="card p-10 text-center">
          <div className="text-4xl mb-3">🎉</div>
          <p className="text-gray-600 font-medium">Ingen fejl at gennemgå lige nu!</p>
          <p className="text-gray-400 text-sm mt-1">
            Forkerte svar fra Reading- og Grammar-quizzer dukker automatisk op her, næste gang du laver en fejl.
          </p>
        </div>
      ) : (
        <>
          {resolvedCount > 0 && (
            <div className="card bg-emerald-50 border-emerald-200 p-3.5 text-sm text-emerald-800 font-semibold">
              ✓ {resolvedCount} rettet i denne session — godt gået!
            </div>
          )}
          {(Object.keys(byModule) as ModuleKey[]).map((module) => (
            <div key={module} className="space-y-2.5">
              <h2 className="font-bold text-gray-700 text-sm uppercase tracking-wide">
                {MODULE_LABELS[module] ?? module} · {byModule[module].length}
              </h2>
              <div className="card divide-y divide-gray-100">
                {byModule[module].map((m) => (
                  <MistakeRow
                    key={m.id}
                    mistake={m}
                    value={answers[m.id] ?? ''}
                    onChange={(v) => setAnswers((a) => ({ ...a, [m.id]: v }))}
                    isChecked={!!checked[m.id]}
                    isCorrect={checked[m.id] ? isCorrect(m) : null}
                    onCheck={() => handleCheck(m)}
                  />
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  )
}

function MistakeRow({
  mistake,
  value,
  onChange,
  isChecked,
  isCorrect,
  onCheck,
}: {
  mistake: MistakeRecord
  value: string
  onChange: (v: string) => void
  isChecked: boolean
  isCorrect: boolean | null
  onCheck: () => void
}) {
  const resolved = isChecked && isCorrect

  return (
    <div className={`p-4 transition-colors ${resolved ? 'bg-emerald-50/60' : isChecked ? 'bg-red-50/50' : ''}`}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <p className="text-xs text-gray-400 font-medium">{mistake.context}</p>
        <Link to={mistake.linkTo} className="text-xs text-dk-red font-semibold underline shrink-0">
          Åbn opgaven →
        </Link>
      </div>
      <p className="text-sm text-gray-800 font-medium mb-2.5">{mistake.prompt}</p>

      {mistake.questionType === 'short-answer' ? (
        <input
          type="text"
          disabled={isChecked}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Dit svar…"
          className="w-full max-w-md border-2 border-gray-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-dk-red disabled:bg-gray-50 transition-colors"
        />
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {(mistake.options ?? []).map((opt) => {
            const selected = value === opt.label
            return (
              <button
                key={opt.label}
                disabled={isChecked}
                onClick={() => onChange(opt.label)}
                className={`text-sm px-3 py-1.5 rounded-full border-2 font-medium transition-all ${
                  selected ? 'bg-dk-red text-white border-dk-red' : 'bg-white text-gray-700 border-gray-200 hover:border-dk-red'
                } disabled:cursor-default`}
              >
                {opt.text ? `${opt.label}. ${opt.text}` : opt.label}
              </button>
            )
          })}
        </div>
      )}

      <div className="flex items-center gap-3 mt-3">
        {!isChecked ? (
          <button
            onClick={onCheck}
            disabled={!value}
            className="btn-primary text-xs px-3.5 py-2 rounded-full disabled:opacity-40"
          >
            Tjek svar
          </button>
        ) : (
          <span className={`text-sm font-bold ${resolved ? 'text-emerald-700' : 'text-red-700'}`}>
            {resolved ? '✓ Rigtigt! Fjernet fra listen.' : `✗ Forkert. Facit: ${mistake.correctAnswer}`}
          </span>
        )}
        {mistake.timesMissed > 1 && (
          <span className="text-xs text-gray-400">Set forkert {mistake.timesMissed} gange</span>
        )}
      </div>
    </div>
  )
}
