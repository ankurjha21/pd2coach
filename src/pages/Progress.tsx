import { useMemo, useState } from 'react'
import { getAttempts, clearAttempts } from '../lib/storage'
import type { ModuleKey } from '../types'

const MODULE_LABELS: Record<ModuleKey, string> = {
  reading: '📖 PD2 Reading',
  writing: '✍️ PD2 Writing',
  speaking: '🗣️ PD2 Speaking',
  grammar: '🧩 PD2 Grammar',
  vocab: '🗂️ PD2 Vocab',
  'pd3-reading': '📖 PD3 Reading',
  'pd3-writing': '✍️ PD3 Writing',
  'pd3-speaking': '🗣️ PD3 Speaking',
  'pd3-grammar': '🧩 PD3 Grammar',
  'pd3-vocab': '🗂️ PD3 Vocab',
}

export function Progress() {
  const [, forceRerender] = useState(0)
  const attempts = useMemo(() => getAttempts().slice().reverse(), [])

  const byModule = useMemo(() => {
    const groups: Record<string, typeof attempts> = {}
    for (const a of attempts) {
      groups[a.module] = groups[a.module] ?? []
      groups[a.module].push(a)
    }
    return groups
  }, [attempts])

  function handleClear() {
    if (confirm('Er du sikker på, at du vil slette al fremgang? Dette kan ikke fortrydes.')) {
      clearAttempts()
      forceRerender((n) => n + 1)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center text-2xl shrink-0">
            📊
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Progress Tracker</h1>
            <p className="text-gray-600 text-sm mt-0.5">Din øvehistorik, gemt lokalt i din browser.</p>
          </div>
        </div>
        {attempts.length > 0 && (
          <button onClick={handleClear} className="text-xs text-red-600 font-semibold underline shrink-0">
            Slet alt
          </button>
        )}
      </div>

      {attempts.length === 0 ? (
        <div className="card p-10 text-center">
          <div className="text-4xl mb-3">📭</div>
          <p className="text-gray-600 font-medium">Ingen forsøg endnu.</p>
          <p className="text-gray-400 text-sm mt-1">Gå i gang med et modul for at se din fremgang her.</p>
        </div>
      ) : (
        (Object.keys(MODULE_LABELS) as ModuleKey[])
          .filter((m) => byModule[m]?.length)
          .map((m) => (
            <div key={m} className="card p-4">
              <h2 className="font-semibold text-gray-900 mb-3">{MODULE_LABELS[m]}</h2>
              <div className="space-y-2">
                {byModule[m].map((a) => (
                  <div key={a.id} className="flex items-center gap-3 text-sm">
                    <span className="text-gray-400 w-24 shrink-0 text-xs">
                      {new Date(a.timestamp).toLocaleDateString('da-DK')}
                    </span>
                    <span className="flex-1 text-gray-700 truncate">{a.label}</span>
                    {a.scorePercent != null && (
                      <div className="flex items-center gap-2 w-32 shrink-0">
                        <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-dk-red h-full rounded-full"
                            style={{ width: `${Math.round(a.scorePercent)}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 w-10 text-right">{Math.round(a.scorePercent)}%</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
      )}
    </div>
  )
}
