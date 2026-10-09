import { Link } from 'react-router-dom'
import { writingGenres, writingPrompts } from '../../data/writing'

const GENRE_ICONS: Record<string, string> = {
  opslag: '📌',
  invitation: '🎉',
  jobansoegning: '💼',
  klage: '😤',
  takkebrev: '🙏',
  anbefaling: '⭐',
  laeserbrev: '📰',
  efterlysning: '🔍',
  email: '✉️',
}

export function WritingHome() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center text-2xl shrink-0">
          ✍️
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Writing — Skriftlig fremstilling</h1>
          <p className="text-gray-600 text-sm mt-0.5">
            Vælg en genre, skriv, og sammenlign med en ægte elevbesvarelse med karakter.
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {writingGenres.map((g) => {
          const count = writingPrompts.filter((p) => p.genre === g.key).length
          return (
            <Link key={g.key} to={`/writing/${g.key}`} className="card card-hover block p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-xl shrink-0">
                  {GENRE_ICONS[g.key] ?? '✍️'}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-gray-900">{g.label}</div>
                  <p className="text-sm text-gray-500 mt-1 leading-relaxed">{g.description}</p>
                  <div className="text-xs text-dk-red font-bold mt-2.5">
                    {count} rigtige opgave{count !== 1 ? 'r' : ''}
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
