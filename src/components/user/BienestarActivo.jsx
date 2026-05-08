import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle, Clock, Wifi, WifiOff, Users, ChevronDown, ChevronUp } from 'lucide-react'
import { ACTIVITIES_CATALOG, MY_ACTIVITY_RESERVATIONS, DEMO_PROFILE } from '../../data/mockData'

const STATES = [
  { key: 'bajo', label: 'Baja energía', emoji: '🌙', desc: 'Cansada o con síntomas fuertes hoy' },
  { key: 'medio', label: 'Regular', emoji: '🌤', desc: 'Síntomas presentes pero manejables' },
  { key: 'bien', label: 'Bien', emoji: '☀️', desc: 'Con energía, lista para moverme' },
]

function PricingBadge({ act }) {
  if (act.pricing === 'included') {
    return (
      <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-green-100 text-green-700">
        {act.pricingLabel}
      </span>
    )
  }
  if (act.pricing === 'discount') {
    return (
      <div className="flex items-center gap-1.5">
        <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-blue-100 text-blue-700">
          Precio convenio
        </span>
        <span className="text-[10px] text-[#666666] line-through">{act.normalPrice}</span>
        <span className="text-xs font-bold text-[#1A1A1A]">{act.heryaPrice}</span>
      </div>
    )
  }
  if (act.pricing === 'market') {
    return (
      <span className="text-xs font-semibold text-[#1A1A1A]">{act.marketPrice}</span>
    )
  }
  return null
}

