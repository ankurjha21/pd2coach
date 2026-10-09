import { Link } from 'react-router-dom'
import { readingExams } from '../../data/reading'
import { getAttempts } from '../../lib/storage'

function scoreColor(pct: number) {
  if (pct >= 80) return 'bg-emerald-100 text-emerald-700'
  if (pct >= 50) return 'bg-amber-100 text-amber-700'
  return 'bg-red-100 text-red-700'
}

export function ReadingList() {
  const attempts = getAttempts().filter((a) => a.module === 'reading')

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center text-2xl shrink-0">
          📖
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Reading — Læseforståelse</h1>
          <p className="text-gray-600 text-sm mt-0.5">
            Vælg et helt eksamenssæt. Samme opgavetype og tidsgrænse som til den rigtige eksamen.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {readingExams.map((exam) => {
          const examAttempts = attempts.filter((a) => a.refId.startsWith(exam.id))
          const best = examAttempts.length ? Math.max(...examAttempts.map((a) => a.scorePercent ?? 0)) : null
          const isSommer = exam.exam.season === 'Sommer'
          return (
            <div key={exam.id} className="card card-hover p-5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">{isSommer ? '☀️' : '❄️'}</span>
                  <h2 className="font-bold text-gray-900">{exam.exam.label}</h2>
                </div>
                {best != null && (
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold shrink-0 ${scoreColor(best)}`}>
                    {Math.round(best)}%
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1 font-medium">{exam.tasks.length} opgaver · Delprøve 1 & 2</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {exam.tasks.map((t) => (
                  <Link
                    key={t.id}
                    to={`/reading/${exam.id}/${t.id}`}
                    className="text-xs bg-gray-50 hover:bg-dk-red hover:text-white transition-colors px-2.5 py-1.5 rounded-full text-gray-600 font-medium border border-gray-100 hover:border-dk-red"
                  >
                    Opg. {t.opgaveNumber}: {t.title.split('(')[0].trim()}
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
