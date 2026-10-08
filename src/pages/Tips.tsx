import { examFacts, tipSections } from '../data/tips'

export function Tips() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">💡 Tips & Tricks</h1>
        <p className="text-gray-600 mt-1">
          Strategi og huskeregler til hver del af eksamen — baseret på de officielle eksamensregler og
          bedømmelseskriterier.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-900 mb-3">{examFacts.title}</h2>
        <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
          {examFacts.items.map((item, i) => (
            <div key={i} className="text-sm">
              <dt className="text-gray-500">{item.label}</dt>
              <dd className="font-medium text-gray-900">{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="grid gap-4">
        {tipSections.map((section) => (
          <div key={section.id} className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
              <span>{section.icon}</span> {section.title}
            </h2>
            <ul className="space-y-2">
              {section.tips.map((tip, i) => (
                <li key={i} className="text-sm text-gray-700 flex gap-2">
                  <span className="text-dk-red shrink-0">•</span>
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
