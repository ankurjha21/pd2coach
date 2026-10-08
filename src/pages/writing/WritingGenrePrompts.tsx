import { Link, useParams } from 'react-router-dom'
import { getGenreInfo, getPromptsForGenre } from '../../data/writing'

export function WritingGenrePrompts() {
  const { genre } = useParams()
  const info = genre ? getGenreInfo(genre) : undefined
  const prompts = genre ? getPromptsForGenre(genre) : []

  if (!info) {
    return (
      <div>
        <p>Genren blev ikke fundet.</p>
        <Link to="/writing" className="text-dk-red underline">
          Tilbage
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <Link to="/writing" className="text-sm text-gray-500 hover:text-dk-red">
          ← Writing
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">{info.label}</h1>
        <p className="text-gray-600 mt-1">{info.description}</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-900 mb-2">Struktur-tips</h2>
        <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
          {info.structureTips.map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>
      </div>

      <div className="grid gap-3">
        {prompts.map((p) => (
          <Link
            key={p.id}
            to={`/writing/${genre}/${p.id}`}
            className="block bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-dk-red/40 transition-all"
          >
            <div className="text-xs text-gray-400 font-medium">{p.exam.label}</div>
            <p className="text-sm text-gray-800 mt-1">{p.situation}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
