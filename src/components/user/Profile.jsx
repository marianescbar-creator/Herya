import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, RefreshCw, User, Heart, Building2, Bell, Info, Pill, Calendar, FolderOpen, Plus, X, Check } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { getSeverityInfo } from '../../data/mockData'

const SUGGESTED_SUPPLEMENTS = [
  { id: 'mag', name: 'Magnesio bisglicinato', dose: '400mg', time: '22:00', note: 'Antes de dormir' },
  { id: 'vitd', name: 'Vitamina D3', dose: '2000 UI', time: '14:00', note: 'Con el almuerzo' },
  { id: 'omega', name: 'Omega-3', dose: '1g', time: '14:00', note: 'Con la comida principal' },
]

function MedReminder({ item, onToggle, onRemove, active }) {
  return (
    <div className={`flex items-center justify-between py-3 border-b border-gray-50 last:border-0 ${!active ? 'opacity-50' : ''}`}>
      <div className="flex-1 pr-3">
        <div className="font-medium text-sm text-[#1A1A1A]">{item.name}</div>
        <div className="text-xs text-[#444444]">{item.dose} · {item.time}{item.note ? ` · ${item.note}` : ''}</div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {onRemove && (
          <button onClick={onRemove} className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center">
            <X size={10} className="text-red-400" />
          </button>
        )}
        <button onClick={onToggle}
          className={`w-12 h-6 rounded-full transition-colors relative ${active ? 'bg-[#b84289]' : 'bg-gray-200'}`}>
          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${active ? 'left-7' : 'left-1'}`} />
        </button>
      </div>
    </div>
  )
}

function Toggle({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-gray-50 last:border-0">
      <div className="flex-1 pr-4">
        <div className="font-medium text-sm text-[#1A1A1A]">{label}</div>
        {description && <div className="text-xs text-[#444444] mt-0.5">{description}</div>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`w-12 h-6 rounded-full transition-colors flex-shrink-0 relative ${checked ? 'bg-[#b84289]' : 'bg-gray-200'}`}
      >
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${checked ? 'left-7' : 'left-1'}`} />
      </button>
    </div>
  )
}

function TimeSelect({ value, options, onChange }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="border border-gray-200 rounded-xl text-sm px-3 py-2 focus:outline-none focus:border-[#b84289] bg-white text-[#1A1A1A]"
    >
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  )
}

