import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Download } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useApp } from '../../context/AppContext'
import {
  MOCK_WEEKLY_HISTORY, SYMPTOMS_LIST, DEMO_PROFILE, DEMO_CYCLE_DATA, getSeverityInfo,
} from '../../data/mockData'

const CHART_COLORS = ['#b84289', '#b84289', '#10B981', '#F59E0B', '#EF4444']
const NAVY = '#7b2d6e'
const RED = '#F87171'

const QUESTIONS_BY_SPECIALIST = [
  {
    specialist: 'Ginecóloga',
    color: '#b84289',
    questions: {
      insomnio: 'Llevo semanas con insomnio severo a pesar de hacer higiene del sueño. ¿Tiene sentido valorar progesterona micronizada?',
      sofocos: 'Mis sofocos son frecuentes e interrumpen el sueño. ¿Soy candidata para THS?',
      problemasSexuales: 'La sequedad vaginal y el dolor son persistentes. ¿Qué opciones de estrógeno local recomiendas?',
      palpitaciones: 'Tengo palpitaciones frecuentes que no siempre van con sofocos. ¿Vale la pena hacer un holter?',
    },
  },
  {
    specialist: 'Médico de cabecera',
    color: '#b84289',
    questions: {
      dolorArticular: 'El dolor articular no mejora con los cambios de hábito. ¿Debería descartar artritis reumatoide?',
      cansancio: 'La niebla mental no ha mejorado. ¿Tiene sentido pedir TSH y función tiroidea?',
      problemasUrinarios: 'Tengo episodios de urgencia urinaria frecuentes. ¿Qué evaluación inicial recomiendas?',
    },
  },
  {
    specialist: 'Psicóloga o psiquiatra',
    color: '#10B981',
    questions: {
      ansiedad: 'La ansiedad es nueva — empezó con los síntomas. ¿Soy candidata para TCC o THS?',
      animoBajo: 'El ánimo bajo persiste más de 2 semanas e interfiere con el trabajo. ¿Valoramos opciones?',
      irritabilidad: 'La irritabilidad está afectando mis relaciones. ¿Qué opciones hay más allá de los hábitos?',
    },
  },
]

function Droplet({ color = NAVY, size = 11 }) {
  return (
    <svg width={size} height={Math.round(size * 1.3)} viewBox="0 0 12 15" fill={color}>
      <path d="M6 0.5 C6 0.5, 11.5 6.5, 11.5 10.5 C11.5 13.2 9.0 14.8 6 14.8 C3.0 14.8 0.5 13.2 0.5 10.5 C0.5 6.5 6 0.5 6 0.5 Z" />
    </svg>
  )
}

function CycleDroplets({ level }) {
  if (level === 4) {
    return (
      <span className="flex items-center gap-0.5">
        <Droplet color={RED} /><Droplet color={RED} /><Droplet color={RED} />
      </span>
    )
  }
  return (
    <span className="flex items-center gap-0.5">
      {[0, 1, 2].map(i => <Droplet key={i} color={i < level ? NAVY : '#E5E7EB'} />)}
    </span>
  )
}

function SectionHeader({ number, title }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <div className="w-6 h-6 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
        <span className="text-white text-[10px] font-bold">{number}</span>
      </div>
      <h2 className="font-heading text-base font-semibold text-[#1A1A1A]">{title}</h2>
    </div>
  )
}

