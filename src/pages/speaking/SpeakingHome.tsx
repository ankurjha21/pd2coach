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
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-2xl shrink-0">
          🗣️
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Speaking — Mundtlig kommunikation</h1>
          <p className="text-gray-600 text-sm mt-0.5">
            Billedbeskrivelse, mening, erfaring og diskussion — ligesom til den rigtige eksamen.
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        {(['all', 'official', 'practice'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs px-3.5 py-1.5 rounded-full border-2 font-semibold transition-colors ${
              filter === f ? 'bg-dk-red text-white border-dk-red' : 'bg-white text-gray-600 border-gray-200 hover:border-dk-red/40'
            }`}
          >
            {f === 'all' ? 'Alle emner' : f === 'official' ? '🎓 Officielle' : '✏️ Øvelse'}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {topics.map((t) => (
          <Link key={t.id} to={`/speaking/${t.id}`} className="card card-hover block p-4">
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold flex items-center justify-center">
                {t.letter}
              </span>
              {t.source === 'official' && (
                <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">
                  OFFICIEL
                </span>
              )}
            </div>
            <div className="font-bold text-gray-900 mt-2.5 leading-snug">{t.title}</div>
            {t.exam && <div className="text-xs text-gray-400 mt-1 font-medium">{t.exam.label}</div>}
          </Link>
        ))}
      </div>
    </div>
  )
}
