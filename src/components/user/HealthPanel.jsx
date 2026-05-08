import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LineChart, Line, ResponsiveContainer, Tooltip,
  XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts'
import { ArrowRight, AlertCircle, ChevronDown, ChevronUp, Briefcase, Activity, Lock, RefreshCw, Salad, FileText, Scale, X, Sparkles } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { getSeverityInfo, getTopSymptoms, MOVEMENT_DAYS, EMOTIONAL_DAYS, SYMPTOM_RECOMMENDATIONS, MOCK_WEEKLY_HISTORY, DOCTOR_PROFILE } from '../../data/mockData'

function getGreeting(name) {
  const h = new Date().getHours()
  if (h < 13) return `Buenos días, ${name}`
  if (h < 21) return `Buenas tardes, ${name}`
  return `Buenas noches, ${name}`
}

function ProgressRing({ done, total, size = 100 }) {
  const r = 40; const stroke = 8
  const circumference = 2 * Math.PI * r
  const pct = total === 0 ? 0 : done / total
  const offset = circumference * (1 - pct)
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <defs>
        <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#b84289" />
          <stop offset="100%" stopColor="#7b2d6e" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r={r} fill="none" stroke="#E5E7EB" strokeWidth={stroke} />
      <circle cx="50" cy="50" r={r} fill="none" stroke="url(#ringGrad)" strokeWidth={stroke}
        strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
        transform="rotate(-90 50 50)" style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
      <text x="50" y="44" textAnchor="middle" fontSize="18" fontWeight="700" fill="#1A1A1A">{done}</text>
      <text x="50" y="60" textAnchor="middle" fontSize="10" fill="#444444">de {total}</text>
    </svg>
  )
}

function getTrendMessage(weeklyLogs) {
  if (weeklyLogs.length < 4) return { text: 'Sigue registrando para ver tu tendencia.', positive: true }
  const recent = weeklyLogs.slice(-3).map(l => l.totalScore)
  const older = weeklyLogs.slice(-6, -3).map(l => l.totalScore)
  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length
  const olderAvg = older.reduce((a, b) => a + b, 0) / older.length
  const delta = recentAvg - olderAvg
  if (delta < -1) return { text: 'Llevas semanas con tendencia positiva. Sigue así.', positive: true }
  if (delta > 1) return { text: 'Esta semana ha sido más difícil. Los síntomas fluctúan. Tu plan sigue activo.', positive: false }
  return { text: 'Tu puntuación se mantiene estable. Revisemos tus hábitos esta semana.', positive: null }
}

function getTodayHabitCount(routineCompletions) {
  const today = new Date().toISOString().split('T')[0]
  const dow = new Date().getDay()
  const relevant = ['sleep', 'nutrition', ...(MOVEMENT_DAYS.includes(dow) ? ['movement'] : []), ...(EMOTIONAL_DAYS.includes(dow) ? ['emotional'] : [])]
  const total = relevant.length
  const todayDone = routineCompletions[today] || {}
  const done = relevant.filter(h => todayDone[h]).length
  return { done, total }
}

