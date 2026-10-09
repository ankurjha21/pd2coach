import { Link } from 'react-router-dom'
import { pd3GrammarTopics } from '../../../data/pd3Grammar'

export function PD3GrammarHome() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center text-2xl shrink-0">
          🧩
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">PD3 Grammar Engine</h1>
          <p className="text-gray-600 text-sm mt-0.5">
            B2-niveau grammatik, der bygger videre på PD2's B1-emner — passiv, relativsætninger, ledsætninger,
            participier og indirekte tale.
          </p>
        </div>
      </div>

      <div className="grid gap-3">
        {pd3GrammarTopics.map((t, i) => (
          <Link key={t.id} to={`/pd3/grammar/${t.id}`} className="card card-hover flex items-center gap-4 p-4">
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
