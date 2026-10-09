import { Link } from 'react-router-dom'
import { grammarTopics } from '../../data/grammar'

export function GrammarHome() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center text-2xl shrink-0">
          🧩
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Grammar Engine</h1>
          <p className="text-gray-600 text-sm mt-0.5">
            De emner, der oftest giver problemer for B1-kursister — forklaring, eksempler og quiz.
          </p>
        </div>
      </div>

      <div className="grid gap-3">
        {grammarTopics.map((t, i) => (
          <Link key={t.id} to={`/grammar/${t.id}`} className="card card-hover flex items-center gap-4 p-4">
            <div className="w-9 h-9 rounded-full bg-amber-50 text-amber-700 font-extrabold flex items-center justify-center shrink-0">
              {i + 1}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-gray-900">{t.title}</div>
              <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{t.summary}</p>
              <div className="text-xs text-dk-red font-bold mt-2">{t.quiz.length} quiz-spørgsmål</div>
            </div>
            <span className="text-gray-300 text-xl shrink-0">›</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
