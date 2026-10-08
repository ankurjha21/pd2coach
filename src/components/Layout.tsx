import { NavLink, Outlet } from 'react-router-dom'
import { CoachWidget } from './CoachWidget'

const NAV_ITEMS = [
  { to: '/', label: 'Oversigt', icon: '🏠', end: true },
  { to: '/reading', label: 'Reading', icon: '📖' },
  { to: '/writing', label: 'Writing', icon: '✍️' },
  { to: '/speaking', label: 'Speaking', icon: '🗣️' },
  { to: '/grammar', label: 'Grammar', icon: '🧩' },
  { to: '/vocab', label: 'Vocab', icon: '🗂️' },
  { to: '/tips', label: 'Tips & Tricks', icon: '💡' },
  { to: '/progress', label: 'Progress', icon: '📊' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
]

export function Layout() {
  return (
    <div className="min-h-full flex flex-col md:flex-row">
      <aside className="md:w-56 shrink-0 bg-white border-b md:border-b-0 md:border-r border-gray-200">
        <div className="p-4 flex items-center gap-2">
          <span className="text-2xl">🇩🇰</span>
          <div>
            <div className="font-bold text-lg leading-tight">PD2 Coach</div>
            <div className="text-xs text-gray-500">Prøve i Dansk 2</div>
          </div>
        </div>
        <nav className="flex md:flex-col gap-1 px-2 pb-3 overflow-x-auto md:overflow-visible">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive ? 'bg-dk-red text-white' : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 min-w-0">
        <div className="max-w-5xl mx-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
      <CoachWidget />
    </div>
  )
}
