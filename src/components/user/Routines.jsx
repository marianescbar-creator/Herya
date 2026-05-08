import { useState, useEffect, useRef, useCallback } from 'react'
import { CheckCircle2, Circle, ChevronLeft, Flame, Calendar, ChevronDown, ChevronUp, Volume2, VolumeX, X } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import {
  SLEEP_BY_DAY, MOVEMENT_DAYS, MOVEMENT_BY_DAY,
  NUTRITION_BY_DAY, EMOTIONAL_DAYS, EMOTIONAL_BY_DAY,
} from '../../data/mockData'

const DAY_NAMES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
const DAY_NAMES_SHORT = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const MONTH_NAMES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']

const fmt = (d) => d.toISOString().split('T')[0]
function todayStr() { return fmt(new Date()) }

const SUPPLEMENTS = [
  { id: 'magnesio',    emoji: '🌙', label: 'Magnesio glicinato', dose: '300 mg antes de dormir' },
  { id: 'vitamind',   emoji: '☀️', label: 'Vitamina D3',         dose: '2.000 UI con la primera comida' },
  { id: 'omega3',     emoji: '🐟', label: 'Omega-3',             dose: '1 g EPA+DHA con comidas' },
  { id: 'isoflavonas', emoji: '🌿', label: 'Isoflavonas de soja', dose: '40 mg con el desayuno' },
]

function getHabitsForDay(dow) {
  const movFallback = { text: 'Movimiento suave: camina 20 min o haz estiramientos articulares para activar la circulación.', duration: '20 min' }
  const emoFallback = { text: 'Respiración consciente: inhala 4s, aguanta 2s, exhala 6s. Repite 5 veces para calmar el sistema nervioso.', duration: '5 min' }
  return [
    { id: 'sleep',      emoji: '🌙',    label: 'Rutina de sueño',    ...(SLEEP_BY_DAY[dow] || SLEEP_BY_DAY[0]) },
    { id: 'movement',   emoji: '🏃‍♀️', label: 'Movimiento',          ...(MOVEMENT_BY_DAY[dow] || movFallback) },
    { id: 'nutrition',  emoji: '🥗',    label: 'Nutrición del día',  text: NUTRITION_BY_DAY[dow].text, detail: NUTRITION_BY_DAY[dow], duration: '5 min' },
    { id: 'emotional',  emoji: '🧠',    label: 'Práctica emocional', ...(EMOTIONAL_BY_DAY[dow] || emoFallback) },
    { id: 'supplement', emoji: '💊',    label: 'Suplementación',     text: 'Marca los suplementos que has tomado hoy.', duration: '2 min' },
  ]
}

function calcStreak(completions) {
  let streak = 0
  const d = new Date()
  d.setDate(d.getDate() - 1)
  for (let i = 0; i < 30; i++) {
    const key = fmt(d)
    const day = completions[key] || {}
    if (Object.values(day).some(Boolean)) { streak++ } else { break }
    d.setDate(d.getDate() - 1)
  }
  return streak
}

// ─── Voice synthesis helper ───────────────────────────────────────────────────
let selectedVoice = null

function loadVoice() {
  if (!('speechSynthesis' in window)) return
  const voices = window.speechSynthesis.getVoices()
  const preferred = ['monica', 'paulina', 'marisol', 'helena', 'google español', 'es-es', 'es-mx']
  selectedVoice =
    voices.find(v => preferred.some(p => v.name.toLowerCase().includes(p) || v.lang.toLowerCase().includes(p))) ||
    voices.find(v => v.lang.startsWith('es')) ||
    null
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadVoice()
  window.speechSynthesis.addEventListener('voiceschanged', loadVoice)
}

const speak = (text) => {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const utt = new SpeechSynthesisUtterance(text)
  utt.lang = 'es-ES'
  utt.rate = 0.82
  utt.pitch = 0.95
  utt.volume = 1.0
  if (selectedVoice) utt.voice = selectedVoice
  window.speechSynthesis.speak(utt)
}
const stopSpeech = () => { if ('speechSynthesis' in window) window.speechSynthesis.cancel() }

// ─── Nutrition detail expansion ───────────────────────────────────────────────
function NutritionDetail({ data, userProfile }) {
  const stage = userProfile?.stage || 'Menopausia'
  const suppKey = stage.includes('Peri') ? 'peri' : stage.includes('Post') ? 'post' : 'meno'
  return (
    <div className="mt-4 space-y-3">
      <div className="text-[10px] font-bold text-[#b84289] uppercase tracking-wider">{data.focus}</div>
      {data.items?.map((item, i) => (
        <div key={i} className="bg-gray-50 rounded-2xl p-3.5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-[#b84289] uppercase tracking-wide">{item.meal}</span>
            <span className="text-[10px] font-semibold text-[#10B981]">{item.benefit}</span>
          </div>
          <p className="text-xs font-semibold text-[#1A1A1A] mb-1 leading-snug">{item.food}</p>
          <p className="text-[11px] text-[#444444] leading-relaxed">{item.reason}</p>
          {item.note && (
            <p className="text-[10px] text-amber-700 mt-1.5 flex gap-1">
              <span>⚠️</span><span>{item.note}</span>
            </p>
          )}
        </div>
      ))}
      {data.supplement?.[suppKey] && (
        <div className="bg-[#b84289]/5 rounded-2xl p-3.5">
          <p className="text-[10px] font-bold text-[#b84289] mb-1">💊 Suplementación recomendada · {stage}</p>
          <p className="text-xs text-[#444444] leading-relaxed">{data.supplement[suppKey]}</p>
        </div>
      )}
      <div className="p-3 bg-amber-50 rounded-xl flex gap-2">
        <span className="text-[10px]">⚕️</span>
        <p className="text-[10px] text-amber-700 leading-relaxed">{data.warning}</p>
      </div>
    </div>
  )
}

// ─── SESSION: Breathing 4-7-8 ────────────────────────────────────────────────
const PHASES_478 = [
  { key: 'inhale', label: 'Inhala', subtext: 'Llena los pulmones lentamente', duration: 4, scale: 1.65, voice: 'Inhala' },
  { key: 'hold',   label: 'Aguanta', subtext: 'Mantén el aire, relaja los hombros', duration: 7, scale: 1.65, voice: 'Aguanta el aire' },
  { key: 'exhale', label: 'Exhala', subtext: 'Suelta el aire despacio por la boca', duration: 8, scale: 1.0, voice: 'Exhala despacio' },
]
const TOTAL_ROUNDS_478 = 4

