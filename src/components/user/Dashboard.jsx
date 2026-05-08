import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Circle, ArrowRight, ChevronRight } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts'
import { useApp } from '../../context/AppContext'
import { getSeverityInfo, getTopSymptoms, SYMPTOMS_LIST } from '../../data/mockData'

const DAILY_ACTIONS = [
  { id: 'sleep', icon: '🌙', title: 'Rutina de sueño', desc: 'Prepara tu dormitorio a 18°C y sin pantallas 1h antes' },
  { id: 'walk', icon: '🚶‍♀️', title: 'Caminata 30 min', desc: 'Sal a caminar a ritmo moderado hoy' },
  { id: 'mindful', icon: '🧘‍♀️', title: 'Mindfulness 10 min', desc: 'Practica respiración consciente o meditación guiada' },
]

const getLifeAreas = (symptoms) => {
  const s = symptoms || {}
  return [
    { name: 'Sueño', value: Math.round(((s.insomnio || 0) / 4) * 100), color: '#b84289' },
    { name: 'Físico', value: Math.round((((s.dolorArticular || 0) + (s.sofocos || 0)) / 8) * 100), color: '#b84289' },
    { name: 'Emocional', value: Math.round((((s.animoBajo || 0) + (s.irritabilidad || 0) + (s.ansiedad || 0)) / 12) * 100), color: '#F59E0B' },
    { name: 'Trabajo', value: Math.round((((s.cansancio || 0) + (s.insomnio || 0)) / 8) * 100), color: '#EF4444' },
    { name: 'Intimidad', value: Math.round(((s.problemasSexuales || 0) / 4) * 100), color: '#10B981' },
  ]
}

