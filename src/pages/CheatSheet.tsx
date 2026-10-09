import { getExamLevel } from '../lib/storage'
import { examFacts, tipSections } from '../data/tips'
import { pd3ExamFacts, pd3TipSections } from '../data/pd3Tips'
import { writingGenres } from '../data/writing'
import { grammarTopics } from '../data/grammar'
import { pd3GrammarTopics } from '../data/pd3Grammar'
import { pd3Phrases } from '../data/pd3Vocab'

export function CheatSheet() {
  const isPd3 = getExamLevel() === 'pd3'

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap no-print">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center text-2xl shrink-0">
            🖨️
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Snydeseddel — {isPd3 ? 'PD3' : 'PD2'}</h1>
            <p className="text-gray-600 text-sm mt-0.5">
              Én side til sidste-øjebliks-gennemgang. Print den, eller gem som PDF, til aftenen/morgenen før eksamen.
            </p>
          </div>
        </div>
        <button onClick={() => window.print()} className="btn-primary text-sm px-4 py-2.5 rounded-xl shrink-0">
          🖨️ Print / Gem som PDF
        </button>
      </div>

      <div className="print-sheet card p-6 space-y-5 text-sm leading-relaxed">
        <div>
          <h2 className="font-extrabold text-gray-900 text-base mb-2">
            {isPd3 ? pd3ExamFacts.title : examFacts.title}
          </h2>
          <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5">
            {(isPd3 ? pd3ExamFacts.items : examFacts.items).map((item, i) => (
              <div key={i}>
                <dt className="text-gray-500 text-xs">{item.label}</dt>
                <dd className="font-semibold text-gray-900">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <h2 className="font-extrabold text-gray-900 text-base mb-2">⏱️ Vigtigste huskeregler pr. del</h2>
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
            {(isPd3 ? pd3TipSections : tipSections)
              .filter((s) => s.id !== 'general')
              .map((section) => (
                <div key={section.id}>
                  <div className="font-bold text-gray-800">
                    {section.icon} {section.title}
                  </div>
                  <ul className="mt-1 space-y-0.5">
                    {section.tips.slice(0, 2).map((t, i) => (
                      <li key={i} className="text-gray-600 flex gap-1.5">
                        <span className="shrink-0">•</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <h2 className="font-extrabold text-gray-900 text-base mb-2">
            ✍️ {isPd3 ? 'Nyttige konnektorer til argumentation' : 'Nyttige vendinger til en e-mail'}
          </h2>
          {isPd3 ? (
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {pd3Phrases
                .filter((p) => p.category === 'connective')
                .slice(0, 14)
                .map((p) => (
                  <span key={p.phrase} className="text-gray-700">
                    <span className="font-semibold">{p.phrase}</span> ({p.meaning})
                  </span>
                ))}
            </div>
          ) : (
            (() => {
              const email = writingGenres.find((g) => g.key === 'email')
              if (!email) return null
              return (
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <div className="font-bold text-gray-800 text-xs uppercase tracking-wide mb-1">Indledning</div>
                    <ul className="space-y-0.5 text-gray-600">
                      {email.openingPhrases.map((p, i) => (
                        <li key={i}>• {p}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="font-bold text-gray-800 text-xs uppercase tracking-wide mb-1">Nyttige vendinger</div>
                    <ul className="space-y-0.5 text-gray-600">
                      {email.usefulPhrases.map((p, i) => (
                        <li key={i}>• {p}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="font-bold text-gray-800 text-xs uppercase tracking-wide mb-1">Afslutning</div>
                    <ul className="space-y-0.5 text-gray-600">
                      {email.closingPhrases.map((p, i) => (
                        <li key={i}>• {p}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )
            })()
          )}
        </div>

        <div className="pt-4 border-t border-gray-100">
          <h2 className="font-extrabold text-gray-900 text-base mb-2">🧩 Grammatik på 10 sekunder</h2>
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5">
            {(isPd3 ? pd3GrammarTopics : grammarTopics).map((t) => (
              <div key={t.id} className="flex gap-1.5">
                <span className="font-semibold text-gray-800 shrink-0">{t.title.split(':')[0]}:</span>
                <span className="text-gray-600">{t.points[0]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 text-xs text-gray-400">
          Udskrevet fra PD2/PD3 Coach — god fornøjelse til eksamen! 🇩🇰
        </div>
      </div>
    </div>
  )
}
