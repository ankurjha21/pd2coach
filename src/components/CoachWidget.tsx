import { useEffect, useRef, useState } from 'react'
import { askCoach, computeStats, offlineTips } from '../lib/coach'
import { getAttempts, getSrsState } from '../lib/storage'
import { isDue } from '../lib/srs'

interface ChatMsg {
  role: 'user' | 'assistant'
  content: string
}

export function CoachWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMsg[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [messages, open])

  function getStats() {
    const attempts = getAttempts()
    const srs = Object.values(getSrsState())
    const dueCount = srs.filter((s) => isDue(s)).length
    return computeStats(attempts, dueCount)
  }

  useEffect(() => {
    if (open && messages.length === 0) {
      const tips = offlineTips(getStats())
      setMessages([{ role: 'assistant', content: `Hej! 👋 Jeg er din AI Coach. Her er et par tips til dig lige nu:\n\n${tips.map((t) => `• ${t}`).join('\n\n')}` }])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  async function send() {
    const q = input.trim()
    if (!q || loading) return
    setInput('')
    const newMessages: ChatMsg[] = [...messages, { role: 'user', content: q }]
    setMessages(newMessages)
    setLoading(true)
    try {
      const answer = await askCoach(q, getStats(), newMessages.slice(-6))
      setMessages((m) => [...m, { role: 'assistant', content: answer }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-20 right-4 md:bottom-5 md:right-5 z-40 w-14 h-14 rounded-full bg-dk-red text-white shadow-soft-lg flex items-center justify-center text-2xl hover:bg-dk-red-dark active:scale-95 transition-all"
        aria-label="Åbn AI Coach"
      >
        {open ? '✕' : '🤖'}
      </button>
      {open && (
        <div className="fixed bottom-36 right-4 left-4 md:left-auto md:bottom-24 md:right-5 z-40 md:w-[90vw] md:max-w-sm h-[55vh] md:h-[60vh] bg-white rounded-2xl shadow-soft-lg border border-gray-200 flex flex-col overflow-hidden animate-fade-in">
          <div className="bg-dk-red text-white px-4 py-3 font-semibold flex items-center gap-2">
            <span>🤖</span> AI Coach
          </div>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3 text-sm">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 max-w-[90%] ${
                  m.role === 'user' ? 'bg-dk-red text-white ml-auto rounded-br-sm' : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                }`}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="bg-gray-100 text-gray-400 text-xs rounded-2xl rounded-bl-sm px-3.5 py-2.5 w-fit">
                Tænker…
              </div>
            )}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              send()
            }}
            className="border-t border-gray-200 p-2 flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Spørg om dansk, eksamen, grammatik…"
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dk-red"
            />
            <button type="submit" className="btn-primary px-4 py-2 rounded-full text-sm">
              Send
            </button>
          </form>
        </div>
      )}
    </>
  )
}
