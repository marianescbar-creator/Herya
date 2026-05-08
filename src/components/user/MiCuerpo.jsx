import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, TrendingUp, Scale, Info, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import {
  LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts'

const MOCK_WEIGHT_DATA = [
  { month: 'Oct', weight: 68.2 },
  { month: 'Nov', weight: 68.8 },
  { month: 'Dic', weight: 69.1 },
  { month: 'Ene', weight: 68.9 },
  { month: 'Feb', weight: 69.4 },
  { month: 'Mar', weight: 69.0 },
]

const FEEL_OPTIONS = [
  { key: 'good', label: 'Bien', emoji: '😊' },
  { key: 'ok', label: 'Regular', emoji: '😐' },
  { key: 'uncomfortable', label: 'Incómoda', emoji: '😔' },
]

const STAGE_INFO = {
  Perimenopausia: {
    title: 'Perimenopausia',
    text: 'Los estrógenos fluctuantes hacen que la grasa migre de caderas y muslos hacia el abdomen. Es redistribución, no necesariamente ganancia total. El entrenamiento de fuerza 2-3x/semana es la intervención más eficaz para revertir esta tendencia — más que el cardio.',
  },
  Menopausia: {
    title: 'Menopausia',
    text: 'Sin estrógenos, el metabolismo basal cae un 10-15% y la grasa visceral (abdominal) aumenta el riesgo cardiovascular. La prioridad aquí es masa muscular, no peso en la báscula.',
  },
  Postmenopausia: {
    title: 'Postmenopausia',
    text: 'La sarcopenia (pérdida de músculo) acelera si no hay entrenamiento activo. 1.5g de proteína por kg de peso al día + fuerza 3x/semana son la base de la salud metabólica en esta etapa.',
  },
}

function getStageKey(stage) {
  if (!stage) return 'Menopausia'
  if (stage.includes('Peri')) return 'Perimenopausia'
  if (stage.includes('Post')) return 'Postmenopausia'
  return 'Menopausia'
}

export default function MiCuerpo() {
  const navigate = useNavigate()
  const { userProfile } = useApp()
  const stageKey = getStageKey(userProfile?.stage)
  const stageInfo = STAGE_INFO[stageKey]

  const [weights, setWeights] = useState(MOCK_WEIGHT_DATA)
  const [newWeight, setNewWeight] = useState('')
  const [newDate, setNewDate] = useState('')
  const [waist, setWaist] = useState('')
  const [feel, setFeel] = useState('')
  const [showWhyExpanded, setShowWhyExpanded] = useState(false)
  const [showArticle, setShowArticle] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleAddWeight = () => {
    const w = parseFloat(newWeight)
    if (!w || !newDate) return
    const d = new Date(newDate)
    const monthLabel = d.toLocaleDateString('es-ES', { month: 'short' })
    setWeights(prev => [...prev, { month: monthLabel, weight: w }].slice(-6))
    setNewWeight('')
    setNewDate('')
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (showArticle) {
    return (
      <div className="min-h-screen bg-[#FAF9F7]">
        <div className="bg-[#f9eef5] px-4 pt-14 pb-5">
          <button onClick={() => setShowArticle(false)} className="flex items-center gap-2 text-[#b84289] text-sm font-semibold mb-3">
            <ArrowLeft size={16} /> Volver
          </button>
          <h1 className="font-heading text-xl font-bold text-[#1A1A1A]">El peso en la menopausia: qué está pasando</h1>
        </div>
        <div className="px-4 py-5 pb-28 space-y-4">
          <p className="text-sm text-[#1A1A1A] leading-relaxed">
            El aumento de peso en la menopausia no tiene que ver con fuerza de voluntad. Es una consecuencia directa de la caída de estrógenos sobre el metabolismo, la distribución de grasa y la masa muscular.
          </p>
          <div className="card p-4">
            <h3 className="font-semibold text-sm text-[#1A1A1A] mb-2">¿Qué cambia exactamente?</h3>
            <ul className="space-y-2 text-xs text-[#444444] leading-relaxed">
              <li>• Los estrógenos regulan dónde se almacena la grasa. Sin ellos, el cuerpo prefiere el abdomen sobre caderas y muslos.</li>
              <li>• El metabolismo basal cae un 10-15% — el cuerpo quema menos calorías en reposo.</li>
              <li>• La masa muscular disminuye 1-2% por año sin entrenamiento de fuerza activo.</li>
              <li>• El cortisol (hormona del estrés) sube con el mal sueño, favoreciendo la acumulación de grasa abdominal.</li>
            </ul>
          </div>
          <div className="card p-4 bg-[#b84289]/5">
            <h3 className="font-semibold text-sm text-[#b84289] mb-2">Qué funciona de verdad</h3>
            <ul className="space-y-2 text-xs text-[#1A1A1A] leading-relaxed">
              <li>✓ Entrenamiento de fuerza 2-3x/semana (no solo cardio)</li>
              <li>✓ Proteína suficiente: 1.2-1.5g por kg de peso</li>
              <li>✓ Sueño de calidad — el cortisol alto por falta de sueño dificulta el control de peso</li>
              <li>✓ Reducir ultraprocesados e inflamación, no "contar calorías"</li>
            </ul>
          </div>
          <p className="text-xs text-[#666666] leading-relaxed">
            El objetivo de Herya no es el número en la báscula — es que te sientas bien, con energía y en tu cuerpo.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      <div className="gradient-primary px-4 pt-14 pb-5">
        <div className="flex items-center gap-3 mb-1">
          <button onClick={() => navigate('/user/health')} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <ArrowLeft size={16} className="text-white" />
          </button>
          <h1 className="font-heading text-xl font-bold text-white">Mi cuerpo</h1>
        </div>
        <p className="text-white/70 text-xs ml-11">Comprende los cambios con información real</p>
      </div>

      <div className="px-4 py-4 pb-28 space-y-4">
        {/* Educational banner */}
        <div className="rounded-2xl p-4" style={{ backgroundColor: '#f9eef5' }}>
          <div className="flex items-start gap-3">
            <Info size={16} className="text-[#b84289] flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-[#4C1D95] leading-relaxed">
                El aumento de grasa abdominal en la menopausia está causado por la caída de estrógenos, no por comer mal o moverse poco. Es un cambio metabólico real. Entenderlo es el primer paso.
              </p>
              <button onClick={() => setShowArticle(true)} className="mt-2 text-xs font-semibold text-[#b84289] flex items-center gap-1">
                Saber más <ArrowRight size={11} />
              </button>
            </div>
          </div>
        </div>

        {/* Weight registration */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Scale size={16} className="text-[#b84289]" />
            <h2 className="font-heading text-base font-semibold text-[#1A1A1A]">Registro de peso</h2>
          </div>

          {/* Chart */}
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={weights} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#666666' }} />
              <YAxis tick={{ fontSize: 9, fill: '#666666' }} domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{ fontSize: 11, borderRadius: 10, border: '1px solid #E5E7EB' }}
                formatter={(v) => [`${v} kg`]}
              />
              <Line type="monotone" dataKey="weight" stroke="#b84289" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>

          <p className="text-[10px] text-[#666666] leading-relaxed mt-3 mb-4">
            Tu peso puede variar 1–2 kg por retención de líquidos durante el ciclo. Registra siempre a la misma hora del día para comparar bien.
          </p>

          {/* Add weight */}
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-[10px] font-semibold text-[#444444] mb-1 block">Peso (kg)</label>
                <input type="number" step="0.1" value={newWeight} onChange={e => setNewWeight(e.target.value)}
                  placeholder="69.5"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-[#1A1A1A] outline-none focus:border-[#b84289]" />
              </div>
              <div className="flex-1">
                <label className="text-[10px] font-semibold text-[#444444] mb-1 block">Fecha</label>
                <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-[#1A1A1A] outline-none focus:border-[#b84289]" />
              </div>
            </div>
            <button onClick={handleAddWeight} disabled={!newWeight || !newDate}
              className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${saved ? 'bg-green-50 text-green-700' : 'bg-[#b84289]/10 text-[#b84289] disabled:opacity-40'}`}>
              {saved ? '¡Guardado ✓' : 'Añadir registro'}
            </button>
          </div>
        </div>

        {/* Optional measures */}
        <div className="card p-5">
          <h2 className="font-heading text-base font-semibold text-[#1A1A1A] mb-1">Medidas opcionales</h2>
          <p className="text-xs text-[#666666] mb-4">Solo si quieres. No son obligatorias.</p>

          <div className="mb-4">
            <label className="text-[10px] font-semibold text-[#444444] mb-1 block">Contorno de cintura (cm)</label>
            <input type="number" step="0.5" value={waist} onChange={e => setWaist(e.target.value)}
              placeholder="82"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-[#1A1A1A] outline-none focus:border-[#b84289]" />
          </div>

          <div>
            <p className="text-[10px] font-semibold text-[#444444] mb-2">¿Cómo te sientes en tu ropa hoy?</p>
            <div className="flex gap-2">
              {FEEL_OPTIONS.map(opt => (
                <button key={opt.key} onClick={() => setFeel(opt.key)}
                  className={`flex-1 flex flex-col items-center py-3 rounded-xl border-2 transition-all ${feel === opt.key ? 'border-[#b84289] bg-[#b84289]/5' : 'border-gray-200'}`}>
                  <span className="text-xl">{opt.emoji}</span>
                  <span className="text-[9px] font-semibold text-[#444444] mt-1">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Why is this happening */}
        <div className="card p-5">
          <button
            onClick={() => setShowWhyExpanded(e => !e)}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-[#b84289]" />
              <h2 className="font-heading text-base font-semibold text-[#1A1A1A]">¿Por qué está pasando esto?</h2>
            </div>
            {showWhyExpanded ? <ChevronUp size={16} className="text-[#666666]" /> : <ChevronDown size={16} className="text-[#666666]" />}
          </button>
          {showWhyExpanded && (
            <div className="mt-4">
              <div className="inline-flex items-center px-2 py-1 rounded-full text-[9px] font-bold bg-[#b84289]/10 text-[#b84289] mb-3">
                {stageInfo.title}
              </div>
              <p className="text-xs text-[#444444] leading-relaxed">{stageInfo.text}</p>
            </div>
          )}
        </div>

        {/* Link to routines */}
        <button onClick={() => navigate('/user/routines')}
          className="w-full card p-4 flex items-center gap-3 hover:shadow active:scale-[0.99] transition-all">
          <div className="w-10 h-10 rounded-2xl bg-[#10B981]/10 flex items-center justify-center flex-shrink-0">
            <TrendingUp size={18} className="text-[#10B981]" />
          </div>
          <div className="flex-1 text-left">
            <div className="font-semibold text-sm text-[#1A1A1A]">Ver mi plan de movimiento</div>
            <div className="text-xs text-[#444444]">Ejercicios de fuerza y metabolismo para esta semana</div>
          </div>
          <ArrowRight size={16} className="text-[#666666]" />
        </button>
      </div>
    </div>
  )
}
