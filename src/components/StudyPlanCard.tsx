import { Link } from 'react-router-dom'
import { getSettings } from '../lib/storage'
import { buildStudyPlan, type StudyStats } from '../lib/studyPlan'
import { OFFICIAL_EXAM_DATES_2026 } from '../data/examDates'
import type { ExamLevel } from '../types'

const PHASE_STYLE: Record<string, { tint: string; icon: string }> = {
  foundation: { tint: 'from-blue-500 to-blue-600', icon: '🧱' },
  practice: { tint: 'from-emerald-500 to-emerald-600', icon: '📚' },
  intensive: { tint: 'from-amber-500 to-amber-600', icon: '🔥' },
  'final-days': { tint: 'from-dk-red to-dk-red-dark', icon: '⏳' },
  'exam-day': { tint: 'from-purple-500 to-purple-600', icon: '🎓' },
  past: { tint: 'from-gray-400 to-gray-500', icon: '✅' },
}

export function StudyPlanCard({ stats, examLevel }: { stats: StudyStats; examLevel: ExamLevel }) {
  const customDate = getSettings().examDate
  const officialDate = OFFICIAL_EXAM_DATES_2026[examLevel].written
  const examDate = customDate || officialDate
  const usingOfficialDefault = !customDate

  const plan = buildStudyPlan(examDate, stats)
  const style = PHASE_STYLE[plan.phase] ?? PHASE_STYLE.practice

  return (
    <div className={`rounded-2xl bg-linear-to-br ${style.tint} text-white p-5 md:p-6 shadow-soft-lg relative overflow-hidden`}>
      <div className="absolute -right-6 -bottom-6 text-[110px] opacity-10 select-none leading-none">{style.icon}</div>
      <div className="relative">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{style.icon}</span>
            <div>
              <div className="font-extrabold text-lg leading-tight">
                {plan.phase === 'past'
                  ? plan.phaseLabel
                  : plan.phase === 'exam-day'
                    ? 'I dag er eksamensdagen! 🎓'
                    : `${plan.daysLeft} ${plan.daysLeft === 1 ? 'dag' : 'dage'} til eksamen`}
              </div>
              {plan.phase !== 'past' && plan.phase !== 'exam-day' && (
                <div className="text-white/80 text-xs font-semibold uppercase tracking-wide">{plan.phaseLabel}</div>
              )}
            </div>
          </div>
          <Link to="/settings" className="text-xs text-white/80 hover:text-white underline shrink-0">
            Rediger dato
          </Link>
        </div>
        {usingOfficialDefault && (
          <p className="text-xs text-white/75 mt-2">
            Baseret på den officielle {examLevel.toUpperCase()}-skriftlige eksamensdato ({OFFICIAL_EXAM_DATES_2026[examLevel].writtenLabel}).
            Har du en anden dato (fx mundtlig prøve {OFFICIAL_EXAM_DATES_2026.oralPeriod})? Ret den under Settings.
          </p>
        )}
        <ul className="mt-4 space-y-1.5">
          {plan.focus.map((f, i) => (
            <li key={i} className="text-sm text-white/95 flex gap-2 leading-relaxed">
              <span className="shrink-0">•</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
