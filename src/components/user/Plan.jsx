import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, ChevronRight, Check, Play, Pause, RotateCcw, ArrowLeft, Volume2, VolumeX } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { NUTRITION_BY_DAY, SLEEP_BY_DAY } from '../../data/mockData'

// ── Data ─────────────────────────────────────────────────────────────────────

const SUPPLEMENTS = [
  { id: 'magnesio', name: 'Magnesio bisglicinato 400 mg', timing: 'Con la cena', desc: 'Absorción superior al óxido (23% vs 4%). Mejora la calidad del sueño y reduce la tensión muscular.', warning: 'No tomar con antibióticos o con menos de 2h de separación.' },
  { id: 'vit-d', name: 'Vitamina D3 2000 UI + K2 90 mcg', timing: 'Con la comida principal — se absorbe con grasas', desc: 'D3 para densidad ósea; K2 dirige el calcio al hueso en lugar de las arterias.', warning: null },
  { id: 'omega3', name: 'Omega-3 2 g (EPA+DHA en ratio 2:1)', timing: 'Con el almuerzo', desc: 'Antiinflamatorio articular. Equivale a 120 g de salmón salvaje en EPA+DHA.', warning: null },
  { id: 'colageno', name: 'Colágeno hidrolizado tipo II 10 g', timing: 'En ayunas o entre comidas', desc: 'La vitamina C mejora su síntesis. Resultados visibles en articulaciones en 8-12 semanas.', warning: null },
]

const SCRIPTS = {
  bodyscan: [
    'Busca una posición cómoda. Tumbada si puedes.',
    'Cierra los ojos. Respira sin cambiar nada.',
    'Solo observa el ritmo natural de tu respiración.',
    'Lleva tu atención a los pies. Nota cualquier sensación. Temperatura, presión, contacto.',
    'Sube lentamente por las pantorrillas. Las rodillas. Los muslos.',
    'Ahora el abdomen. Observa cómo sube y baja con cada respiración.',
    'El pecho. Los hombros. Los brazos, hasta la punta de los dedos.',
    'El cuello. La mandíbula. ¿Está apretada? Déjala aflojar.',
    'La frente, los ojos, la coronilla. Todo tu cuerpo, presente y en calma.',
    'Cuando estés lista, mueve suavemente los dedos de las manos. Y vuelve a la habitación.',
  ],
  anchoring: [
    'Mira a tu alrededor. Encuentra cinco cosas que puedes ver. Nómbralas mentalmente.',
    'Cuatro cosas que puedes tocar. Nota la textura, la temperatura.',
    'Tres cosas que puedes escuchar ahora mismo.',
    'Dos cosas que puedes oler. O que te gustaría oler.',
    'Una cosa que puedes saborear.',
    'Bien. Estás aquí. Estás presente. Este momento es real.',
  ],
  compassion: [
    'Coloca una mano sobre el corazón. Siente su calor.',
    'Piensa en algo que te esté costando ahora mismo. Sin juzgarlo.',
    'Dite a ti misma: esto es difícil. Estoy pasando por algo real.',
    'No estás sola. Muchas mujeres sienten exactamente lo mismo.',
    '¿Qué le dirías a una amiga muy querida que estuviera pasando por esto?',
    'Ahora díselo a ti misma. Con esa misma amabilidad.',
    'Llevas toda la vida cuidando a otros. Este momento es solo tuyo.',
  ],
}

const PRACTICE_META = {
  bodyscan:    { title: 'Escáner Corporal MBSR',           duration: '15 min', emoji: '🧘‍♀️', desc: 'Recorre tu cuerpo con atención plena para soltar tensión' },
  breathing478:{ title: 'Respiración 4-7-8',               duration: '8 min',  emoji: '💨',   desc: 'Activa el nervio vago y reduce el cortisol en minutos' },
  anchoring:   { title: 'Técnica de Anclaje 5-4-3-2-1',   duration: '6 min',  emoji: '⚓',   desc: 'Interrumpe la ansiedad y vuelve al momento presente' },
  compassion:  { title: 'Autocompasión (Kristin Neff)',     duration: '12 min', emoji: '💛',   desc: 'Trátate con la misma amabilidad que le darías a una amiga' },
  journaling:  { title: 'Journaling Guiado',               duration: '10 min', emoji: '📝',   desc: 'Tres preguntas para claridad mental y autoconocimiento' },
}

// ── Voice helpers ─────────────────────────────────────────────────────────────

function getPreferredVoice() {
  const voices = window.speechSynthesis.getVoices()
  const PREF = ['monica', 'paulina', 'marisol', 'helena', 'google español', 'google spanish']
  return (
    voices.find(v => PREF.some(p => v.name.toLowerCase().includes(p))) ||
    voices.find(v => v.lang === 'es-ES') ||
    voices.find(v => v.lang === 'es-MX') ||
    voices.find(v => v.lang.startsWith('es')) ||
    null
  )
}

const PAUSE_MS = { bodyscan: 2000, anchoring: 1500, compassion: 1500 }

// ── Practices menu data ───────────────────────────────────────────────────────

