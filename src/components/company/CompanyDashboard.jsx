import { useNavigate } from 'react-router-dom'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, PieChart, Pie, Cell,
} from 'recharts'
import { TrendingDown, TrendingUp, Users, Zap, CalendarDays, ArrowRight } from 'lucide-react'
import { COMPANY_KPI_HISTORY, SEVERITY_DISTRIBUTION } from '../../data/mockData'

const KPI_CARDS = [
  {
    icon: TrendingDown,
    color: '#10B981',
    title: 'Carga sintomática media',
    before: '18.2',
    after: '14.1',
    change: '↓22%',
    changeColor: '#10B981',
    unit: '/40 puntos',
    period: 'en 8 semanas',
  },
  {
    icon: Zap,
    color: '#F59E0B',
    title: 'Días con fatiga severa',
    before: '3.8',
    after: '2.1',
    change: '↓45%',
    changeColor: '#10B981',
    unit: 'días/semana',
    period: 'media por empleada',
  },
  {
    icon: TrendingUp,
    color: '#b84289',
    title: 'Calidad de vida media',
    before: '6.4',
    after: '7.1',
    change: '↑11%',
    changeColor: '#10B981',
    unit: '/10 puntos',
    period: 'autopercibida',
  },
  {
    icon: Users,
    color: '#b84289',
    title: 'Engagement semanal',
    before: '—',
    after: '78%',
    change: '',
    changeColor: '#b84289',
    unit: 'usuarias activas',
    period: 'esta semana',
  },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white rounded-2xl p-3 shadow-card border border-gray-100 text-xs">
      <p className="font-semibold text-[#1A1A1A] mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color }}>
          {entry.name}: {entry.value}{entry.name === 'Calidad de vida' ? '/10' : '/40'}
        </p>
      ))}
    </div>
  )
}

const RADIAN = Math.PI / 180
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
  if (percent < 0.08) return null
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight="600">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export default function CompanyDashboard() {
  const navigate = useNavigate()
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-[#1A1A1A]">TechCorp España — Panel Herya</h1>
        <p className="text-[#444444] text-sm mt-1">47 empleadas activas · Actualizado hoy · Datos del programa (8 semanas)</p>
      </div>

      {/* Organizar con Herya CTA */}
      <button onClick={() => navigate('/company/eventos')}
        className="w-full card p-5 text-left hover:shadow-lg active:scale-[0.99] transition-all"
        style={{ background: 'linear-gradient(135deg, #b8428910, #b8428910)' }}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center flex-shrink-0">
            <CalendarDays size={20} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-heading text-base font-bold text-[#1A1A1A]">Organizar con Herya</div>
            <div className="text-xs text-[#444444] mt-0.5">Talleres y eventos para tu organización — 5 formatos disponibles</div>
          </div>
          <ArrowRight size={18} className="text-[#666666] flex-shrink-0" />
        </div>
      </button>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-4">
        {KPI_CARDS.map((kpi, i) => {
          const Icon = kpi.icon
          return (
            <div key={i} className="card p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: kpi.color + '15' }}>
                  <Icon size={16} style={{ color: kpi.color }} />
                </div>
                <span className="text-xs text-[#444444] leading-tight">{kpi.title}</span>
              </div>
              <div className="flex items-end gap-2 mb-1">
                <span className="font-heading text-2xl font-bold text-[#1A1A1A]">{kpi.after}</span>
                {kpi.change && (
                  <span className="text-xs font-bold mb-0.5" style={{ color: kpi.changeColor }}>{kpi.change}</span>
                )}
              </div>
              {kpi.before !== '—' && (
                <div className="text-xs text-[#666666]">Antes: {kpi.before} {kpi.unit}</div>
              )}
              {kpi.before === '—' && (
                <div className="text-xs text-[#666666]">{kpi.unit}</div>
              )}
              <div className="text-[10px] text-[#666666] mt-0.5">{kpi.period}</div>
            </div>
          )
        })}
      </div>

      {/* Evolution chart */}
      <div className="card p-5">
        <h2 className="font-heading text-base font-semibold text-[#1A1A1A] mb-1">Evolución del programa</h2>
        <p className="text-xs text-[#444444] mb-4">Carga sintomática vs. calidad de vida — 8 semanas</p>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={COMPANY_KPI_HISTORY} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#666666' }} />
            <YAxis tick={{ fontSize: 10, fill: '#666666' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 11, color: '#444444' }}
              iconType="circle"
              iconSize={8}
            />
            <Line
              type="monotone"
              dataKey="symptoms"
              name="Carga sintomática"
              stroke="#EF4444"
              strokeWidth={2.5}
              dot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="quality"
              name="Calidad de vida"
              stroke="#10B981"
              strokeWidth={2.5}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-[10px] text-[#666666] mt-3 text-center">
          Relación inversa: al reducirse los síntomas, mejora la calidad de vida autopercibida
        </p>
      </div>

      {/* Severity distribution */}
      <div className="card p-5">
        <h2 className="font-heading text-base font-semibold text-[#1A1A1A] mb-1">Distribución por severidad</h2>
        <p className="text-xs text-[#444444] mb-4">Situación actual de las 47 empleadas</p>
        <div className="flex items-center gap-6">
          <ResponsiveContainer width={160} height={160}>
            <PieChart>
              <Pie
                data={SEVERITY_DISTRIBUTION}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={75}
                dataKey="value"
                labelLine={false}
                label={renderCustomLabel}
              >
                {SEVERITY_DISTRIBUTION.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex-1 space-y-3">
            {SEVERITY_DISTRIBUTION.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-[#1A1A1A] truncate">{item.name}</div>
                  <div className="text-[10px] text-[#666666]">Antes: {item.baseline}%</div>
                </div>
                <div className="text-sm font-bold" style={{ color: item.color }}>{item.value}%</div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 p-3 bg-amber-50 rounded-xl">
          <p className="text-[10px] text-amber-700 leading-relaxed">
            Al inicio, el 46% presentaba carga severa (referencia: Estudio Bienestar Hormonal Femenino, n=158, España 2026)
          </p>
        </div>
      </div>
    </div>
  )
}
