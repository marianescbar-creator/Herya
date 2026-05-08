import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'
import { Download, TrendingDown, TrendingUp, Users, Zap, Shield, AlertTriangle, Thermometer } from 'lucide-react'
import { SEVERITY_DISTRIBUTION, STAGE_DISTRIBUTION, TOP_SYMPTOMS_COMPANY } from '../../data/mockData'

// ── Section 1: Executive KPIs ─────────────────────────────────────────────────
const EXEC_KPIS = [
  {
    icon: TrendingDown,
    iconColor: '#10B981',
    iconBg: '#ECFDF5',
    label: 'Productividad recuperada',
    value: '↑ 23%',
    valueColor: '#10B981',
    sub: 'reducción en días de fatiga severa',
    detail: 'De 3.8 → 2.1 días/semana por empleada',
  },
  {
    icon: Shield,
    iconColor: '#b84289',
    iconBg: '#f9eef5',
    label: 'Riesgo de rotación',
    value: '↓ Bajo',
    valueColor: '#10B981',
    sub: 'tendencia de mejora sostenida',
    detail: '8 semanas consecutivas de mejora en bienestar',
  },
  {
    icon: Users,
    iconColor: '#b84289',
    iconBg: '#f9eef5',
    label: 'Engagement con el programa',
    value: '78%',
    valueColor: '#b84289',
    sub: 'usuarias activas esta semana',
    detail: '37 de 47 empleadas han hecho check-in',
  },
  {
    icon: Zap,
    iconColor: '#F59E0B',
    iconBg: '#FFFBEB',
    label: 'Coste estimado evitado',
    value: '~€14.200',
    valueColor: '#F59E0B',
    sub: 'en presentismo este mes',
    detail: 'Reducción 1.7 días × 47 empleadas × €180/día',
  },
]

// ── Section 2: Work impact metrics ────────────────────────────────────────────
const WORK_METRICS = [
  {
    label: 'Días/semana con fatiga que afecta al trabajo',
    before: 3.8, after: 2.1, unit: 'días/sem',
    context: 'La fatiga es el síntoma que más impacta en tareas de alta concentración y toma de decisiones.',
    beforeLabel: '3.8', afterLabel: '2.1',
  },
  {
    label: 'Empleadas con dificultad de concentración frecuente',
    before: 57, after: 38, unit: '%',
    context: 'La niebla mental afecta especialmente a reuniones largas y trabajo con alta carga cognitiva.',
    beforeLabel: '57%', afterLabel: '38%',
  },
  {
    label: 'Empleadas que reportan sueño reparador',
    before: 31, after: 54, unit: '%',
    context: 'El sueño reparador es el predictor más fuerte de rendimiento laboral al día siguiente.',
    beforeLabel: '31%', afterLabel: '54%',
    positive: true,
  },
]

// ── Section 4: HR recommendations ─────────────────────────────────────────────
const HR_RECS = [
  {
    icon: '🕐',
    title: 'Flexibilidad horaria para el 31% con síntomas severos',
    text: 'Las empleadas con carga severa reportan mayor dificultad en las primeras horas de la mañana por trastornos del sueño. Una entrada flexible puede reducir el presentismo de forma inmediata.',
    effort: 'Impacto alto · Esfuerzo bajo',
    color: '#b84289',
  },
  {
    icon: '🗣️',
    title: 'Formación a managers: cómo tener la conversación',
    text: 'El 73% de tus empleadas prefiere no hablar del tema en el trabajo. Una sesión de 2h para managers reduce el estigma y aumenta la adopción del programa.',
    effort: 'Impacto alto · Esfuerzo medio',
    color: '#b84289',
  },
  {
    icon: '🌡️',
    title: 'Control térmico en espacios de trabajo',
    text: 'Los sofocos son disruptivos en reuniones y espacios compartidos. Ventiladores de escritorio o control de temperatura en salas es la adaptación más valorada.',
    effort: 'Impacto medio · Esfuerzo bajo',
    color: '#10B981',
  },
]