// ── Medical recommendation for top symptom ────────────────────────────────────
function MedicalRecommendation({ symptomId }) {
  const [expanded, setExpanded] = useState(false)
  const rec = SYMPTOM_RECOMMENDATIONS[symptomId]
  if (!rec) return null

  return (
    <div className="card p-5 border-l-4 border-[#b84289]">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{rec.emoji}</span>
          <div>
            <div className="text-xs font-bold text-[#b84289] uppercase tracking-wide">Recomendación médica</div>
            <div className="font-semibold text-sm text-[#1A1A1A]">{rec.title}</div>
          </div>
        </div>
        <button onClick={() => setExpanded(e => !e)} className="text-[#666666] flex-shrink-0">
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {/* Causa — always visible */}
      <div className="bg-[#b84289]/5 rounded-xl p-3 mb-3">
        <p className="text-xs text-[#b84289] font-semibold mb-1">¿Por qué ocurre?</p>
        <p className="text-xs text-[#1A1A1A] leading-relaxed">{rec.cause}</p>
      </div>

      {expanded && (
        <>
          {/* Protocol */}
          <div className="mb-3">
            <p className="text-xs font-semibold text-[#1A1A1A] mb-2">Protocolo específico para hoy:</p>
            <div className="space-y-1.5">
              {rec.protocol.map((step, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <div className="w-4 h-4 rounded-full bg-[#b84289]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[9px] font-bold text-[#b84289]">{i + 1}</span>
                  </div>
                  <p className="text-xs text-[#444444] leading-relaxed flex-1">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Supplement */}
          <div className="bg-green-50 rounded-xl p-3 mb-3">
            <p className="text-[10px] font-bold text-green-700 mb-1">💊 Suplementación</p>
            <p className="text-xs text-green-800 leading-relaxed">{rec.supplement}</p>
          </div>

          {/* Escalate */}
          <div className="bg-amber-50 rounded-xl p-3">
            <p className="text-[10px] font-bold text-amber-700 mb-1">⚕️ Cuándo hablar con tu ginecóloga</p>
            <p className="text-xs text-amber-800 leading-relaxed">{rec.escalate}</p>
          </div>
        </>
      )}

      {!expanded && (
        <button onClick={() => setExpanded(true)} className="text-xs text-[#b84289] font-semibold flex items-center gap-1">
          Ver protocolo completo <ChevronDown size={12} />
        </button>
      )}
    </div>
  )
}

const ONBOARDING_STEPS = [
  { emoji: '🩺', title: 'Entiende tu etapa',      desc: 'Tu perfil muestra síntomas, puntuación y evolución. Ya estás registrada.', cta: null },
  { emoji: '📋', title: 'Registra cómo estás',    desc: 'El check-in semanal tarda 2 minutos y construye tu historial de síntomas.', cta: 'tracking' },
  { emoji: '💪', title: 'Elige una cosa hoy',     desc: 'Una rutina de movimiento o una práctica de sueño ya marca la diferencia.', cta: 'routines' },
  { emoji: '📄', title: 'Tu informe médico',      desc: 'Genera un resumen listo para llevar a tu ginecóloga con un clic.', cta: 'informe' },
  { emoji: '✨', title: 'Tu plan completo',        desc: '6 pilares de bienestar: movimiento, nutrición, sueño, mente y más.', cta: 'plan' },
]

function OnboardingModal({ onClose }) {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const current = ONBOARDING_STEPS[step]

  function handleCta() {
    onClose()
    if (current.cta) navigate(`/user/${current.cta}`)
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-4 md:p-6">
      <div className="bg-white rounded-3xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-heading text-base font-bold text-[#1A1A1A]">Primeros pasos</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <X size={16} />
          </button>
        </div>

        <div className="flex gap-1.5 mb-6">
          {ONBOARDING_STEPS.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= step ? 'bg-[#b84289]' : 'bg-gray-200'}`} />
          ))}
        </div>

        <div className="text-center px-2 mb-7">
          <div className="text-5xl mb-4">{current.emoji}</div>
          <h4 className="font-heading text-lg font-bold text-[#1A1A1A] mb-2">{current.title}</h4>
          <p className="text-sm text-[#444444] leading-relaxed">{current.desc}</p>
        </div>

        <div className="flex gap-2">
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)}
              className="flex-1 py-3 rounded-2xl border border-gray-200 text-sm font-semibold text-[#444444]">
              Anterior
            </button>
          )}
          {step < ONBOARDING_STEPS.length - 1 ? (
            <button onClick={() => setStep(s => s + 1)}
              className="flex-1 py-3 gradient-primary text-white font-semibold rounded-2xl">
              Siguiente
            </button>
          ) : (
            <button onClick={handleCta}
              className="flex-1 py-3 gradient-primary text-white font-semibold rounded-2xl">
              Ver mi plan completo
            </button>
          )}
        </div>

        {current.cta && step < ONBOARDING_STEPS.length - 1 && (
          <button onClick={handleCta} className="w-full mt-2 py-2 text-xs text-[#b84289] font-medium">
            Ir ahora →
          </button>
        )}
      </div>
    </div>
  )
}

export default function HealthPanel() {
  const navigate = useNavigate()
  const { userProfile, weeklyLogs, routineCompletions } = useApp()
  const [showOnboarding, setShowOnboarding] = useState(false)

  if (!userProfile) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center px-6">
        <p className="text-[#444444] mb-4">Completa el cuestionario para ver tu panel.</p>
        <button onClick={() => navigate('/user/assessment')} className="gradient-primary text-white px-6 py-3 rounded-2xl font-semibold">Empezar</button>
      </div>
    </div>
  )

  const isNewUser = weeklyLogs.length < 3
  const { done, total } = getTodayHabitCount(routineCompletions)
  const sev = getSeverityInfo(userProfile.totalScore)
  const topSymptoms = getTopSymptoms(userProfile.symptoms)
  const trend = getTrendMessage(weeklyLogs)
  const today = new Date().toISOString().split('T')[0]
  const hasCheckinToday = weeklyLogs.some(l => l.date === today)
  const weekNumber = Math.max(1, weeklyLogs.length)
  const latestLog = weeklyLogs[weeklyLogs.length - 1]

  const topSym = topSymptoms[0]
  const insightMap = {
    insomnio: 'Tu sueño sigue siendo el área con más margen de mejora esta semana.',
    cansancio: 'La niebla mental y el cansancio son tu prioridad. Mantén el movimiento suave diario.',
    problemasSexuales: 'Tu salud íntima es parte del plan. Los hábitos de suelo pélvico marcan diferencia.',
    dolorArticular: 'El dolor articular responde bien al movimiento suave y al omega-3 diario.',
    ansiedad: 'Tu sistema nervioso necesita regularidad. Las prácticas de respiración están en tu plan.',
    sofocos: 'Los sofocos mejoran con temperatura fresca y reducción de cafeína.',
    irritabilidad: 'La irritabilidad es hormonal, no de carácter. Tu plan incluye herramientas para regularla.',
  }
  const insight = insightMap[topSym?.id] || 'Consulta tu plan para las recomendaciones de esta semana.'
  const currentQoL = userProfile.qualityOfLife
  const fatigueDays = latestLog?.cansancio ?? userProfile.symptoms.cansancio ?? 0

  return (
    <div className="px-4 lg:px-8 py-6 space-y-5 pb-28 lg:pb-10">
      {/* Header */}
      <div className="pt-10 flex items-center justify-between">
        <div>
          <p className="text-[#444444] text-sm">{getGreeting(userProfile.name)}</p>
          <h1 className="font-heading text-2xl lg:text-3xl font-bold text-[#1A1A1A]">Tu salud hoy</h1>
        </div>
        <button onClick={() => navigate('/')} className="text-xs text-[#444444] border border-gray-200 px-3 py-1.5 rounded-xl">
          Cambiar vista
        </button>
      </div>

      {/* Today snapshot */}
      <div className="card p-5">
        <div className="flex items-center gap-5">
          <ProgressRing done={done} total={total} size={100} />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-[#b84289] uppercase tracking-wide mb-1">Semana {weekNumber} de tu plan</div>
            <div className="font-heading text-lg font-bold text-[#1A1A1A] mb-1">
              {done === 0 ? 'Empieza tu rutina de hoy' : done === total ? '¡Rutina completada!' : `${done} de ${total} hábitos listos`}
            </div>
            <p className="text-xs text-[#444444] leading-relaxed">{insight}</p>
            <button onClick={() => navigate('/user/routines')} className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-[#b84289]">
              Ver rutina <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Onboarding card — shown for new users */}
      {isNewUser && (
        <button onClick={() => setShowOnboarding(true)}
          className="w-full card p-4 flex items-center gap-4 hover:shadow-card-hover transition-all active:scale-[0.99] text-left border-l-4 border-[#b84289]">
          <div className="w-11 h-11 rounded-2xl bg-[#b84289]/10 flex items-center justify-center flex-shrink-0">
            <Sparkles size={20} className="text-[#b84289]" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-sm text-[#1A1A1A]">¿No sabes por dónde empezar?</div>
            <div className="text-xs text-[#444444]">Guía de 5 pasos para sacar el máximo a Herya</div>
          </div>
          <ArrowRight size={16} className="text-[#666666]" />
        </button>
      )}

      {/* Check-in prompt */}
      {!hasCheckinToday && (
        <div className="card p-4 border-l-4 border-[#F59E0B] flex items-start gap-3">
          <AlertCircle size={18} className="text-[#F59E0B] flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="text-sm font-semibold text-[#1A1A1A]">Aún no has hecho tu check-in semanal</div>
            <div className="text-xs text-[#444444] mt-0.5">Tarda 2 minutos. Registrar cómo estás ayuda a ver tu progreso.</div>
          </div>
          <button onClick={() => navigate('/user/tracking')} className="gradient-primary text-white text-xs font-semibold px-3 py-2 rounded-xl flex-shrink-0">
            Hacer check-in
          </button>
        </div>
      )}

      {/* Medical recommendation for top symptom */}
      {topSym && SYMPTOM_RECOMMENDATIONS[topSym.id] && (
        <MedicalRecommendation symptomId={topSym.id} />
      )}

      {/* Mi Día planner shortcut */}
      <button
        onClick={() => navigate('/user/myday')}
        className="w-full card p-4 flex items-center gap-4 hover:shadow-card-hover transition-all active:scale-[0.99]"
      >
        <div className="w-11 h-11 rounded-2xl bg-[#F59E0B]/10 flex items-center justify-center flex-shrink-0">
          <Briefcase size={20} className="text-[#F59E0B]" />
        </div>
        <div className="flex-1 text-left">
          <div className="font-semibold text-sm text-[#1A1A1A]">Mi Día</div>
          <div className="text-xs text-[#444444]">Planifica tus tareas según tu energía histórica</div>
        </div>
        <ArrowRight size={16} className="text-[#666666]" />
      </button>

      {/* More tools grid */}
      <div>
        <h2 className="font-heading text-base font-semibold text-[#1A1A1A] mb-3">Más herramientas</h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { to: '/user/bienestar', icon: Activity, label: 'Bienestar Activo', desc: 'Actividades para tu bienestar físico', color: '#10B981', bg: '#ECFDF5' },
            { to: '/user/salud-intima', icon: Lock, label: 'Salud Íntima', desc: 'Privada · No en informes', color: '#b84289', bg: '#f9eef5', badge: '🔒' },
            { to: '/user/mi-ciclo', icon: RefreshCw, label: 'Mi Ciclo', desc: 'Registro de períodos', color: '#EF4444', bg: '#FEF2F2' },
            { to: '/user/nutricion', icon: Salad, label: 'Nutrición', desc: 'Micronutrientes y compra', color: '#F59E0B', bg: '#FFFBEB' },
            { to: '/user/informe', icon: FileText, label: 'Informe Médico', desc: 'Exportar para consulta', color: '#b84289', bg: '#f9eef5' },
            { to: '/user/mi-cuerpo', icon: Scale, label: 'Mi Cuerpo', desc: 'Peso y cambios hormonales', color: '#b84289', bg: '#f9eef5' },
          ].map(({ to, icon: Icon, label, desc, color, bg, badge }) => (
            <button key={to} onClick={() => navigate(to)}
              className="card p-4 text-left hover:shadow active:scale-[0.98] transition-all">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bg }}>
                  <Icon size={15} style={{ color }} />
                </div>
                {badge && <span className="text-xs">{badge}</span>}
              </div>
              <div className="font-semibold text-xs text-[#1A1A1A] mb-0.5">{label}</div>
              <div className="text-[10px] text-[#666666] leading-tight">{desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Symptom evolution — 8-week chart */}
      <div className="card p-5">
        <h2 className="font-heading text-base font-semibold text-[#1A1A1A] mb-1">Evolución de tus síntomas y bienestar (últimas 8 semanas)</h2>
        <p className="text-xs text-[#444444] mb-3">Intensidad por semana (0–4). Tendencia a la baja = mejoría.</p>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={MOCK_WEEKLY_HISTORY} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis dataKey="week" tick={{ fontSize: 9, fill: '#666666' }} />
            <YAxis domain={[0, 4]} ticks={[0, 1, 2, 3, 4]} tick={{ fontSize: 9, fill: '#666666' }} />
            <Tooltip
              contentStyle={{ fontSize: 11, borderRadius: 12, border: '1px solid #F3F4F6' }}
              formatter={(value, name) => [`${value}/4`, name]}
            />
            <Legend wrapperStyle={{ fontSize: 10, paddingTop: 8 }} iconType="circle" iconSize={7} />
            <Line type="monotone" dataKey="insomnio" name="Insomnio" stroke="#b84289" strokeWidth={2} dot={{ r: 2 }} />
            <Line type="monotone" dataKey="cansancio" name="Cansancio" stroke="#F59E0B" strokeWidth={2} dot={{ r: 2 }} />
            <Line type="monotone" dataKey="sofocos" name="Sofocos" stroke="#EF4444" strokeWidth={2} dot={{ r: 2 }} />
            <Line type="monotone" dataKey="dolorArticular" name="Dolor articular" stroke="#10B981" strokeWidth={2} dot={{ r: 2 }} />
            <Line type="monotone" dataKey="ansiedad" name="Ansiedad" stroke="#b84289" strokeWidth={2} dot={{ r: 2 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Medical team backup card */}
      <div className="border border-gray-200 rounded-2xl p-4 bg-white">
        <p className="text-[10px] font-bold text-[#666666] uppercase tracking-wide mb-3">Tu equipo médico de respaldo</p>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-[#b84289]/10 flex items-center justify-center flex-shrink-0 text-sm font-bold text-[#b84289]">
            {DOCTOR_PROFILE.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm text-[#1A1A1A]">{DOCTOR_PROFILE.name}</div>
            <div className="text-[10px] text-[#666666]">{DOCTOR_PROFILE.specialty}</div>
          </div>
        </div>
        <p className="text-xs text-[#444444] leading-relaxed mb-3">Tu plan está supervisado por especialistas. Consulta cuando lo necesites.</p>
        <div className="flex gap-2">
          <button onClick={() => navigate('/user/citas')} className="flex-1 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-[#444444] hover:bg-gray-50 transition-all">Ver equipo</button>
          <button onClick={() => navigate('/user/citas')} className="flex-1 py-2 rounded-xl border border-[#b84289]/30 text-xs font-semibold text-[#b84289] hover:bg-[#b84289]/5 transition-all">Agendar consulta</button>
        </div>
      </div>

      {/* Wellbeing score */}
      <div className="card p-5">
        <h2 className="font-heading text-base font-semibold text-[#1A1A1A] mb-4">Tu bienestar</h2>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center p-3 rounded-2xl" style={{ backgroundColor: sev.bgColor }}>
            <div className="font-heading text-2xl font-bold" style={{ color: sev.color }}>{latestLog?.totalScore ?? userProfile.totalScore}</div>
            <div className="text-[10px] text-[#444444] mt-0.5">Puntuación</div>
            <div className="text-[10px] font-medium" style={{ color: sev.color }}>/40</div>
          </div>
          <div className="text-center p-3 rounded-2xl bg-blue-50">
            <div className="font-heading text-2xl font-bold text-[#b84289]">{currentQoL}</div>
            <div className="text-[10px] text-[#444444] mt-0.5">Calidad de vida</div>
            <div className="text-[10px] font-medium text-[#b84289]">/10</div>
          </div>
          <div className="text-center p-3 rounded-2xl bg-gray-50">
            <div className="font-heading text-2xl font-bold text-[#1A1A1A]">{fatigueDays}</div>
            <div className="text-[10px] text-[#444444] mt-0.5">Cansancio</div>
            <div className="text-[10px] font-medium text-[#444444]">/4 hoy</div>
          </div>
        </div>
        <div className={`rounded-2xl p-3 flex items-start gap-2 ${trend.positive === true ? 'bg-green-50' : trend.positive === false ? 'bg-red-50' : 'bg-amber-50'}`}>
          <span className="text-base flex-shrink-0 mt-0.5">{trend.positive === true ? '📈' : trend.positive === false ? '💙' : '📊'}</span>
          <p className="text-xs leading-relaxed" style={{ color: trend.positive === true ? '#065F46' : trend.positive === false ? '#991B1B' : '#92400E' }}>
            {trend.text}
          </p>
        </div>
      </div>
      {showOnboarding && <OnboardingModal onClose={() => setShowOnboarding(false)} />}
    </div>
  )
}
