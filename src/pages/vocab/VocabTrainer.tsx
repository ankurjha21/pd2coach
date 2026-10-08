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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">🗂️ Vocab Trainer</h1>
        <p className="text-gray-600 mt-1">
          Øv bøjning af de 500 mest almindelige danske verber og 250 adjektiver med spaced repetition (flashcards kommer
          tilbage, når du har brug for at genopfriske dem).
        </p>
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
            className={`text-xs px-3 py-1.5 rounded-full border ${
              mode === m ? 'bg-dk-red text-white border-dk-red' : 'bg-white text-gray-600 border-gray-300'
            }`}
          >
            {m === 'verb' ? 'Verber (500)' : m === 'adjective' ? 'Adjektiver (250)' : 'Begge'}
          </button>
        ))}
      </div>

      <div className="text-sm text-gray-500">
        {dueQueue.length} kort klar til repetition nu · {sessionCount} gennemgået i denne session
      </div>

      {!currentCard ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <p className="text-gray-600">🎉 Ingen kort er klar til repetition lige nu. Kom tilbage senere, eller skift kategori.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">
            {currentCard.kind === 'verb' ? 'Verbum — navneform (infinitiv)' : 'Adjektiv — n-form (ubestemt, fælleskøn)'}
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-4">{currentCard.front}</div>
          {!revealed ? (
            <button
              onClick={() => setRevealed(true)}
              className="bg-dk-red text-white px-5 py-2.5 rounded-lg hover:bg-dk-red-dark"
            >
              Vis svar
            </button>
          ) : (
            <div className="space-y-4">
              <div className="text-lg text-gray-800 font-medium">{currentCard.back}</div>
              {currentCard.extra && <div className="text-xs text-gray-400">{currentCard.extra}</div>}
              <div className="flex justify-center gap-2 pt-2">
                <button
                  onClick={() => handleReview('again')}
                  className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-200"
                >
                  Igen (glemte)
                </button>
                <button
                  onClick={() => handleReview('good')}
                  className="bg-amber-100 text-amber-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-200"
                >
                  Godt
                </button>
                <button
                  onClick={() => handleReview('easy')}
                  className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-200"
                >
                  Let
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