export default function Profile() {
  const navigate = useNavigate()
  const { userProfile, reminderSettings, saveReminderSettings, resetToDemo, clearProfile } = useApp()

  const update = (key, val) => saveReminderSettings({ ...reminderSettings, [key]: val })

  // Medication reminders state
  const [activeSupps, setActiveSupps] = useState({ mag: false, vitd: true, omega: false })
  const [customMeds, setCustomMeds] = useState([])
  const [showAddMed, setShowAddMed] = useState(false)
  const [newMed, setNewMed] = useState({ name: '', dose: '', time: '08:00', note: '' })
  const [medicalReminders, setMedicalReminders] = useState([
    { id: 'analitic', label: 'Próxima analítica', date: '2026-06-01', active: true },
    { id: 'gine', label: 'Revisión ginecológica', date: '2026-07-15', active: false },
  ])

  const addCustomMed = () => {
    if (!newMed.name) return
    setCustomMeds(m => [...m, { id: Date.now(), ...newMed, active: true }])
    setNewMed({ name: '', dose: '', time: '08:00', note: '' })
    setShowAddMed(false)
  }

  const toggleCustomMed = (id) => {
    setCustomMeds(m => m.map(med => med.id === id ? { ...med, active: !med.active } : med))
  }

  const removeCustomMed = (id) => {
    setCustomMeds(m => m.filter(med => med.id !== id))
  }

  if (!userProfile) return (
    <div className="p-6 text-center py-20">
      <p className="text-[#444444] mb-4">No hay perfil completado.</p>
      <button onClick={() => navigate('/user/assessment')} className="gradient-primary text-white px-6 py-3 rounded-2xl font-semibold">
        Completar cuestionario
      </button>
    </div>
  )

  const sev = getSeverityInfo(userProfile.totalScore)

  return (
    <div className="px-4 py-6 space-y-5 pb-28">
      <div className="pt-8">
        <h1 className="font-heading text-2xl font-bold text-[#1A1A1A]">Mi perfil</h1>
      </div>

      {/* Avatar + name */}
      <div className="card p-6 text-center">
        <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-3">
          <User size={28} className="text-white" />
        </div>
        <h2 className="font-heading text-xl font-bold text-[#1A1A1A]">{userProfile.name}</h2>
        <p className="text-[#444444] text-sm">{userProfile.stage} · {userProfile.age} años</p>
        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
          style={{ backgroundColor: sev.bgColor, color: sev.textColor }}>
          <Heart size={11} />
          Carga sintomática {sev.label} · {userProfile.totalScore}/40
        </div>
      </div>

      {/* Profile details */}
      <div className="card p-5 space-y-1">
        <h3 className="font-semibold text-sm text-[#1A1A1A] mb-3">Datos del perfil</h3>
        {[
          ['Etapa hormonal', userProfile.stage],
          ['Edad', userProfile.age],
          ['Situación laboral', userProfile.work],
          ['Calidad de vida', `${userProfile.qualityOfLife}/10`],
          ['Hablado con médica', userProfile.hasSpokenToDoctor],
        ].map(([label, value]) => (
          <div key={label} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
            <span className="text-xs text-[#444444]">{label}</span>
            <span className="text-sm font-medium text-[#1A1A1A]">{value}</span>
          </div>
        ))}
      </div>

      {/* Management */}
      <div className="card p-5">
        <h3 className="font-semibold text-sm text-[#1A1A1A] mb-3">Manejo actual</h3>
        <div className="flex flex-wrap gap-2">
          {(userProfile.management || []).map(m => (
            <span key={m} className="text-xs px-3 py-1.5 rounded-full bg-[#b84289]/10 text-[#b84289] font-medium">{m}</span>
          ))}
        </div>
      </div>

      {/* ── Reminders ─────────────────────────────────────────────────────────── */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-[#b84289]/10 flex items-center justify-center">
            <Bell size={16} className="text-[#b84289]" />
          </div>
          <h3 className="font-semibold text-sm text-[#1A1A1A]">Recordatorios</h3>
        </div>

        {/* Morning */}
        <div className="py-3.5 border-b border-gray-50">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="font-medium text-sm text-[#1A1A1A]">Recordatorio matutino</div>
              <div className="text-xs text-[#444444]">Arrancar tu rutina del día</div>
            </div>
            <button
              onClick={() => update('morningEnabled', !reminderSettings.morningEnabled)}
              className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${reminderSettings.morningEnabled ? 'bg-[#b84289]' : 'bg-gray-200'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${reminderSettings.morningEnabled ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
          {reminderSettings.morningEnabled && (
            <TimeSelect
              value={reminderSettings.morningTime}
              options={['7:00', '7:30', '8:00', '8:30']}
              onChange={v => update('morningTime', v)}
            />
          )}
        </div>

        {/* Night */}
        <div className="py-3.5 border-b border-gray-50">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="font-medium text-sm text-[#1A1A1A]">Recordatorio rutina de noche</div>
              <div className="text-xs text-[#444444]">Preparar el sueño</div>
            </div>
            <button
              onClick={() => update('nightEnabled', !reminderSettings.nightEnabled)}
              className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${reminderSettings.nightEnabled ? 'bg-[#b84289]' : 'bg-gray-200'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${reminderSettings.nightEnabled ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
          {reminderSettings.nightEnabled && (
            <TimeSelect
              value={reminderSettings.nightTime}
              options={['21:00', '21:30', '22:00']}
              onChange={v => update('nightTime', v)}
            />
          )}
        </div>

        {/* Weekly check-in */}
        <div className="py-3.5 border-b border-gray-50">
          <div className="font-medium text-sm text-[#1A1A1A] mb-1">Check-in semanal</div>
          <div className="text-xs text-[#444444] mb-2">Día preferido para el registro de síntomas</div>
          <TimeSelect
            value={reminderSettings.checkinDay}
            options={['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']}
            onChange={v => update('checkinDay', v)}
          />
        </div>

        {/* Hydration */}
        <Toggle
          label="Recordatorio hidratación"
          description="Avisos periódicos para beber agua"
          checked={reminderSettings.hydrationEnabled}
          onChange={v => update('hydrationEnabled', v)}
        />

        {/* Notice */}
        <div className="mt-3 p-3 bg-amber-50 rounded-xl flex items-start gap-2">
          <Info size={13} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-[10px] text-amber-700 leading-relaxed">
            Las notificaciones se activarán en la versión instalable de Herya. Tu configuración queda guardada.
          </p>
        </div>
      </div>

      {/* ── Historial clínico ──────────────────────────────────────────────────── */}
      <button onClick={() => navigate('/user/mi-historial')}
        className="w-full card p-4 flex items-center gap-3 hover:shadow-card-hover transition-all active:scale-[0.99]">
        <div className="w-10 h-10 rounded-xl bg-[#b84289]/10 flex items-center justify-center">
          <FolderOpen size={18} className="text-[#b84289]" />
        </div>
        <div className="flex-1 text-left">
          <div className="font-medium text-sm text-[#1A1A1A]">Mi historial clínico</div>
          <div className="text-xs text-[#444444]">Analíticas, informes y documentos médicos</div>
        </div>
      </button>

      {/* ── Medication reminders ──────────────────────────────────────────────── */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-[#b84289]/10 flex items-center justify-center">
            <Pill size={16} className="text-[#b84289]" />
          </div>
          <h3 className="font-semibold text-sm text-[#1A1A1A]">Recordatorios de salud</h3>
        </div>

        {/* Suggested supplements */}
        <p className="text-[10px] font-bold text-[#b84289] uppercase tracking-wide mb-2">Sugeridos para tu plan</p>
        {SUGGESTED_SUPPLEMENTS.map(s => (
          <MedReminder
            key={s.id}
            item={s}
            active={activeSupps[s.id]}
            onToggle={() => setActiveSupps(a => ({ ...a, [s.id]: !a[s.id] }))}
          />
        ))}

        {/* Custom meds */}
        {customMeds.length > 0 && (
          <>
            <p className="text-[10px] font-bold text-[#666666] uppercase tracking-wide mt-4 mb-2">Mis recordatorios personalizados</p>
            {customMeds.map(med => (
              <MedReminder
                key={med.id}
                item={med}
                active={med.active}
                onToggle={() => toggleCustomMed(med.id)}
                onRemove={() => removeCustomMed(med.id)}
              />
            ))}
          </>
        )}

        {/* Add custom med */}
        {showAddMed ? (
          <div className="mt-4 space-y-3 border-t border-gray-100 pt-4">
            <input type="text" value={newMed.name} onChange={e => setNewMed(m => ({ ...m, name: e.target.value }))}
              placeholder="Nombre del suplemento o medicamento"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-[#1A1A1A] outline-none focus:border-[#b84289]" />
            <div className="flex gap-2">
              <input type="text" value={newMed.dose} onChange={e => setNewMed(m => ({ ...m, dose: e.target.value }))}
                placeholder="Dosis (ej. 400mg)"
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-[#1A1A1A] outline-none focus:border-[#b84289]" />
              <input type="time" value={newMed.time} onChange={e => setNewMed(m => ({ ...m, time: e.target.value }))}
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-[#1A1A1A] outline-none focus:border-[#b84289]" />
            </div>
            <input type="text" value={newMed.note} onChange={e => setNewMed(m => ({ ...m, note: e.target.value }))}
              placeholder="Nota (ej. Tomar con la comida)"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-[#1A1A1A] outline-none focus:border-[#b84289]" />
            <div className="flex gap-2">
              <button onClick={() => setShowAddMed(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs text-[#444444] font-semibold">
                Cancelar
              </button>
              <button onClick={addCustomMed} disabled={!newMed.name}
                className="flex-1 py-2.5 rounded-xl bg-[#b84289] text-white text-xs font-semibold disabled:opacity-40">
                Añadir
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowAddMed(true)}
            className="mt-4 flex items-center gap-2 text-xs font-semibold text-[#b84289] border border-[#b84289]/30 px-3 py-2 rounded-xl">
            <Plus size={12} /> Añadir recordatorio personalizado
          </button>
        )}

        {/* Medical reminders */}
        <p className="text-[10px] font-bold text-[#666666] uppercase tracking-wide mt-5 mb-2">Revisiones médicas</p>
        {medicalReminders.map(mr => (
          <div key={mr.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
            <div className="flex items-center gap-2 flex-1">
              <Calendar size={13} className="text-[#b84289] flex-shrink-0" />
              <div>
                <div className="font-medium text-sm text-[#1A1A1A]">{mr.label}</div>
                <div className="text-xs text-[#444444]">{mr.date}</div>
              </div>
            </div>
            <button
              onClick={() => setMedicalReminders(r => r.map(x => x.id === mr.id ? { ...x, active: !x.active } : x))}
              className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${mr.active ? 'bg-[#b84289]' : 'bg-gray-200'}`}>
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${mr.active ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
        ))}

        <div className="mt-3 p-3 bg-amber-50 rounded-xl flex items-start gap-2">
          <Info size={13} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-[10px] text-amber-700 leading-relaxed">
            Las notificaciones se activarán en la versión instalable de Herya. Tu configuración queda guardada.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button onClick={() => navigate('/')}
          className="w-full card p-4 flex items-center gap-3 hover:shadow-card-hover transition-all active:scale-[0.99]">
          <div className="w-10 h-10 rounded-xl bg-[#b84289]/10 flex items-center justify-center">
            <Building2 size={18} className="text-[#b84289]" />
          </div>
          <div className="text-left">
            <div className="font-medium text-sm text-[#1A1A1A]">Cambiar vista</div>
            <div className="text-xs text-[#444444]">Volver al selector de rol</div>
          </div>
        </button>

        <button onClick={resetToDemo}
          className="w-full card p-4 flex items-center gap-3 hover:shadow-card-hover transition-all active:scale-[0.99]">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
            <RefreshCw size={18} className="text-green-600" />
          </div>
          <div className="text-left">
            <div className="font-medium text-sm text-[#1A1A1A]">Restaurar demo</div>
            <div className="text-xs text-[#444444]">Vuelve al perfil de Carmen</div>
          </div>
        </button>

        <button onClick={() => { clearProfile(); navigate('/user/assessment') }}
          className="w-full card p-4 flex items-center gap-3 active:scale-[0.99]">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
            <LogOut size={18} className="text-red-500" />
          </div>
          <div className="text-left">
            <div className="font-medium text-sm text-[#1A1A1A]">Empezar desde cero</div>
            <div className="text-xs text-[#444444]">Completa el cuestionario de nuevo</div>
          </div>
        </button>
      </div>

      <div className="text-center text-xs text-[#666666] pb-4">
        Herya MVP · v2.0 Demo · Datos simulados
      </div>
    </div>
  )
}
