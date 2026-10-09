import { Link } from 'react-router-dom'
import { pd3WritingExams } from '../../../data/pd3'
import { getAttempts } from '../../../lib/storage'

const TASK_ICON: Record<string, string> = {
  email: '📧',
  'essay-a': '📊',
  'essay-b': '📊',
}

export function PD3WritingHome() {
  const attempts = getAttempts().filter((a) => a.module === 'pd3-writing')

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center text-2xl shrink-0">
          ✍️
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">PD3 Writing — Skriftlig fremstilling</h1>
          <p className="text-gray-600 text-sm mt-0.5">
            Hver eksamen har en e-mail (Delprøve 1, min. 100 ord) og et valg mellem to
            diskussionsopgaver (Delprøve 2, min. 200 ord).
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {pd3WritingExams.map((exam) => {
          const examAttempts = attempts.filter((a) => a.refId.startsWith(exam.id))
          const isSommer = exam.exam.season === 'Sommer'
          return (
            <div key={exam.id} className="card card-hover p-5">
              <div className="flex items-center gap-2">
                <span className="text-base">{isSommer ? '☀️' : '❄️'}</span>
                <h2 className="font-bold text-gray-900">{exam.exam.label}</h2>
                {examAttempts.length > 0 && (
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold ml-auto">
                    {examAttempts.length} forsøg
                  </span>
                )}
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {exam.tasks.map((t) => (
                  <Link
                    key={t.id}
                    to={`/pd3/writing/${exam.id}/${t.id}`}
                    className="text-xs bg-gray-50 hover:bg-dk-red hover:text-white transition-colors px-2.5 py-1.5 rounded-full text-gray-600 font-medium border border-gray-100 hover:border-dk-red"
                  >
                    {TASK_ICON[t.key]} {t.title}
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
