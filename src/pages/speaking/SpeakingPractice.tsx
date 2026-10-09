import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getSpeakingTopic } from '../../data/speaking'
import { Timer } from '../../components/Timer'
import { addAttempt } from '../../lib/storage'
import { askCoach, computeStats } from '../../lib/coach'
import { getAttempts, getSrsState } from '../../lib/storage'
import { isDue } from '../../lib/srs'

const CHECKLIST_ITEMS = [
  'Jeg beskrev billedet tydeligt (hvem, hvad, hvor).',
  'Jeg gav min mening og begrundede den ("...fordi...").',
  'Jeg fortalte om egne erfaringer.',
  'Jeg deltog aktivt i diskussionen og lyttede til modparten.',
  'Jeg brugte varieret ordforråd og undgik lange pauser.',
]

export function SpeakingPractice() {
  const { topicId } = useParams()
  const topic = topicId ? getSpeakingTopic(topicId) : undefined

  const [checked, setChecked] = useState<boolean[]>(CHECKLIST_ITEMS.map(() => false))
  const [showHelp, setShowHelp] = useState(false)
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [recError, setRecError] = useState<string | null>(null)
  const [transcript, setTranscript] = useState('')
  const [aiFeedback, setAiFeedback] = useState<string | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    return () => {
      mediaRecorderRef.current?.stream.getTracks().forEach((t) => t.stop())
      recognitionRef.current?.stop?.()
    }
  }, [])

  if (!topic) {
    return (
      <div>
        <p>Emnet blev ikke fundet.</p>
        <Link to="/speaking" className="text-dk-red underline">
          Tilbage
        </Link>
      </div>
    )
  }

  async function startRecording() {
    setRecError(null)
    setAudioUrl(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      chunksRef.current = []
      recorder.ondataavailable = (e) => chunksRef.current.push(e.data)
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setAudioUrl(URL.createObjectURL(blob))
        stream.getTracks().forEach((t) => t.stop())
      }
      recorder.start()
      mediaRecorderRef.current = recorder
      setRecording(true)

      // Best-effort live transcript via Web Speech API (Chrome-only; feature-detected)
      const SpeechRecognitionCtor =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognitionCtor) {
        const recognition = new SpeechRecognitionCtor()
        recognition.lang = 'da-DK'
        recognition.continuous = true
        recognition.interimResults = true
        recognition.onresult = (event: any) => {
          let text = ''
          for (let i = 0; i < event.results.length; i++) {
            text += event.results[i][0].transcript
          }
          setTranscript(text)
        }
        recognition.start()
        recognitionRef.current = recognition
      }
    } catch {
      setRecError('Kunne ikke få adgang til mikrofonen. Du kan stadig øve mundtligt uden optagelse — brug selvevalueringen nedenfor.')
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop()
    recognitionRef.current?.stop?.()
    setRecording(false)
  }

  function toggleCheck(i: number) {
    setChecked((c) => c.map((v, idx) => (idx === i ? !v : v)))
  }

  function handleSave() {
    const scorePercent = (checked.filter(Boolean).length / CHECKLIST_ITEMS.length) * 100
    addAttempt({
      module: 'speaking',
      refId: topic!.id,
      label: `${topic!.title} (${topic!.letter})`,
      scorePercent,
    })
    setSaved(true)
  }

  async function handleAiFeedback() {
    if (!transcript.trim()) return
    setAiLoading(true)
    try {
      const attempts = getAttempts()
      const dueCount = Object.values(getSrsState()).filter(isDue).length
      const stats = computeStats(attempts, dueCount)
      const question = `Dette er en (automatisk genereret, muligvis upræcis) transskription af mit mundtlige svar på emnet "${topic!.title}" til PD2-eksamen. Giv kort feedback på indhold, grammatik og ordvalg, og foreslå 1-2 forbedringer:\n\n${transcript}`
      const answer = await askCoach(question, stats)
      setAiFeedback(answer)
    } finally {
      setAiLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <Link to="/speaking" className="text-sm text-gray-500 hover:text-dk-red">
            ← Speaking
          </Link>
          <h1 className="text-xl font-bold text-gray-900 mt-1">
            {topic.letter}: {topic.title}
          </h1>
          {topic.exam && <p className="text-xs text-gray-400">{topic.exam.label}</p>}
        </div>
        <Timer minutes={0.5} autoStart={false} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {topic.pictures.map((pic) => (
          <div key={pic.participant} className="card p-4">
            <div className="text-xs font-semibold text-dk-red uppercase tracking-wide mb-2">
              Prøvedeltager {pic.participant}
            </div>
            <div className="bg-gray-100 rounded-lg p-4 text-sm text-gray-600 italic mb-3">
              🖼️ {pic.imageDescription}
            </div>
            <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside">
              <li>{pic.describeCue}</li>
              <li>{pic.opinionQuestion}</li>
              <li>{pic.experienceQuestion}</li>
            </ol>
          </div>
        ))}
      </div>

      <div className="card p-4">
        <h2 className="font-semibold text-gray-900 mb-2">💬 Diskussion (begge prøvedeltagere sammen)</h2>
        <p className="text-sm text-gray-700 mb-3">{topic.discussionPrompt}</p>
        <button onClick={() => setShowHelp((s) => !s)} className="text-xs text-dk-red underline">
          {showHelp ? 'Skjul hjælpepunkter' : 'Vis hjælpepunkter (hvis samtalen går i stå)'}
        </button>
        {showHelp && (
          <div className="grid sm:grid-cols-2 gap-3 mt-3 text-sm">
            <div>
              <div className="font-medium text-green-700 mb-1">Argumenter for</div>
              <ul className="list-disc list-inside text-gray-600 space-y-0.5">
                {topic.discussionPointsFor.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="font-medium text-red-700 mb-1">Argumenter imod</div>
              <ul className="list-disc list-inside text-gray-600 space-y-0.5">
                {topic.discussionPointsAgainst.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      <div className="card p-4">
        <h2 className="font-semibold text-gray-900 mb-2">🎙️ Optag dig selv (valgfrit)</h2>
        <p className="text-xs text-gray-500 mb-3">
          Optagelsen gemmes kun i din browser og bliver aldrig uploadet nogen steder.
        </p>
        {recError && <p className="text-xs text-red-600 mb-2">{recError}</p>}
        <div className="flex items-center gap-3">
          {!recording ? (
            <button onClick={startRecording} className="bg-dk-red text-white text-sm px-3 py-1.5 rounded-lg hover:bg-dk-red-dark">
              ● Start optagelse
            </button>
          ) : (
            <button onClick={stopRecording} className="bg-gray-800 text-white text-sm px-3 py-1.5 rounded-lg">
              ■ Stop
            </button>
          )}
          {audioUrl && <audio controls src={audioUrl} className="h-9" />}
        </div>
        {transcript && (
          <div className="mt-3">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Automatisk transskription (kan indeholde fejl)
            </div>
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded-lg p-2 text-sm"
            />
            <button
              onClick={handleAiFeedback}
              disabled={aiLoading}
              className="mt-2 text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg disabled:opacity-50"
            >
              {aiLoading ? 'Spørger AI Coach…' : '🤖 Få AI-feedback på det, jeg sagde'}
            </button>
          </div>
        )}
        {aiFeedback && (
          <div className="mt-3 bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-sm text-indigo-900 whitespace-pre-wrap">
            {aiFeedback}
          </div>
        )}
      </div>

      <div className="card p-4">
        <h2 className="font-semibold text-gray-900 mb-3">Selvevaluering</h2>
        <ul className="space-y-2">
          {CHECKLIST_ITEMS.map((item, i) => (
            <li key={i}>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="checkbox" checked={checked[i]} onChange={() => toggleCheck(i)} className="accent-dk-red" />
                {item}
              </label>
            </li>
          ))}
        </ul>
        <button
          onClick={handleSave}
          className="mt-4 bg-dk-red text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-dk-red-dark"
        >
          {saved ? 'Gemt ✓' : 'Gem selvevaluering'}
        </button>
      </div>
    </div>
  )
}
