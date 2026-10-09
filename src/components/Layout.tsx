import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { CoachWidget } from './CoachWidget'
import { usePageviewTracking } from '../lib/analytics'
import { getExamLevel, setExamLevel as persistExamLevel } from '../lib/storage'
import type { ExamLevel } from '../types'

interface NavItem {
  to: string
  label: string
  icon: string
  end?: boolean
}

const PD2_PRIMARY_ITEMS: NavItem[] = [
  { to: '/', label: 'Hjem', icon: '🏠', end: true },
  { to: '/reading', label: 'Reading', icon: '📖' },
  { to: '/writing', label: 'Writing', icon: '✍️' },
  { to: '/speaking', label: 'Speaking', icon: '🗣️' },
]

const PD2_MORE_ITEMS: NavItem[] = [
  { to: '/grammar', label: 'Grammar', icon: '🧩' },
  { to: '/vocab', label: 'Vocab', icon: '🗂️' },
  { to: '/tips', label: 'Tips & Tricks', icon: '💡' },
  { to: '/progress', label: 'Progress', icon: '📊' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
]

const PD3_PRIMARY_ITEMS: NavItem[] = [
  { to: '/', label: 'Hjem', icon: '🏠', end: true },
  { to: '/pd3/reading', label: 'Reading', icon: '📖' },
  { to: '/pd3/writing', label: 'Writing', icon: '✍️' },
  { to: '/pd3/speaking', label: 'Speaking', icon: '🗣️' },
]

const PD3_MORE_ITEMS: NavItem[] = [
  { to: '/pd3/grammar', label: 'Grammar', icon: '🧩' },
  { to: '/pd3/vocab', label: 'Vocab', icon: '🗂️' },
  { to: '/tips', label: 'Tips & Tricks', icon: '💡' },
  { to: '/progress', label: 'Progress', icon: '📊' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
]

export function Layout() {
  usePageviewTracking()
  const [moreOpen, setMoreOpen] = useState(false)
  const [examLevel, setExamLevelState] = useState<ExamLevel>(getExamLevel())
  const location = useLocation()
  const navigate = useNavigate()

  // keep the toggle in sync if exam level was changed elsewhere (e.g. Dashboard)
  useEffect(() => {
    setExamLevelState(getExamLevel())
  }, [location.pathname])

  const primaryItems = examLevel === 'pd3' ? PD3_PRIMARY_ITEMS : PD2_PRIMARY_ITEMS
  const moreItems = examLevel === 'pd3' ? PD3_MORE_ITEMS : PD2_MORE_ITEMS
  const allItems: NavItem[] = [
    { to: '/', label: 'Oversigt', icon: '🏠', end: true },
    ...primaryItems.slice(1),
    ...moreItems,
  ]

  function isMoreActive(pathname: string) {
    return moreItems.some((item) => pathname.startsWith(item.to))
  }

  function switchExamLevel(level: ExamLevel) {
    setExamLevelState(level)
    persistExamLevel(level)
    setMoreOpen(false)
    navigate('/')
  }

  const examSwitcher = (
    <div className="flex bg-gray-100 rounded-full p-1 text-xs font-bold">
      <button
        onClick={() => switchExamLevel('pd2')}
        className={`px-3 py-1.5 rounded-full transition-colors ${
          examLevel === 'pd2' ? 'bg-white text-dk-red shadow-sm' : 'text-gray-500'
        }`}
      >
        PD2
      </button>
      <button
        onClick={() => switchExamLevel('pd3')}
        className={`px-3 py-1.5 rounded-full transition-colors ${
          examLevel === 'pd3' ? 'bg-white text-dk-red shadow-sm' : 'text-gray-500'
        }`}
      >
        PD3
      </button>
    </div>
  )

  return (
    <div className="min-h-full flex flex-col md:flex-row">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-60 shrink-0 bg-white border-r border-gray-200 flex-col">
        <div className="p-5 flex items-center gap-2.5 border-b border-gray-100">
          <span className="text-2xl">🇩🇰</span>
          <div>
            <div className="font-extrabold text-lg leading-tight tracking-tight">
              {examLevel === 'pd3' ? 'PD3 Coach' : 'PD2 Coach'}
            </div>
            <div className="text-xs text-gray-500">{examLevel === 'pd3' ? 'Prøve i Dansk 3' : 'Prøve i Dansk 2'}</div>
          </div>
        </div>
        <div className="px-5 pt-4">{examSwitcher}</div>
        <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
          {allItems.map((item, i) => (
            <div key={item.to}>
              {i === 4 && <div className="h-px bg-gray-100 my-2 mx-1" />}
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-dk-red text-white shadow-soft'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </NavLink>
            </div>
          ))}
        </nav>
        <div className="p-4 text-xs text-gray-400 border-t border-gray-100">
          Gratis & offline-first · dine data forlader aldrig din browser
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="md:hidden sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-gray-200">
        <div className="flex items-center justify-between gap-2 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🇩🇰</span>
            <div className="font-extrabold text-base tracking-tight">{examLevel === 'pd3' ? 'PD3 Coach' : 'PD2 Coach'}</div>
          </div>
          {examSwitcher}
        </div>
      </header>

      <main className="flex-1 min-w-0 pb-20 md:pb-0">
        <div className="max-w-5xl mx-auto p-4 md:p-8 animate-fade-in">
          <Outlet />
        </div>
      </main>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-gray-200 pb-[env(safe-area-inset-bottom)]">
        <div className="grid grid-cols-5">
          {primaryItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMoreOpen(false)}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-0.5 py-2.5 text-[11px] font-semibold transition-colors ${
                  isActive ? 'text-dk-red' : 'text-gray-500'
                }`
              }
            >
              <span className="text-lg leading-none">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
          <button
            onClick={() => setMoreOpen((o) => !o)}
            className={`flex flex-col items-center justify-center gap-0.5 py-2.5 text-[11px] font-semibold transition-colors ${
              moreOpen || isMoreActive(location.pathname) ? 'text-dk-red' : 'text-gray-500'
            }`}
          >
            <span className="text-lg leading-none">{moreOpen ? '✕' : '⋯'}</span>
            Mere
          </button>
        </div>
      </nav>

      {/* Mobile "more" sheet */}
      {moreOpen && (
        <div className="md:hidden fixed inset-0 z-20" onClick={() => setMoreOpen(false)}>
          <div className="absolute inset-0 bg-black/30" />
          <div
            className="absolute bottom-16 inset-x-0 bg-white rounded-t-2xl shadow-soft-lg p-3 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-1 gap-1 max-h-[60vh] overflow-y-auto">
              {moreItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMoreOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold ${
                      isActive ? 'bg-dk-red text-white' : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      )}

      <CoachWidget />
    </div>
  )
}
