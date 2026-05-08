import { useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer, Legend,
} from 'recharts'
import { Save, TrendingDown, TrendingUp, Minus } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { SYMPTOMS_LIST, RATING_LABELS, getSeverityInfo } from '../../data/mockData'

const AI_INSIGHT = `Tu insomnio ha mejorado 1 punto en las últimas 4 semanas. Las recomendaciones de higiene del sueño están teniendo efecto. Continúa con la rutina de temperatura fresca y sin pantallas antes de dormir.`

export default function Tracking() {
  const { userProfile, weeklyLogs, saveWeeklyLog } = useApp()

  const initialSymptoms = userProfile?.symptoms || Object.fromEntries(SYMPTOMS_LIST.map(s => [s.id, 0]))
  const [current, setCurrent] = useState({ ...initialSymptoms })
  const [saved, setSaved] = useState(false)

  const chartData = weeklyLogs.map(log => ({
    name: log.week,
    score: log.totalScore,
  }))

  const initialScore = weeklyLogs[0]?.totalScore || userProfile?.totalScore || 22

  const handleSave = () => {
    const total = Object.values(current).reduce((a, b) => a + b, 0)
    const log = {
      week: `Sem ${weeklyLogs.length + 1}`,
      date: new Date().toISOString().split('T')[0],
      totalScore: total,
      ...current,
    }
    saveWeeklyLog(log)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const latestLog = weeklyLogs[weeklyLogs.length - 1]

  return (
    <div className="px-4 py-6 space-y-6">
      <div className="pt-8">
        <h1 className="font-heading text-2xl font-bold text-[#1A1A1A]">Seguimiento de síntomas</h1>
        <p className="text-[#444444] text-sm mt-1">Registra cómo te encuentras cada semana</p>
      </div>

      {/* Progress chart */}
      <div className="card p-5">
        <h2 className="font-heading text-base font-semibold text-[#1A1A1A] mb-1">Evolución de tu puntuación</h2>
        <p className="text-xs text-[#444444] mb-4">Últimas {weeklyLogs.length} semanas</p>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#666666' }} />
            <YAxis domain={[0, 40]} tick={{ fontSize: 10, fill: '#666666' }} />
            <Tooltip
              contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 2px 12px rgba(0,0,0,0.1)', fontSize: 12 }}
              formatter={(v) => [`${v}/40`, 'Puntuación']}
            />
            <ReferenceLine y={initialScore} stroke="#EF4444" strokeDasharray="4 4" label={{ value: 'Inicio', position: 'right', fontSize: 10, fill: '#EF4444' }} />
            <Line
              type="monotone"
              dataKey="score"
              stroke="url(#gradient)"
              strokeWidth={2.5}
              dot={{ fill: '#b84289', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#b84289" />
                <stop offset="100%" stopColor="#b84289" />
              </linearGradient>
            </defs>
          </LineChart>
        </ResponsiveContainer>
        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-50">
          <div className="text-center">
            <div className="font-bold text-lg text-[#1A1A1A]">{initialScore}</div>
            <div className="text-[10px] text-[#444444]">Inicio</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg text-[#1A1A1A]">{weeklyLogs[weeklyLogs.length - 1]?.totalScore || '—'}</div>
            <div className="text-[10px] text-[#444444]">Actual</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg text-[#10B981]">
              -{initialScore - (weeklyLogs[weeklyLogs.length - 1]?.totalScore || initialScore)}
            </div>
            <div className="text-[10px] text-[#444444]">Mejora</div>
          </div>
        </div>
      </div>

      {/* Symptom breakdown */}
      {latestLog && (
        <div className="card p-5">
          <h2 className="font-heading text-base font-semibold text-[#1A1A1A] mb-4">Evolución por síntoma</h2>
          <div className="space-y-3">
            {SYMPTOMS_LIST.map(symptom => {
              const initial = userProfile?.symptoms[symptom.id] || 0
              const current_val = latestLog[symptom.id] ?? initial
              const diff = current_val - initial
              return (
                <div key={symptom.id} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-[#444444] truncate">{symptom.label}</div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-[#666666] w-6 text-right">{initial}</span>
                    <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(current_val / 4) * 100}%`,
                          backgroundColor: diff < 0 ? '#10B981' : diff > 0 ? '#EF4444' : '#444444',
                        }}
                      />
                    </div>
                    <span className="text-xs font-semibold w-4 text-right" style={{
                      color: diff < 0 ? '#10B981' : diff > 0 ? '#EF4444' : '#444444',
                    }}>
                      {current_val}
                    </span>
                    {diff < 0 ? <TrendingDown size={12} className="text-[#10B981]" /> :
                     diff > 0 ? <TrendingUp size={12} className="text-[#EF4444]" /> :
                     <Minus size={12} className="text-[#444444]" />}
                  </div>
                </div>
              )
            })}
          </div>
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-50 text-[10px] text-[#666666]">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400 inline-block" /> Mejora</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400 inline-block" /> Empeora</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-300 inline-block" /> Igual</span>
          </div>
        </div>
      )}

      {/* AI Insight */}
      <div className="card p-5 border-l-4 border-[#b84289]">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-5 rounded-full gradient-primary flex items-center justify-center">
            <span className="text-[9px] text-white font-bold">IA</span>
          </div>
          <span className="text-xs font-semibold text-[#b84289]">Insight personalizado</span>
        </div>
        <p className="text-sm text-[#1A1A1A] leading-relaxed">{AI_INSIGHT}</p>
      </div>

      {/* Weekly check-in */}
      <div className="card p-5">
        <h2 className="font-heading text-base font-semibold text-[#1A1A1A] mb-1">Registro semanal</h2>
        <p className="text-xs text-[#444444] mb-5">¿Cómo estás esta semana? Ajusta los valores según tu experiencia</p>
        <div className="space-y-5">
          {SYMPTOMS_LIST.map(symptom => (
            <div key={symptom.id}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#1A1A1A]">{symptom.label}</span>
                <span className="text-xs font-semibold text-[#b84289]">{RATING_LABELS[current[symptom.id]]}</span>
              </div>
              <div className="flex gap-2">
                {[0, 1, 2, 3, 4].map(val => (
                  <button
                    key={val}
                    onClick={() => setCurrent(s => ({ ...s, [symptom.id]: val }))}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                      current[symptom.id] === val
                        ? 'gradient-primary text-white'
                        : 'bg-gray-100 text-[#444444]'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 pt-4 border-t border-gray-50 flex items-center justify-between">
          <div>
            <div className="text-xs text-[#444444]">Puntuación actual</div>
            <div className="font-heading text-2xl font-bold gradient-text">
              {Object.values(current).reduce((a, b) => a + b, 0)}/40
            </div>
          </div>
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm transition-all ${
              saved
                ? 'bg-green-500 text-white'
                : 'gradient-primary text-white'
            }`}
          >
            <Save size={16} />
            {saved ? '¡Guardado!' : 'Registrar semana'}
          </button>
        </div>
      </div>
    </div>
  )
}