const RADIAN = Math.PI / 180
const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.07) return null
  const r = innerRadius + (outerRadius - innerRadius) * 0.5
  return (
    <text x={cx + r * Math.cos(-midAngle * RADIAN)} y={cy + r * Math.sin(-midAngle * RADIAN)}
      fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight="600">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

const MetricTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white rounded-2xl p-3 shadow-card border border-gray-100 text-xs">
      <p className="font-semibold text-[#1A1A1A] mb-1">{label}</p>
      {payload.map((e, i) => <p key={i} style={{ color: e.fill }}>
        {e.name}: {e.value}{e.name === 'Inicio' || e.name === 'Ahora' ? '%' : ''}
      </p>)}
    </div>
  )
}

export default function WellbeingReport() {
  // Top 3 symptoms for company
  const top3Symptoms = TOP_SYMPTOMS_COMPANY.slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#1A1A1A]">Informe de bienestar</h1>
          <p className="text-[#444444] text-sm mt-1">Abril 2026 · TechCorp España · 47 empleadas</p>
        </div>
        <button className="flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-xl text-sm font-medium text-[#444444] hover:bg-gray-50 transition-colors flex-shrink-0">
          <Download size={15} />
          <span className="hidden sm:inline">Descargar</span>
        </button>
      </div>

      {/* Section 1: Executive KPIs */}
      <div>
        <h2 className="font-heading text-base font-semibold text-[#1A1A1A] mb-3">Resumen ejecutivo</h2>
        <div className="grid grid-cols-2 gap-3">
          {EXEC_KPIS.map((kpi, i) => {
            const Icon = kpi.icon
            return (
              <div key={i} className="card p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: kpi.iconBg }}>
                    <Icon size={16} style={{ color: kpi.iconColor }} />
                  </div>
                  <span className="text-xs text-[#444444] leading-tight">{kpi.label}</span>
                </div>
                <div className="font-heading text-2xl font-bold mb-1" style={{ color: kpi.valueColor }}>
                  {kpi.value}
                </div>
                <div className="text-xs text-[#444444]">{kpi.sub}</div>
                <div className="text-[10px] text-[#666666] mt-1">{kpi.detail}</div>
              </div>
            )
          })}
        </div>
        <p className="text-[10px] text-[#666666] mt-2 text-center">
          ⚠️ Estimaciones basadas en datos autorreportados. No son datos clínicos validados.
        </p>
      </div>

      {/* Section 2: Work impact */}
      <div className="card p-5">
        <h2 className="font-heading text-base font-semibold text-[#1A1A1A] mb-1">
          Impacto en el rendimiento laboral
        </h2>
        <p className="text-xs text-[#444444] mb-4">Evolución en 8 semanas de programa</p>
        <div className="space-y-5">
          {WORK_METRICS.map((m, i) => {
            const maxVal = Math.max(m.before, m.after, 7)
            const isPositive = m.positive
            return (
              <div key={i} className="p-4 bg-gray-50 rounded-2xl">
                <div className="font-medium text-sm text-[#1A1A1A] mb-3">{m.label}</div>
                <div className="flex items-center gap-4 mb-2">
                  <div className="text-center w-12 flex-shrink-0">
                    <div className="font-heading text-xl font-bold text-[#444444]">{m.beforeLabel}</div>
                    <div className="text-[10px] text-[#666666]">Inicio</div>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gray-400"
                        style={{ width: `${(m.before / maxVal) * 100}%` }} />
                    </div>
                    <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full rounded-full"
                        style={{
                          width: `${(m.after / maxVal) * 100}%`,
                          backgroundColor: isPositive ? '#10B981' : '#b84289',
                        }} />
                    </div>
                  </div>
                  <div className="text-center w-12 flex-shrink-0">
                    <div className="font-heading text-xl font-bold"
                      style={{ color: isPositive ? '#10B981' : '#b84289' }}>
                      {m.afterLabel}
                    </div>
                    <div className="text-[10px] text-[#666666]">Ahora</div>
                  </div>
                </div>
                <p className="text-[10px] text-[#444444] leading-relaxed mt-2 italic">{m.context}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Section 3: Collective profile */}
      <div className="card p-5">
        <h2 className="font-heading text-base font-semibold text-[#1A1A1A] mb-4">Tu colectivo hoy</h2>

        {/* Stage distribution */}
        <div className="mb-5">
          <h3 className="text-xs font-semibold text-[#444444] uppercase tracking-wide mb-3">Distribución por etapa</h3>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={130} height={130}>
              <PieChart>
                <Pie data={STAGE_DISTRIBUTION} cx="50%" cy="50%" innerRadius={35} outerRadius={60}
                  dataKey="value" labelLine={false} label={renderLabel}>
                  {STAGE_DISTRIBUTION.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {STAGE_DISTRIBUTION.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <div className="text-xs text-[#444444] flex-1 truncate">{item.name}</div>
                  <div className="text-xs font-bold text-[#1A1A1A]">{item.value}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Severity evolution simple bars */}
        <div className="mb-5">
          <h3 className="text-xs font-semibold text-[#444444] uppercase tracking-wide mb-3">Severidad — inicio vs. ahora</h3>
          <div className="space-y-2">
            {SEVERITY_DISTRIBUTION.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="text-xs text-[#444444] w-24 flex-shrink-0 truncate">{item.name.split('(')[0].trim()}</div>
                <div className="flex-1 flex gap-1 items-center">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gray-300" style={{ width: `${item.baseline}%` }} />
                  </div>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${item.value}%`, backgroundColor: item.color }} />
                  </div>
                </div>
                <div className="text-xs font-bold w-8 text-right" style={{ color: item.color }}>{item.value}%</div>
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-2 text-[10px] text-[#666666]">
            <span className="flex items-center gap-1"><span className="w-3 h-1 bg-gray-300 rounded inline-block" /> Inicio</span>
            <span className="flex items-center gap-1"><span className="w-3 h-1 bg-[#b84289] rounded inline-block" /> Ahora</span>
          </div>
        </div>

        {/* Top 3 symptoms */}
        <div>
          <h3 className="text-xs font-semibold text-[#444444] uppercase tracking-wide mb-3">Top 3 síntomas del colectivo</h3>
          <div className="space-y-3">
            {top3Symptoms.map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-[9px] text-white font-bold">{i + 1}</span>
                </div>
                <div className="flex-1">
                  <div className="text-xs font-medium text-[#1A1A1A]">{s.name}</div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mt-1">
                    <div className="h-full rounded-full bg-[#b84289]" style={{ width: `${s.current}%` }} />
                  </div>
                </div>
                <div className="text-xs font-bold text-[#b84289]">{s.current}%</div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-[#666666] mt-2">% de empleadas con nivel moderado-severo actualmente</p>
        </div>
      </div>

      {/* Section 4: HR recommendations */}
      <div>
        <h2 className="font-heading text-base font-semibold text-[#1A1A1A] mb-3">Qué puedes hacer como empresa</h2>
        <div className="space-y-4">
          {HR_RECS.map((rec, i) => (
            <div key={i} className="card p-5" style={{ borderLeft: `3px solid ${rec.color}` }}>
              <div className="flex items-start gap-3 mb-2">
                <span className="text-2xl flex-shrink-0">{rec.icon}</span>
                <div>
                  <div className="font-semibold text-sm text-[#1A1A1A] leading-snug mb-1">{rec.title}</div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: rec.color + '15', color: rec.color }}>
                    {rec.effort}
                  </span>
                </div>
              </div>
              <p className="text-xs text-[#444444] leading-relaxed">{rec.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
