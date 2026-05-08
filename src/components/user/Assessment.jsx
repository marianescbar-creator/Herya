import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, Heart } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { SYMPTOMS_LIST, RATING_LABELS, getSeverityInfo } from '../../data/mockData'

const STAGES = ['Aún no noto cambios', 'Perimenopausia', 'Menopausia', 'Postmenopausia', 'No estoy segura']
const WORK_OPTIONS = ['Trabajo por cuenta ajena', 'Trabajo por cuenta propia', 'No trabajo actualmente']
const AGE_OPTIONS = ['<45', '45-49', '50-54', '55-59', '60-64', '65+']
const MANAGEMENT_OPTIONS = [
  'Suplementos naturales', 'Cambios en dieta', 'Ejercicio específico',
  'Tratamiento hormonal (THS)', 'Psicología o terapia', 'Cremas o tratamientos locales', 'Nada por ahora',
]
const DOCTOR_OPTIONS = ['Sí', 'No', 'En proceso']

const defaultSymptoms = Object.fromEntries(SYMPTOMS_LIST.map(s => [s.id, 0]))

export default function Assessment() {
  const navigate = useNavigate()
  const { saveProfile } = useApp()
  const [step, setStep] = useState(0)

  const [profile, setProfile] = useState({ name: '', age: '', stage: '', work: '' })
  const [symptoms, setSymptoms] = useState(defaultSymptoms)
  const [habits, setHabits] = useState({ management: [], qualityOfLife: 5, hasSpokenToDoctor: '' })
  const [result, setResult] = useState(null)

  const totalScore = Object.values(symptoms).reduce((a, b) => a + b, 0)
  const [displayScore, setDisplayScore] = useState(0)

  useEffect(() => {
    if (step !== 3 || !result) return
    setDisplayScore(0)
    let current = 0
    const target = result.score
    const interval = setInterval(() => {
      current += 1
      setDisplayScore(current)
      if (current >= target) clearInterval(interval)
    }, 50)
    return () => clearInterval(interval)
  }, [step, result])

  const handleSubmit = () => {
    const score = Object.values(symptoms).reduce((a, b) => a + b, 0)
    const fullProfile = {
      ...profile,
      symptoms,
      totalScore: score,
      management: habits.management,
      qualityOfLife: habits.qualityOfLife,
      hasSpokenToDoctor: habits.hasSpokenToDoctor,
      completedAt: new Date().toISOString(),
    }
    saveProfile(fullProfile)
    setResult({ score, profile: fullProfile })
    setStep(3)
  }

  const toggleManagement = (item) => {
    setHabits(h => ({
      ...h,
      management: h.management.includes(item)
        ? h.management.filter(m => m !== item)
        : [...h.management, item],
    }))
  }

  const severity = result ? getSeverityInfo(result.score) : null

  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      {/* Header */}
      <div className="gradient-primary px-6 pt-14 pb-8">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => step > 0 && step < 3 ? setStep(s => s - 1) : navigate('/')}
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <ArrowLeft size={16} className="text-white" />
          </button>
          <div className="flex items-center gap-2">
            <Heart size={18} className="text-white" />
            <span className="text-white font-semibold">herya</span>
          </div>
        </div>

        {step < 3 && (
          <>
            <h1 className="font-heading text-2xl font-bold text-white mb-2">Cuéntanos cómo te encuentras</h1>
            <p className="text-white/80 text-sm">Este cuestionario nos permite crear tu plan personalizado</p>
            {/* Progress */}
            <div className="flex gap-2 mt-5">
              {[0, 1, 2].map(i => (
                <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i <= step ? 'bg-white' : 'bg-white/30'}`} />
              ))}
            </div>
            <p className="text-white/70 text-xs mt-2">Paso {step + 1} de 3</p>
          </>
        )}
        {step === 3 && (
          <h1 className="font-heading text-2xl font-bold text-white">Tu puntuación</h1>
        )}
      </div>

      <div className="px-6 py-8 max-w-lg mx-auto">
        {/* Step 0: Basic profile */}
        {step === 0 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Tu nombre</label>
              <input
                type="text"
                value={profile.name}
                onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                placeholder="¿Cómo te llamas?"
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white focus:outline-none focus:border-[#b84289] text-[#1A1A1A]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Edad</label>
              <div className="grid grid-cols-3 gap-2">
                {AGE_OPTIONS.map(a => (
                  <button key={a} onClick={() => setProfile(p => ({ ...p, age: a }))}
                    className={`py-2.5 rounded-xl text-sm font-medium transition-all border ${
                      profile.age === a
                        ? 'gradient-primary text-white border-transparent'
                        : 'bg-white text-[#444444] border-gray-200 hover:border-[#b84289]'
                    }`}>
                    {a}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Etapa hormonal</label>
              <div className="space-y-2">
                {STAGES.map(s => (
                  <button key={s} onClick={() => setProfile(p => ({ ...p, stage: s }))}
                    className={`w-full px-4 py-3 rounded-xl text-sm text-left transition-all border ${
                      profile.stage === s
                        ? 'border-[#b84289] bg-[#b84289]/5 text-[#b84289] font-medium'
                        : 'bg-white text-[#444444] border-gray-200'
                    }`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Situación laboral</label>
              <div className="space-y-2">
                {WORK_OPTIONS.map(w => (
                  <button key={w} onClick={() => setProfile(p => ({ ...p, work: w }))}
                    className={`w-full px-4 py-3 rounded-xl text-sm text-left transition-all border ${
                      profile.work === w
                        ? 'border-[#b84289] bg-[#b84289]/5 text-[#b84289] font-medium'
                        : 'bg-white text-[#444444] border-gray-200'
                    }`}>
                    {w}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep(1)}
              disabled={!profile.name || !profile.age || !profile.stage || !profile.work}
              className="w-full py-4 rounded-2xl gradient-primary text-white font-semibold disabled:opacity-40 flex items-center justify-center gap-2"
            >
              Guardar y continuar <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* Step 1: Symptoms */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-heading text-xl font-semibold text-[#1A1A1A] mb-1">Evaluación de síntomas</h2>
              <p className="text-[#444444] text-sm">Valora la intensidad de cada síntoma en las últimas 2 semanas</p>
            </div>

            <div className="space-y-5">
              {SYMPTOMS_LIST.map((symptom, idx) => (
                <div key={symptom.id} className="card p-4">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-sm font-medium text-[#1A1A1A] pr-4">{symptom.label}</span>
                    <span className="text-xs font-bold text-[#b84289] whitespace-nowrap">
                      {RATING_LABELS[symptoms[symptom.id]]}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {[0, 1, 2, 3, 4].map(val => (
                      <button
                        key={val}
                        onClick={() => setSymptoms(s => ({ ...s, [symptom.id]: val }))}
                        className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
                          symptoms[symptom.id] === val
                            ? 'gradient-primary text-white'
                            : 'bg-gray-100 text-[#444444] hover:bg-gray-200'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-[10px] text-[#666666]">Nada</span>
                    <span className="text-[10px] text-[#666666]">Muy severo</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="card p-4 flex items-center justify-between">
              <span className="text-sm font-medium text-[#1A1A1A]">Puntuación actual</span>
              <span className="font-heading text-2xl font-bold gradient-text">{totalScore}/40</span>
            </div>

            <button onClick={() => setStep(2)}
              className="w-full py-4 rounded-2xl gradient-primary text-white font-semibold flex items-center justify-center gap-2">
              Guardar y continuar <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* Step 2: Habits */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-heading text-xl font-semibold text-[#1A1A1A] mb-1">Hábitos y contexto</h2>
              <p className="text-[#444444] text-sm">Cuéntanos qué estás haciendo actualmente para gestionar tus síntomas</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-3">¿Qué estás haciendo actualmente? (selecciona todo lo que aplique)</label>
              <div className="flex flex-wrap gap-2">
                {MANAGEMENT_OPTIONS.map(item => (
                  <button key={item} onClick={() => toggleManagement(item)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium transition-all border ${
                      habits.management.includes(item)
                        ? 'gradient-primary text-white border-transparent'
                        : 'bg-white text-[#444444] border-gray-200'
                    }`}>
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-3">
                ¿Cómo valorarías tu calidad de vida en los últimos 3 meses?
                <span className="ml-2 font-bold text-[#b84289]">{habits.qualityOfLife}/10</span>
              </label>
              <input
                type="range" min={0} max={10} value={habits.qualityOfLife}
                onChange={e => setHabits(h => ({ ...h, qualityOfLife: +e.target.value }))}
                className="w-full accent-[#b84289]"
              />
              <div className="flex justify-between text-xs text-[#666666] mt-1">
                <span>0 — Muy mala</span>
                <span>10 — Excelente</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-3">¿Has hablado con tu médica sobre estos síntomas?</label>
              <div className="flex gap-2">
                {DOCTOR_OPTIONS.map(opt => (
                  <button key={opt} onClick={() => setHabits(h => ({ ...h, hasSpokenToDoctor: opt }))}
                    className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all border ${
                      habits.hasSpokenToDoctor === opt
                        ? 'gradient-primary text-white border-transparent'
                        : 'bg-white text-[#444444] border-gray-200'
                    }`}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleSubmit}
              className="w-full py-4 rounded-2xl gradient-primary text-white font-semibold flex items-center justify-center gap-2">
              Ver mis resultados <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* Step 3: Result */}
        {step === 3 && result && (() => {
          const sev = getSeverityInfo(result.score)
          const isEarlyStage = result.profile.stage === 'Aún no noto cambios'
          const isSevere = result.score >= 16
          return (
            <div className="space-y-6">
              {/* Score card */}
              <div className="card p-6 text-center">
                <div className="text-[#444444] text-sm mb-2">Tu puntuación total</div>
                <div className="font-heading text-6xl font-bold gradient-text mb-1">{displayScore}</div>
                <div className="text-[#444444] text-lg">/40</div>
                <div className="mt-4 mb-4">
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${(displayScore / 40) * 100}%`, background: sev.color }}
                    />
                  </div>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
                  style={{ backgroundColor: sev.bgColor, color: sev.textColor }}>
                  Carga {sev.label}
                </div>
              </div>

              {/* Contextual message */}
              <div className="card p-5" style={{ borderLeft: `4px solid ${sev.color}` }}>
                <p className="text-[#1A1A1A] text-sm leading-relaxed">
                  {isEarlyStage
                    ? 'Este es el mejor momento para prepararte. Las mujeres que llegan informadas a esta etapa la viven mejor.'
                    : isSevere
                    ? 'Lo que sientes es real y tiene nombre. No tienes que normalizarlo ni aguantarlo sola.'
                    : sev.description}
                </p>
              </div>

              {/* Stage message */}
              <div className="card p-5 bg-gradient-to-br from-[#b84289]/5 to-[#b84289]/5">
                <div className="text-xs font-semibold text-[#b84289] uppercase tracking-wide mb-2">Tu etapa</div>
                <div className="font-semibold text-[#1A1A1A]">{result.profile.stage}</div>
                <div className="text-[#444444] text-sm mt-1">
                  Plan personalizado preparado · Semana 1
                </div>
              </div>

              <button
                onClick={() => navigate('/user/health')}
                className="w-full py-4 rounded-2xl gradient-primary text-white font-semibold flex items-center justify-center gap-2"
              >
                <Check size={18} /> Ver mi plan
              </button>
            </div>
          )
        })()}
      </div>
    </div>
  )
}