export default function InformeMedico() {
  const navigate = useNavigate()
  const { userProfile } = useApp()
  const profile = userProfile || DEMO_PROFILE
  const sev = getSeverityInfo(profile.totalScore)

  const history = MOCK_WEEKLY_HISTORY
  const chartData = history.map(w => ({
    sem: w.week,
    Insomnio: w.insomnio,
    Cansancio: w.cansancio,
    Sofocos: w.sofocos,
    'Dolor articular': w.dolorArticular,
    Ansiedad: w.ansiedad,
  }))

  const topSymptoms = Object.entries(profile.symptoms)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
    .map(([id, val]) => ({
      id, val,
      label: SYMPTOMS_LIST.find(s => s.id === id)?.label || id,
      initial: val,
      current: history[history.length - 1]?.[id] ?? val,
    }))

  const today = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
  const initialScore = history[0]?.totalScore ?? profile.totalScore
  const currentScore = history[history.length - 1]?.totalScore ?? profile.totalScore
  const delta = currentScore - initialScore

  const gaps = DEMO_CYCLE_DATA.filter(c => c.daysToNext).map(c => c.daysToNext)
  const avgGap = gaps.length ? Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length) : null
  const lastCycle = DEMO_CYCLE_DATA[DEMO_CYCLE_DATA.length - 1]

  const activeSymptomIds = topSymptoms.map(s => s.id)
  const suggestedGroups = QUESTIONS_BY_SPECIALIST
    .map(g => ({
      ...g,
      items: Object.entries(g.questions)
        .filter(([id]) => activeSymptomIds.includes(id))
        .map(([id, q]) => ({ id, q })),
    }))
    .filter(g => g.items.length > 0)

  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      <div className="gradient-primary px-4 pt-14 pb-5">
        <div className="flex items-center gap-3 mb-1">
          <button onClick={() => navigate('/user/health')} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <ArrowLeft size={16} className="text-white" />
          </button>
          <h1 className="font-heading text-xl font-bold text-white">Informe médico</h1>
        </div>
        <p className="text-white/70 text-xs ml-11">Generado el {today}</p>
      </div>

      <div className="px-4 py-4 pb-28 space-y-4">

        {/* 1. Datos generales */}
        <div className="card p-5">
          <SectionHeader number="1" title="Datos generales" />
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="bg-gray-50 rounded-2xl p-3">
              <div className="text-[10px] text-[#666666] mb-0.5">Paciente</div>
              <div className="text-sm font-semibold text-[#1A1A1A]">{profile.name}</div>
              <div className="text-[10px] text-[#444444]">{profile.age} años</div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-3">
              <div className="text-[10px] text-[#666666] mb-0.5">Etapa</div>
              <div className="text-sm font-semibold text-[#b84289]">{profile.stage}</div>
              <div className="text-[10px] text-[#444444]">{profile.work}</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-2xl p-3 text-center" style={{ backgroundColor: sev.bgColor }}>
              <div className="text-xs font-bold" style={{ color: sev.color }}>{currentScore}/40</div>
              <div className="text-[10px] text-[#666666] mt-0.5">{sev.label}</div>
            </div>
            <div className="rounded-2xl p-3 text-center bg-blue-50">
              <div className="text-xs font-bold text-[#b84289]">{delta <= 0 ? `↓${Math.abs(delta)}` : `↑${delta}`}</div>
              <div className="text-[10px] text-[#666666] mt-0.5">vs. inicio</div>
            </div>
            <div className="rounded-2xl p-3 text-center bg-purple-50">
              <div className="text-xs font-bold text-[#b84289]">{profile.qualityOfLife}/10</div>
              <div className="text-[10px] text-[#666666] mt-0.5">Calidad vida</div>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {profile.management.map((m, i) => (
              <span key={i} className="px-2 py-0.5 rounded-lg bg-[#b84289]/10 text-[10px] font-medium text-[#b84289]">{m}</span>
            ))}
          </div>
        </div>

        {/* 2. Síntomas últimas 4 semanas */}
        <div className="card p-5">
          <SectionHeader number="2" title="Síntomas · últimas 4 semanas" />
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 pr-3 text-[#666666] font-semibold">Síntoma</th>
                  <th className="text-center py-2 px-2 text-[#666666] font-semibold">Inicio</th>
                  <th className="text-center py-2 px-2 text-[#666666] font-semibold">Actual</th>
                  <th className="text-center py-2 pl-2 text-[#666666] font-semibold">Tendencia</th>
                </tr>
              </thead>
              <tbody>
                {topSymptoms.map(({ id, label, initial, current }) => {
                  const diff = current - initial
                  return (
                    <tr key={id} className="border-b border-gray-50">
                      <td className="py-2.5 pr-3 text-[#1A1A1A] font-medium leading-tight text-[11px]">{label.split(' (')[0]}</td>
                      <td className="py-2.5 px-2 text-center text-[#444444]">{initial}/4</td>
                      <td className="py-2.5 px-2 text-center font-bold text-[#1A1A1A]">{current}/4</td>
                      <td className="py-2.5 pl-2 text-center font-bold text-sm" style={{ color: diff < 0 ? '#10B981' : diff > 0 ? '#EF4444' : '#444444' }}>
                        {diff < 0 ? `↓${Math.abs(diff)}` : diff > 0 ? `↑${diff}` : '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <XAxis dataKey="sem" tick={{ fontSize: 9, fill: '#666666' }} />
              <YAxis domain={[0, 4]} tick={{ fontSize: 9, fill: '#666666' }} ticks={[0, 1, 2, 3, 4]} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 12 }} />
              <Legend wrapperStyle={{ fontSize: 9 }} iconSize={7} />
              {['Insomnio', 'Cansancio', 'Sofocos', 'Dolor articular'].map((key, i) => (
                <Line key={key} type="monotone" dataKey={key} stroke={CHART_COLORS[i]}
                  strokeWidth={2} dot={false} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 3. Ciclo menstrual */}
        <div className="card p-5">
          <SectionHeader number="3" title="Ciclo menstrual" />
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="bg-gray-50 rounded-2xl p-3 text-center">
              <div className="font-heading text-xl font-bold text-[#b84289]">{avgGap ?? '—'}</div>
              <div className="text-[10px] text-[#666666] mt-0.5">días de ciclo medio</div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-3 text-center">
              <div className="font-heading text-xl font-bold text-[#b84289]">{DEMO_CYCLE_DATA.length}</div>
              <div className="text-[10px] text-[#666666] mt-0.5">períodos en seguimiento</div>
            </div>
          </div>
          <div className="space-y-2 mb-3">
            {DEMO_CYCLE_DATA.map(c => {
              const d = new Date(c.startDate)
              const label = d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: '2-digit' })
              return (
                <div key={c.id} className="flex items-center gap-3 text-[11px]">
                  <span className="text-[#444444] w-20 flex-shrink-0">{label}</span>
                  <span className="text-[#666666] w-12 flex-shrink-0">{c.durationDays}d</span>
                  <div className="flex gap-1">
                    {c.intensity.map((lv, i) => <CycleDroplets key={i} level={lv} />)}
                  </div>
                  {c.note && <span className="text-[10px] text-[#666666] italic truncate">{c.note}</span>}
                </div>
              )
            })}
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-[10px] font-semibold text-[#1A1A1A] mb-1.5">Escala de intensidad:</p>
            <div className="flex flex-wrap gap-3">
              {[1, 2, 3].map(lv => (
                <div key={lv} className="flex items-center gap-1.5">
                  <CycleDroplets level={lv} />
                  <span className="text-[10px] text-[#444444]">{lv === 1 ? 'Leve' : lv === 2 ? 'Moderado' : 'Abundante'}</span>
                </div>
              ))}
              <div className="flex items-center gap-1.5">
                <CycleDroplets level={4} />
                <span className="text-[10px] text-[#F87171] font-semibold">Muy abundante · Con coágulos</span>
              </div>
            </div>
          </div>
          {avgGap && avgGap > 45 && (
            <div className="mt-3 bg-amber-50 rounded-xl p-3">
              <p className="text-[10px] text-amber-700 leading-relaxed">
                Ciclo medio de {avgGap} días. Los ciclos irregulares y largos son típicos en perimenopausia por producción ovárica fluctuante de estrógenos.
              </p>
            </div>
          )}
        </div>

        {/* 4. Sueño y energía */}
        <div className="card p-5">
          <SectionHeader number="4" title="Sueño y energía" />
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="bg-indigo-50 rounded-2xl p-3 text-center">
              <div className="font-heading text-xl font-bold text-[#b84289]">
                {history[history.length - 1]?.insomnio ?? profile.symptoms.insomnio}/4
              </div>
              <div className="text-[10px] text-[#666666] mt-0.5">Insomnio actual</div>
            </div>
            <div className="bg-amber-50 rounded-2xl p-3 text-center">
              <div className="font-heading text-xl font-bold text-[#F59E0B]">
                {history[history.length - 1]?.cansancio ?? profile.symptoms.cansancio}/4
              </div>
              <div className="text-[10px] text-[#666666] mt-0.5">Cansancio / niebla mental</div>
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px]">
              <span className="text-[#444444]">Horas de sueño estimadas</span>
              <span className="font-semibold text-[#1A1A1A]">5–6 h/noche</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-[#444444]">Despertares nocturnos frecuentes</span>
              <span className="font-semibold text-[#EF4444]">Sí</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-[#444444]">Sofocos nocturnos</span>
              <span className="font-semibold text-[#EF4444]">Sí — varias veces/semana</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-[#444444]">Gestión actual del sueño</span>
              <span className="font-semibold text-[#1A1A1A]">Higiene del sueño + rutinas</span>
            </div>
          </div>
        </div>

        {/* 5. Actividad física */}
        <div className="card p-5">
          <SectionHeader number="5" title="Actividad física" />
          <div className="space-y-2">
            <div className="flex justify-between text-[11px]">
              <span className="text-[#444444]">Frecuencia semanal de ejercicio</span>
              <span className="font-semibold text-[#1A1A1A]">2–3 días/semana</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-[#444444]">Tipo de actividad actual</span>
              <span className="font-semibold text-[#1A1A1A]">Yoga, caminata</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-[#444444]">Dolor articular al ejercicio</span>
              <span className="font-semibold text-[#F59E0B]">Sí — rodillas y caderas</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-[#444444]">Entrenamiento de fuerza</span>
              <span className="font-semibold text-[#EF4444]">No actualmente</span>
            </div>
          </div>
          <div className="mt-3 bg-blue-50 rounded-xl p-3">
            <p className="text-[10px] text-blue-700 leading-relaxed">
              El entrenamiento de fuerza 2×/semana es la intervención con mayor evidencia para preservar masa ósea y muscular en menopausia.
            </p>
          </div>
        </div>

        {/* 6. Preguntas sugeridas */}
        <div className="card p-5">
          <SectionHeader number="6" title="Preguntas para tu consulta" />
          <p className="text-xs text-[#444444] mb-4">Basadas en tus síntomas activos. Úsalas como guía — puedes adaptarlas con tus palabras.</p>
          <div className="space-y-4">
            {suggestedGroups.map(group => (
              <div key={group.specialist}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: group.color }} />
                  <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: group.color }}>{group.specialist}</span>
                </div>
                <div className="space-y-2 ml-4">
                  {group.items.map(({ id, q }, i) => (
                    <div key={id} className="rounded-2xl p-3" style={{ backgroundColor: group.color + '0D' }}>
                      <div className="flex items-start gap-2">
                        <span className="text-[9px] font-bold mt-0.5 flex-shrink-0" style={{ color: group.color }}>
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <p className="text-xs text-[#1A1A1A] leading-relaxed italic">"{q}"</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Export */}
        <div className="card p-5">
          <button className="w-full py-3.5 rounded-2xl gradient-primary text-white font-semibold text-sm flex items-center justify-center gap-2">
            <Download size={16} /> Preparar informe para mi consulta
          </button>
          <p className="text-[10px] text-[#666666] text-center mt-2 leading-relaxed">
            Útil para ginecóloga, médico de cabecera, nutricionista o cualquier especialista
          </p>
        </div>
      </div>
    </div>
  )
}
