import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { getAttempts, getExamLevel, getSrsState } from '../lib/storage'
import { isDue } from '../lib/srs'
import { computeStats, offlineTips } from '../lib/coach'
import { StudyPlanCard } from '../components/StudyPlanCard'
import { ExamReadinessSummary, type ReadinessItem } from '../components/ExamReadinessSummary'
import { scoreBasedVerdict, countBasedVerdict, vocabVerdict, formatPct } from '../lib/readiness'
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
  const srsState = useMemo(() => getSrsState(), [])
  const srsDue = useMemo(() => Object.values(srsState).filter(isDue).length, [srsState])
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
    const grammarAttempts = pd3Attempts.filter((a) => a.module === 'pd3-grammar' && a.scorePercent != null)
    const grammarAvg = grammarAttempts.length
      ? grammarAttempts.reduce((sum, a) => sum + (a.scorePercent ?? 0), 0) / grammarAttempts.length
      : null

    const totalReadingSections = pd3ReadingExams.reduce(
      (sum, e) => sum + e.papers.reduce((s2, p) => s2 + p.sections.length, 0),
      0,
    )
    const readingCoverage = new Set(pd3Reading.map((a) => a.refId)).size / Math.max(totalReadingSections, 1)
    const grammarCoverage = new Set(grammarAttempts.map((a) => a.refId)).size / Math.max(pd3GrammarTopics.length, 1)
    const vocabReviewed = Object.keys(srsState).filter((k) => k.startsWith('pd3phrase:')).length

    const readinessItems: ReadinessItem[] = [
      {
        icon: '📖',
        label: 'Reading',
        to: '/pd3/reading',
        verdict: scoreBasedVerdict(pd3Reading.length, readingCoverage, readingAvg),
        detail: `${new Set(pd3Reading.map((a) => a.refId)).size}/${totalReadingSections} opgaver · snit ${formatPct(readingAvg)}`,
      },
      {
        icon: '✍️',
        label: 'Writing',
        to: '/pd3/writing',
        verdict: countBasedVerdict(writingAttempts),
        detail: `${writingAttempts} forsøg gemt`,
      },
      {
        icon: '🗣️',
        label: 'Speaking',
        to: '/pd3/speaking',
        verdict: countBasedVerdict(speakingAttempts),
        detail: `${speakingAttempts} forsøg gemt`,
      },
      {
        icon: '🧩',
        label: 'Grammar',
        to: '/pd3/grammar',
        verdict: scoreBasedVerdict(grammarAttempts.length, grammarCoverage, grammarAvg),
        detail: `${new Set(grammarAttempts.map((a) => a.refId)).size}/${pd3GrammarTopics.length} emner · snit ${formatPct(grammarAvg)}`,
      },
      {
        icon: '🗂️',
        label: 'Vocab',
        to: '/pd3/vocab',
        verdict: vocabVerdict(vocabReviewed, pd3Phrases.length, srsDue),
        detail: `${vocabReviewed}/${pd3Phrases.length} set mindst én gang`,
      },
    ]

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

        <StudyPlanCard stats={{ readingAvg, writingAttempts, speakingAttempts, vocabDueCount: srsDue }} examLevel="pd3" />

        <ExamReadinessSummary items={readinessItems} />

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

  const readingAttempts = attempts.filter((a) => a.module === 'reading' && a.scorePercent != null)
  const grammarAttemptsPd2 = attempts.filter((a) => a.module === 'grammar' && a.scorePercent != null)
  const totalReadingTasksPd2 = readingExams.reduce((sum, e) => sum + e.tasks.length, 0)
  const readingCoveragePd2 = new Set(readingAttempts.map((a) => a.refId)).size / Math.max(totalReadingTasksPd2, 1)
  const grammarCoveragePd2 = new Set(grammarAttemptsPd2.map((a) => a.refId)).size / Math.max(grammarTopics.length, 1)
  const vocabReviewedPd2 = Object.keys(srsState).filter((k) => k.startsWith('verb:') || k.startsWith('adj:')).length

  const readinessItemsPd2: ReadinessItem[] = [
    {
      icon: '📖',
      label: 'Reading',
      to: '/reading',
      verdict: scoreBasedVerdict(readingAttempts.length, readingCoveragePd2, stats.readingAvg),
      detail: `${new Set(readingAttempts.map((a) => a.refId)).size}/${totalReadingTasksPd2} opgaver · snit ${formatPct(stats.readingAvg)}`,
    },
    {
      icon: '✍️',
      label: 'Writing',
      to: '/writing',
      verdict: countBasedVerdict(stats.writingAttempts),
      detail: `${stats.writingAttempts} forsøg gemt`,
    },
    {
      icon: '🗣️',
      label: 'Speaking',
      to: '/speaking',
      verdict: countBasedVerdict(stats.speakingAttempts),
      detail: `${stats.speakingAttempts} forsøg gemt`,
    },
    {
      icon: '🧩',
      label: 'Grammar',
      to: '/grammar',
      verdict: scoreBasedVerdict(grammarAttemptsPd2.length, grammarCoveragePd2, stats.grammarAvg),
      detail: `${new Set(grammarAttemptsPd2.map((a) => a.refId)).size}/${grammarTopics.length} emner · snit ${formatPct(stats.grammarAvg)}`,
    },
    {
      icon: '🗂️',
      label: 'Vocab',
      to: '/vocab',
      verdict: vocabVerdict(vocabReviewedPd2, verbs.length + adjectives.length, stats.vocabDueCount),
      detail: `${vocabReviewedPd2}/${verbs.length + adjectives.length} set mindst én gang`,
    },
  ]

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

      <StudyPlanCard stats={{ readingAvg: stats.readingAvg, writingAttempts: stats.writingAttempts, speakingAttempts: stats.speakingAttempts, vocabDueCount: stats.vocabDueCount }} examLevel="pd2" />

      <ExamReadinessSummary items={readinessItemsPd2} />

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