const SYMPTOM_TIPS = {
  insomnio: 'Mantén horarios de sueño fijos. La regularidad regula el ritmo circadiano.',
  cansancio: 'Divide tareas grandes en bloques de 25 min (técnica Pomodoro) para gestionar la niebla mental.',
  problemasSexuales: 'El uso regular de lubricante reduce la microinflamación y el malestar.',
  dolorArticular: 'El yoga suave y los omega-3 han mostrado eficacia para reducir la rigidez matutina.',
  sofocos: 'Mantén el dormitorio a 16-19°C y usa ropa de cama transpirable.',
  ansiedad: 'La respiración 4-7-8 (inhala 4s, aguanta 7s, exhala 8s) activa el nervio vago.',
  irritabilidad: 'El ejercicio aeróbico libera endorfinas y reduce la reactividad emocional.',
  animoBajo: 'La exposición a luz natural por la mañana regula la serotonina y el ritmo circadiano.',
  palpitaciones: 'Reduce el consumo de cafeína y alcohol, que pueden desencadenar episodios.',
  problemasUrinarios: 'Los ejercicios de Kegel practicados 3x/día mejoran el control vesical en 6-8 semanas.',
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { userProfile, checkedActions, toggleAction } = useApp()

  if (!userProfile) return (
    <div className="p-6 text-center">
      <p className="text-[#444444]">No hay perfil. <button onClick={() => navigate('/user/assessment')} className="text-[#b84289]">Completar cuestionario</button></p>
    </div>
  )

  const sev = getSeverityInfo(userProfile.totalScore)
  const topSymptoms = getTopSymptoms(userProfile.symptoms)
  const lifeAreas = getLifeAreas(userProfile.symptoms)
  const pct = Math.round((userProfile.totalScore / 40) * 100)

  return (
    <div className="px-4 py-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pt-8">
        <div>
          <p className="text-[#444444] text-sm">Hola, {userProfile.name} 👋</p>
          <h1 className="font-heading text-2xl font-bold text-[#1A1A1A]">Tu panel de salud</h1>
        </div>
        <button onClick={() => navigate('/')} className="text-xs text-[#444444] border border-gray-200 px-3 py-1.5 rounded-lg">
          Cambiar vista
        </button>
      </div>

      {/* Score card */}
      <div className="card p-5 gradient-primary text-white">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-white/70 text-xs font-medium uppercase tracking-wide mb-1">Puntuación de síntomas</div>
            <div className="flex items-baseline gap-1">
              <span className="font-heading text-5xl font-bold">{userProfile.totalScore}</span>
              <span className="text-white/60 text-lg">/40</span>
            </div>
            <div className="mt-1 text-sm font-medium">Carga {sev.label}</div>
          </div>
          <div className="text-right">
            <div className="text-white/70 text-xs mb-1">Etapa</div>
            <div className="text-sm font-semibold">{userProfile.stage}</div>
            <div className="text-white/60 text-xs mt-2">Semana 1 de tu plan</div>
          </div>
        </div>
        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-white rounded-full" style={{ width: `${pct}%` }} />
        </div>
        <div className="flex justify-between text-white/60 text-xs mt-1">
          <span>0</span>
          <span>40</span>
        </div>
      </div>

      {/* Top 3 symptoms */}
      <div>
        <h2 className="font-heading text-lg font-semibold text-[#1A1A1A] mb-3">Tus síntomas principales</h2>
        <div className="space-y-3">
          {topSymptoms.map(({ id, label, value }) => {
            const sevInfo = getSeverityInfo(value * (40 / 4))
            return (
              <div key={id} className="card p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-[#1A1A1A]">{label}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: sevInfo.bgColor, color: sevInfo.textColor }}>
                    {value}/4
                  </span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-2">
                  <div className="h-full rounded-full" style={{ width: `${(value / 4) * 100}%`, backgroundColor: sevInfo.color }} />
                </div>
                <p className="text-xs text-[#444444]">{SYMPTOM_TIPS[id] || 'Consulta tu plan personalizado para recomendaciones específicas.'}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Daily actions */}
      <div>
        <h2 className="font-heading text-lg font-semibold text-[#1A1A1A] mb-3">Plan de hoy</h2>
        <div className="space-y-3">
          {DAILY_ACTIONS.map(action => {
            const done = !!checkedActions[action.id]
            return (
              <button
                key={action.id}
                onClick={() => toggleAction(action.id)}
                className={`w-full card p-4 text-left transition-all ${done ? 'opacity-70' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-xl mt-0.5">{action.icon}</div>
                  <div className="flex-1">
                    <div className={`font-medium text-sm ${done ? 'line-through text-[#444444]' : 'text-[#1A1A1A]'}`}>
                      {action.title}
                    </div>
                    <div className="text-xs text-[#444444] mt-0.5">{action.desc}</div>
                  </div>
                  {done
                    ? <CheckCircle2 size={20} className="text-[#10B981] flex-shrink-0" />
                    : <Circle size={20} className="text-gray-200 flex-shrink-0" />
                  }
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Life areas chart */}
      <div>
        <h2 className="font-heading text-lg font-semibold text-[#1A1A1A] mb-3">Áreas afectadas</h2>
        <div className="card p-4">
          <p className="text-xs text-[#444444] mb-4">Impacto estimado en cada área de tu vida (% de afectación)</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={lifeAreas} layout="vertical" margin={{ left: 0, right: 16, top: 0, bottom: 0 }}>
              <XAxis type="number" domain={[0, 100]} tickFormatter={v => `${v}%`} tick={{ fontSize: 10, fill: '#666666' }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#444444' }} width={64} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {lifeAreas.map((area, i) => <Cell key={i} fill={area.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick link to plan */}
      <button onClick={() => navigate('/user/plan')}
        className="w-full card p-4 flex items-center justify-between hover:shadow-card-hover transition-all">
        <div>
          <div className="font-semibold text-[#1A1A1A] text-sm">Ver tu plan completo</div>
          <div className="text-xs text-[#444444] mt-0.5">4 categorías · recomendaciones personalizadas</div>
        </div>
        <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
          <ChevronRight size={16} className="text-white" />
        </div>
      </button>
    </div>
  )
}
