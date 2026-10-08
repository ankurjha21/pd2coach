import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { getAttempts, getSrsState } from '../lib/storage'
import { isDue } from '../lib/srs'
import { computeStats, offlineTips } from '../lib/coach'
import { readingExams } from '../data/reading'
import { writingPrompts } from '../data/writing'
import { allSpeakingTopics } from '../data/speaking'
import { grammarTopics } from '../data/grammar'
import { verbs, adjectives } from '../data/vocab'
import { tipSections } from '../data/tips'

const MODULES = [
  {
    to: '/reading',
    icon: '📖',
    title: 'Reading',
    desc: 'Læseforståelse — rigtige eksamensopgaver 2013-2022 med facit.',
    stat: (n: number) => `${n} eksamenssæt`,
  },
  {
    to: '/writing',
    icon: '✍️',
    title: 'Writing',
    desc: 'Skriftlig fremstilling — 9 genrer, rigtige opgaver & elevbesvarelser.',
    stat: (n: number) => `${n} opgaver`,
  },
  {
    to: '/speaking',
    icon: '🗣️',
    title: 'Speaking',
    desc: 'Mundtlig kommunikation — billedbeskrivelse, mening, og diskussion.',
    stat: (n: number) => `${n} emner`,
  },
  {
    to: '/grammar',
    icon: '🧩',
    title: 'Grammar',
    desc: 'Grammar Engine — ordstilling, bøjning, tider, modalverber.',
    stat: (n: number) => `${n} emner`,
  },
  {
    to: '/vocab',
    icon: '🗂️',
    title: 'Vocab',
    desc: 'Bøj 500 verber og 250 adjektiver med spaced repetition.',
    stat: (n: number) => `${n} ord`,
  },
  {
    to: '/tips',
    icon: '💡',
    title: 'Tips & Tricks',
    desc: 'Eksamensstrategi, tidsfakta og de hyppigste fejl — per del af eksamen.',
    stat: (n: number) => `${n} emner`,
  },
]

export function Dashboard() {
  const attempts = getAttempts()
  const srsDue = useMemo(() => Object.values(getSrsState()).filter(isDue).length, [])
  const stats = computeStats(attempts, srsDue)
  const tips = offlineTips(stats)

  const counts: Record<string, number> = {
    '/reading': readingExams.length,
    '/writing': writingPrompts.length,
    '/speaking': allSpeakingTopics.length,
    '/grammar': grammarTopics.length,
    '/vocab': verbs.length + adjectives.length,
    '/tips': tipSections.length,
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">🇩🇰 PD2 Coach</h1>
        <p className="text-gray-600 mt-1">
          Dit personlige øveværktøj til Prøve i Dansk 2 — baseret på rigtige eksamensopgaver fra 2013–2023.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {MODULES.map((m) => (
          <Link
            key={m.to}
            to={m.to}
            className="block bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-dk-red/40 transition-all"
          >
            <div className="text-3xl mb-2">{m.icon}</div>
            <div className="font-semibold text-gray-900">{m.title}</div>
            <p className="text-sm text-gray-500 mt-1">{m.desc}</p>
            <div className="text-xs text-dk-red font-medium mt-3">{m.stat(counts[m.to] ?? 0)}</div>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
          <span>🤖</span> AI Coach — anbefalinger lige nu
        </h2>
        <ul className="space-y-2">
          {tips.map((t, i) => (
            <li key={i} className="text-sm text-gray-700 flex gap-2">
              <span className="text-dk-red">•</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Forsøg i alt" value={stats.totalAttempts} />
        <StatCard label="Reading snit" value={stats.readingAvg != null ? `${Math.round(stats.readingAvg)}%` : '–'} />
        <StatCard label="Writing forsøg" value={stats.writingAttempts} />
        <StatCard label="Ord til repetition" value={stats.vocabDueCount} />
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </div>
  )
}
