import { Link } from 'react-router-dom'
import { readingExams } from '../../data/reading'
import { getAttempts } from '../../lib/storage'

export function ReadingList() {
  const attempts = getAttempts().filter((a) => a.module === 'reading')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">📖 Reading — Læseforståelse</h1>
        <p className="text-gray-600 mt-1">
          Vælg et helt eksamenssæt. Hver opgave har den samme opgavetype og tidsgrænse som til den rigtige eksamen.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {readingExams.map((exam) => {
          const examAttempts = attempts.filter((a) => a.refId.startsWith(exam.id))
          const best = examAttempts.length ? Math.max(...examAttempts.map((a) => a.scorePercent ?? 0)) : null
          return (
            <div key={exam.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg text-gray-900">{exam.exam.label}</h2>
                {best != null && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                    Bedste: {Math.round(best)}%
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">{exam.tasks.length} opgaver · Delprøve 1 & 2</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {exam.tasks.map((t) => (
                  <Link
                    key={t.id}
                    to={`/reading/${exam.id}/${t.id}`}
                    className="text-xs bg-gray-100 hover:bg-dk-red hover:text-white transition-colors px-2.5 py-1 rounded-full text-gray-700"
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
