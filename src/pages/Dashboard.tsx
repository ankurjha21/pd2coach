import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { getAttempts, getExamLevel, getSrsState } from '../lib/storage'
import { isDue } from '../lib/srs'
import { computeStats, offlineTips } from '../lib/coach'
import { readingExams } from '../data/reading'
import { writingPrompts } from '../data/writing'
import { allSpeakingTopics } from '../data/speaking'
import { grammarTopics } from '../data/grammar'
import { verbs, adjectives } from '../data/vocab'
import { tipSections } from '../data/tips'
import { pd3ReadingExams, pd3WritingExams, pd3SpeakingExams } from '../data/pd3'
import { pd3GrammarTopics } from '../data/pd3Grammar'
import { pd3Phrases } from '../data/pd3Vocab'

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

const PD3_MODULES = [
  {
    to: '/pd3/reading',
    icon: '📖',
    title: 'Reading',
    desc: 'Læseforståelse 1 & 2 — søg informationer, flervalg, tekstdele og ord/udtryk.',
    stat: (n: number) => `${n} eksamenssæt`,
    tint: 'bg-blue-50 text-blue-700',
  },
  {
    to: '/pd3/writing',
    icon: '✍️',
    title: 'Writing',
    desc: 'Skriftlig fremstilling — en e-mail plus valg mellem to diskussionsopgaver.',
    stat: (n: number) => `${n} eksamenssæt`,
    tint: 'bg-purple-50 text-purple-700',
  },
  {
    to: '/pd3/speaking',
    icon: '🗣️',
    title: 'Speaking',
    desc: 'Mundtlig kommunikation — emner med billeder, obligatoriske spørgsmål og argumentation.',
    stat: (n: number) => `${n} eksamenssæt`,
    tint: 'bg-emerald-50 text-emerald-700',
  },
  {
    to: '/pd3/grammar',
    icon: '🧩',
    title: 'Grammar',
    desc: 'B2-grammatik: passiv, relativsætninger, ledsætninger, participier og indirekte tale.',
    stat: (n: number) => `${n} emner`,
    tint: 'bg-amber-50 text-amber-700',
  },
  {
    to: '/pd3/vocab',
    icon: '🗂️',
    title: 'Vocab',
    desc: 'B2 "lim-sprog": sætningskonnektorer til argumentation og faste udtryk (idiomer).',
    stat: (n: number) => `${n} udtryk`,
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
  const examLevel = getExamLevel()
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
    '/pd3/reading': pd3ReadingExams.length,
    '/pd3/writing': pd3WritingExams.length,
    '/pd3/speaking': pd3SpeakingExams.length,
    '/pd3/grammar': pd3GrammarTopics.length,
    '/pd3/vocab': pd3Phrases.length,
  }

  if (examLevel === 'pd3') {
    const pd3Attempts = attempts.filter((a) => a.module.startsWith('pd3-'))
    const pd3Reading = pd3Attempts.filter((a) => a.module === 'pd3-reading' && a.scorePercent != null)
    const readingAvg = pd3Reading.length
      ? pd3Reading.reduce((sum, a) => sum + (a.scorePercent ?? 0), 0) / pd3Reading.length
      : null
    const writingAttempts = pd3Attempts.filter((a) => a.module === 'pd3-writing').length
    const speakingAttempts = pd3Attempts.filter((a) => a.module === 'pd3-speaking').length

    return (
      <div className="space-y-8">
        <div className="rounded-2xl bg-linear-to-br from-dk-red to-dk-red-dark text-white p-6 md:p-8 shadow-soft-lg relative overflow-hidden">
          <div className="absolute -right-8 -top-8 text-[140px] opacity-10 select-none leading-none">🇩🇰</div>
          <div className="relative">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">🇩🇰 PD3 Coach</h1>
            <p className="text-white/85 mt-2 max-w-xl">
              Øv Prøve i Dansk 3 (B2-niveau) med rigtige eksamensopgaver fra 2018–2024.
            </p>
            <div className="flex flex-wrap gap-2 mt-5">
              <Link
                to="/pd3/reading"
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

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
          <StatCard icon="🎯" label="Forsøg i alt" value={pd3Attempts.length} />
          <StatCard icon="📖" label="Reading snit" value={readingAvg != null ? `${Math.round(readingAvg)}%` : '–'} />
          <StatCard icon="✍️" label="Writing forsøg" value={writingAttempts} />
          <StatCard icon="🗣️" label="Speaking forsøg" value={speakingAttempts} />
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Moduler</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PD3_MODULES.map((m) => (
              <Link key={m.to} to={m.to} className="card card-hover block p-5">
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

        <div className="card bg-indigo-50 border-indigo-200 p-5">
          <h2 className="font-bold text-gray-900 flex items-center gap-2 mb-2">
            <span className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">ℹ️</span>
            Om Prøve i Dansk 3
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            PD3 tester dansk på Vantage-niveau (B2) og er sværere end PD2 (B1). Læseforståelsen er delt i to
            prøver: søg-informationer, flervalgsspørgsmål, match af tekstdele og udfyldning af manglende
            ord/udtryk. Brug din samlede fremgang på tværs af PD2 og PD3 under Progress.
          </p>
        </div>
      </div>
    )
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