const EMOTIONAL_PRACTICES = [
  { key: 'breathing478', title: 'Respiración 4-7-8',             duration: '8 min',  type: 'voice',   desc: 'Activa el nervio vago y reduce el cortisol en minutos' },
  { key: 'bodyscan',     title: 'Escáner Corporal MBSR',         duration: '15 min', type: 'voice',   desc: 'Recorre tu cuerpo con atención plena para soltar tensión' },
  { key: 'journaling',   title: 'Journaling Guiado',             duration: '10 min', type: 'writing', desc: 'Tres preguntas para claridad mental y autoconocimiento' },
  { key: 'anchoring',    title: 'Técnica de Anclaje 5-4-3-2-1', duration: '6 min',  type: 'voice',   desc: 'Interrumpe la ansiedad y vuelve al momento presente' },
  { key: 'compassion',   title: 'Autocompasión (Kristin Neff)',   duration: '12 min', type: 'voice',   desc: 'Trátate con la misma amabilidad que le darías a una amiga' },
]

const B_PHASES = [
  { label: 'Prepárate',  duration: 6 },
  { label: 'Inhala...',  duration: 4 },
  { label: 'Aguanta',    duration: 7 },
  { label: 'Exhala...', duration: 8 },
]
const MAX_ROUNDS = 4

// ── Breathing 4-7-8 ──────────────────────────────────────────────────────────