function Breathing478({ onComplete, onExit }) {
  const [phase, setPhase] = useState(-1)
  const [round, setRound] = useState(1)
  const [timeLeft, setTimeLeft] = useState(0)
  const [scale, setScale] = useState(1)
  const [done, setDone] = useState(false)
  const [rating, setRating] = useState(null)
  const [muted, setMuted] = useState(false)
  const pausedRef = useRef(false)
  const timerRef = useRef(null)

  useEffect(() => () => { stopSpeech(); clearInterval(timerRef.current) }, [])

  const startSession = useCallback(() => {
    setPhase(0); setRound(1)
    if (!muted) speak('Comenzamos. ' + PHASES_478[0].voice)
  }, [muted])

  useEffect(() => {
    if (phase < 0 || done) return
    setTimeLeft(PHASES_478[phase].duration)
    setScale(PHASES_478[phase].scale)
    timerRef.current = setInterval(() => {
      if (pausedRef.current) return
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          const nextPhase = (phase + 1) % PHASES_478.length
          const nextRound = nextPhase === 0 ? round + 1 : round
          if (nextPhase === 0 && round >= TOTAL_ROUNDS_478) {
            if (!muted) speak('Sesión completada. Muy bien.')
            setDone(true); return 0
          }
          if (!muted) speak(PHASES_478[nextPhase].voice)
          setPhase(nextPhase); setRound(nextRound)
          return PHASES_478[nextPhase].duration
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [phase, done])

  const handleRate = (r) => { setRating(r); setTimeout(() => onComplete(r), 800) }
  const totalDuration = PHASES_478.reduce((a, p) => a + p.duration, 0) * TOTAL_ROUNDS_478
  const elapsed = (round - 1) * PHASES_478.reduce((a, p) => a + p.duration, 0) + PHASES_478.slice(0, phase >= 0 ? phase : 0).reduce((a, p) => a + p.duration, 0) + (phase >= 0 ? PHASES_478[phase].duration - timeLeft : 0)
  const progressPct = totalDuration > 0 ? Math.min(100, (elapsed / totalDuration) * 100) : 0

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gradient-to-b from-[#1A1A1A] to-[#2D1B5E]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-14 pb-4">
        <button onClick={() => { stopSpeech(); onExit() }} className="text-white/60 flex items-center gap-1 text-sm">
          <ChevronLeft size={18} /> Mis rutinas
        </button>
        <button onClick={() => { setMuted(m => !m); if (!muted) stopSpeech() }} className="text-white/40">
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </div>

      {/* Prep screen */}
      {phase === -1 && !done && (
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <div className="text-5xl mb-5">🌬️</div>
          <h2 className="font-heading text-2xl font-bold text-white mb-1">Respiración 4-7-8</h2>
          <p className="text-white/50 text-sm mb-5">8 minutos · {TOTAL_ROUNDS_478} ciclos · Práctica guiada por voz</p>
          <div className="bg-white/10 rounded-2xl p-4 mb-6 text-left w-full max-w-xs">
            <p className="text-white/80 text-xs font-semibold mb-2">Qué necesitas:</p>
            <p className="text-white/60 text-sm leading-relaxed">Un lugar tranquilo. Puedes estar sentada o tumbada. Sube el volumen del dispositivo.</p>
          </div>
          <p className="text-white/60 text-sm leading-relaxed mb-8 max-w-xs">
            Esta técnica activa el sistema nervioso parasimpático, reduciendo la intensidad de los sofocos y la respuesta de estrés. Inhala 4s · Aguanta 7s · Exhala 8s.
          </p>
          <button onClick={startSession} className="bg-white text-[#2D1B5E] font-bold px-8 py-4 rounded-2xl text-base">
            Iniciar práctica con voz
          </button>
        </div>
      )}

      {/* Active session */}
      {phase >= 0 && !done && (
        <div className="flex-1 flex flex-col">
          <div className="px-6 pt-2">
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-white/50 rounded-full transition-all duration-1000" style={{ width: `${progressPct}%` }} />
            </div>
            <div className="text-white/30 text-xs text-right mt-1">Ciclo {round}/{TOTAL_ROUNDS_478}</div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center gap-6 px-8">
            {/* Breathing circle */}
            <div className="relative flex items-center justify-center" style={{ width: 200, height: 200 }}>
              <div className="rounded-full" style={{
                width: 100, height: 100,
                background: 'rgba(255,255,255,0.15)',
                transform: `scale(${scale})`,
                transition: phase === 0 ? `transform ${PHASES_478[0].duration}s ease-in-out`
                           : phase === 2 ? `transform ${PHASES_478[2].duration}s ease-in-out`
                           : 'none',
                boxShadow: '0 0 50px rgba(74,108,247,0.6)',
              }} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="font-heading text-3xl font-bold text-white">{timeLeft}</div>
                <div className="text-white/40 text-xs">seg</div>
              </div>
            </div>
            <div className="text-center">
              <div className="font-heading text-4xl font-bold text-white mb-2">{PHASES_478[phase].label}</div>
              <p className="text-white/50 text-sm">{PHASES_478[phase].subtext}</p>
            </div>
          </div>

          <div className="px-6 pb-10 flex justify-center">
            <button onClick={() => { pausedRef.current = !pausedRef.current }} className="text-white/25 text-xs border border-white/10 px-5 py-2 rounded-xl">
              Pausar
            </button>
          </div>
        </div>
      )}

      {/* Done */}
      {done && (
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <div className="text-5xl mb-5">✨</div>
          <h2 className="font-heading text-2xl font-bold text-white mb-3">Sesión completada</h2>
          <p className="text-white/60 text-sm leading-relaxed mb-8 max-w-xs">La práctica regular reduce el cortisol basal, lo que tiene efecto directo sobre la frecuencia de sofocos y la irritabilidad.</p>
          <p className="font-semibold text-white mb-4">¿Cómo te sientes?</p>
          <div className="flex gap-3">
            {['Mejor 😊', 'Igual 😐', 'Peor 😔'].map(opt => (
              <button key={opt} onClick={() => handleRate(opt)}
                className={`px-4 py-2.5 rounded-2xl text-sm font-semibold border transition-all ${rating === opt ? 'bg-white text-[#2D1B5E] border-white' : 'border-white/30 text-white'}`}>
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── SESSION: Body Scan ───────────────────────────────────────────────────────
const BODY_SCAN_STEPS = [
  { label: 'Respiración inicial', text: 'Cierra los ojos. Lleva la atención a tu respiración. Tres respiraciones profundas, sin forzar.', voice: 'Cierra los ojos. Tres respiraciones profundas, sin forzar.', duration: 35, emoji: '🫧' },
  { label: 'Pies y piernas', text: 'Lleva tu atención a los pies. ¿Sientes el suelo? Sube lentamente por pantorrillas, rodillas, muslos. Sin juzgar, solo observar.', voice: 'Lleva la atención a los pies. Sube lentamente por las piernas. Sin juzgar, solo observar.', duration: 45, emoji: '🦶' },
  { label: 'Abdomen y pecho', text: 'Lleva la atención al abdomen. Con cada inhala, nota cómo se expande. Con cada exhala, cómo se relaja. Observa el latido del corazón.', voice: 'Atención al abdomen. Con cada inhala se expande. Con cada exhala se relaja.', duration: 45, emoji: '🫁' },
  { label: 'Hombros y cuello', text: 'Muchas veces acumulamos tensión aquí sin saberlo. Observa si hay rigidez. No es necesario cambiar nada, solo notar.', voice: 'Hombros y cuello. Observa si hay tensión. No es necesario cambiar nada, solo notar.', duration: 40, emoji: '🤷‍♀️' },
  { label: 'Cara y mandíbula', text: 'Afloja la mandíbula conscientemente. Suaviza el entrecejo. Relaja los músculos alrededor de los ojos.', voice: 'Afloja la mandíbula. Suaviza el entrecejo. Relaja los ojos.', duration: 35, emoji: '😌' },
  { label: 'Integración', text: 'Expande la atención a todo el cuerpo a la vez. Estás presente, completa, aquí. Respira.', voice: 'Expande la atención a todo el cuerpo. Estás presente, completa, aquí.', duration: 40, emoji: '🌟' },
  { label: 'Cierre', text: 'Mueve los dedos de los pies y las manos suavemente. Cuando estés lista, abre los ojos a tu ritmo.', voice: 'Mueve los dedos suavemente. Cuando estés lista, abre los ojos.', duration: 25, emoji: '👁️' },
]

function BodyScan({ onComplete, onExit }) {
  const [stepIdx, setStepIdx] = useState(-1)
  const [timeLeft, setTimeLeft] = useState(0)
  const [done, setDone] = useState(false)
  const [rating, setRating] = useState(null)
  const [muted, setMuted] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => () => { stopSpeech(); clearInterval(timerRef.current) }, [])

  const startSession = () => {
    if (!muted) speak(BODY_SCAN_STEPS[0].voice)
    setStepIdx(0); setTimeLeft(BODY_SCAN_STEPS[0].duration)
  }

  useEffect(() => {
    if (stepIdx < 0 || done) return
    setTimeLeft(BODY_SCAN_STEPS[stepIdx].duration)
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          if (stepIdx + 1 >= BODY_SCAN_STEPS.length) {
            if (!muted) speak('Escaneo completado. Bien hecho.')
            setDone(true); return 0
          }
          const next = stepIdx + 1
          if (!muted) speak(BODY_SCAN_STEPS[next].voice)
          setStepIdx(next)
          return BODY_SCAN_STEPS[next].duration
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [stepIdx, done])

  const progress = stepIdx >= 0 ? ((stepIdx + 1) / BODY_SCAN_STEPS.length) * 100 : 0
  const handleRate = (r) => { setRating(r); setTimeout(() => onComplete(r), 800) }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gradient-to-b from-[#0F2027] to-[#203A43]">
      <div className="flex items-center justify-between px-5 pt-14 pb-4">
        <button onClick={() => { stopSpeech(); onExit() }} className="text-white/60 flex items-center gap-1 text-sm">
          <ChevronLeft size={18} /> Mis rutinas
        </button>
        <button onClick={() => { setMuted(m => !m); if (!muted) stopSpeech() }} className="text-white/40">
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </div>

      {stepIdx === -1 && !done && (
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <div className="text-5xl mb-5">🫧</div>
          <h2 className="font-heading text-2xl font-bold text-white mb-1">Escaneo Corporal de Aceptación</h2>
          <p className="text-white/50 text-sm mb-5">12 minutos · Práctica guiada por voz · Para dolor articular</p>
          <div className="bg-white/10 rounded-2xl p-4 mb-6 text-left w-full max-w-xs">
            <p className="text-white/80 text-xs font-semibold mb-2">Qué necesitas:</p>
            <p className="text-white/60 text-sm leading-relaxed">Un lugar tranquilo. Tumbada o sentada con la espalda apoyada. Sube el volumen del dispositivo.</p>
          </div>
          <p className="text-white/60 text-sm leading-relaxed mb-8 max-w-xs">
            El escaneo corporal reduce la tensión acumulada y mejora la relación con el dolor articular. No es eliminar el dolor — es cambiar tu relación con él.
          </p>
          <button onClick={startSession} className="bg-white text-[#203A43] font-bold px-8 py-4 rounded-2xl text-base">
            Iniciar práctica con voz
          </button>
        </div>
      )}

      {stepIdx >= 0 && !done && (
        <div className="flex-1 flex flex-col">
          <div className="px-6 pt-2">
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-white/50 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
            <div className="text-white/30 text-xs text-right mt-1">{stepIdx + 1}/{BODY_SCAN_STEPS.length}</div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-6">
            <div className="text-6xl">{BODY_SCAN_STEPS[stepIdx].emoji}</div>
            <div>
              <div className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-3">{BODY_SCAN_STEPS[stepIdx].label}</div>
              <p className="font-heading text-xl text-white leading-relaxed max-w-xs">{BODY_SCAN_STEPS[stepIdx].text}</p>
            </div>
            <div className="text-white/30 text-sm">{timeLeft}s</div>
          </div>

          <div className="px-6 pb-10 flex justify-center">
            <button className="text-white/25 text-xs border border-white/10 px-5 py-2 rounded-xl">Pausar</button>
          </div>
        </div>
      )}

      {done && (
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <div className="text-5xl mb-5">🌙</div>
          <h2 className="font-heading text-2xl font-bold text-white mb-3">Escaneo completado</h2>
          <p className="text-white/60 text-sm leading-relaxed mb-8 max-w-xs">La práctica regular del escaneo corporal reduce la reactividad al dolor y mejora la calidad del sueño.</p>
          <p className="font-semibold text-white mb-4">¿Cómo te sientes?</p>
          <div className="flex gap-3">
            {['Mejor 😊', 'Igual 😐', 'Peor 😔'].map(opt => (
              <button key={opt} onClick={() => handleRate(opt)}
                className={`px-4 py-2.5 rounded-2xl text-sm font-semibold border transition-all ${rating === opt ? 'bg-white text-[#203A43] border-white' : 'border-white/30 text-white'}`}>
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── SESSION: Box Breathing ───────────────────────────────────────────────────
const BOX_PHASES = [
  { key: 'inhale', label: 'Inhala', duration: 4, voice: 'Inhala' },
  { key: 'hold1',  label: 'Aguanta', duration: 4, voice: 'Aguanta' },
  { key: 'exhale', label: 'Exhala', duration: 4, voice: 'Exhala' },
  { key: 'hold2',  label: 'Aguanta', duration: 4, voice: 'Aguanta' },
]
const BOX_TOTAL_ROUNDS = 6

function BoxBreathing({ onComplete, onExit }) {
  const [phase, setPhase] = useState(-1)
  const [round, setRound] = useState(1)
  const [timeLeft, setTimeLeft] = useState(0)
  const [done, setDone] = useState(false)
  const [rating, setRating] = useState(null)
  const [muted, setMuted] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => () => { stopSpeech(); clearInterval(timerRef.current) }, [])

  const startSession = () => {
    if (!muted) speak(BOX_PHASES[0].voice)
    setPhase(0); setRound(1)
  }

  useEffect(() => {
    if (phase < 0 || done) return
    setTimeLeft(BOX_PHASES[phase].duration)
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          const nextPhase = (phase + 1) % BOX_PHASES.length
          const nextRound = nextPhase === 0 ? round + 1 : round
          if (nextPhase === 0 && round >= BOX_TOTAL_ROUNDS) {
            if (!muted) speak('Sesión completada. Muy bien hecho.')
            setDone(true); return 0
          }
          if (!muted) speak(BOX_PHASES[nextPhase].voice)
          setPhase(nextPhase); setRound(nextRound)
          return BOX_PHASES[nextPhase].duration
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [phase, done])

  const sideActive = phase >= 0 ? phase : -1
  const handleRate = (r) => { setRating(r); setTimeout(() => onComplete(r), 800) }
  const totalSecs = BOX_PHASES.reduce((a, p) => a + p.duration, 0) * BOX_TOTAL_ROUNDS
  const elapsed = (round - 1) * BOX_PHASES.reduce((a, p) => a + p.duration, 0) + BOX_PHASES.slice(0, phase >= 0 ? phase : 0).reduce((a, p) => a + p.duration, 0) + (phase >= 0 ? BOX_PHASES[phase].duration - timeLeft : 0)
  const progressPct = totalSecs > 0 ? Math.min(100, (elapsed / totalSecs) * 100) : 0

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gradient-to-b from-[#1A1A1A] to-[#16213E]">
      <div className="flex items-center justify-between px-5 pt-14 pb-4">
        <button onClick={() => { stopSpeech(); onExit() }} className="text-white/60 flex items-center gap-1 text-sm">
          <ChevronLeft size={18} /> Mis rutinas
        </button>
        <button onClick={() => { setMuted(m => !m); if (!muted) stopSpeech() }} className="text-white/40">
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </div>

      {phase === -1 && !done && (
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <div className="text-5xl mb-5">🔲</div>
          <h2 className="font-heading text-2xl font-bold text-white mb-1">Respiración Box</h2>
          <p className="text-white/50 text-sm mb-5">6 minutos · {BOX_TOTAL_ROUNDS} ciclos · Práctica guiada por voz</p>
          <div className="bg-white/10 rounded-2xl p-4 mb-6 text-left w-full max-w-xs">
            <p className="text-white/80 text-xs font-semibold mb-2">Qué necesitas:</p>
            <p className="text-white/60 text-sm leading-relaxed">Estar sentada. Espalda recta o apoyada. Sube el volumen del dispositivo.</p>
          </div>
          <p className="text-white/60 text-sm leading-relaxed mb-8 max-w-xs">
            La respiración box activa el sistema nervioso parasimpático en minutos. Reduce el cortisol, que amplifica los sofocos y la irritabilidad. Inhala 4s · Aguanta 4s · Exhala 4s · Aguanta 4s.
          </p>
          <button onClick={startSession} className="bg-white text-[#16213E] font-bold px-8 py-4 rounded-2xl text-base">
            Iniciar práctica con voz ({BOX_TOTAL_ROUNDS} ciclos)
          </button>
        </div>
      )}

      {phase >= 0 && !done && (
        <div className="flex-1 flex flex-col">
          <div className="px-6 pt-2">
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-white/50 rounded-full transition-all duration-1000" style={{ width: `${progressPct}%` }} />
            </div>
            <div className="text-white/30 text-xs text-right mt-1">Ciclo {round}/{BOX_TOTAL_ROUNDS}</div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center gap-8 px-8">
            {/* Box visual */}
            <div className="relative" style={{ width: 160, height: 160 }}>
              <div className={`absolute top-0 left-0 right-0 h-1.5 rounded-full transition-all duration-300 ${sideActive === 0 ? 'bg-[#b84289]' : 'bg-white/15'}`} />
              <div className={`absolute top-0 right-0 bottom-0 w-1.5 rounded-full transition-all duration-300 ${sideActive === 1 ? 'bg-[#b84289]' : 'bg-white/15'}`} />
              <div className={`absolute bottom-0 left-0 right-0 h-1.5 rounded-full transition-all duration-300 ${sideActive === 2 ? 'bg-[#b84289]' : 'bg-white/15'}`} />
              <div className={`absolute top-0 left-0 bottom-0 w-1.5 rounded-full transition-all duration-300 ${sideActive === 3 ? 'bg-[#b84289]' : 'bg-white/15'}`} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="font-heading text-3xl font-bold text-white">{timeLeft}</div>
                <div className="text-white/40 text-xs">seg</div>
              </div>
            </div>
            <div className="font-heading text-4xl font-bold text-white">{BOX_PHASES[phase].label}</div>
          </div>

          <div className="px-6 pb-10 flex justify-center">
            <button className="text-white/25 text-xs border border-white/10 px-5 py-2 rounded-xl">Pausar</button>
          </div>
        </div>
      )}

      {done && (
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <div className="text-5xl mb-5">💙</div>
          <h2 className="font-heading text-2xl font-bold text-white mb-3">Sesión completada</h2>
          <p className="text-white/60 text-sm leading-relaxed mb-8 max-w-xs">La práctica regular reduce el cortisol basal, con efecto directo sobre la frecuencia de sofocos y la irritabilidad.</p>
          <p className="font-semibold text-white mb-4">¿Cómo te sientes?</p>
          <div className="flex gap-3">
            {['Mejor 😊', 'Igual 😐', 'Peor 😔'].map(opt => (
              <button key={opt} onClick={() => handleRate(opt)}
                className={`px-4 py-2.5 rounded-2xl text-sm font-semibold border transition-all ${rating === opt ? 'bg-white text-[#16213E] border-white' : 'border-white/30 text-white'}`}>
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── SESSION: Anchoring 5-4-3-2-1 ────────────────────────────────────────────
const ANCHORING_STEPS = [
  { count: 5, sense: 'ves', label: '5 cosas que ves', text: 'Mira a tu alrededor. Nombra mentalmente 5 cosas que puedes ver ahora mismo. Tómate tu tiempo con cada una.', voice: 'Mira a tu alrededor. Nombra mentalmente cinco cosas que puedes ver ahora mismo.', duration: 45, emoji: '👁️' },
  { count: 4, sense: 'tocas', label: '4 cosas que sientes', text: 'Lleva la atención al cuerpo. ¿Qué sientes físicamente? El peso de la ropa, la temperatura del aire, el contacto de tus pies con el suelo.', voice: 'Lleva la atención al cuerpo. ¿Qué cuatro cosas puedes sentir físicamente ahora mismo?', duration: 40, emoji: '🤲' },
  { count: 3, sense: 'escuchas', label: '3 cosas que escuchas', text: 'Cierra los ojos. ¿Qué sonidos puedes distinguir? Sonidos cercanos, lejanos, de fondo. Sin juzgarlos, solo escucharlos.', voice: 'Cierra los ojos. ¿Qué tres sonidos puedes distinguir a tu alrededor?', duration: 35, emoji: '👂' },
  { count: 2, sense: 'hueles', label: '2 cosas que hueles', text: 'Aspira suavemente. ¿Qué aromas puedes detectar en este momento? Tu ropa, el ambiente, algo cercano.', voice: 'Aspira suavemente. ¿Qué dos cosas puedes oler ahora mismo?', duration: 30, emoji: '👃' },
  { count: 1, sense: 'saboreas', label: '1 cosa que saboreas', text: 'Lleva la atención a la boca. ¿Qué sabor percibes en este momento? Solo observa, sin cambiar nada.', voice: 'Por último, ¿qué sabor puedes percibir ahora mismo?', duration: 25, emoji: '👅' },
  { count: 0, sense: '', label: 'Integración', text: 'Toma tres respiraciones profundas. Estás presente, aquí, en este momento. La niebla mental tiene límites — este cuerpo, esta respiración, este instante.', voice: 'Toma tres respiraciones profundas. Estás presente, aquí, en este momento.', duration: 35, emoji: '🌿' },
]

function Anchoring54321({ onComplete, onExit }) {
  const [stepIdx, setStepIdx] = useState(-1)
  const [timeLeft, setTimeLeft] = useState(0)
  const [done, setDone] = useState(false)
  const [rating, setRating] = useState(null)
  const [muted, setMuted] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => () => { stopSpeech(); clearInterval(timerRef.current) }, [])

  const startSession = () => {
    if (!muted) speak(ANCHORING_STEPS[0].voice)
    setStepIdx(0); setTimeLeft(ANCHORING_STEPS[0].duration)
  }

  useEffect(() => {
    if (stepIdx < 0 || done) return
    setTimeLeft(ANCHORING_STEPS[stepIdx].duration)
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          if (stepIdx + 1 >= ANCHORING_STEPS.length) {
            if (!muted) speak('Técnica completada. Sigues aquí. Sigues presente.')
            setDone(true); return 0
          }
          const next = stepIdx + 1
          if (!muted) speak(ANCHORING_STEPS[next].voice)
          setStepIdx(next)
          return ANCHORING_STEPS[next].duration
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [stepIdx, done])

  const progress = stepIdx >= 0 ? ((stepIdx + 1) / ANCHORING_STEPS.length) * 100 : 0
  const handleRate = (r) => { setRating(r); setTimeout(() => onComplete(r), 800) }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gradient-to-b from-[#1B4332] to-[#0D3B2C]">
      <div className="flex items-center justify-between px-5 pt-14 pb-4">
        <button onClick={() => { stopSpeech(); onExit() }} className="text-white/60 flex items-center gap-1 text-sm">
          <ChevronLeft size={18} /> Mis rutinas
        </button>
        <button onClick={() => { setMuted(m => !m); if (!muted) stopSpeech() }} className="text-white/40">
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </div>

      {stepIdx === -1 && !done && (
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <div className="text-5xl mb-5">🌿</div>
          <h2 className="font-heading text-2xl font-bold text-white mb-1">Anclaje 5-4-3-2-1</h2>
          <p className="text-white/50 text-sm mb-5">6 minutos · Práctica guiada por voz · Para niebla mental</p>
          <div className="bg-white/10 rounded-2xl p-4 mb-6 text-left w-full max-w-xs">
            <p className="text-white/80 text-xs font-semibold mb-2">Qué necesitas:</p>
            <p className="text-white/60 text-sm leading-relaxed">Puedes estar de pie, sentada o tumbada. Los ojos abiertos al principio. Sube el volumen.</p>
          </div>
          <p className="text-white/60 text-sm leading-relaxed mb-8 max-w-xs">
            La técnica de anclaje sensorial interrumpe la disociación y la niebla mental activando los 5 sentidos. Especialmente útil en momentos de confusión cognitiva o ansiedad aguda.
          </p>
          <button onClick={startSession} className="bg-white text-[#1B4332] font-bold px-8 py-4 rounded-2xl text-base">
            Iniciar práctica con voz
          </button>
        </div>
      )}

      {stepIdx >= 0 && !done && (
        <div className="flex-1 flex flex-col">
          <div className="px-6 pt-2">
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-white/50 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-6">
            <div className="text-6xl">{ANCHORING_STEPS[stepIdx].emoji}</div>
            {ANCHORING_STEPS[stepIdx].count > 0 && (
              <div className="font-heading text-7xl font-bold text-white/20">{ANCHORING_STEPS[stepIdx].count}</div>
            )}
            <div>
              <div className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-3">{ANCHORING_STEPS[stepIdx].label}</div>
              <p className="font-heading text-lg text-white leading-relaxed max-w-xs">{ANCHORING_STEPS[stepIdx].text}</p>
            </div>
            <div className="text-white/30 text-sm">{timeLeft}s</div>
          </div>

          <div className="px-6 pb-10 flex justify-center">
            <button className="text-white/25 text-xs border border-white/10 px-5 py-2 rounded-xl">Pausar</button>
          </div>
        </div>
      )}

      {done && (
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <div className="text-5xl mb-5">🌿</div>
          <h2 className="font-heading text-2xl font-bold text-white mb-3">Técnica completada</h2>
          <p className="text-white/60 text-sm leading-relaxed mb-8 max-w-xs">Sigues aquí. Sigues presente. La práctica regular del anclaje sensorial reduce la frecuencia e intensidad de la niebla mental.</p>
          <p className="font-semibold text-white mb-4">¿Cómo te sientes?</p>
          <div className="flex gap-3">
            {['Mejor 😊', 'Igual 😐', 'Peor 😔'].map(opt => (
              <button key={opt} onClick={() => handleRate(opt)}
                className={`px-4 py-2.5 rounded-2xl text-sm font-semibold border transition-all ${rating === opt ? 'bg-white text-[#1B4332] border-white' : 'border-white/30 text-white'}`}>
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── SESSION: Self-Compassion ─────────────────────────────────────────────────
const COMPASSION_STEPS = [
  { label: 'Llegada', text: 'Encuentra una postura cómoda. Cierra los ojos o baja la mirada. Pon una mano en el pecho, sobre el corazón.', voice: 'Encuentra una postura cómoda. Pon una mano en el corazón.', duration: 35, emoji: '🤲' },
  { label: 'Reconocimiento', text: 'Piensa en algo difícil que estás viviendo ahora. No tienes que resolverlo — solo reconocerlo. Di para ti misma: "Esto es difícil. Estoy en un momento de sufrimiento."', voice: 'Piensa en algo difícil que estás viviendo. Dite a ti misma: esto es difícil. Estoy en un momento de sufrimiento.', duration: 50, emoji: '💙' },
  { label: 'Humanidad compartida', text: 'El sufrimiento es parte de la experiencia humana. No estás sola. Hay miles de mujeres viviendo algo parecido ahora mismo. Di: "El sufrimiento es parte de estar viva. No estoy sola en esto."', voice: 'El sufrimiento es parte de estar viva. No estás sola en esto.', duration: 45, emoji: '🌍' },
  { label: 'Bondad hacia ti', text: 'Ahora, habla contigo misma como le hablarías a una amiga querida que está pasando por lo mismo. ¿Qué le dirías? Dítelo a ti misma, con esa misma ternura.', voice: 'Habla contigo misma como le hablarías a una amiga querida. Dítelo con esa misma ternura.', duration: 55, emoji: '🌸' },
  { label: 'Frase de compasión', text: 'Repite en silencio: "Que pueda darme la amabilidad que necesito. Que pueda aceptarme tal como soy ahora."', voice: 'Repite en silencio: que pueda darme la amabilidad que necesito. Que pueda aceptarme tal como soy ahora.', duration: 45, emoji: '🌺' },
  { label: 'Cierre', text: 'Respira profundo tres veces. Con cada exhala, suelta un poco de tensión. Cuando estés lista, abre los ojos.', voice: 'Tres respiraciones profundas. Con cada exhala, suelta tensión. Cuando estés lista, abre los ojos.', duration: 30, emoji: '✨' },
]

function SelfCompassion({ onComplete, onExit }) {
  const [stepIdx, setStepIdx] = useState(-1)
  const [timeLeft, setTimeLeft] = useState(0)
  const [done, setDone] = useState(false)
  const [rating, setRating] = useState(null)
  const [muted, setMuted] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => () => { stopSpeech(); clearInterval(timerRef.current) }, [])

  const startSession = () => {
    if (!muted) speak(COMPASSION_STEPS[0].voice)
    setStepIdx(0); setTimeLeft(COMPASSION_STEPS[0].duration)
  }

  useEffect(() => {
    if (stepIdx < 0 || done) return
    setTimeLeft(COMPASSION_STEPS[stepIdx].duration)
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          if (stepIdx + 1 >= COMPASSION_STEPS.length) {
            if (!muted) speak('Práctica completada. Mereces todo el cuidado que das a los demás.')
            setDone(true); return 0
          }
          const next = stepIdx + 1
          if (!muted) speak(COMPASSION_STEPS[next].voice)
          setStepIdx(next)
          return COMPASSION_STEPS[next].duration
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [stepIdx, done])

  const progress = stepIdx >= 0 ? ((stepIdx + 1) / COMPASSION_STEPS.length) * 100 : 0
  const handleRate = (r) => { setRating(r); setTimeout(() => onComplete(r), 800) }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gradient-to-b from-[#4A1942] to-[#2D0A3D]">
      <div className="flex items-center justify-between px-5 pt-14 pb-4">
        <button onClick={() => { stopSpeech(); onExit() }} className="text-white/60 flex items-center gap-1 text-sm">
          <ChevronLeft size={18} /> Mis rutinas
        </button>
        <button onClick={() => { setMuted(m => !m); if (!muted) stopSpeech() }} className="text-white/40">
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </div>

      {stepIdx === -1 && !done && (
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <div className="text-5xl mb-5">🌸</div>
          <h2 className="font-heading text-2xl font-bold text-white mb-1">Práctica de compasión</h2>
          <p className="text-white/50 text-sm mb-5">12 minutos · Práctica guiada por voz · Para ánimo bajo</p>
          <div className="bg-white/10 rounded-2xl p-4 mb-6 text-left w-full max-w-xs">
            <p className="text-white/80 text-xs font-semibold mb-2">Qué necesitas:</p>
            <p className="text-white/60 text-sm leading-relaxed">Un lugar tranquilo. Puedes estar sentada o tumbada. Sube el volumen.</p>
          </div>
          <p className="text-white/60 text-sm leading-relaxed mb-8 max-w-xs">
            La auto-compasión reduce la autocrítica y el ánimo bajo con la misma eficacia que la TCC según estudios recientes. Mereces la misma amabilidad que das a los demás.
          </p>
          <button onClick={startSession} className="bg-white text-[#4A1942] font-bold px-8 py-4 rounded-2xl text-base">
            Iniciar práctica con voz
          </button>
        </div>
      )}

      {stepIdx >= 0 && !done && (
        <div className="flex-1 flex flex-col">
          <div className="px-6 pt-2">
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-white/50 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-6">
            <div className="text-6xl">{COMPASSION_STEPS[stepIdx].emoji}</div>
            <div>
              <div className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-3">{COMPASSION_STEPS[stepIdx].label}</div>
              <p className="font-heading text-xl text-white leading-relaxed max-w-xs">{COMPASSION_STEPS[stepIdx].text}</p>
            </div>
            <div className="text-white/30 text-sm">{timeLeft}s</div>
          </div>
          <div className="px-6 pb-10 flex justify-center">
            <button className="text-white/25 text-xs border border-white/10 px-5 py-2 rounded-xl">Pausar</button>
          </div>
        </div>
      )}

      {done && (
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <div className="text-5xl mb-5">🌸</div>
          <h2 className="font-heading text-2xl font-bold text-white mb-3">Práctica completada</h2>
          <p className="text-white/60 text-sm leading-relaxed mb-8 max-w-xs">Mereces todo el cuidado que das a los demás. La práctica regular reduce el ánimo bajo y la autocrítica en 6–8 semanas.</p>
          <p className="font-semibold text-white mb-4">¿Cómo te sientes?</p>
          <div className="flex gap-3">
            {['Mejor 😊', 'Igual 😐', 'Peor 😔'].map(opt => (
              <button key={opt} onClick={() => handleRate(opt)}
                className={`px-4 py-2.5 rounded-2xl text-sm font-semibold border transition-all ${rating === opt ? 'bg-white text-[#4A1942] border-white' : 'border-white/30 text-white'}`}>
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── SESSION: Journaling guiado ───────────────────────────────────────────────
const JOURNALING_PROMPTS = [
  { id: 1, text: '¿Qué está siendo difícil para ti ahora mismo, sin juzgarlo?', hint: 'Escribe libremente. No hay respuestas correctas. Nadie va a leer esto.', minutes: 3 },
  { id: 2, text: '¿Qué necesitas hoy que quizás no te estás dando?', hint: 'Puede ser descanso, reconocimiento, tiempo, conexión...', minutes: 3 },
  { id: 3, text: 'Escríbete algo amable sobre cómo estás navegando todo esto.', hint: 'Como le escribirías a una amiga que está pasando por lo mismo.', minutes: 4 },
]

function JournalingSession({ onComplete, onExit }) {
  const [promptIdx, setPromptIdx] = useState(0)
  const [answers, setAnswers] = useState(['', '', ''])
  const [timeLeft, setTimeLeft] = useState(JOURNALING_PROMPTS[0].minutes * 60)
  const [done, setDone] = useState(false)
  const [rating, setRating] = useState(null)
  const timerRef = useRef(null)

  useEffect(() => () => clearInterval(timerRef.current), [])

  useEffect(() => {
    if (done) return
    setTimeLeft(JOURNALING_PROMPTS[promptIdx].minutes * 60)
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [promptIdx, done])

  const goNext = () => {
    if (promptIdx + 1 >= JOURNALING_PROMPTS.length) {
      setDone(true)
    } else {
      setPromptIdx(p => p + 1)
    }
  }

  const handleRate = (r) => { setRating(r); setTimeout(() => onComplete(r), 800) }
  const mins = Math.floor(timeLeft / 60)
  const secs = timeLeft % 60
  const progress = ((promptIdx + 1) / JOURNALING_PROMPTS.length) * 100

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gradient-to-b from-[#1A2942] to-[#0D1B2E]">
      <div className="flex items-center justify-between px-5 pt-14 pb-4">
        <button onClick={onExit} className="text-white/60 flex items-center gap-1 text-sm">
          <ChevronLeft size={18} /> Mis rutinas
        </button>
        <span className="text-white/40 text-sm">{mins}:{secs.toString().padStart(2, '0')}</span>
      </div>

      {!done && (
        <div className="flex-1 flex flex-col px-6">
          <div className="h-1 bg-white/10 rounded-full overflow-hidden mb-6">
            <div className="h-full bg-white/50 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-4">
            Reflexión {promptIdx + 1} de {JOURNALING_PROMPTS.length} · {JOURNALING_PROMPTS[promptIdx].minutes} min
          </div>
          <p className="font-heading text-xl font-bold text-white mb-2 leading-snug">
            {JOURNALING_PROMPTS[promptIdx].text}
          </p>
          <p className="text-white/40 text-xs mb-5">{JOURNALING_PROMPTS[promptIdx].hint}</p>
          <textarea
            value={answers[promptIdx]}
            onChange={e => {
              const next = [...answers]
              next[promptIdx] = e.target.value
              setAnswers(next)
            }}
            rows={8}
            placeholder="Escribe aquí..."
            className="flex-1 bg-white/10 text-white placeholder-white/20 rounded-2xl p-4 text-sm resize-none outline-none focus:bg-white/15 transition-colors leading-relaxed"
          />
          <button onClick={goNext}
            className="mt-5 mb-8 w-full py-3.5 rounded-2xl bg-white text-[#1A2942] font-bold text-base">
            {promptIdx + 1 < JOURNALING_PROMPTS.length ? 'Siguiente reflexión' : 'Completar'}
          </button>
        </div>
      )}

      {done && (
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <div className="text-5xl mb-5">📓</div>
          <h2 className="font-heading text-2xl font-bold text-white mb-3">Journaling completado</h2>
          <p className="text-white/60 text-sm leading-relaxed mb-8 max-w-xs">Escribir sobre las emociones reduce su intensidad y mejora la claridad mental. La práctica regular tiene efecto similar a la psicoterapia para el procesamiento emocional.</p>
          <p className="font-semibold text-white mb-4">¿Cómo te sientes?</p>
          <div className="flex gap-3">
            {['Mejor 😊', 'Igual 😐', 'Peor 😔'].map(opt => (
              <button key={opt} onClick={() => handleRate(opt)}
                className={`px-4 py-2.5 rounded-2xl text-sm font-semibold border transition-all ${rating === opt ? 'bg-white text-[#1A2942] border-white' : 'border-white/30 text-white'}`}>
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Emotional practices menu ─────────────────────────────────────────────────
const EMOTIONAL_PRACTICES = [
  { id: 'breathing478', emoji: '🌬️', name: 'Respiración 4-7-8', duration: '8 min', type: 'Con voz', typeColor: '#b84289', purpose: 'Para sofocos y ansiedad hormonal' },
  { id: 'bodyscan', emoji: '🫧', name: 'Escáner corporal MBSR', duration: '15 min', type: 'Con voz', typeColor: '#b84289', purpose: 'Para dolor articular y mejorar el sueño' },
  { id: 'journaling', emoji: '📓', name: 'Journaling guiado', duration: '10 min', type: 'Escritura', typeColor: '#10B981', purpose: 'Para procesar emociones y niebla mental' },
  { id: 'anchoring', emoji: '🌿', name: 'Anclaje 5-4-3-2-1', duration: '6 min', type: 'Con voz', typeColor: '#b84289', purpose: 'Para niebla mental y ansiedad aguda' },
  { id: 'compassion', emoji: '🌸', name: 'Compasión hacia una misma', duration: '12 min', type: 'Con voz', typeColor: '#b84289', purpose: 'Para ánimo bajo y autocrítica' },
]

function EmotionalPracticesMenu({ onSelect, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
      <div className="bg-[#FAF9F7] rounded-t-3xl w-full max-w-lg max-h-[85vh] flex flex-col">
        <div className="bg-white px-5 pt-5 pb-4 border-b border-gray-100 rounded-t-3xl flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading text-base font-bold text-[#1A1A1A]">Práctica emocional</h2>
              <p className="text-xs text-[#444444] mt-0.5">Elige la práctica que más necesitas hoy</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <X size={16} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {EMOTIONAL_PRACTICES.map(p => (
            <button key={p.id} onClick={() => { onClose(); onSelect(p.id) }}
              className="w-full card p-4 text-left hover:shadow transition-all active:scale-[0.99]">
              <div className="flex items-center gap-3">
                <span className="text-2xl flex-shrink-0">{p.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="font-semibold text-sm text-[#1A1A1A]">{p.name}</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md"
                      style={{ backgroundColor: p.typeColor + '18', color: p.typeColor }}>
                      {p.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-[#666666]">
                    <span>{p.duration}</span>
                    <span>·</span>
                    <span>{p.purpose}</span>
                  </div>
                </div>
                <ChevronDown size={14} className="text-[#666666] flex-shrink-0 -rotate-90" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Movement config + exercise checklist ────────────────────────────────────
const EXERCISE_SETS = {
  '10_casa': [
    { id: 1, name: 'Rotaciones de cuello', reps: '5 círculos / dirección', desc: 'Círculos lentos de cuello hacia ambos lados. Sin forzar el rango de movimiento.', why: 'Libera la tensión cervical acumulada, especialmente frecuente en trabajo de pantalla.', emoji: '🔄' },
    { id: 2, name: 'Movilidad de cadera', reps: '45 seg / lado', desc: 'De pie, traza círculos amplios con la cadera. Manos en la cintura, rodillas ligeramente flexionadas.', why: 'Mantiene la movilidad articular de cadera, que disminuye con la caída de estrógenos.', emoji: '🔄' },
    { id: 3, name: 'Flexión lateral de tronco', reps: '30 seg / lado', desc: 'Brazo por encima de la cabeza, inclínate suavemente hacia el lado opuesto. Mantén sin rebotar.', why: 'Estira los músculos intercostales y la cadena lateral — reduce la rigidez matutina.', emoji: '🧘' },
    { id: 4, name: 'Respiración diafragmática de cierre', reps: '2 min', desc: 'Sentada o de pie. Inhala 4 seg por la nariz, exhala 6 seg por la boca. Mano en el abdomen.', why: 'Activa el nervio vago y reduce el cortisol post-ejercicio en 8-12%.', emoji: '🌬️' },
  ],
  '20_esterilla': [
    { id: 1, name: 'Wall sit (sentadilla isométrica)', reps: '3 × 20-30 seg', desc: 'Espalda apoyada en la pared, rodillas a 90°. Mantén sin bajar más si hay dolor articular.', why: 'Activa cuádriceps sin impacto articular. Clave para preservar masa ósea de cadera.', emoji: '🦵' },
    { id: 2, name: 'Puente de glúteos', reps: '3 × 12 rep', desc: 'Tumbada boca arriba, pies en el suelo. Eleva la cadera controlado, sin forzar la zona lumbar.', why: 'Fortalece suelo pélvico y glúteo mayor. Reduce el riesgo de incontinencia urinaria.', emoji: '🌉' },
    { id: 3, name: 'Superman', reps: '2 × 10 rep', desc: 'Boca abajo en esterilla. Eleva brazos y piernas a la vez simultáneamente. Sostén 2 seg arriba.', why: 'Fortalece el erector espinal. Previene la cifosis postural frecuente en postmenopausia.', emoji: '🦸' },
    { id: 4, name: 'Curl de bíceps', reps: '3 × 10 rep · 1-2 kg', desc: 'Peso 1-2 kg. Codo pegado al cuerpo, sube y baja controlado en 2 seg cada dirección.', why: 'Mantiene masa muscular del tren superior, que cae un 1-2% anual sin entrenamiento.', emoji: '💪' },
    { id: 5, name: 'Respiración de cierre', reps: '2 min', desc: 'Tendida en savasana. Escaneo corporal breve. Siente el peso del cuerpo sobre la esterilla.', why: 'Reduce el cortisol post-ejercicio y mejora la recuperación muscular.', emoji: '🌬️' },
  ],
  '30_gimnasio': [
    { id: 1, name: 'Prensa de piernas', reps: '3 × 12 rep', desc: 'Ajusta el rango al confort articular. Peso moderado, fase excéntrica (bajada) controlada en 3 seg.', why: 'Alternativa a sentadilla libre cuando hay dolor de rodilla. Mismo estímulo óseo y muscular.', emoji: '🦵' },
    { id: 2, name: 'Remo en máquina', reps: '3 × 12 rep', desc: 'Espalda recta, junta las escápulas al final de cada repetición. Sin balanceo de tronco.', why: 'Fortalece la musculatura postural de espalda media. Contrarresta la postura de oficina.', emoji: '💪' },
    { id: 3, name: 'Hip thrust en banco', reps: '3 × 12 rep', desc: 'Hombros apoyados en banco, pies en el suelo. Empuja la cadera hacia arriba y aprieta glúteos arriba.', why: 'El ejercicio con mayor activación de glúteo medio — crítico para la salud de cadera en menopausia.', emoji: '🌉' },
    { id: 4, name: 'Press de hombros', reps: '3 × 10 rep · 2-4 kg', desc: 'Sentada o de pie con mancuernas 2-4 kg. Empuja verticalmente sin arquear la zona lumbar.', why: 'Mantiene la masa muscular del tren superior y mejora la densidad ósea de hombros.', emoji: '🏋️' },
    { id: 5, name: 'Plancha anterior', reps: '3 × 20-30 seg', desc: 'Apoya antebrazos y puntas de pie. Cuerpo recto como una tabla. Sin elevar caderas ni hundir la zona lumbar.', why: 'Activa el core profundo que estabiliza la columna y reduce el dolor lumbar crónico.', emoji: '⬛' },
    { id: 6, name: 'Estiramientos de cierre', reps: '5 min', desc: 'Cadena posterior (isquios), caderas y hombros. Mantén 30 seg en cada posición sin rebotar.', why: 'La flexibilidad decrece con la menopausia — dedicar 5 min al estiramiento reduce lesiones.', emoji: '🧘' },
  ],
  '45_aire': [
    { id: 1, name: 'Caminata rápida', reps: '25 min · zona 2', desc: 'Paso enérgico, brazos en movimiento. Zona 2: puedes hablar frases cortas pero con esfuerzo.', why: 'El ejercicio en zona 2 mejora el metabolismo graso y la salud cardiovascular sin desgaste articular.', emoji: '🚶' },
    { id: 2, name: 'Sentadillas en banco del parque', reps: '3 × 10 rep', desc: 'Usa un banco del parque como guía. Baja hasta rozarlo, sube controlado apretando glúteos.', why: 'El entrenamiento de fuerza al aire libre tiene efecto adicional sobre el estado de ánimo por exposición a luz natural.', emoji: '🌲' },
    { id: 3, name: 'Step-ups alternos', reps: '2 × 10 por pierna', desc: 'Sube con un pie al banco del parque, baja controlado. Alterna piernas en cada repetición.', why: 'Trabaja glúteo e isquios de forma funcional. Mejora el equilibrio, que decrece en postmenopausia.', emoji: '🪜' },
    { id: 4, name: 'Estiramientos al aire libre', reps: '8 min', desc: 'Cuádriceps, isquiotibiales, caderas y pantorrillas. Apóyate en el banco o árbol si necesitas.', why: 'El estiramiento post-aeróbico al aire libre reduce la rigidez articular del día siguiente.', emoji: '🌿' },
  ],
}

const ROUTINE_META = {
  '10_casa': { title: 'Movilidad rápida en casa', subtitle: '4 ejercicios · Sin material' },
  '20_esterilla': { title: 'Fuerza funcional con esterilla', subtitle: '5 ejercicios · Esterilla en casa' },
  '30_gimnasio': { title: 'Sesión de fuerza en gimnasio', subtitle: '6 ejercicios · Gimnasio' },
  '45_aire': { title: 'Actívate al aire libre', subtitle: '4 bloques · Aire libre' },
}

const TIME_OPTIONS = ['10', '20', '30', '45', '+60']
const LOCATION_OPTIONS = [
  { key: 'casa', label: 'Casa sin material', emoji: '🏠' },
  { key: 'esterilla', label: 'Casa con esterilla', emoji: '🧘' },
  { key: 'gimnasio', label: 'Gimnasio', emoji: '🏋️' },
  { key: 'aire', label: 'Aire libre', emoji: '🌿' },
]

function MovementConfigView({ onStart, onClose }) {
  const [time, setTime] = useState('20')
  const [location, setLocation] = useState('esterilla')
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
      <div className="bg-[#FAF9F7] rounded-t-3xl w-full max-w-lg flex flex-col">
        <div className="bg-white px-5 pt-5 pb-4 border-b border-gray-100 rounded-t-3xl flex-shrink-0">
          <button onClick={onClose} className="flex items-center gap-1 text-[#b84289] font-semibold text-sm mb-3">
            <ChevronLeft size={16} />
            <span>Mis rutinas</span>
          </button>
          <div>
            <h2 className="font-heading text-base font-bold text-[#1A1A1A]">Configura tu sesión</h2>
            <p className="text-xs text-[#444444] mt-0.5">Te adaptamos los ejercicios</p>
          </div>
        </div>
        <div className="px-5 py-5 space-y-5">
          <div>
            <p className="text-xs font-semibold text-[#444444] mb-2">¿Cuánto tiempo tienes?</p>
            <div className="flex gap-2">
              {TIME_OPTIONS.map(t => (
                <button key={t} onClick={() => setTime(t)}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold border-2 transition-all ${time === t ? 'border-[#b84289] bg-[#b84289]/5 text-[#b84289]' : 'border-gray-200 text-[#444444]'}`}>
                  {t} min
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#444444] mb-2">¿Dónde estás?</p>
            <div className="grid grid-cols-2 gap-2">
              {LOCATION_OPTIONS.map(l => (
                <button key={l.key} onClick={() => setLocation(l.key)}
                  className={`py-3 rounded-xl text-xs font-semibold border-2 transition-all flex items-center justify-center gap-2 ${location === l.key ? 'border-[#b84289] bg-[#b84289]/5 text-[#b84289]' : 'border-gray-200 text-[#444444]'}`}>
                  {l.emoji} {l.label}
                </button>
              ))}
            </div>
          </div>
          <button onClick={() => onStart(time, location)}
            className="w-full py-3.5 rounded-2xl gradient-primary text-white font-bold text-sm">
            Ver mi sesión de hoy
          </button>
        </div>
      </div>
    </div>
  )
}

function ExerciseChecklistView({ time, location, onComplete, onClose }) {
  const t = parseInt(time) || 20
  const timeKey = t <= 10 ? '10' : t <= 20 ? '20' : t <= 30 ? '30' : '45'
  const key = `${timeKey}_${location}`
  const meta = ROUTINE_META[key] || ROUTINE_META['20_esterilla']
  const [exercises, setExercises] = useState((EXERCISE_SETS[key] || EXERCISE_SETS['20_esterilla']).map(e => ({ ...e, done: false })))
  const [confetti, setConfetti] = useState(false)
  const allDone = exercises.every(e => e.done)

  const toggle = (id) => {
    setExercises(ex => {
      const updated = ex.map(e => e.id === id ? { ...e, done: !e.done } : e)
      if (updated.every(e => e.done)) setConfetti(true)
      return updated
    })
  }

  const doneCount = exercises.filter(e => e.done).length

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
      <div className="bg-[#FAF9F7] rounded-t-3xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="bg-white px-5 pt-5 pb-4 border-b border-gray-100 rounded-t-3xl flex-shrink-0">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="font-heading text-base font-bold text-[#1A1A1A]">{meta.title}</h2>
              <p className="text-xs text-[#444444] mt-0.5">{meta.subtitle}</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <X size={16} />
            </button>
          </div>
          {/* Progress bar */}
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#b84289] rounded-full transition-all duration-500"
              style={{ width: `${exercises.length > 0 ? (doneCount / exercises.length) * 100 : 0}%` }} />
          </div>
          <p className="text-[10px] text-[#666666] mt-1">{doneCount}/{exercises.length} ejercicios completados</p>
        </div>

        {confetti && allDone ? (
          <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
            <div className="text-5xl mb-4">✨</div>
            <h3 className="font-heading text-xl font-bold text-[#1A1A1A] mb-2">¡Sesión completada!</h3>
            <p className="text-sm text-[#444444] leading-relaxed mb-6">Tu cuerpo lo ha notado.</p>
            <button onClick={onComplete} className="w-full py-3.5 rounded-2xl gradient-primary text-white font-bold text-sm">
              ← Volver a Mis rutinas
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {exercises.map(ex => (
                <button key={ex.id} onClick={() => toggle(ex.id)}
                  className={`w-full card p-4 text-left transition-all ${ex.done ? 'opacity-60' : ''}`}>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0">{ex.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className={`font-semibold text-sm mb-0.5 ${ex.done ? 'line-through text-[#444444]' : 'text-[#1A1A1A]'}`}>{ex.name}</div>
                      <div className="text-[10px] font-bold text-[#b84289] mb-1">{ex.reps}</div>
                      <p className="text-xs text-[#444444] leading-relaxed mb-1.5">{ex.desc}</p>
                      {ex.why && (
                        <span className="inline-block text-[10px] bg-[#f9eef5] text-[#b84289] px-2 py-1 rounded-lg mt-1 leading-relaxed">{ex.why}</span>
                      )}
                    </div>
                    {ex.done
                      ? <CheckCircle2 size={22} className="text-[#b84289] flex-shrink-0 mt-0.5" />
                      : <Circle size={22} className="text-gray-200 flex-shrink-0 mt-0.5" />
                    }
                  </div>
                </button>
              ))}
            </div>
            <div className="px-5 py-4 bg-white border-t border-gray-100">
              <button onClick={onClose} className="w-full py-2.5 rounded-2xl border border-gray-200 text-[#b84289] text-xs font-semibold">
                ← Volver a Mis rutinas
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Weekly overview ──────────────────────────────────────────────────────────
function WeeklyView({ routineCompletions }) {
  const [selectedDay, setSelectedDay] = useState(null)
  const today = new Date()
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today); d.setDate(today.getDate() - (6 - i))
    return { date: fmt(d), label: DAY_NAMES_SHORT[d.getDay()], isToday: i === 6, dow: d.getDay() }
  })

  const streak = calcStreak(routineCompletions)

  const ALL_HABIT_IDS = ['sleep', 'movement', 'nutrition', 'emotional', 'supplement']
  const getPct = (date) => {
    const comp = routineCompletions[date] || {}
    const done = ALL_HABIT_IDS.filter(h => comp[h]).length
    return Math.min(100, Math.round((done / ALL_HABIT_IDS.length) * 100))
  }

  const dotColor = (pct) => pct >= 75 ? '#10B981' : pct >= 50 ? '#F59E0B' : '#D1D5DB'

  return (
    <div className="space-y-5">
      {streak > 0 && (
        <div className="card p-4 flex items-center gap-3">
          <Flame size={24} className="text-orange-500" />
          <div>
            <div className="font-bold text-[#1A1A1A]">{streak} {streak === 1 ? 'día' : 'días'} seguidos</div>
            <div className="text-xs text-[#444444]">¡Sigue así! La consistencia es la clave.</div>
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="font-heading text-sm font-semibold text-[#1A1A1A] mb-4">Esta semana</h3>
        <div className="flex gap-2">
          {days.map(day => {
            const pct = getPct(day.date)
            return (
              <button key={day.date}
                onClick={() => setSelectedDay(selectedDay === day.date ? null : day.date)}
                className={`flex-1 flex flex-col items-center gap-2 p-2 rounded-2xl transition-all ${day.isToday ? 'bg-[#b84289]/10' : selectedDay === day.date ? 'bg-gray-100' : ''}`}
              >
                <span className={`text-xs font-medium ${day.isToday ? 'text-[#b84289]' : 'text-[#444444]'}`}>{day.label}</span>
                <div className="w-full">
                  <div className="h-1 bg-gray-100 rounded-full overflow-hidden mb-1.5">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: dotColor(pct) }} />
                  </div>
                </div>
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: dotColor(pct) }} />
                <span className="text-[10px] text-[#666666]">{pct}%</span>
              </button>
            )
          })}
        </div>
      </div>

      {selectedDay && (() => {
        const day = days.find(d => d.date === selectedDay)
        if (!day) return null
        const comp = routineCompletions[selectedDay] || {}
        const habits = getHabitsForDay(day.dow)
        return (
          <div className="card p-5">
            <h3 className="font-heading text-sm font-semibold text-[#1A1A1A] mb-3">
              {DAY_NAMES[day.dow]} {day.isToday ? '(hoy)' : ''}
            </h3>
            <div className="space-y-3">
              {habits.map(habit => (
                <div key={habit.id} className="flex items-center gap-3">
                  <span className="text-lg">{habit.emoji}</span>
                  <span className="flex-1 text-sm text-[#444444]">{habit.label}</span>
                  {comp[habit.id]
                    ? <CheckCircle2 size={18} className="text-[#10B981]" />
                    : <Circle size={18} className="text-gray-200" />
                  }
                </div>
              ))}
            </div>
          </div>
        )
      })()}
    </div>
  )
}

// ─── Main Routines component ──────────────────────────────────────────────────
export default function Routines() {
  const { userProfile, routineCompletions, completeHabit, uncompleteHabit, rateSession } = useApp()
  const [view, setView] = useState('today')
  const [activeSession, setActiveSession] = useState(null)
  const [expandedNutrition, setExpandedNutrition] = useState(false)
  const [practiceCompletions, setPracticeCompletions] = useState(() => {
    try {
      const raw = localStorage.getItem(`herya_practices_${todayStr()}`)
      return raw ? JSON.parse(raw) : {}
    } catch { return {} }
  })
  const [showMovementConfig, setShowMovementConfig] = useState(false)
  const [showExerciseChecklist, setShowExerciseChecklist] = useState(false)
  const [movementTime, setMovementTime] = useState('20')
  const [movementLocation, setMovementLocation] = useState('esterilla')
  const [supplementChecked, setSupplementChecked] = useState(() => {
    try {
      const raw = localStorage.getItem(`herya_supplements_${todayStr()}`)
      return raw ? JSON.parse(raw) : []
    } catch { return [] }
  })

  const today = todayStr()
  const now = new Date()
  const dow = now.getDay()
  const habits = getHabitsForDay(dow)
  const todayComp = routineCompletions[today] || {}

  const handleToggle = (habitId) => {
    if (todayComp[habitId]) uncompleteHabit(today, habitId)
    else completeHabit(today, habitId)
  }

  const handleSessionComplete = (sessionId, rating) => {
    rateSession(`${sessionId}_${today}`, rating)
    completeHabit(today, 'emotional')
    setActiveSession(null)
  }

  const handleMovementStart = (time, location) => {
    setMovementTime(time)
    setMovementLocation(location)
    setShowMovementConfig(false)
    setShowExerciseChecklist(true)
  }

  const handleMovementComplete = () => {
    completeHabit(today, 'movement')
    setShowExerciseChecklist(false)
  }

  const handleStartPractice = (practiceId) => {
    const newComps = { ...practiceCompletions, [practiceId]: true }
    setPracticeCompletions(newComps)
    try { localStorage.setItem(`herya_practices_${today}`, JSON.stringify(newComps)) } catch {}
    completeHabit(today, 'emotional')
    setActiveSession(practiceId)
  }

  const handleSupplementToggle = (suppId) => {
    const newChecked = supplementChecked.includes(suppId)
      ? supplementChecked.filter(id => id !== suppId)
      : [...supplementChecked, suppId]
    setSupplementChecked(newChecked)
    try { localStorage.setItem(`herya_supplements_${today}`, JSON.stringify(newChecked)) } catch {}
    if (newChecked.length > 0) completeHabit(today, 'supplement')
    else uncompleteHabit(today, 'supplement')
  }

  const ALL_HABIT_IDS = ['sleep', 'movement', 'nutrition', 'emotional', 'supplement']
  const done = ALL_HABIT_IDS.filter(h => todayComp[h]).length
  const total = ALL_HABIT_IDS.length

  return (
    <div className="px-4 py-6 pb-28">
      <div className="pt-8 mb-5">
        <h1 className="font-heading text-2xl font-bold text-[#1A1A1A]">Mis rutinas</h1>
        <p className="text-[#444444] text-sm mt-1">
          {DAY_NAMES[dow]}, {now.getDate()} de {MONTH_NAMES[now.getMonth()]}
        </p>
      </div>

      <div className="flex bg-gray-100 rounded-2xl p-1 mb-5">
        {['today', 'week'].map(v => (
          <button key={v} onClick={() => setView(v)}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${view === v ? 'bg-white shadow-sm text-[#1A1A1A]' : 'text-[#444444]'}`}>
            {v === 'today' ? <><Calendar size={14} /> Hoy</> : <><Flame size={14} /> Esta semana</>}
          </button>
        ))}
      </div>

      {view === 'today' && (
        <div className="space-y-4">
          {/* Progress */}
          <div className="card p-4 flex items-center gap-4">
            <div className="relative w-14 h-14 flex-shrink-0">
              <svg className="w-14 h-14 -rotate-90">
                <circle cx="28" cy="28" r="22" fill="none" stroke="#E5E7EB" strokeWidth="5" />
                <circle cx="28" cy="28" r="22" fill="none" stroke="#b84289" strokeWidth="5"
                  strokeDasharray={2 * Math.PI * 22}
                  strokeDashoffset={total > 0 ? 2 * Math.PI * 22 * (1 - done / total) : 2 * Math.PI * 22}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-[#1A1A1A]">{done}/{total}</span>
              </div>
            </div>
            <div>
              <div className="font-semibold text-[#1A1A1A]">
                {done === 0 ? 'Empieza tu rutina' : done === total ? '¡Todo completado! 🎉' : `${total - done} ${total - done === 1 ? 'hábito restante' : 'hábitos restantes'}`}
              </div>
              <div className="text-xs text-[#444444] mt-0.5">{DAY_NAMES[dow]} · Semana {Math.max(1, Object.keys(routineCompletions).length)}</div>
            </div>
          </div>

          {/* Habit cards */}
          {habits.map(habit => {
            const isDone = !!todayComp[habit.id]
            const isNutrition = habit.id === 'nutrition'
            return (
              <div key={habit.id} className={`card p-5 transition-all ${isDone ? 'opacity-80' : ''}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 text-xl ${isDone ? 'bg-green-50' : 'bg-gray-50'}`}>
                    {habit.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-semibold text-sm mb-1 ${isDone ? 'line-through text-[#444444]' : 'text-[#1A1A1A]'}`}>
                      {habit.label}
                    </div>
                    <p className="text-xs text-[#444444] leading-relaxed">{habit.text}</p>
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      {habit.duration && (
                        <span className="text-[10px] text-[#666666] font-medium">⏱ {habit.duration}</span>
                      )}
                      {habit.id === 'movement' && !isDone && (
                        <button onClick={() => setShowMovementConfig(true)}
                          className="text-[10px] font-semibold text-[#b84289] border border-[#b84289]/30 px-2 py-1 rounded-lg">
                          Iniciar sesión de movimiento
                        </button>
                      )}
                      {isNutrition && (
                        <button
                          onClick={() => {
                            setExpandedNutrition(e => !e)
                            if (!isDone) completeHabit(today, 'nutrition')
                          }}
                          className="text-[10px] font-semibold text-[#10B981] border border-[#10B981]/30 px-2 py-1 rounded-lg flex items-center gap-1"
                        >
                          {expandedNutrition ? <><ChevronUp size={10} /> Menos detalle</> : <><ChevronDown size={10} /> Ver plan completo</>}
                        </button>
                      )}
                    </div>
                    {isNutrition && expandedNutrition && (
                      <NutritionDetail data={habit.detail} userProfile={userProfile} />
                    )}
                    {habit.id === 'emotional' && (
                      <div className="mt-3 flex flex-col gap-2.5">
                        {EMOTIONAL_PRACTICES.map(p => {
                          const practiceDone = practiceCompletions[p.id]
                          return (
                            <div key={p.id} className={`rounded-2xl p-3 transition-all ${practiceDone ? 'bg-[#b84289]/5 border border-[#b84289]/20' : 'bg-gray-50'}`}>
                              <div className="flex items-center gap-2.5">
                                <span className="text-lg flex-shrink-0">{p.emoji}</span>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="text-xs font-semibold text-[#1A1A1A]">{p.name}</span>
                                    {practiceDone && <CheckCircle2 size={13} className="text-[#b84289] flex-shrink-0" />}
                                  </div>
                                  <div className="text-[10px] text-[#666666] mt-0.5">{p.duration} · {p.purpose}</div>
                                </div>
                                <button
                                  onClick={() => handleStartPractice(p.id)}
                                  className="text-[10px] font-bold text-[#b84289] border border-[#b84289]/30 px-2 py-1.5 rounded-xl flex-shrink-0"
                                >
                                  {practiceDone ? 'Repetir' : 'Iniciar'}
                                </button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                    {habit.id === 'supplement' && (
                      <div className="mt-3 space-y-2">
                        {SUPPLEMENTS.map(s => (
                          <button key={s.id} onClick={() => handleSupplementToggle(s.id)}
                            className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all text-left ${supplementChecked.includes(s.id) ? 'bg-green-50' : 'bg-gray-50'}`}>
                            <span className="text-base">{s.emoji}</span>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-semibold text-[#1A1A1A]">{s.label}</div>
                              <div className="text-[10px] text-[#666666]">{s.dose}</div>
                            </div>
                            {supplementChecked.includes(s.id)
                              ? <CheckCircle2 size={18} className="text-[#10B981] flex-shrink-0" />
                              : <Circle size={18} className="text-gray-200 flex-shrink-0" />
                            }
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <button onClick={() => handleToggle(habit.id)} className="flex-shrink-0 mt-0.5 active:scale-95 transition-transform">
                    {isDone
                      ? <CheckCircle2 size={24} className="text-[#10B981]" />
                      : <Circle size={24} className="text-gray-200" />
                    }
                  </button>
                </div>
              </div>
            )
          })}

        </div>
      )}

      {view === 'week' && <WeeklyView routineCompletions={routineCompletions} />}

      {activeSession === 'breathing478' && <Breathing478 onComplete={(r) => handleSessionComplete('breathing478', r)} onExit={() => setActiveSession(null)} />}
      {activeSession === 'bodyscan' && <BodyScan onComplete={(r) => handleSessionComplete('bodyscan', r)} onExit={() => setActiveSession(null)} />}
      {activeSession === 'boxbreathing' && <BoxBreathing onComplete={(r) => handleSessionComplete('boxbreathing', r)} onExit={() => setActiveSession(null)} />}
      {activeSession === 'anchoring' && <Anchoring54321 onComplete={(r) => handleSessionComplete('anchoring', r)} onExit={() => setActiveSession(null)} />}
      {activeSession === 'journaling' && <JournalingSession onComplete={(r) => handleSessionComplete('journaling', r)} onExit={() => setActiveSession(null)} />}
      {activeSession === 'compassion' && <SelfCompassion onComplete={(r) => handleSessionComplete('compassion', r)} onExit={() => setActiveSession(null)} />}

      {showMovementConfig && (
        <MovementConfigView
          onStart={handleMovementStart}
          onClose={() => setShowMovementConfig(false)}
        />
      )}

      {showExerciseChecklist && (
        <ExerciseChecklistView
          time={movementTime}
          location={movementLocation}
          onComplete={handleMovementComplete}
          onClose={() => setShowExerciseChecklist(false)}
        />
      )}
    </div>
  )
}
