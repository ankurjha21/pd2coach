import { useEffect, useRef, useState } from 'react'

interface TimerProps {
  minutes: number
  onExpire?: () => void
  autoStart?: boolean
}

export function Timer({ minutes, onExpire, autoStart = true }: TimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(minutes * 60)
  const [running, setRunning] = useState(autoStart)
  const expiredRef = useRef(false)

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id)
          if (!expiredRef.current) {
            expiredRef.current = true
            onExpire?.()
          }
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [running, onExpire])

  const mm = Math.floor(secondsLeft / 60)
  const ss = secondsLeft % 60
  const isLow = secondsLeft <= 60 && secondsLeft > 0

  return (
    <div className="flex items-center gap-2">
      <span className={`font-mono text-lg font-semibold ${isLow ? 'text-dk-red animate-pulse' : 'text-gray-700'}`}>
        {String(mm).padStart(2, '0')}:{String(ss).padStart(2, '0')}
      </span>
      <button
        onClick={() => setRunning((r) => !r)}
        className="text-xs px-2 py-1 rounded border border-gray-300 hover:bg-gray-100"
      >
        {running ? 'Pause' : 'Start'}
      </button>
      <button
        onClick={() => {
          setSecondsLeft(minutes * 60)
          expiredRef.current = false
        }}
        className="text-xs px-2 py-1 rounded border border-gray-300 hover:bg-gray-100"
      >
        Nulstil
      </button>
    </div>
  )
}
