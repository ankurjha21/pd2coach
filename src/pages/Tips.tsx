import { examFacts, tipSections } from '../data/tips'
import { pd3ExamFacts, pd3TipSections } from '../data/pd3Tips'
import { getExamLevel } from '../lib/storage'

export function Tips() {
  const isPd3 = getExamLevel() === 'pd3'
  const facts = isPd3 ? pd3ExamFacts : examFacts
  const sections = isPd3 ? pd3TipSections : tipSections

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center text-2xl shrink-0">
          💡
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Tips & Tricks {isPd3 ? '(PD3)' : '(PD2)'}</h1>
          <p className="text-gray-600 text-sm mt-0.5">
            Strategi og huskeregler — baseret på de officielle eksamensregler og bedømmelseskriterier.
          </p>
        </div>
      </div>

      <div className="card p-5 bg-linear-to-br from-white to-indigo-50/40">
        <h2 className="font-bold text-gray-900 mb-3">{facts.title}</h2>
        <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-3.5">
          {facts.items.map((item, i) => (
            <div key={i} className="text-sm">
              <dt className="text-gray-500">{item.label}</dt>
              <dd className="font-bold text-gray-900 mt-0.5">{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="grid gap-4">
        {sections.map((section) => (
          <div key={section.id} className="card p-5">
            <h2 className="font-bold text-gray-900 flex items-center gap-2.5 mb-3">
              <span className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                {section.icon}
              </span>
              {section.title}
            </h2>
            <ul className="space-y-2.5">
              {section.tips.map((tip, i) => (
                <li key={i} className="text-sm text-gray-700 flex gap-2.5 leading-relaxed">
                  <span className="text-dk-red shrink-0 font-bold">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
