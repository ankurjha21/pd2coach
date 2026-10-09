import { Link } from 'react-router-dom'
import { pd3SpeakingExams } from '../../../data/pd3'

const LETTER_COLORS: Record<string, string> = {
  A: 'bg-blue-50 text-blue-700',
  B: 'bg-purple-50 text-purple-700',
  C: 'bg-emerald-50 text-emerald-700',
}

export function PD3SpeakingHome() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-2xl shrink-0">
          🗣️
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">PD3 Speaking — Mundtlig kommunikation</h1>
          <p className="text-gray-600 text-sm mt-0.5">
            Hvert eksamenssæt har 3 emner (A, B, C). Eksaminator trækker ét emne, beskriver to billeder, og
            stiller et obligatorisk spørgsmål til hver situation plus et afsluttende overordnet spørgsmål.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {pd3SpeakingExams.map((exam) => {
          const isSommer = exam.exam.season === 'Sommer'
          return (
            <div key={exam.id} className="card p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-base">{isSommer ? '☀️' : '❄️'}</span>
                <h2 className="font-bold text-gray-900">{exam.exam.label}</h2>
              </div>
              <div className="grid sm:grid-cols-3 gap-2">
                {exam.topics.map((t) => (
                  <Link
                    key={t.id}
                    to={`/pd3/speaking/${exam.id}/${t.id}`}
                    className="card-hover border border-gray-100 rounded-xl p-3 flex items-center gap-2.5"
                  >
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-sm shrink-0 ${LETTER_COLORS[t.letter] ?? 'bg-gray-50 text-gray-700'}`}
                    >
                      {t.letter}
                    </span>
                    <span className="text-sm font-medium text-gray-700">{t.title}</span>
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