function ActivityCard({ act, reserved, onReserve }) {
  const [showWhy, setShowWhy] = useState(false)
  const isIncluded = act.pricing === 'included'
  const cardBg = isIncluded ? 'bg-[#b84289]/5 border border-[#b84289]/10' : 'bg-white'

  return (
    <div className={`card p-4 ${cardBg}`}>
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 text-xl" style={{ backgroundColor: act.color + '18' }}>
          {act.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <span className="font-semibold text-sm text-[#1A1A1A]">{act.name}</span>
            {reserved && <CheckCircle size={13} className="text-green-500 flex-shrink-0" />}
          </div>
          <div className="flex items-center gap-3 text-[10px] text-[#666666] mb-2 flex-wrap">
            <span className="flex items-center gap-1"><Clock size={9} /> {act.duration} min</span>
            <span className="flex items-center gap-1">{act.online ? <Wifi size={9} /> : <WifiOff size={9} />} {act.online ? 'Online' : 'Presencial'}</span>
            <span className="flex items-center gap-1"><Users size={9} /> {act.spotsLeft} plazas</span>
          </div>
          <div className="text-[10px] text-[#444444] mb-2">{act.instructor} · {act.nextSession}</div>

          <div className="mb-3">
            <PricingBadge act={act} />
          </div>

          {act.whyItHelps && (
            <div className="mb-3">
              <button onClick={() => setShowWhy(w => !w)}
                className="flex items-center gap-1 text-[10px] font-semibold text-[#b84289]">
                ¿Por qué te puede ir bien?
                {showWhy ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
              </button>
              {showWhy && (
                <div className="mt-2 bg-white/60 rounded-xl p-2.5 border border-gray-100">
                  <p className="text-[10px] text-[#444444] leading-relaxed">{act.whyItHelps}</p>
                </div>
              )}
            </div>
          )}

          {reserved ? (
            <div className="w-full py-2 rounded-xl bg-green-50 text-green-700 text-xs font-semibold text-center">
              Reservada ✓
            </div>
          ) : (
            <button onClick={() => onReserve(act.id)}
              className="w-full py-2 rounded-xl text-white text-xs font-semibold"
              style={{ background: `linear-gradient(135deg, ${act.color}dd, ${act.color})` }}>
              Reservar plaza
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function BienestarActivo() {
  const navigate = useNavigate()
  const [physicalState, setPhysicalState] = useState(null)
  const [reservations, setReservations] = useState(MY_ACTIVITY_RESERVATIONS.map(r => r.activityId))
  const [tab, setTab] = useState('recomendadas')
  const activeSymptoms = Object.entries(DEMO_PROFILE.symptoms)
    .filter(([, v]) => v >= 2)
    .map(([k]) => k)

  const recommended = ACTIVITIES_CATALOG.filter(a =>
    physicalState && a.physicalStates.includes(physicalState) &&
    a.symptoms.some(s => activeSymptoms.includes(s))
  )
  const all = ACTIVITIES_CATALOG

  const handleReserve = (id) => {
    setReservations(r => [...r, id])
  }

  const displayList = tab === 'recomendadas' ? (physicalState ? recommended : []) : all

  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      <div className="gradient-primary px-4 pt-14 pb-5">
        <div className="flex items-center gap-3 mb-1">
          <button onClick={() => navigate('/user/health')} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <ArrowLeft size={16} className="text-white" />
          </button>
          <h1 className="font-heading text-xl font-bold text-white">Bienestar Activo</h1>
        </div>
        <p className="text-white/70 text-xs ml-11">Actividades para tu bienestar físico</p>
      </div>

      <div className="px-4 py-4 pb-28 space-y-4">
        <div className="card p-5">
          <h2 className="font-heading text-base font-semibold text-[#1A1A1A] mb-1">¿Cómo te sientes hoy físicamente?</h2>
          <p className="text-xs text-[#444444] mb-4">Te recomendamos actividades adaptadas a tu estado y síntomas activos.</p>
          <div className="grid grid-cols-3 gap-2">
            {STATES.map(s => (
              <button key={s.key} onClick={() => { setPhysicalState(s.key); setTab('recomendadas') }}
                className={`p-3 rounded-2xl border-2 text-center transition-all ${physicalState === s.key ? 'border-[#b84289] bg-[#b84289]/5' : 'border-gray-100 bg-gray-50'}`}>
                <div className="text-2xl mb-1">{s.emoji}</div>
                <div className="text-xs font-semibold text-[#1A1A1A]">{s.label}</div>
                <div className="text-[9px] text-[#666666] mt-0.5 leading-tight">{s.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {reservations.length > 0 && (
          <div className="card p-4">
            <h2 className="font-heading text-sm font-semibold text-[#1A1A1A] mb-3">Mis reservas</h2>
            <div className="space-y-2">
              {ACTIVITIES_CATALOG.filter(a => reservations.includes(a.id)).map(act => {
                const r = MY_ACTIVITY_RESERVATIONS.find(x => x.activityId === act.id)
                return (
                  <div key={act.id} className="flex items-center gap-3 bg-gray-50 rounded-2xl p-3">
                    <span className="text-lg">{act.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-[#1A1A1A] truncate">{act.name}</div>
                      <div className="text-[10px] text-[#666666]">{r ? `${r.date} · ${r.time}` : act.nextSession}</div>
                    </div>
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle size={11} className="text-green-600" />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className="flex bg-gray-100 rounded-2xl p-1">
          {[{ key: 'recomendadas', label: 'Recomendadas' }, { key: 'todas', label: 'Todas las actividades' }].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${tab === t.key ? 'bg-white shadow-sm text-[#1A1A1A]' : 'text-[#444444]'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'recomendadas' && !physicalState && (
          <div className="text-center py-8">
            <p className="text-3xl mb-2">☝️</p>
            <p className="text-sm text-[#444444]">Indica cómo te sientes hoy para ver<br />actividades adaptadas a tu estado.</p>
          </div>
        )}

        {tab === 'recomendadas' && physicalState && recommended.length === 0 && (
          <div className="text-center py-8">
            <p className="text-3xl mb-2">🔍</p>
            <p className="text-sm text-[#444444]">No hay actividades específicas para<br />este estado hoy. Prueba el catálogo completo.</p>
            <button onClick={() => setTab('todas')} className="mt-3 text-xs text-[#b84289] font-semibold">Ver todas las actividades →</button>
          </div>
        )}

        <div className="space-y-3">
          {displayList.map(act => (
            <ActivityCard key={act.id} act={act} reserved={reservations.includes(act.id)} onReserve={handleReserve} />
          ))}
        </div>
      </div>
    </div>
  )
}
