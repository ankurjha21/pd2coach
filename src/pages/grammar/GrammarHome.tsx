import { Link } from 'react-router-dom'
import { grammarTopics } from '../../data/grammar'

export function GrammarHome() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">🧩 Grammar Engine</h1>
        <p className="text-gray-600 mt-1">
          De grammatikemner, der oftest giver problemer for B1-kursister — med forklaring, eksempler og quiz.
        </p>
      </div>

      <div className="grid gap-3">
        {grammarTopics.map((t) => (
          <Link
            key={t.id}
            to={`/grammar/${t.id}`}
            className="block bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-dk-red/40 transition-all"
          >
            <div className="font-semibold text-gray-900">{t.title}</div>
            <p className="text-sm text-gray-500 mt-1">{t.summary}</p>
            <div className="text-xs text-dk-red font-medium mt-2">{t.quiz.length} quiz-spørgsmål</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
