import { Link } from 'react-router-dom'
import { writingGenres, writingPrompts } from '../../data/writing'

export function WritingHome() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">✍️ Writing — Skriftlig fremstilling</h1>
        <p className="text-gray-600 mt-1">
          Vælg en genre. Du får en rigtig eksamensopgave, nyttige vendinger, og kan sammenligne med en ægte
          elevbesvarelse med karakter.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {writingGenres.map((g) => {
          const count = writingPrompts.filter((p) => p.genre === g.key).length
          return (
            <Link
              key={g.key}
              to={`/writing/${g.key}`}
              className="block bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-dk-red/40 transition-all"
            >
              <div className="font-semibold text-gray-900">{g.label}</div>
              <p className="text-sm text-gray-500 mt-1">{g.description}</p>
              <div className="text-xs text-dk-red font-medium mt-3">{count} rigtige opgave{count !== 1 ? 'r' : ''}</div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
