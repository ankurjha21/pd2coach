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
    desc: 'Læseforståelse — rigtige eksamensopgaver 2013-2023 med facit.',
    stat: (n: number) => `${n} eksamenssæt`,
    tint: 'bg-blue-50 text-blue-700',
  },
  {
    to: '/writing',
    icon: '✍️',
    title: 'Writing',
    desc: 'Skriftlig fremstilling — 9 genrer, rigtige opgaver & elevbesvarelser.',
    stat: (n: number) => `${n} opgaver`,
    tint: 'bg-purple-50 text-purple-700',
  },
  {
    to: '/speaking',
    icon: '🗣️',
    title: 'Speaking',
    desc: 'Mundtlig kommunikation — billedbeskrivelse, mening, og diskussion.',
    stat: (n: number) => `${n} emner`,
    tint: 'bg-emerald-50 text-emerald-700',
  },
  {
    to: '/grammar',
    icon: '🧩',
    title: 'Grammar',
    desc: 'Grammar Engine — ordstilling, bøjning, tider, modalverber.',
    stat: (n: number) => `${n} emner`,
    tint: 'bg-amber-50 text-amber-700',
  },
  {
    to: '/vocab',
    icon: '🗂️',
    title: 'Vocab',
    desc: 'Bøj 500 verber og 250 adjektiver med spaced repetition.',
    stat: (n: number) => `${n} ord`,
    tint: 'bg-rose-50 text-rose-700',
  },
  {
    to: '/tips',
    icon: '💡',
    title: 'Tips & Tricks',
    desc: 'Eksamensstrategi, tidsfakta og de hyppigste fejl — per del af eksamen.',
    stat: (n: number) => `${n} emner`,
    tint: 'bg-indigo-50 text-indigo-700',
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
      {/* Hero */}
      <div className="rounded-2xl bg-linear-to-br from-dk-red to-dk-red-dark text-white p-6 md:p-8 shadow-soft-lg relative overflow-hidden">
        <div className="absolute -right-8 -top-8 text-[140px] opacity-10 select-none leading-none">🇩🇰</div>
        <div className="relative">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">🇩🇰 PD2 Coach</h1>
          <p className="text-white/85 mt-2 max-w-xl">
            Dit personlige øveværktøj til Prøve i Dansk 2 — baseret på rigtige eksamensopgaver fra 2013–2023.
          </p>
          <div className="flex flex-wrap gap-2 mt-5">
            <Link
              to="/reading"
              className="bg-white text-dk-red font-bold px-4 py-2.5 rounded-xl text-sm hover:bg-white/90 transition-colors shadow-soft"
            >
              Start en læseøvelse →
            </Link>
            <Link
              to="/tips"
              className="bg-white/15 text-white font-semibold px-4 py-2.5 rounded-xl text-sm hover:bg-white/25 transition-colors border border-white/20"
            >
              💡 Se eksamenstips
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
        <StatCard icon="🎯" label="Forsøg i alt" value={stats.totalAttempts} />
        <StatCard
          icon="📖"
          label="Reading snit"
          value={stats.readingAvg != null ? `${Math.round(stats.readingAvg)}%` : '–'}
        />
        <StatCard icon="✍️" label="Writing forsøg" value={stats.writingAttempts} />
        <StatCard icon="🗂️" label="Ord til repetition" value={stats.vocabDueCount} />
      </div>

      {/* Module cards */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-3">Moduler</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODULES.map((m) => (
            <Link
              key={m.to}
              to={m.to}
              className="card card-hover block p-5"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-3 ${m.tint}`}>
                {m.icon}
              </div>
              <div className="font-bold text-gray-900">{m.title}</div>
              <p className="text-sm text-gray-500 mt-1 leading-relaxed">{m.desc}</p>
              <div className="text-xs text-dk-red font-bold mt-3">{m.stat(counts[m.to] ?? 0)}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* AI Coach */}
      <div className="card p-5">
        <h2 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
          <span className="w-8 h-8 rounded-full bg-dk-red-light flex items-center justify-center">🤖</span>
          AI Coach — anbefalinger lige nu
        </h2>
        <div className="space-y-2.5">
          {tips.map((t, i) => (
            <div key={i} className="bg-gray-50 rounded-xl rounded-tl-sm px-4 py-3 text-sm text-gray-700 leading-relaxed">
              {t}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value }: { icon: string; label: string; value: string | number }) {
  return (
    <div className="card p-4 text-center">
      <div className="text-xl mb-1">{icon}</div>
      <div className="text-xl md:text-2xl font-extrabold text-gray-900">{value}</div>
      <div className="text-xs text-gray-500 mt-0.5">{label}</div>
    </div>
  )
}
