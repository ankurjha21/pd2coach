export interface ReadinessItem {
  icon: string
  label: string
  verdict: 'ready' | 'ok' | 'needs-work' | 'not-started'
  detail: string
  to: string
}

const VERDICT_STYLE: Record<ReadinessItem['verdict'], { dot: string; label: string; text: string }> = {
  ready: { dot: 'bg-emerald-500', label: 'Klar', text: 'text-emerald-700' },
  ok: { dot: 'bg-amber-500', label: 'På vej', text: 'text-amber-700' },
  'needs-work': { dot: 'bg-red-500', label: 'Mangler øvelse', text: 'text-red-700' },
  'not-started': { dot: 'bg-gray-300', label: 'Ikke startet', text: 'text-gray-500' },
}

export function ExamReadinessSummary({ items }: { items: ReadinessItem[] }) {
  return (
    <div className="card p-5">
      <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span className="w-8 h-8 rounded-full bg-sky-50 flex items-center justify-center">📊</span>
        Eksamensklar-status
      </h2>
      <div className="space-y-2.5">
        {items.map((item) => {
          const style = VERDICT_STYLE[item.verdict]
          return (
            <a
              key={item.label}
              href={`#${item.to}`}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-gray-50 transition-colors -mx-1"
            >
              <span className="text-lg shrink-0">{item.icon}</span>
              <span className="font-semibold text-gray-800 w-20 shrink-0">{item.label}</span>
              <span className="text-xs text-gray-500 flex-1 min-w-0 truncate">{item.detail}</span>
              <span className={`flex items-center gap-1.5 text-xs font-bold shrink-0 ${style.text}`}>
                <span className={`w-2 h-2 rounded-full ${style.dot}`} />
                {style.label}
              </span>
            </a>
          )
        })}
      </div>
    </div>
  )
}
