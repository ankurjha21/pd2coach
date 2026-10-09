import { useMemo, useState } from 'react'
import { verbs, adjectives } from '../../data/vocab'
import { getSrsState, saveSrsState, addAttempt } from '../../lib/storage'
import { initSrsState, isDue, reviewCard, sortByDue } from '../../lib/srs'
import type { VocabSrsState } from '../../types'

type CardKind = 'verb' | 'adjective'
interface Card {
  key: string
  kind: CardKind
  front: string
  back: string
  extra?: string
}

function buildCards(kind: 'verb' | 'adjective' | 'both'): Card[] {
  const cards: Card[] = []
  if (kind === 'verb' || kind === 'both') {
    for (const v of verbs) {
      cards.push({
        key: `verb:${v.infinitive}`,
        kind: 'verb',
        front: v.infinitive,
        back: `${v.present} · ${v.past} · ${v.presentPerfect}`,
        extra: v.verbClass ? `Bøjningsklasse: ${v.verbClass}` : undefined,
      })
    }
  }
  if (kind === 'adjective' || kind === 'both') {
    for (const a of adjectives) {
      cards.push({
        key: `adj:${a.nForm}`,
        kind: 'adjective',
        front: a.nForm,
        back: `${a.tForm} (et-ord) · ${a.eForm} (flertal/bestemt)`,
      })
    }
  }
  return cards
}

export function VocabTrainer() {
  const [mode, setMode] = useState<'verb' | 'adjective' | 'both'>('verb')
  const [srs, setSrs] = useState<Record<string, VocabSrsState>>(() => getSrsState())
  const [revealed, setRevealed] = useState(false)
  const [sessionCount, setSessionCount] = useState(0)
  const [sessionCorrect, setSessionCorrect] = useState(0)

  const allCards = useMemo(() => buildCards(mode), [mode])

  const dueQueue = useMemo(() => {
    const states = allCards.map((c) => srs[c.key] ?? initSrsState(c.key))
    const due = states.filter(isDue)
    return sortByDue(due)
  }, [allCards, srs])

  const currentState = dueQueue[0]
  const currentCard = currentState ? allCards.find((c) => c.key === currentState.key) : undefined

  function handleReview(result: 'again' | 'good' | 'easy') {
    if (!currentState) return
    const updated = reviewCard(currentState, result)
    const next = { ...srs, [updated.key]: updated }
    setSrs(next)
    saveSrsState(next)
    setRevealed(false)
    setSessionCount((c) => c + 1)
    if (result !== 'again') setSessionCorrect((c) => c + 1)
  }

  function finishSession() {
    if (sessionCount > 0) {
      addAttempt({
        module: 'vocab',
        refId: mode,
        label: `Vocab-træning (${mode})`,
        scorePercent: (sessionCorrect / sessionCount) * 100,
      })
    }
    setSessionCount(0)
    setSessionCorrect(0)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center text-2xl shrink-0">
          🗂️
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Vocab Trainer</h1>
          <p className="text-gray-600 text-sm mt-0.5">
            500 verber og 250 adjektiver med spaced repetition — kort kommer tilbage, når du har brug for at
            genopfriske dem.
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        {(['verb', 'adjective', 'both'] as const).map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m)
              setRevealed(false)
              finishSession()
            }}
            className={`text-xs px-3.5 py-1.5 rounded-full border-2 font-semibold transition-colors ${
              mode === m ? 'bg-dk-red text-white border-dk-red' : 'bg-white text-gray-600 border-gray-200 hover:border-dk-red/40'
            }`}
          >
            {m === 'verb' ? 'Verber (500)' : m === 'adjective' ? 'Adjektiver (250)' : 'Begge'}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500 font-medium">{dueQueue.length} kort klar til repetition</span>
        <span className="text-gray-400">{sessionCount} gennemgået i denne session</span>
      </div>

      {!currentCard ? (
        <div className="card p-10 text-center">
          <div className="text-4xl mb-3">🎉</div>
          <p className="text-gray-600 font-medium">Ingen kort er klar til repetition lige nu.</p>
          <p className="text-gray-400 text-sm mt-1">Kom tilbage senere, eller skift kategori ovenfor.</p>
        </div>
      ) : (
        <div className="card p-8 md:p-10 text-center bg-linear-to-br from-white to-rose-50/40 relative overflow-hidden">
          <div className="text-xs text-rose-600 bg-rose-50 inline-block px-3 py-1 rounded-full font-bold uppercase tracking-wide mb-5">
            {currentCard.kind === 'verb' ? 'Verbum — navneform' : 'Adjektiv — n-form'}
          </div>
          <div className="text-4xl font-extrabold text-gray-900 mb-6">{currentCard.front}</div>
          {!revealed ? (
            <button onClick={() => setRevealed(true)} className="btn-primary px-6 py-3 rounded-xl">
              Vis svar
            </button>
          ) : (
            <div className="space-y-5 animate-fade-in">
              <div className="text-xl text-gray-800 font-bold">{currentCard.back}</div>
              {currentCard.extra && <div className="text-xs text-gray-400">{currentCard.extra}</div>}
              <div className="flex justify-center gap-2 pt-2 flex-wrap">
                <button
                  onClick={() => handleReview('again')}
                  className="bg-red-100 text-red-700 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-red-200 transition-colors"
                >
                  😓 Igen
                </button>
                <button
                  onClick={() => handleReview('good')}
                  className="bg-amber-100 text-amber-700 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-amber-200 transition-colors"
                >
                  🙂 Godt
                </button>
                <button
                  onClick={() => handleReview('easy')}
                  className="bg-emerald-100 text-emerald-700 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-200 transition-colors"
                >
                  😎 Let
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
