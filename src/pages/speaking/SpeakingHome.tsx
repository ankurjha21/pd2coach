import { Link } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { allSpeakingTopics } from '../../data/speaking'

export function SpeakingHome() {
  const [filter, setFilter] = useState<'all' | 'official' | 'practice'>('all')

  const topics = useMemo(
    () => allSpeakingTopics.filter((t) => filter === 'all' || t.source === filter),
    [filter],
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">🗣️ Speaking — Mundtlig kommunikation</h1>
        <p className="text-gray-600 mt-1">
          Vælg et emne. Du får et billede at beskrive, spørgsmål om din mening og erfaring, og et diskussionsemne —
          ligesom til den rigtige eksamen (to prøvedeltagere + eksaminator).
        </p>
      </div>

      <div className="flex gap-2">
        {(['all', 'official', 'practice'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-full border ${
              filter === f ? 'bg-dk-red text-white border-dk-red' : 'bg-white text-gray-600 border-gray-300'
            }`}
          >
            {f === 'all' ? 'Alle emner' : f === 'official' ? '🎓 Officielle eksamensemner' : '✏️ Øvelsesemner'}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {topics.map((t) => (
          <Link
            key={t.id}
            to={`/speaking/${t.id}`}
            className="block bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-dk-red/40 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono bg-gray-100 text-gray-500 rounded px-1.5 py-0.5">{t.letter}</span>
              {t.source === 'official' && (
                <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-medium">
                  OFFICIEL
                </span>
              )}
            </div>
            <div className="font-medium text-gray-900 mt-2">{t.title}</div>
            {t.exam && <div className="text-xs text-gray-400 mt-0.5">{t.exam.label}</div>}
          </Link>
        ))}
      </div>
    </div>
  )
}
