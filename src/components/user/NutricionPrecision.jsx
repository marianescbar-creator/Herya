import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react'
import { MICRONUTRIENTS_BY_STAGE, DRUG_INTERACTIONS, DEMO_PROFILE } from '../../data/mockData'

const STAGE_FROM_PROFILE = { Perimenopausia: 'peri', Menopausia: 'meno', Postmenopausia: 'post' }

function NutrientBar({ nutrient }) {
  const isRatio = nutrient.unit.includes('g/kg')
  const pct = Math.min(100, Math.round((nutrient.demo / nutrient.target) * 100))
  const ok = pct >= 80
  const [open, setOpen] = useState(false)

  const displayValue = isRatio
    ? `${nutrient.demo} g/kg/día`
    : `${nutrient.demo} / ${nutrient.target} ${nutrient.unit.replace('/día', '')}`

  return (
    <div>
      <button onClick={() => setOpen(o => !o)} className="w-full text-left">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: nutrient.color + '18' }}>
            <span className="text-base">
              {nutrient.id === 'hierro' ? '🩸' : nutrient.id === 'vitd3' ? '☀️' : nutrient.id === 'magnesio' ? '⚡' : nutrient.id === 'omega3' ? '🐟' : nutrient.id === 'calcio' ? '🦴' : nutrient.id === 'vitk2' ? '🔑' : nutrient.id === 'proteina' ? '💪' : nutrient.id === 'colageno' ? '🌿' : nutrient.id === 'vitb12' ? '🧠' : '💊'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold text-[#1A1A1A]">{nutrient.name}</span>
              <span className="text-xs font-bold" style={{ color: ok ? '#10B981' : '#F59E0B' }}>{pct}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: ok ? '#10B981' : '#F59E0B' }} />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[9px] text-[#666666]">{displayValue}</span>
              <span className="text-[9px] font-medium" style={{ color: ok ? '#10B981' : '#F59E0B' }}>{ok ? 'Adecuado' : 'Déficit'}</span>
            </div>
          </div>
          {open ? <ChevronUp size={13} className="text-[#666666] flex-shrink-0" /> : <ChevronDown size={13} className="text-[#666666] flex-shrink-0" />}
        </div>
      </button>
      {open && (
        <div className="ml-11 mb-3 space-y-2">
          <p className="text-[11px] text-[#444444] leading-relaxed">{nutrient.importance}</p>
          <div>
            <p className="text-[10px] font-bold text-[#1A1A1A] mb-1">Fuentes alimentarias:</p>
            <div className="space-y-0.5">
              {nutrient.foods.map((f, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: nutrient.color }} />
                  <span className="text-[10px] text-[#444444]">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function DrugCard({ drug }) {
  const [open, setOpen] = useState(false)
  const hasWarning = drug.interactions.some(i => i.effect === 'critico')
  return (
    <div className={`card p-4 ${hasWarning ? 'border-l-4 border-[#EF4444]' : ''}`}>
      <button onClick={() => setOpen(o => !o)} className="w-full text-left">
        <div className="flex items-center gap-3">
          <span className="text-xl flex-shrink-0">{drug.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm text-[#1A1A1A]">{drug.drug}</div>
            <div className="text-[10px] text-[#666666]">{drug.category}</div>
          </div>
          {hasWarning && <AlertTriangle size={14} className="text-[#EF4444] flex-shrink-0" />}
          {open ? <ChevronUp size={14} className="text-[#666666] flex-shrink-0" /> : <ChevronDown size={14} className="text-[#666666] flex-shrink-0" />}
        </div>
      </button>
      {open && (
        <div className="mt-3 space-y-3">
          {drug.interactions.map((inter, i) => {
            const bg = inter.effect === 'critico' ? 'bg-red-50' : inter.effect === 'aumenta' ? 'bg-orange-50' : 'bg-amber-50'
            const textColor = inter.effect === 'critico' ? 'text-red-700' : inter.effect === 'aumenta' ? 'text-orange-700' : 'text-amber-700'
            const label = inter.effect === 'critico' ? '⚠️ CRÍTICO' : inter.effect === 'reduce' ? '↓ Reduce' : inter.effect === 'interfiere' ? '⟺ Interfiere' : '↑ Aumenta'
            return (
              <div key={i} className={`${bg} rounded-xl p-3`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[9px] font-bold ${textColor} uppercase tracking-wide`}>{label}</span>
                  <span className={`text-xs font-semibold ${textColor}`}>{inter.nutrient}</span>
                </div>
                <p className={`text-[11px] ${textColor} leading-relaxed mb-1`}>{inter.detail}</p>
                <p className={`text-[11px] font-semibold ${textColor}`}>→ {inter.action}</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function NutricionPrecision() {
  const navigate = useNavigate()
  const stage = STAGE_FROM_PROFILE[DEMO_PROFILE.stage] || 'meno'
  const [tab, setTab] = useState('nutrientes')
  const [myDrugs, setMyDrugs] = useState([])

  const nutrients = MICRONUTRIENTS_BY_STAGE[stage]

  const toggleDrug = (drug) => {
    setMyDrugs(d => d.includes(drug) ? d.filter(x => x !== drug) : [...d, drug])
  }

  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      <div className="gradient-primary px-4 pt-14 pb-5">
        <div className="flex items-center gap-3 mb-1">
          <button onClick={() => navigate('/user/health')} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <ArrowLeft size={16} className="text-white" />
          </button>
          <h1 className="font-heading text-xl font-bold text-white">Nutrición de Precisión</h1>
        </div>
        <p className="text-white/70 text-xs ml-11">Micronutrientes y medicamentos por etapa</p>
      </div>

      <div className="px-4 pt-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#b84289]/10">
          <span className="text-[11px] font-bold text-[#b84289]">Tu plan · {DEMO_PROFILE.stage}</span>
        </div>
      </div>

      <div className="flex bg-gray-100 mx-4 mt-3 rounded-2xl p-1">
        {[
          { key: 'nutrientes', label: 'Micronutrientes' },
          { key: 'medicamentos', label: 'Interacciones' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${tab === t.key ? 'bg-white shadow-sm text-[#1A1A1A]' : 'text-[#444444]'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="px-4 py-4 pb-28">
        {tab === 'nutrientes' && (
          <div className="card p-5">
            <h2 className="font-heading text-base font-semibold text-[#1A1A1A] mb-1">Micronutrientes clave</h2>
            <p className="text-xs text-[#444444] mb-4">Estimación basada en tu dieta registrada. Toca cada nutriente para ver las fuentes alimentarias.</p>
            <div className="divide-y divide-gray-50">
              {nutrients.map((n, i) => (
                <div key={n.id} className={i > 0 ? 'pt-3 mt-1' : ''}>
                  <NutrientBar nutrient={n} />
                </div>
              ))}
            </div>
            <div className="mt-4 bg-amber-50 rounded-2xl p-3">
              <p className="text-[10px] text-amber-700 leading-relaxed">
                Estimación basada en evidencia clínica. No es un sustituto de una analítica de sangre. Consulta con tu ginecóloga o nutricionista de Herya antes de modificar la suplementación.
              </p>
            </div>
          </div>
        )}

        {tab === 'medicamentos' && (
          <div className="space-y-4">
            <div className="card p-4">
              <h2 className="font-heading text-sm font-semibold text-[#1A1A1A] mb-1">¿Tomas alguno de estos medicamentos?</h2>
              <p className="text-xs text-[#444444] mb-3">Selecciona para ver cómo pueden afectar a tu absorción de nutrientes.</p>
              <div className="flex flex-wrap gap-2">
                {DRUG_INTERACTIONS.map(d => (
                  <button key={d.drug} onClick={() => toggleDrug(d.drug)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border-2 transition-all ${myDrugs.includes(d.drug) ? 'border-[#b84289] bg-[#b84289]/10 text-[#b84289]' : 'border-gray-200 text-[#444444]'}`}>
                    {d.drug.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              {DRUG_INTERACTIONS
                .filter(d => myDrugs.length === 0 || myDrugs.includes(d.drug))
                .map(d => <DrugCard key={d.drug} drug={d} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
