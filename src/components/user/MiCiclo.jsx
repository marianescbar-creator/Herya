import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, AlertTriangle, AlertCircle, X } from 'lucide-react'
import { DEMO_CYCLE_DATA } from '../../data/mockData'

const RED = '#E53E3E'
const MONTH_SHORT = ['En', 'Fe', 'Ma', 'Ab', 'My', 'Jn', 'Jl', 'Ag', 'Se', 'Oc', 'No', 'Di']

function Droplet({ size = 14 }) {
  const w = Math.round(size * 0.8)
  return (
    <svg width={w} height={size} viewBox="0 0 12 15" fill={RED}>
      <path d="M6 0.5 C6 0.5, 11.5 6.5, 11.5 10.5 C11.5 13.2 9.0 14.8 6 14.8 C3.0 14.8 0.5 13.2 0.5 10.5 C0.5 6.5 6 0.5 6 0.5 Z" />
    </svg>
  )
}

function intensitySize(level) {
  if (level === 1) return 12
  if (level === 2) return 18
  if (level === 3 || level === 4) return 24
  return 0
}

function DayChip({ dayNum, level, extraData, onClick }) {
  const hasDrop = level > 0
  const hasExtra = extraData && (extraData.pain > 0 || extraData.mood || extraData.symptoms?.length > 0 || extraData.sleep || extraData.spotting)
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-between rounded-xl py-1.5 px-1 transition-all active:scale-95"
      style={{
        backgroundColor: hasDrop ? '#FFF5F5' : '#F7F8FA',
        width: 38,
        minHeight: 52,
        border: '1px solid',
        borderColor: hasDrop ? '#FECDD3' : '#E5E7EB',
      }}
    >
      <span className="text-[9px] font-semibold text-[#666666]">D{dayNum}</span>
      <div className="flex items-center justify-center" style={{ height: 28 }}>
        {hasDrop
          ? <Droplet size={intensitySize(level)} />
          : <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
        }
      </div>
      {hasExtra && (
        <div className="flex gap-0.5 flex-wrap justify-center">
          {extraData.pain > 0 && <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />}
          {extraData.mood && extraData.mood !== 'stable' && <div className="w-1.5 h-1.5 rounded-full bg-[#b84289]" />}
          {extraData.spotting && <div className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />}
          {extraData.symptoms?.length > 0 && <div className="w-1.5 h-1.5 rounded-full bg-[#b84289]" />}
        </div>
      )}
    </button>
  )
}

function AlertCard({ type, message, action }) {
  const styles = {
    red: { bg: 'bg-red-50', border: 'border-red-400', icon: AlertCircle, textColor: 'text-red-700', iconColor: 'text-red-500' },
    amber: { bg: 'bg-amber-50', border: 'border-amber-400', icon: AlertTriangle, textColor: 'text-amber-700', iconColor: 'text-amber-500' },
    blue: { bg: 'bg-blue-50', border: 'border-blue-400', icon: AlertCircle, textColor: 'text-blue-700', iconColor: 'text-blue-500' },
  }
  const s = styles[type]
  const Icon = s.icon
  return (
    <div className={`${s.bg} border-l-4 ${s.border} rounded-2xl p-4`}>
      <div className="flex items-start gap-2">
        <Icon size={16} className={`${s.iconColor} flex-shrink-0 mt-0.5`} />
        <div className="flex-1">
          <p className={`text-xs ${s.textColor} leading-relaxed`}>{message}</p>
          {action && <p className={`text-xs font-semibold ${s.textColor} mt-1`}>{action}</p>}
        </div>
      </div>
    </div>
  )
}

const DAY_SYMPTOM_CHIPS = [
  { key: 'hinchazón', label: 'Hinchazón', emoji: '🫧' },
  { key: 'sensibilidad-pechos', label: 'Sensibilidad en pechos', emoji: '💛' },
  { key: 'cambios-humor', label: 'Cambios de humor', emoji: '🌊' },
  { key: 'migraña', label: 'Migraña', emoji: '🧠' },
  { key: 'fatiga-intensa', label: 'Fatiga intensa', emoji: '😴' },
  { key: 'retención-líquidos', label: 'Retención de líquidos', emoji: '💧' },
  { key: 'acné', label: 'Acné o piel grasa', emoji: '🫙' },
  { key: 'dificultad-dormir', label: 'Dificultad para dormir', emoji: '🌙' },
]

