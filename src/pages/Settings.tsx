import { useState } from 'react'
import { getSettings, saveSettings, resetAllData } from '../lib/storage'

export function Settings() {
  const [settings, setSettings] = useState(getSettings())
  const [savedMsg, setSavedMsg] = useState(false)

  function handleSave() {
    saveSettings(settings)
    setSavedMsg(true)
    setTimeout(() => setSavedMsg(false), 2000)
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">⚙️ Settings</h1>
        <p className="text-gray-600 mt-1">Alt gemmes lokalt i din browser — intet sendes til en server (medmindre du vælger at bruge AI Coach med din egen API-nøgle).</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <h2 className="font-semibold text-gray-900">🤖 AI Coach (valgfrit)</h2>
        <p className="text-sm text-gray-600">
          Uden en API-nøgle giver AI Coach allerede nyttige, regelbaserede tips offline. Hvis du indsætter din egen
          OpenAI API-nøgle her, får du i stedet rigtige, personlige samtale-svar. Nøglen gemmes kun i din browsers
          localStorage og sendes direkte fra din browser til OpenAI — aldrig til en tredjepartsserver fra denne app.
        </p>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">OpenAI API-nøgle</span>
          <input
            type="password"
            value={settings.openAiApiKey ?? ''}
            onChange={(e) => setSettings((s) => ({ ...s, openAiApiKey: e.target.value }))}
            placeholder="sk-…"
            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dk-red"
          />
        </label>
        <button onClick={handleSave} className="bg-dk-red text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-dk-red-dark">
          {savedMsg ? 'Gemt ✓' : 'Gem'}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
        <h2 className="font-semibold text-gray-900">Data</h2>
        <p className="text-sm text-gray-600">Nulstil din øvefremgang og ordforråds-repetition (indstillinger bevares).</p>
        <button
          onClick={() => {
            if (confirm('Nulstil al fremgang og ordforråds-repetition?')) {
              resetAllData()
              window.location.reload()
            }
          }}
          className="text-sm text-red-600 border border-red-200 rounded-lg px-4 py-2 hover:bg-red-50"
        >
          Nulstil fremgang
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 text-sm text-gray-600 space-y-2">
        <h2 className="font-semibold text-gray-900">Om indholdet</h2>
        <p>
          Opgaver og tekster i Reading- og Writing-modulet er baseret på officielle "Prøve i Dansk 2"-eksamenssæt
          (2012–2023), som bruges her udelukkende til personlig eksamensforberedelse. Speaking-emnerne markeret
          "OFFICIEL" følger strukturen fra rigtige eksaminatorhæfter; øvrige emner er originalt øvelsesmateriale i
          samme stil. Grammar-indholdet er skrevet til denne app.
        </p>
      </div>
    </div>
  )
}