function Breathing478Plan({ onClose }) {
  const phaseIdxRef = useRef(0)
  const roundRef    = useRef(0)
  const timeLeftRef = useRef(B_PHASES[0].duration)
  const intervalRef = useRef(null)

  const [display, setDisplay] = useState({ phaseIdx: 0, round: 0, timeLeft: B_PHASES[0].duration })
  const [running, setRunning]  = useState(false)
  const [done, setDone]        = useState(false)

  function tick() {
    timeLeftRef.current -= 1
    if (timeLeftRef.current > 0) {
      setDisplay(d => ({ ...d, timeLeft: timeLeftRef.current }))
      return
    }
    const pi = phaseIdxRef.current
    const r  = roundRef.current
    if (pi === 0) {
      phaseIdxRef.current = 1; roundRef.current = 1
      timeLeftRef.current = B_PHASES[1].duration
    } else if (pi === 3) {
      if (r >= MAX_ROUNDS) {
        clearInterval(intervalRef.current)
        setRunning(false); setDone(true); return
      } else {
        roundRef.current = r + 1; phaseIdxRef.current = 1
        timeLeftRef.current = B_PHASES[1].duration
      }
    } else {
      phaseIdxRef.current = pi + 1
      timeLeftRef.current = B_PHASES[pi + 1].duration
    }
    setDisplay({ phaseIdx: phaseIdxRef.current, round: roundRef.current, timeLeft: timeLeftRef.current })
  }

  function toggleRun() {
    if (running) {
      clearInterval(intervalRef.current)
      setRunning(false)
    } else {
      intervalRef.current = setInterval(tick, 1000)
      setRunning(true)
    }
  }

  useEffect(() => () => clearInterval(intervalRef.current), [])

  const phase = B_PHASES[display.phaseIdx]
  const pct   = phase.duration > 0 ? display.timeLeft / phase.duration : 0
  const C = 2 * Math.PI * 45
  const offset = C * (1 - pct)

  if (done) return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm p-8 text-center">
        <div className="text-5xl mb-4">✨</div>
        <h3 className="font-heading text-xl font-bold text-[#1A1A1A] mb-2">Ejercicio completado</h3>
        <p className="text-sm text-[#444444] mb-6">4 rondas de respiración 4-7-8. Tu sistema nervioso lo nota.</p>
        <button onClick={onClose} className="w-full py-3 gradient-primary text-white font-semibold rounded-2xl">Volver al plan</button>
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-4 md:p-6">
      <div className="bg-white rounded-3xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <button onClick={() => { clearInterval(intervalRef.current); onClose() }}
            className="flex items-center gap-1 text-[#b84289] text-sm font-semibold">
            <ArrowLeft size={16} /> Volver
          </button>
          <h3 className="font-heading text-base font-bold text-[#1A1A1A]">Respiración 4-7-8</h3>
          <div className="w-16" />
        </div>

        {display.round > 0 && (
          <p className="text-center text-xs text-[#666666] mb-2">Ronda {display.round} de {MAX_ROUNDS}</p>
        )}

        <div className="flex justify-center mb-5">
          <div className="relative w-32 h-32">
            <svg width="128" height="128" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#F3F4F6" strokeWidth="8" />
              <circle cx="50" cy="50" r="45" fill="none" stroke="#b84289" strokeWidth="8"
                strokeDasharray={C} strokeDashoffset={offset} strokeLinecap="round"
                transform="rotate(-90 50 50)" style={{ transition: 'stroke-dashoffset 1s linear' }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-3xl font-bold text-[#1A1A1A]">{display.timeLeft}</div>
              <div className="text-[10px] text-[#444444]">seg</div>
            </div>
          </div>
        </div>

        <div className="text-center mb-6">
          <p className="text-xl font-semibold text-[#b84289]">{phase.label}</p>
          {display.phaseIdx === 1 && <p className="text-xs text-[#444444] mt-1">Inhala por la nariz contando 4</p>}
          {display.phaseIdx === 2 && <p className="text-xs text-[#444444] mt-1">Aguanta el aire contando 7</p>}
          {display.phaseIdx === 3 && <p className="text-xs text-[#444444] mt-1">Exhala por la boca contando 8</p>}
        </div>

        <button onClick={toggleRun}
          className="w-full py-3 rounded-2xl gradient-primary text-white font-semibold flex items-center justify-center gap-2">
          {running ? <><Pause size={16} /> Pausar</> : <><Play size={16} /> {display.round === 0 ? 'Comenzar' : 'Continuar'}</>}
        </button>
      </div>
    </div>
  )
}

// ── Voice practice ────────────────────────────────────────────────────────────

function SimpleVoicePractice({ type, onClose }) {
  const meta     = PRACTICE_META[type]
  const lines    = SCRIPTS[type] || []
  const synthRef = useRef(window.speechSynthesis)
  const voiceRef = useRef(null)

  const [lineIdx, setLineIdx]           = useState(-1)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [done, setDone]                 = useState(false)

  useEffect(() => {
    function loadVoice() { voiceRef.current = getPreferredVoice() }
    loadVoice()
    window.speechSynthesis.addEventListener('voiceschanged', loadVoice)
    return () => {
      synthRef.current.cancel()
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoice)
    }
  }, [])

  function speakFrom(idx) {
    synthRef.current.cancel()
    if (!voiceEnabled || idx >= lines.length) { if (idx >= lines.length) setDone(true); return }
    setLineIdx(idx)
    const utt  = new SpeechSynthesisUtterance(lines[idx])
    if (voiceRef.current) utt.voice = voiceRef.current
    else utt.lang = 'es-ES'
    utt.rate   = 0.82
    utt.pitch  = 0.95
    utt.volume = 1
    const pause = PAUSE_MS[type] || 1000
    utt.onend  = () => {
      if (idx + 1 < lines.length) setTimeout(() => speakFrom(idx + 1), pause)
      else setDone(true)
    }
    synthRef.current.speak(utt)
  }

  if (done) return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm p-8 text-center">
        <div className="text-5xl mb-4">✨</div>
        <h3 className="font-heading text-xl font-bold text-[#1A1A1A] mb-2">Práctica completada</h3>
        <p className="text-sm text-[#444444] mb-6">Cada minuto de estas prácticas construye resiliencia.</p>
        <button onClick={onClose} className="w-full py-3 gradient-primary text-white font-semibold rounded-2xl">Volver al plan</button>
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-4 md:p-6">
      <div className="bg-white rounded-3xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <button onClick={() => { synthRef.current.cancel(); onClose() }}
            className="flex items-center gap-1 text-[#b84289] text-sm font-semibold">
            <ArrowLeft size={16} /> Volver
          </button>
          <h3 className="font-heading text-base font-bold text-[#1A1A1A]">{meta.title}</h3>
          <button onClick={() => { setVoiceEnabled(v => !v); synthRef.current.cancel() }}>
            {voiceEnabled ? <Volume2 size={18} className="text-[#666666]" /> : <VolumeX size={18} className="text-[#666666]" />}
          </button>
        </div>

        <div className="bg-[#f9eef5] rounded-2xl p-6 mb-5 min-h-[120px] flex items-center justify-center text-center">
          <p className="text-sm text-[#1A1A1A] leading-relaxed italic">
            {lineIdx >= 0 ? `"${lines[lineIdx]}"` : meta.desc}
          </p>
        </div>

        <div className="flex gap-1.5 justify-center mb-5">
          {lines.map((_, i) => (
            <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${
              i === lineIdx ? 'bg-[#b84289] scale-125' : i < lineIdx ? 'bg-[#b84289]' : 'bg-gray-200'
            }`} />
          ))}
        </div>

        {lineIdx < 0 ? (
          <button onClick={() => speakFrom(0)}
            className="w-full py-3 gradient-primary text-white font-semibold rounded-2xl flex items-center justify-center gap-2">
            <Play size={16} /> Comenzar
          </button>
        ) : (
          <button onClick={() => { synthRef.current.cancel(); onClose() }}
            className="w-full py-3 rounded-2xl border-2 border-gray-200 text-[#444444] font-semibold text-sm">
            Terminar sesión
          </button>
        )}
      </div>
    </div>
  )
}

// ── Journaling ────────────────────────────────────────────────────────────────

const JOURNAL_QS = [
  { q: '¿Cómo estás ahora mismo?',                       hint: 'Sin filtros. Una palabra, una frase, lo que sea.' },
  { q: '¿Qué te está pesando esta semana?',              hint: 'Un pensamiento, una situación que no puedes sacarte de la cabeza.' },
  { q: '¿Una cosa pequeña que puedes hacer hoy por ti?', hint: 'No tiene que ser grande. Un descanso, una llamada, un momento a solas.' },
]

function JournalingPractice({ onClose }) {
  const [step, setStep]       = useState(0)
  const [answers, setAnswers] = useState(['', '', ''])
  const [done, setDone]       = useState(false)

  if (done) return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm p-8 text-center">
        <div className="text-5xl mb-4">✨</div>
        <h3 className="font-heading text-xl font-bold text-[#1A1A1A] mb-2">Escrito y guardado</h3>
        <p className="text-sm text-[#444444] mb-6">Poner en palabras lo que sientes es ya un acto de cuidado.</p>
        <button onClick={onClose} className="w-full py-3 gradient-primary text-white font-semibold rounded-2xl">Volver al plan</button>
      </div>
    </div>
  )

  const { q, hint } = JOURNAL_QS[step]
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-4 md:p-6">
      <div className="bg-white rounded-3xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <button onClick={onClose} className="flex items-center gap-1 text-[#b84289] text-sm font-semibold">
            <ArrowLeft size={16} /> Volver
          </button>
          <h3 className="font-heading text-base font-bold text-[#1A1A1A]">Diario reflexivo</h3>
          <div className="text-xs text-[#666666]">{step + 1}/3</div>
        </div>

        <p className="font-semibold text-[#1A1A1A] mb-1">{q}</p>
        <p className="text-xs text-[#666666] mb-4">{hint}</p>
        <textarea
          className="w-full h-32 border border-gray-200 rounded-2xl p-4 text-sm text-[#1A1A1A] placeholder-gray-300 resize-none focus:outline-none focus:border-[#b84289]"
          placeholder="Escribe aquí..."
          value={answers[step]}
          onChange={e => { const a = [...answers]; a[step] = e.target.value; setAnswers(a) }}
        />
        <div className="flex gap-2 mt-4">
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)}
              className="flex-1 py-3 rounded-2xl border border-gray-200 text-sm font-semibold text-[#444444]">
              Anterior
            </button>
          )}
          {step < 2
            ? <button onClick={() => setStep(s => s + 1)} className="flex-1 py-3 gradient-primary text-white font-semibold rounded-2xl">Siguiente</button>
            : <button onClick={() => setDone(true)} className="flex-1 py-3 gradient-primary text-white font-semibold rounded-2xl">Guardar</button>
          }
        </div>
      </div>
    </div>
  )
}

// ── Emotional menu ────────────────────────────────────────────────────────────

function getTodayKey() { return new Date().toISOString().split('T')[0] }

function loadDailyCompletions() {
  try {
    const raw = localStorage.getItem(`herya_practices_${getTodayKey()}`)
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}

function saveDailyCompletion(key) {
  try {
    const existing = loadDailyCompletions()
    existing[key] = true
    localStorage.setItem(`herya_practices_${getTodayKey()}`, JSON.stringify(existing))
  } catch {}
}

function EmotionalMenuModal({ onClose }) {
  const [active, setActive]       = useState(null)
  const [completed, setCompleted] = useState(loadDailyCompletions)

  function handlePracticeClose(key) {
    saveDailyCompletion(key)
    setCompleted(loadDailyCompletions())
    setActive(null)
  }

  if (active === 'breathing478') return <Breathing478Plan onClose={() => handlePracticeClose('breathing478')} />
  if (active === 'bodyscan')     return <SimpleVoicePractice type="bodyscan"   onClose={() => handlePracticeClose('bodyscan')} />
  if (active === 'anchoring')    return <SimpleVoicePractice type="anchoring"  onClose={() => handlePracticeClose('anchoring')} />
  if (active === 'compassion')   return <SimpleVoicePractice type="compassion" onClose={() => handlePracticeClose('compassion')} />
  if (active === 'journaling')   return <JournalingPractice onClose={() => handlePracticeClose('journaling')} />

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-4 md:p-6">
      <div className="bg-white rounded-3xl w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden">
        <div className="px-6 pt-6 pb-4 border-b border-[#F0E0EA] flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading text-lg font-bold text-[#1A1A1A]">Mente y emociones</h3>
              <p className="text-xs text-[#666666] mt-0.5">5 prácticas · elige la que necesitas hoy</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
              <X size={16} />
            </button>
          </div>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-3">
          {EMOTIONAL_PRACTICES.map(p => {
            const done = !!completed[p.key]
            return (
              <div key={p.key}
                className={`rounded-2xl p-4 border transition-colors ${done ? 'border-[#b84289]/25 bg-[#f9eef5]/40' : 'border-[#F0E0EA]'}`}>
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-semibold text-sm text-[#1A1A1A]">{p.title}</span>
                    {done && (
                      <span className="text-[10px] bg-[#f9eef5] text-[#b84289] px-2 py-0.5 rounded-full font-semibold">✓ Hecho hoy</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs text-[#666666]">{p.duration}</span>
                    {p.type === 'voice'
                      ? <span className="text-[10px] bg-[#f9eef5] text-[#b84289] px-2 py-0.5 rounded-full font-medium">Voz guiada</span>
                      : <span className="text-[10px] bg-[#F5F5F5] text-[#444444] px-2 py-0.5 rounded-full font-medium">Escritura</span>
                    }
                  </div>
                  <p className="text-xs text-[#666666] leading-relaxed">{p.desc}</p>
                </div>
                <button
                  onClick={() => setActive(p.key)}
                  className="w-full py-2.5 rounded-xl border-2 border-[#b84289] text-[#b84289] text-sm font-semibold hover:bg-[#f9eef5] transition-colors">
                  {done ? 'Repetir' : 'Iniciar'}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── Supplement modal ──────────────────────────────────────────────────────────

function SupplementModal({ onClose }) {
  const [checked, setChecked] = useState({})
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-4 md:p-6">
      <div className="bg-white rounded-3xl w-full max-w-lg p-6 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-heading text-lg font-bold text-[#1A1A1A]">Suplementación</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <X size={16} />
          </button>
        </div>
        <p className="text-xs text-[#666666] mb-4">Marca los que ya has tomado hoy</p>
        <div className="space-y-4">
          {SUPPLEMENTS.map(s => (
            <div key={s.id} className={`border rounded-2xl p-4 transition-all ${checked[s.id] ? 'border-[#10B981] bg-green-50' : 'border-gray-100'}`}>
              <div className="flex items-start gap-3">
                <button
                  onClick={() => setChecked(c => ({ ...c, [s.id]: !c[s.id] }))}
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${checked[s.id] ? 'bg-[#10B981] border-[#10B981]' : 'border-gray-300'}`}>
                  {checked[s.id] && <Check size={12} className="text-white" />}
                </button>
                <div className="flex-1">
                  <div className="font-semibold text-sm text-[#1A1A1A]">{s.name}</div>
                  <div className="text-[10px] text-[#b84289] font-medium mt-0.5">{s.timing}</div>
                  <p className="text-xs text-[#444444] mt-1 leading-relaxed">{s.desc}</p>
                  {s.warning && <p className="text-[10px] text-amber-700 bg-amber-50 rounded-lg px-2 py-1 mt-2 leading-relaxed">⚠ {s.warning}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-[#666666] mt-4 leading-relaxed">Guía basada en evidencia. Consulta siempre con tu ginecóloga o nutricionista antes de modificar suplementación.</p>
      </div>
    </div>
  )
}

// ── Nutrition modal ───────────────────────────────────────────────────────────

function NutritionModal({ dow, stage, onClose }) {
  const data    = NUTRITION_BY_DAY[dow] || NUTRITION_BY_DAY[0]
  const suppKey = stage === 'Perimenopausia' ? 'peri' : stage === 'Postmenopausia' ? 'post' : 'meno'
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-4 md:p-6">
      <div className="bg-white rounded-3xl w-full max-w-lg p-6 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-heading text-lg font-bold text-[#1A1A1A]">Nutrición de hoy</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <X size={16} />
          </button>
        </div>
        <p className="text-xs text-[#b84289] font-medium mb-4">{data.focus}</p>
        <div className="space-y-4 mb-5">
          {data.items.map((item, i) => (
            <div key={i} className="border border-gray-100 rounded-2xl p-4">
              <div className="text-[10px] font-bold text-[#b84289] uppercase tracking-wide mb-1">{item.meal}</div>
              <p className="text-sm font-medium text-[#1A1A1A] mb-2">{item.food}</p>
              <p className="text-xs text-[#444444] leading-relaxed mb-1">{item.reason}</p>
              <span className="inline-block text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full">{item.benefit}</span>
              {item.note && <p className="text-[10px] text-amber-700 mt-1.5 leading-relaxed">💡 {item.note}</p>}
            </div>
          ))}
        </div>
        <div className="bg-[#f9eef5] rounded-2xl p-4 mb-3">
          <p className="text-xs font-bold text-[#b84289] mb-1">💊 Suplementación hoy ({stage})</p>
          <p className="text-xs text-[#444444] leading-relaxed">{data.supplement[suppKey]}</p>
        </div>
        <p className="text-[10px] text-[#666666] leading-relaxed">{data.warning}</p>
      </div>
    </div>
  )
}

// ── Sleep modal ───────────────────────────────────────────────────────────────

const HYGIENE_ITEMS = [
  { emoji: '📵', title: 'Sin pantallas 1h antes',         desc: 'La luz azul suprime la melatonina' },
  { emoji: '🌡️', title: 'Habitación a 18-20°C',           desc: 'El frío facilita la bajada de temperatura corporal necesaria para dormir' },
  { emoji: '☕', title: 'Sin cafeína después de las 14h', desc: 'Vida media 5-7h; en menopausia se metaboliza más lento' },
  { emoji: '🛁', title: 'Baño templado 1h antes',          desc: 'Baja la temperatura corporal al salir, señal de sueño' },
  { emoji: '🌿', title: 'Infusión de valeriana o pasiflora', desc: 'Efecto ansiolítico suave, sin dependencia' },
]

function SleepModal({ dow, onClose }) {
  const [tab, setTab]         = useState('log')
  const [bedtime, setBedtime] = useState('22:30')
  const [wakeTime, setWakeTime] = useState('07:00')
  const [quality, setQuality] = useState(null)
  const [sofocos, setSofocos] = useState(false)
  const [saved, setSaved]     = useState(false)
  const todayHygiene = SLEEP_BY_DAY[dow]

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-4 md:p-6">
      <div className="bg-white rounded-3xl w-full max-w-lg p-6 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-lg font-bold text-[#1A1A1A]">Sueño</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <X size={16} />
          </button>
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-5">
          {[['log','Registro'],['hygiene','Protocolo']].map(([k,l]) => (
            <button key={k} onClick={() => setTab(k)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${tab===k ? 'bg-white text-[#1A1A1A] shadow-sm' : 'text-[#444444]'}`}>
              {l}
            </button>
          ))}
        </div>

        {tab === 'log' && (
          <div className="space-y-4">
            {saved ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">🌙</div>
                <p className="font-semibold text-[#1A1A1A]">Registro guardado</p>
                <p className="text-sm text-[#444444] mt-1">Gracias por registrar tu sueño de hoy.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[#444444] mb-1 block">Hora de acostarse</label>
                    <input type="time" value={bedtime} onChange={e => setBedtime(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#b84289]" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#444444] mb-1 block">Hora de levantarse</label>
                    <input type="time" value={wakeTime} onChange={e => setWakeTime(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#b84289]" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#444444] mb-2 block">Calidad del sueño</label>
                  <div className="flex gap-2">
                    {[['😴',1],['😐',2],['🙂',3],['😊',4],['😁',5]].map(([e,v]) => (
                      <button key={v} onClick={() => setQuality(v)}
                        className={`flex-1 py-2 rounded-xl text-xl transition-all border-2 ${quality===v ? 'border-[#b84289] bg-[#b84289]/5' : 'border-transparent bg-gray-50'}`}>
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border border-gray-100 rounded-xl">
                  <span className="text-sm text-[#1A1A1A]">¿Sofocos nocturnos?</span>
                  <button onClick={() => setSofocos(s => !s)}
                    className={`w-12 h-6 rounded-full transition-all relative ${sofocos ? 'bg-[#b84289]' : 'bg-gray-200'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${sofocos ? 'left-6' : 'left-0.5'}`} />
                  </button>
                </div>
                <button onClick={() => setSaved(true)} className="w-full py-3 gradient-primary text-white font-semibold rounded-2xl">
                  Guardar registro
                </button>
              </>
            )}
          </div>
        )}

        {tab === 'hygiene' && (
          <div className="space-y-4">
            {todayHygiene && (
              <div className="bg-[#f9eef5] rounded-2xl p-4 mb-2">
                <p className="text-xs font-bold text-[#b84289] mb-1">🌙 Consejo de hoy</p>
                <p className="text-sm text-[#1A1A1A]">{todayHygiene.text}</p>
                <p className="text-[10px] text-[#444444] mt-1">{todayHygiene.duration}</p>
              </div>
            )}
            {HYGIENE_ITEMS.map((item, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="text-xl flex-shrink-0">{item.emoji}</span>
                <div>
                  <p className="text-sm font-medium text-[#1A1A1A]">{item.title}</p>
                  <p className="text-xs text-[#666666] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
            <div className="bg-amber-50 rounded-2xl p-4 mt-2">
              <p className="text-xs font-bold text-amber-700 mb-1">⚕️ Habla con tu ginecóloga si...</p>
              <p className="text-xs text-amber-800 leading-relaxed">Llevas más de 3 semanas durmiendo menos de 5h, o los sofocos nocturnos te despiertan más de 3 veces por noche. Puede ser candidata a terapia hormonal o melatonina a dosis clínica.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Emotional health modal ────────────────────────────────────────────────────

const MOOD_OPTIONS = [
  { value: 1, label: 'Muy difícil', emoji: '😔' },
  { value: 2, label: 'Difícil',     emoji: '😞' },
  { value: 3, label: 'Regular',     emoji: '😐' },
  { value: 4, label: 'Bien',        emoji: '🙂' },
  { value: 5, label: 'Muy bien',    emoji: '😊' },
]

function EmotionalHealthModal({ weeklyLogs, onClose }) {
  const [mood, setMood]   = useState(null)
  const [saved, setSaved] = useState(false)
  const last7 = weeklyLogs.slice(-7)

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-4 md:p-6">
      <div className="bg-white rounded-3xl w-full max-w-lg p-6 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-heading text-lg font-bold text-[#1A1A1A]">Salud emocional</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <X size={16} />
          </button>
        </div>

        {!saved ? (
          <>
            <p className="text-sm font-medium text-[#1A1A1A] mb-3">¿Cómo estás emocionalmente hoy?</p>
            <div className="grid grid-cols-5 gap-2 mb-5">
              {MOOD_OPTIONS.map(opt => (
                <button key={opt.value} onClick={() => setMood(opt.value)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all ${mood === opt.value ? 'border-[#b84289] bg-[#b84289]/5' : 'border-gray-100'}`}>
                  <span className="text-2xl">{opt.emoji}</span>
                  <span className="text-[9px] text-[#444444] text-center leading-tight">{opt.label}</span>
                </button>
              ))}
            </div>
            <button onClick={() => mood && setSaved(true)} disabled={!mood}
              className={`w-full py-3 rounded-2xl font-semibold text-sm mb-5 ${mood ? 'gradient-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
              Guardar check-in
            </button>
          </>
        ) : (
          <div className="bg-[#F0FDF4] rounded-2xl p-4 mb-5">
            <p className="text-sm font-semibold text-[#065F46]">Check-in guardado ✓</p>
          </div>
        )}

        {last7.length > 0 && (
          <div className="mb-5">
            <p className="text-xs font-bold text-[#444444] uppercase tracking-wide mb-3">Evolución reciente (puntuación síntomas)</p>
            <div className="flex items-end gap-1.5 h-16">
              {last7.map((log, i) => {
                const h = Math.max(8, (log.totalScore / 40) * 60)
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full rounded-t-md bg-[#b84289]/20" style={{ height: h }} />
                    <span className="text-[8px] text-[#666666]">{(log.week || '').replace('Sem ', 'S')}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className="bg-[#f9eef5] rounded-2xl p-4">
          <p className="text-xs font-bold text-[#b84289] mb-2">Herramientas disponibles</p>
          <div className="space-y-2">
            {['Habla con alguien de confianza','Practica una de las técnicas de la sección Mente','Da un paseo de 15 minutos al aire libre','Escribe en el diario reflexivo'].map((t, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#b84289] mt-1.5 flex-shrink-0" />
                <p className="text-xs text-[#444444]">{t}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Pelvic floor modal ────────────────────────────────────────────────────────

const CONTRACT_TIME = 5
const RELAX_TIME    = 10
const TOTAL_REPS    = 10

function PelvicFloorModal({ onClose }) {
  const [tab, setTab]           = useState('kegel')
  const [leaks, setLeaks]       = useState(null)
  const [leakSaved, setLeakSaved] = useState(false)

  const phaseRef    = useRef('contract')
  const repRef      = useRef(0)
  const timeLeftRef = useRef(CONTRACT_TIME)
  const intervalRef = useRef(null)
  const [display, setDisplay] = useState({ phase: 'contract', rep: 0, timeLeft: CONTRACT_TIME })
  const [running, setRunning] = useState(false)
  const [kegelDone, setKegelDone] = useState(false)

  function kegelTick() {
    timeLeftRef.current -= 1
    if (timeLeftRef.current > 0) {
      setDisplay(d => ({ ...d, timeLeft: timeLeftRef.current })); return
    }
    if (phaseRef.current === 'contract') {
      phaseRef.current = 'relax'; timeLeftRef.current = RELAX_TIME
    } else {
      if (repRef.current + 1 >= TOTAL_REPS) {
        clearInterval(intervalRef.current); setRunning(false); setKegelDone(true); return
      }
      repRef.current += 1; phaseRef.current = 'contract'; timeLeftRef.current = CONTRACT_TIME
    }
    setDisplay({ phase: phaseRef.current, rep: repRef.current, timeLeft: timeLeftRef.current })
  }

  function toggleKegel() {
    if (running) { clearInterval(intervalRef.current); setRunning(false) }
    else { intervalRef.current = setInterval(kegelTick, 1000); setRunning(true) }
  }

  function resetKegel() {
    clearInterval(intervalRef.current); setRunning(false); setKegelDone(false)
    phaseRef.current = 'contract'; repRef.current = 0; timeLeftRef.current = CONTRACT_TIME
    setDisplay({ phase: 'contract', rep: 0, timeLeft: CONTRACT_TIME })
  }

  useEffect(() => () => clearInterval(intervalRef.current), [])

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-4 md:p-6">
      <div className="bg-white rounded-3xl w-full max-w-lg p-6 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="font-heading text-lg font-bold text-[#1A1A1A]">Suelo pélvico</h3>
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">🔒 Privado</span>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <X size={16} />
          </button>
        </div>

        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-5">
          {[['kegel','Ejercicio Kegel'],['register','Registro'],['info','Información']].map(([k,l]) => (
            <button key={k} onClick={() => setTab(k)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${tab===k ? 'bg-white text-[#1A1A1A] shadow-sm' : 'text-[#444444]'}`}>
              {l}
            </button>
          ))}
        </div>

        {tab === 'kegel' && (
          <div className="text-center space-y-4">
            {kegelDone ? (
              <>
                <div className="text-5xl">✨</div>
                <p className="font-semibold text-[#1A1A1A]">¡10 repeticiones completadas!</p>
                <p className="text-sm text-[#444444]">Los resultados se acumulan con la práctica diaria.</p>
                <button onClick={resetKegel}
                  className="w-full py-3 rounded-2xl border-2 border-[#b84289] text-[#b84289] font-semibold text-sm flex items-center justify-center gap-2">
                  <RotateCcw size={14} /> Repetir
                </button>
              </>
            ) : (
              <>
                <p className="text-xs text-[#666666]">Repetición {display.rep + 1} de {TOTAL_REPS}</p>
                <div className="w-32 h-32 rounded-full mx-auto flex items-center justify-center border-4 transition-all"
                  style={{ borderColor: display.phase === 'contract' ? '#b84289' : '#10B981', backgroundColor: display.phase === 'contract' ? '#f9eef5' : '#F0FDF4' }}>
                  <div className="text-center">
                    <div className="text-3xl font-bold" style={{ color: display.phase === 'contract' ? '#b84289' : '#10B981' }}>{display.timeLeft}</div>
                    <div className="text-xs mt-1" style={{ color: display.phase === 'contract' ? '#b84289' : '#10B981' }}>
                      {display.phase === 'contract' ? 'Contrae' : 'Relaja'}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-[#444444] px-4">
                  {display.phase === 'contract' ? 'Aprieta el suelo pélvico como si quisieras cortar el flujo de orina' : 'Suelta completamente. Respira.'}
                </p>
                <button onClick={toggleKegel}
                  className="w-full py-3 gradient-primary text-white font-semibold rounded-2xl flex items-center justify-center gap-2">
                  {running ? <><Pause size={16} /> Pausar</> : <><Play size={16} /> {display.rep === 0 && display.phase === 'contract' && !running ? 'Comenzar' : 'Continuar'}</>}
                </button>
              </>
            )}
          </div>
        )}

        {tab === 'register' && (
          <div className="space-y-4">
            <p className="text-sm font-medium text-[#1A1A1A]">Escapes de orina hoy</p>
            <div className="flex gap-2 justify-center flex-wrap">
              {[0,1,2,3,'4+'].map(v => (
                <button key={v} onClick={() => setLeaks(v)}
                  className={`w-12 h-12 rounded-xl border-2 font-bold text-sm transition-all ${leaks === v ? 'border-[#b84289] bg-[#f9eef5] text-[#b84289]' : 'border-gray-200 text-[#444444]'}`}>
                  {v}
                </button>
              ))}
            </div>
            {!leakSaved ? (
              <button onClick={() => leaks !== null && setLeakSaved(true)}
                className="w-full py-3 gradient-primary text-white font-semibold rounded-2xl">
                Guardar registro
              </button>
            ) : (
              <div className="bg-[#F0FDF4] rounded-2xl p-4 text-center">
                <p className="text-sm font-semibold text-[#065F46]">Guardado ✓</p>
              </div>
            )}
            <div className="bg-amber-50 rounded-2xl p-4">
              <p className="text-xs font-bold text-amber-700 mb-1">⚕️ Cuándo consultar</p>
              <p className="text-xs text-amber-800 leading-relaxed">Si tienes 2 o más escapes al día de forma regular, habla con tu ginecóloga. La incontinencia tiene tratamiento efectivo y no es algo que debas aceptar.</p>
            </div>
          </div>
        )}

        {tab === 'info' && (
          <div className="space-y-4">
            <div className="bg-[#f9eef5] rounded-2xl p-4">
              <p className="font-semibold text-[#b84289] mb-2">¿Por qué el suelo pélvico importa en la menopausia?</p>
              <p className="text-xs text-[#444444] leading-relaxed">La caída de estrógenos debilita los tejidos del suelo pélvico. Esto puede causar incontinencia urinaria, prolapso leve y cambios en la salud sexual. Los ejercicios de Kegel son la intervención de primera línea con mayor evidencia.</p>
            </div>
            {[
              { emoji: '🏋️', t: 'Frecuencia recomendada',  d: '10 repeticiones, 3 veces al día' },
              { emoji: '⏱️', t: 'Cuándo ver resultados',    d: 'Mejoría apreciable a las 6-12 semanas' },
              { emoji: '🛑', t: 'Lo que NO debes hacer',    d: 'No practicar los ejercicios mientras orinas — puede inhibir el vaciado completo' },
            ].map(({ emoji, t, d }) => (
              <div key={t} className="flex gap-3 items-start">
                <span className="text-xl">{emoji}</span>
                <div>
                  <p className="text-sm font-medium text-[#1A1A1A]">{t}</p>
                  <p className="text-xs text-[#666666]">{d}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Pillar card ───────────────────────────────────────────────────────────────

function PillarCard({ emoji, title, subtitle, badge, onClick }) {
  return (
    <button onClick={onClick}
      className="w-full card p-4 flex items-center gap-4 hover:shadow-card-hover transition-all active:scale-[0.99] text-left">
      <div className="w-12 h-12 rounded-2xl bg-[#b84289]/8 flex items-center justify-center flex-shrink-0 text-2xl"
        style={{ backgroundColor: 'rgba(74,108,247,0.08)' }}>
        {emoji}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-sm text-[#1A1A1A]">{title}</span>
          {badge && <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">{badge}</span>}
        </div>
        <p className="text-xs text-[#666666] mt-0.5">{subtitle}</p>
      </div>
      <ChevronRight size={18} className="text-[#666666] flex-shrink-0" />
    </button>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function Plan() {
  const navigate = useNavigate()
  const { userProfile, weeklyLogs } = useApp()
  const [modal, setModal] = useState(null)

  const name       = userProfile?.name  || 'Ana'
  const stage      = userProfile?.stage || 'Menopausia'
  const weekNumber = Math.max(1, weeklyLogs.length)
  const dow        = new Date().getDay()

  return (
    <div className="px-4 py-6 space-y-4 pb-28">
      <div className="pt-10">
        <h1 className="font-heading text-2xl font-bold text-[#1A1A1A]">Tu plan de hoy, {name}</h1>
        <p className="text-[#666666] text-xs mt-1">Personalizado para tu etapa · {stage} · Semana {weekNumber}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <PillarCard emoji="🏃‍♀️" title="Movimiento"       subtitle="Rutina adaptada a tu ciclo hormonal"            onClick={() => navigate('/user/routines')} />
        <PillarCard emoji="🥗"   title="Nutrición"        subtitle="Plan del día con micronutrientes clave"          onClick={() => setModal('nutrition')} />
        <PillarCard emoji="💊"   title="Suplementación"   subtitle="4 suplementos de base · Marca los tomados"       onClick={() => setModal('supplements')} />
        <PillarCard emoji="🧘‍♀️" title="Mente y emociones" subtitle="5 prácticas guiadas: respiración, body scan..." onClick={() => setModal('emotional')} />
        <PillarCard emoji="🌙"   title="Sueño"            subtitle="Registro nocturno y protocolo de higiene"         onClick={() => setModal('sleep')} />
        <PillarCard emoji="💜"   title="Salud emocional"  subtitle="Check-in diario y evolución de bienestar"        onClick={() => setModal('emotionalhealth')} />
        <PillarCard emoji="🔒"   title="Suelo pélvico"    subtitle="Kegel, registros y protocolo" badge="Privado"    onClick={() => setModal('pelvic')} />
      </div>

      {modal === 'nutrition'     && <NutritionModal      dow={dow} stage={stage} onClose={() => setModal(null)} />}
      {modal === 'supplements'   && <SupplementModal     onClose={() => setModal(null)} />}
      {modal === 'emotional'     && <EmotionalMenuModal  onClose={() => setModal(null)} />}
      {modal === 'sleep'         && <SleepModal          dow={dow} onClose={() => setModal(null)} />}
      {modal === 'emotionalhealth' && <EmotionalHealthModal weeklyLogs={weeklyLogs} onClose={() => setModal(null)} />}
      {modal === 'pelvic'        && <PelvicFloorModal    onClose={() => setModal(null)} />}
    </div>
  )
}