function DaySymptomModal({ cycleId, dayNum, currentLevel, extraData = {}, onSave, onClose }) {
  const [pain, setPain] = useState(extraData.pain ?? 0)
  const [level, setLevel] = useState(currentLevel || 0)
  const [spotting, setSpotting] = useState(extraData.spotting ?? false)
  const [symptoms, setSymptoms] = useState(extraData.symptoms || [])
  const [mood, setMood] = useState(extraData.mood || 'stable')
  const [sleep, setSleep] = useState(extraData.sleep || 'good')

  const toggleSymptom = (key) => {
    setSymptoms(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])
  }

  const FLOW_OPTIONS = [
    { lv: 0, label: 'Sin flujo' },
    { lv: 1, label: 'Leve' },
    { lv: 2, label: 'Moderado' },
    { lv: 3, label: 'Abundante' },
  ]
  const PAIN_ICONS = ['😌', '😐', '😣', '😫']
  const PAIN_LABELS = ['Sin dolor', 'Leve', 'Moderado', 'Severo']

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
      <div className="bg-white rounded-t-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-5 pt-5 pb-3 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-base font-bold text-[#1A1A1A]">Día {dayNum} del período</h3>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="px-5 py-4 space-y-5">
          {/* CAMPO 1: Cólicos */}
          <div>
            <p className="text-xs font-semibold text-[#1A1A1A] mb-1">Cólicos / Dolor menstrual</p>
            <div className="flex gap-2">
              {[0, 1, 2, 3].map(lv => (
                <button key={lv} onClick={() => setPain(lv)}
                  className={`flex-1 flex flex-col items-center py-2.5 rounded-xl border-2 transition-all ${pain === lv ? 'border-[#F59E0B] bg-amber-50' : 'border-gray-200'}`}>
                  <span className="text-base">{PAIN_ICONS[lv]}</span>
                  <span className="text-[8px] font-semibold text-[#444444] mt-1 leading-tight text-center">{PAIN_LABELS[lv]}</span>
                </button>
              ))}
            </div>
            {pain === 3 && (
              <p className="text-[10px] text-amber-700 bg-amber-50 rounded-xl p-2 mt-2 leading-relaxed">
                El dolor menstrual severo persistente puede indicar endometriosis o fibromas — menciónselo a tu ginecóloga.
              </p>
            )}
          </div>

          {/* CAMPO 2: Flujo */}
          <div>
            <p className="text-xs font-semibold text-[#1A1A1A] mb-2">Intensidad del flujo</p>
            <div className="flex gap-2">
              {FLOW_OPTIONS.map(opt => (
                <button key={opt.lv} onClick={() => setLevel(opt.lv)}
                  className={`flex-1 flex flex-col items-center py-2.5 rounded-xl border-2 transition-all ${level === opt.lv ? 'border-[#E53E3E] bg-red-50' : 'border-gray-200'}`}>
                  <div className="flex items-center justify-center h-7">
                    {opt.lv === 0
                      ? <div className="w-2 h-2 rounded-full bg-gray-200" />
                      : <Droplet size={intensitySize(opt.lv)} />
                    }
                  </div>
                  <span className="text-[9px] font-semibold text-[#444444] mt-1">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* CAMPO 3: Manchado intermenstrual */}
          <div>
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-[#1A1A1A]">Manchado intermenstrual</p>
              <button onClick={() => setSpotting(s => !s)}
                className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${spotting ? 'bg-[#EF4444]' : 'bg-gray-200'}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${spotting ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
            {spotting && (
              <p className="text-[10px] text-red-700 bg-red-50 rounded-xl p-2 mt-2 leading-relaxed">
                El sangrado entre períodos merece una revisión médica para descartar causas hormonales o estructurales.
              </p>
            )}
          </div>

          {/* CAMPO 4: Síntomas del día */}
          <div>
            <p className="text-xs font-semibold text-[#1A1A1A] mb-2">Síntomas del día</p>
            <div className="flex flex-wrap gap-2">
              {DAY_SYMPTOM_CHIPS.map(chip => {
                const active = symptoms.includes(chip.key)
                return (
                  <button key={chip.key} onClick={() => toggleSymptom(chip.key)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-all ${active ? 'border-[#b84289] bg-[#f9eef5] text-[#b84289]' : 'border-gray-200 text-[#444444]'}`}>
                    <span>{chip.emoji}</span>
                    <span>{chip.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* CAMPO 5: Estado emocional */}
          <div>
            <p className="text-xs font-semibold text-[#1A1A1A] mb-2">Estado emocional del día</p>
            <div className="flex gap-2">
              {[
                { key: 'stable', label: 'Estable', emoji: '😊' },
                { key: 'variable', label: 'Variable', emoji: '😶' },
                { key: 'difficult', label: 'Muy difícil', emoji: '😔' },
              ].map(opt => (
                <button key={opt.key} onClick={() => setMood(opt.key)}
                  className={`flex-1 flex flex-col items-center py-2.5 rounded-xl border-2 transition-all ${mood === opt.key ? 'border-[#b84289] bg-purple-50' : 'border-gray-200'}`}>
                  <span className="text-base">{opt.emoji}</span>
                  <span className="text-[9px] font-semibold text-[#444444] mt-1">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* CAMPO 6: Calidad del sueño */}
          <div>
            <p className="text-xs font-semibold text-[#1A1A1A] mb-2">Calidad del sueño</p>
            <div className="flex gap-2">
              {[
                { key: 'good', label: 'Bien', emoji: '😴' },
                { key: 'ok', label: 'Regular', emoji: '🥱' },
                { key: 'bad', label: 'Muy mal', emoji: '😩' },
              ].map(opt => (
                <button key={opt.key} onClick={() => setSleep(opt.key)}
                  className={`flex-1 flex flex-col items-center py-2.5 rounded-xl border-2 transition-all ${sleep === opt.key ? 'border-[#b84289] bg-blue-50' : 'border-gray-200'}`}>
                  <span className="text-base">{opt.emoji}</span>
                  <span className="text-[9px] font-semibold text-[#444444] mt-1">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="px-5 pb-8 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-2xl border border-gray-200 text-sm text-[#444444] font-semibold">Cancelar</button>
          <button
            onClick={() => onSave(cycleId, dayNum - 1, level, { pain, mood, sleep, spotting, symptoms })}
            className="flex-1 py-3 rounded-2xl gradient-primary text-white text-sm font-semibold"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  )
}

function CycleEntry({ cycle, onDayClick }) {
  const start = new Date(cycle.startDate)
  const label = start.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
  const hasCoagulos = cycle.intensity.some(lv => lv === 4)
  const extras = cycle.extras || {}

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="font-semibold text-sm text-[#1A1A1A]">{label}</span>
        <span className="text-xs text-[#444444]">{cycle.durationDays} días</span>
      </div>
      <div className="flex gap-1.5 flex-wrap mb-3">
        {cycle.intensity.map((lv, i) => (
          <DayChip
            key={i}
            dayNum={i + 1}
            level={lv}
            extraData={extras[i]}
            onClick={() => onDayClick(cycle.id, i + 1, lv, extras[i] || {})}
          />
        ))}
      </div>
      {hasCoagulos && (
        <div className="flex items-center gap-1 mb-1">
          <AlertCircle size={11} className="text-[#F87171]" />
          <span className="text-[10px] text-[#F87171] font-semibold">Menciona los coágulos en tu próxima consulta ginecológica.</span>
        </div>
      )}
      {cycle.daysToNext && (
        <div className="text-[10px] text-[#444444]">
          {cycle.daysToNext} días hasta siguiente
          {cycle.daysToNext > 45 && <span className="ml-1 text-amber-600 font-semibold">· Ciclo largo</span>}
        </div>
      )}
    </div>
  )
}

function AddPeriodModal({ onClose, onAdd }) {
  const [startDate, setStartDate] = useState('')
  const [days, setDays] = useState(5)
  const [intensity, setIntensity] = useState(2)
  const [note, setNote] = useState('')

  const handleAdd = () => {
    if (!startDate) return
    const start = new Date(startDate)
    const end = new Date(start)
    end.setDate(end.getDate() + days - 1)
    onAdd({
      id: Date.now(),
      startDate,
      endDate: end.toISOString().split('T')[0],
      durationDays: days,
      intensity: Array(days).fill(intensity),
      note: note || null,
      daysToNext: null,
      extras: {},
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div className="bg-white rounded-t-3xl w-full max-w-lg mx-auto">
        <div className="px-5 pt-5 pb-3 border-b border-gray-100">
          <div className="flex items-center">
            <button onClick={onClose} className="flex items-center gap-1 text-[#b84289] font-semibold text-sm">
              <ArrowLeft size={16} />
              <span>Mi ciclo</span>
            </button>
            <h3 className="font-heading text-base font-bold text-[#1A1A1A] flex-1 text-center">Registrar período</h3>
            <div className="w-20" />
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-[#444444] mb-1 block">Fecha de inicio</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-[#1A1A1A] outline-none focus:border-[#b84289]" />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#444444] mb-2 block">Duración: {days} días</label>
            <input type="range" min="1" max="10" value={days} onChange={e => setDays(Number(e.target.value))}
              className="w-full accent-[#b84289]" />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#444444] mb-2 block">Intensidad general</label>
            <div className="flex gap-2">
              {[1, 2, 3].map(lv => (
                <button key={lv} onClick={() => setIntensity(lv)}
                  className={`flex-1 flex flex-col items-center py-3 rounded-xl border-2 transition-all ${intensity === lv ? 'border-[#E53E3E] bg-red-50' : 'border-gray-200'}`}>
                  <Droplet size={intensitySize(lv)} />
                  <span className="text-[9px] font-semibold text-[#444444] mt-1">
                    {lv === 1 ? 'Leve' : lv === 2 ? 'Moderado' : 'Abundante'}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-[#444444] mb-1 block">Nota (opcional)</label>
            <input type="text" value={note} onChange={e => setNote(e.target.value)}
              placeholder="Ej. Manchado leve, calambres..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-[#1A1A1A] outline-none focus:border-[#b84289]" />
          </div>
        </div>
        <div className="flex gap-3 px-6 pb-8">
          <button onClick={onClose} className="flex-1 py-3 rounded-2xl border border-gray-200 text-sm text-[#444444] font-semibold">Cancelar</button>
          <button onClick={handleAdd} disabled={!startDate}
            className="flex-1 py-3 rounded-2xl gradient-primary text-white text-sm font-semibold disabled:opacity-40">
            Guardar período
          </button>
        </div>
      </div>
    </div>
  )
}

function getAvgIntensity(cycle) {
  const vals = cycle.intensity.filter(v => v > 0)
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0
}

function TransicionView({ cycles }) {
  const today = new Date()

  if (!cycles.length) {
    return (
      <div className="px-4 py-8 text-center">
        <p className="text-sm text-[#444444]">Registra al menos un período para ver tu línea de transición.</p>
      </div>
    )
  }

  const firstDate = new Date(cycles[0].startDate)
  const months = []
  let y = firstDate.getFullYear(), m = firstDate.getMonth()
  const endY = today.getFullYear(), endM = today.getMonth()
  while (y < endY || (y === endY && m <= endM)) {
    const yearMonth = `${y}-${String(m + 1).padStart(2, '0')}`
    const cycle = cycles.find(c => c.startDate.startsWith(yearMonth))
    months.push({ yearMonth, month: m, year: y, cycle: cycle || null })
    m++
    if (m > 11) { m = 0; y++ }
  }

  const displayMonths = months.slice(-24)
  const maxDuration = Math.max(...displayMonths.filter(mo => mo.cycle).map(mo => mo.cycle.durationDays), 1)
  const MAX_BAR_H = 56
  const MIN_BAR_H = 16
  const BAR_W = 28
  const BAR_GAP = 6
  const STEP = BAR_W + BAR_GAP
  const svgW = displayMonths.length * STEP
  const SVG_H = 52

  const gaps = cycles.filter(c => c.daysToNext).map(c => c.daysToNext)
  const avgGap = gaps.length ? Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length) : null
  const lastCycle = cycles[cycles.length - 1]
  const daysSinceLast = Math.floor((today - new Date(lastCycle.startDate)) / (1000 * 60 * 60 * 24))
  const monthsWithPeriod = displayMonths.filter(mo => mo.cycle).length
  const monthsWithoutPeriod = displayMonths.filter(mo => !mo.cycle).length

  const intensityPoints = displayMonths
    .map((mo, i) => mo.cycle ? { x: i * STEP + BAR_W / 2, y: getAvgIntensity(mo.cycle) } : null)
    .filter(Boolean)

  return (
    <div className="px-4 py-4 pb-28 space-y-4">
      {daysSinceLast >= 365 ? (
        <AlertCard type="red"
          message="Han pasado más de 12 meses sin período. Esto es menopausia oficial (criterio clínico). Si aparece cualquier sangrado, consúltalo de forma urgente con tu ginecóloga."
          action="Habla con tu ginecóloga." />
      ) : daysSinceLast >= 60 ? (
        <AlertCard type="amber"
          message={`Han pasado ${daysSinceLast} días desde tu último período. Los ciclos irregulares y prolongados son característicos de la perimenopausia.`}
          action="Registra tus síntomas y llévalo a tu próxima cita." />
      ) : avgGap && avgGap > 45 ? (
        <AlertCard type="blue"
          message={`Tu ciclo medio es de ${avgGap} días — más largo que el rango habitual (21-35 días). Esto es típico en perimenopausia.`}
          action={null} />
      ) : null}

      {/* Bar timeline */}
      <div className="card p-4">
        <h2 className="font-heading text-sm font-semibold text-[#1A1A1A] mb-3">
          Línea de tiempo · últimos {displayMonths.length} meses
        </h2>
        <div className="overflow-x-auto">
          <div className="flex items-end gap-1.5 pb-1" style={{ width: svgW, height: MAX_BAR_H + 20 }}>
            {displayMonths.map((mo) => {
              const hasCycle = !!mo.cycle
              const barH = hasCycle
                ? Math.max(MIN_BAR_H, Math.round((mo.cycle.durationDays / maxDuration) * MAX_BAR_H))
                : 8
              const avgInt = hasCycle ? getAvgIntensity(mo.cycle) : 0
              const opacity = hasCycle ? 0.35 + (avgInt / 4) * 0.65 : 1
              return (
                <div key={mo.yearMonth} className="flex flex-col items-center flex-shrink-0" style={{ width: BAR_W }}>
                  <div
                    className="w-full rounded-t-sm"
                    style={{ height: barH, backgroundColor: hasCycle ? RED : '#E5E7EB', opacity }}
                  />
                  <span className="text-[8px] text-[#666666] font-medium mt-0.5">
                    {MONTH_SHORT[mo.month]}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: RED }} />
            <span className="text-[10px] text-[#444444]">Con período · altura = duración</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-gray-200" />
            <span className="text-[10px] text-[#444444]">Sin período</span>
          </div>
        </div>
      </div>

      {/* SVG polyline intensity chart */}
      {intensityPoints.length >= 2 && (
        <div className="card p-4">
          <h2 className="font-heading text-sm font-semibold text-[#1A1A1A] mb-0.5">Intensidad media del flujo</h2>
          <p className="text-[10px] text-[#666666] mb-3">Tendencia por mes con período</p>
          <div className="overflow-x-auto">
            <svg width={svgW} height={SVG_H} style={{ display: 'block' }}>
              <polyline
                points={intensityPoints.map(pt => `${pt.x},${SVG_H - 4 - (pt.y / 4) * (SVG_H - 12)}`).join(' ')}
                fill="none"
                stroke={RED}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.65"
              />
              {intensityPoints.map((pt, i) => (
                <circle key={i} cx={pt.x} cy={SVG_H - 4 - (pt.y / 4) * (SVG_H - 12)} r="3" fill={RED} opacity="0.8" />
              ))}
            </svg>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-[#666666]">← Leve</span>
            <span className="text-[10px] text-[#666666]">Abundante →</span>
          </div>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card p-4 text-center">
          <div className="font-heading text-xl font-bold text-[#E53E3E]">{monthsWithPeriod}</div>
          <div className="text-[10px] text-[#666666] mt-0.5 leading-tight">meses con período</div>
        </div>
        <div className="card p-4 text-center">
          <div className="font-heading text-xl font-bold text-[#444444]">{monthsWithoutPeriod}</div>
          <div className="text-[10px] text-[#666666] mt-0.5 leading-tight">meses sin período</div>
        </div>
        <div className="card p-4 text-center">
          <div className="font-heading text-xl font-bold text-[#b84289]">{avgGap ?? '—'}</div>
          <div className="text-[10px] text-[#666666] mt-0.5 leading-tight">días de ciclo medio</div>
        </div>
      </div>

      <div className="card p-4">
        <p className="text-xs font-semibold text-[#1A1A1A] mb-1">¿Qué significa esto?</p>
        <p className="text-xs text-[#444444] leading-relaxed">
          La irregularidad de los ciclos es una de las señales más características de la perimenopausia. Ver la evolución mes a mes te ayuda a entender en qué momento de la transición te encuentras y qué puedes esperar.
        </p>
      </div>
    </div>
  )
}

export default function MiCiclo() {
  const navigate = useNavigate()
  const [cycles, setCycles] = useState(DEMO_CYCLE_DATA.map(c => ({ ...c, extras: c.extras || {} })))
  const [showAddModal, setShowAddModal] = useState(false)
  const [dayModal, setDayModal] = useState(null)
  const [activeTab, setActiveTab] = useState('ciclo')

  const gaps = cycles.filter(c => c.daysToNext).map(c => c.daysToNext)
  const avgGap = gaps.length ? Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length) : null
  const lastCycle = cycles[cycles.length - 1]
  const lastDate = new Date(lastCycle.startDate)
  const daysSinceLast = Math.floor((new Date() - lastDate) / (1000 * 60 * 60 * 24))

  const alerts = []
  if (daysSinceLast >= 365) {
    alerts.push({ type: 'red', message: 'Han pasado más de 12 meses desde tu último período. Si se produce cualquier sangrado vaginal ahora, consúltalo con tu ginecóloga de forma urgente.', action: 'Habla con tu ginecóloga.' })
  } else if (daysSinceLast >= 60) {
    alerts.push({ type: 'amber', message: `Han pasado ${daysSinceLast} días desde tu último período. Ciclos de más de 60 días son frecuentes en perimenopausia.`, action: 'Registra tus síntomas y llévalo a tu próxima cita.' })
  }
  if (avgGap && avgGap > 45) {
    alerts.push({ type: 'blue', message: `Tu ciclo medio es de ${avgGap} días — más largo que el rango habitual (21–35 días). Esto es típico en perimenopausia.`, action: null })
  }

  const handleAdd = (cycle) => {
    setCycles(c => [...c, cycle].sort((a, b) => a.startDate.localeCompare(b.startDate)))
  }

  const handleDaySave = (cycleId, dayIndex, level, extra) => {
    setCycles(cycles => cycles.map(c => {
      if (c.id !== cycleId) return c
      const newIntensity = [...c.intensity]
      newIntensity[dayIndex] = level
      const newExtras = { ...c.extras, [dayIndex]: extra }
      return { ...c, intensity: newIntensity, extras: newExtras }
    }))
    setDayModal(null)
  }

  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      <div className="gradient-primary px-4 pt-14 pb-5">
        <div className="flex items-center gap-3 mb-1">
          <button onClick={() => navigate('/user/health')} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <ArrowLeft size={16} className="text-white" />
          </button>
          <h1 className="font-heading text-xl font-bold text-white">Mi Ciclo</h1>
        </div>
        <p className="text-white/70 text-xs ml-11">Registro de menstruación en perimenopausia</p>
      </div>

      {/* Tab switcher */}
      <div className="px-4 pt-4">
        <div className="flex bg-gray-100 rounded-2xl p-1">
          {[
            { key: 'ciclo', label: 'Mi ciclo' },
            { key: 'transicion', label: 'Mi transición' },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === tab.key ? 'bg-white shadow-sm text-[#1A1A1A]' : 'text-[#444444]'}`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'ciclo' && (
        <div className="px-4 py-4 pb-28 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="card p-4 text-center">
              <div className="font-heading text-xl font-bold text-[#b84289]">{daysSinceLast}</div>
              <div className="text-[10px] text-[#666666] mt-0.5 leading-tight">días desde el último período</div>
            </div>
            <div className="card p-4 text-center">
              <div className="font-heading text-xl font-bold text-[#b84289]">{avgGap ?? '—'}</div>
              <div className="text-[10px] text-[#666666] mt-0.5 leading-tight">días de ciclo medio</div>
            </div>
            <div className="card p-4 text-center">
              <div className="font-heading text-xl font-bold text-[#10B981]">{cycles.length}</div>
              <div className="text-[10px] text-[#666666] mt-0.5 leading-tight">períodos registrados</div>
            </div>
          </div>

          {alerts.length > 0 && (
            <div className="space-y-2">
              {alerts.map((a, i) => <AlertCard key={i} {...a} />)}
            </div>
          )}

          <button onClick={() => setShowAddModal(true)}
            className="w-full card p-4 flex items-center gap-3 hover:shadow active:scale-[0.99] transition-all">
            <div className="w-10 h-10 rounded-2xl bg-[#EF4444]/10 flex items-center justify-center flex-shrink-0">
              <Plus size={18} className="text-[#EF4444]" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-semibold text-sm text-[#1A1A1A]">Registrar período</div>
              <div className="text-xs text-[#444444]">Añade fecha, duración e intensidad</div>
            </div>
          </button>

          <div className="card p-4">
            <p className="text-[10px] font-bold text-[#666666] uppercase tracking-wide mb-3">Leyenda de intensidad</p>
            <div className="flex items-center gap-4 flex-wrap">
              {[{ lv: 1, label: 'Leve' }, { lv: 2, label: 'Moderado' }, { lv: 3, label: 'Abundante' }].map(({ lv, label }) => (
                <div key={lv} className="flex items-center gap-1.5">
                  <Droplet size={intensitySize(lv)} />
                  <span className="text-[10px] text-[#444444]">{label}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-[#666666] mt-2">Pulsa sobre cualquier día para registrar síntomas adicionales.</p>
          </div>

          <div>
            <h2 className="font-heading text-sm font-semibold text-[#1A1A1A] mb-3">Historial de períodos</h2>
            <div className="space-y-3">
              {[...cycles].reverse().map((c) => (
                <CycleEntry
                  key={c.id}
                  cycle={c}
                  onDayClick={(cycleId, dayNum, level, extra) => setDayModal({ cycleId, dayNum, level, extra })}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'transicion' && <TransicionView cycles={cycles} />}

      {showAddModal && <AddPeriodModal onClose={() => setShowAddModal(false)} onAdd={handleAdd} />}
      {dayModal && (
        <DaySymptomModal
          cycleId={dayModal.cycleId}
          dayNum={dayModal.dayNum}
          currentLevel={dayModal.level}
          extraData={dayModal.extra}
          onSave={handleDaySave}
          onClose={() => setDayModal(null)}
        />
      )}
    </div>
  )
}
