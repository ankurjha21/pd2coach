import { Link } from 'react-router-dom'
import { pd3ReadingExams } from '../../../data/pd3'
import { getAttempts } from '../../../lib/storage'

function scoreColor(pct: number) {
  if (pct >= 80) return 'bg-emerald-100 text-emerald-700'
  if (pct >= 50) return 'bg-amber-100 text-amber-700'
  return 'bg-red-100 text-red-700'
}

const SECTION_ICON: Record<string, string> = {
  'short-answer': '🔎',
  mcq: '☑️',
  'gap-match': '🧩',
  cloze: '✏️',
}

export function PD3ReadingList() {
  const attempts = getAttempts().filter((a) => a.module === 'pd3-reading')

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center text-2xl shrink-0">
          📖
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">PD3 Reading — Læseforståelse</h1>
          <p className="text-gray-600 text-sm mt-0.5">
            {pd3ReadingExams.length} eksamenssæt (2018–2024). Hvert sæt har to delprøver:
            Læseforståelse 1 (søg informationer) og Læseforståelse 2 (flervalg, tekstdele og ord/udtryk).
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {pd3ReadingExams.map((exam) => {
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
              <div className="mt-3 space-y-2">
                {exam.papers.map((paper) => (
                  <div key={paper.id}>
                    <p className="text-xs text-gray-400 font-medium mb-1">{paper.title}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {paper.sections.map((s) => (
                        <Link
                          key={s.id}
                          to={`/pd3/reading/${exam.id}/${paper.id}/${s.id}`}
                          className="text-xs bg-gray-50 hover:bg-dk-red hover:text-white transition-colors px-2.5 py-1.5 rounded-full text-gray-600 font-medium border border-gray-100 hover:border-dk-red"
                        >
                          {SECTION_ICON[s.type]} {s.letter}: {s.title.split('(')[0].trim()}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
