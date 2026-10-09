import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getPD3SpeakingExam } from '../../../data/pd3'
import { addAttempt, getAttempts, getSrsState } from '../../../lib/storage'
import { askCoach, computeStats } from '../../../lib/coach'
import { isDue } from '../../../lib/srs'

const CHECKLIST_ITEMS = [
  'Jeg beskrev situationen tydeligt, inden jeg svarede.',
  'Jeg svarede på det obligatoriske spørgsmål og begrundede mit svar ("...fordi...").',
  'Jeg forholdt mig også til opfølgningsspørgsmålet.',
  'Jeg argumenterede og tog stilling (ikke kun beskrivende svar).',
  'Jeg brugte varieret ordforråd på B2-niveau og undgik lange pauser.',
]

export function PD3SpeakingPractice() {
  const { examId, topicId } = useParams()
  const exam = examId ? getPD3SpeakingExam(examId) : undefined
  const topic = exam?.topics.find((t) => t.id === topicId)

  const [situationIdx, setSituationIdx] = useState(0)
  const [checked, setChecked] = useState<boolean[]>(CHECKLIST_ITEMS.map(() => false))
  const [recording, setRecording] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [recError, setRecError] = useState<string | null>(null)
  const [transcript, setTranscript] = useState('')
  const [aiFeedback, setAiFeedback] = useState<string | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    return () => {
      mediaRecorderRef.current?.stream.getTracks().forEach((t) => t.stop())
      recognitionRef.current?.stop?.()
    }
  }, [])

  if (!exam || !topic) {
    return (
      <div className="card p-8 text-center">
        <p className="text-gray-600">Emnet blev ikke fundet.</p>
        <Link to="/pd3/speaking" className="text-dk-red font-semibold underline mt-2 inline-block">
          ← Tilbage til PD3 Speaking
        </Link>
      </div>
    )
  }

  const situation = topic.situations[situationIdx] ?? topic.situations[0]

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

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognitionCtor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognitionCtor) {
        const recognition = new SpeechRecognitionCtor()
        recognition.lang = 'da-DK'
        recognition.continuous = true
        recognition.interimResults = true
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      module: 'pd3-speaking',
      refId: `${exam!.id}/${topic!.id}`,
      label: `${topic!.letter}: ${topic!.title} (${exam!.exam.label})`,
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
      const question = `Dette er en (automatisk genereret, muligvis upræcis) transskription af mit mundtlige svar på emnet "${topic!.title}" til PD3-eksamen (niveau B2). Giv kort feedback på indhold, argumentation, grammatik og ordvalg, og foreslå 1-2 forbedringer:\n\n${transcript}`
      const answer = await askCoach(question, stats)
      setAiFeedback(answer)
    } finally {
      setAiLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Link to="/pd3/speaking" className="text-sm text-gray-500 hover:text-dk-red font-medium">
          ← PD3 Speaking
        </Link>
        <h1 className="text-xl font-extrabold text-gray-900 mt-1">
          {topic.letter}: {topic.title}
        </h1>
        <p className="text-xs text-gray-400">{exam.exam.label}</p>
      </div>

      {topic.situations.length > 1 && (
        <div className="flex gap-2">
          {topic.situations.map((s, i) => (
            <button
              key={s.label}
              onClick={() => setSituationIdx(i)}
              className={`text-sm px-3.5 py-1.5 rounded-full font-semibold border-2 transition-colors ${
                i === situationIdx ? 'bg-dk-red text-white border-dk-red' : 'bg-white text-gray-600 border-gray-200 hover:border-dk-red'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}

      <div className="card p-4 space-y-3">
        {situation.description && (
          <div className="bg-gray-50 rounded-xl p-3.5 text-sm text-gray-600 italic">🖼️ {situation.description}</div>
        )}
        <div>
          <div className="text-xs font-semibold text-dk-red uppercase tracking-wide mb-1.5">
            Obligatorisk spørgsmål{situation.firstQuestions.length > 1 ? ' (eksaminator vælger én)' : ''}
          </div>
          <div className="space-y-2.5">
            {situation.firstQuestions.map((q, i) => (
              <div key={i} className="text-sm text-gray-800">
                <p className="font-medium">{q.question}</p>
                {q.followUp && <p className="text-gray-500 mt-0.5">Opfølgende: {q.followUp}</p>}
              </div>
            ))}
          </div>
        </div>
        {situation.secondQuestion && (
          <div className="pt-3 border-t border-gray-100">
            <div className="text-xs font-semibold text-dk-red uppercase tracking-wide mb-1.5">
              Andet obligatoriske spørgsmål (overordnet)
            </div>
            <p className="text-sm text-gray-800 font-medium">{situation.secondQuestion.question}</p>
            {situation.secondQuestion.followUp && (
              <p className="text-sm text-gray-500 mt-0.5">Opfølgende: {situation.secondQuestion.followUp}</p>
            )}
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
            <button onClick={startRecording} className="bg-dk-red text-white text-sm px-3.5 py-2 rounded-full font-semibold hover:bg-dk-red-dark">
              ● Start optagelse
            </button>
          ) : (
            <button onClick={stopRecording} className="bg-gray-800 text-white text-sm px-3.5 py-2 rounded-full font-semibold">
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
              className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-dk-red"
            />
            <button
              onClick={handleAiFeedback}
              disabled={aiLoading}
              className="mt-2 text-xs bg-gray-100 hover:bg-gray-200 px-3.5 py-2 rounded-full font-semibold disabled:opacity-50"
            >
              {aiLoading ? 'Spørger AI Coach…' : '🤖 Få AI-feedback på det, jeg sagde'}
            </button>
          </div>
        )}
        {aiFeedback && (
          <div className="mt-3 card bg-indigo-50 border-indigo-200 p-3.5 text-sm text-indigo-900 whitespace-pre-wrap">
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
        <button onClick={handleSave} className="btn-primary mt-4 text-sm px-4 py-2 rounded-xl">
          {saved ? 'Gemt ✓' : 'Gem selvevaluering'}
        </button>
      </div>
    </div>
  )
}
