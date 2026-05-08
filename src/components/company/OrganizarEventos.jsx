import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Star, Users, Clock, ChevronDown, ChevronUp, Check } from 'lucide-react'
import { WORKSHOP_FORMATS, MANAGEMENT_WORKSHOPS, COMPANY_EVENT_HISTORY, PRICE_NOTE_COMMON } from '../../data/mockData'

function priceDisplay(ws) {
  if (ws.priceUnit) return `${ws.price}${ws.priceUnit}`
  return `${ws.price.toLocaleString('es-ES')}€`
}

function WorkshopCard({ ws, isManagement }) {
  const [open, setOpen] = useState(false)
  const [requested, setRequested] = useState(false)
  const cardBg = isManagement ? 'bg-[#1E3A8A]/5 border border-[#1E3A8A]/10' : ''
  return (
    <div className={`card p-5 ${cardBg}`}>
      <button onClick={() => setOpen(o => !o)} className="w-full text-left">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl"
            style={{ backgroundColor: (ws.color || '#1E3A8A') + '18' }}>
            {ws.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
              <span className="font-semibold text-sm text-[#1A1A1A]">{ws.name}</span>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-[#666666] flex-wrap">
              <span className="flex items-center gap-1"><Clock size={9} /> {ws.duration}</span>
              <span className="flex items-center gap-1"><Users size={9} /> Máx {ws.maxAttendees}</span>
              <span className="px-2 py-0.5 rounded-lg text-[9px] font-semibold"
                style={{ backgroundColor: (ws.color || '#1E3A8A') + '18', color: ws.color || '#1E3A8A' }}>
                {ws.category}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <div className="text-sm font-bold text-[#1A1A1A]">{priceDisplay(ws)}</div>
            {open ? <ChevronUp size={14} className="text-[#666666]" /> : <ChevronDown size={14} className="text-[#666666]" />}
          </div>
        </div>
      </button>

      {open && (
        <div className="mt-4 space-y-3">
          <p className="text-xs text-[#444444] leading-relaxed">{ws.description}</p>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-[10px] font-bold text-[#1A1A1A] mb-1.5">Incluye:</p>
            <div className="space-y-1">
              {ws.includes.map((inc, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <Check size={10} className="text-green-500 flex-shrink-0" />
                  <span className="text-[11px] text-[#444444]">{inc}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl p-3" style={{ backgroundColor: (ws.color || '#1E3A8A') + '10' }}>
            <p className="text-[10px] font-bold mb-0.5" style={{ color: ws.color || '#1E3A8A' }}>Impacto documentado</p>
            <p className="text-[11px]" style={{ color: ws.color || '#1E3A8A' }}>{ws.impact}</p>
          </div>
          <p className="text-[10px] text-[#666666]">Formato: {ws.format}</p>
          {ws.priceNote && <p className="text-[10px] text-[#666666]">📌 {ws.priceNote}</p>}
          {requested ? (
            <div className="w-full py-3 rounded-2xl bg-green-50 text-green-700 font-semibold text-sm text-center">
              Solicitud enviada ✓
            </div>
          ) : (
            <button onClick={() => setRequested(true)}
              className="w-full py-3 rounded-2xl text-white font-semibold text-sm"
              style={{ background: `linear-gradient(135deg, ${ws.color || '#1E3A8A'}dd, ${ws.color || '#1E3A8A'})` }}>
              Solicitar este taller
            </button>
          )}
        </div>
      )}
    </div>
  )
}

function RequestForm({ onSubmit }) {
  const [form, setForm] = useState({ format: '', date: '', attendees: '', notes: '' })
  const [submitted, setSubmitted] = useState(false)
  const allFormats = [...WORKSHOP_FORMATS, ...MANAGEMENT_WORKSHOPS]

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    onSubmit(form)
  }

  if (submitted) {
    return (
      <div className="card p-8 text-center">
        <div className="text-4xl mb-3">✅</div>
        <h3 className="font-heading text-lg font-bold text-[#1A1A1A] mb-2">Solicitud enviada</h3>
        <p className="text-sm text-[#444444] leading-relaxed">Tu equipo de Herya la revisará y te contactará en un plazo de 24–48 horas hábiles para confirmar disponibilidad y fechas.</p>
      </div>
    )
  }

  return (
    <div className="card p-5">
      <h2 className="font-heading text-base font-semibold text-[#1A1A1A] mb-4">Solicitar un evento</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-[#444444] mb-1 block">Formato de taller</label>
          <select value={form.format} onChange={e => setForm(f => ({ ...f, format: e.target.value }))} required
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-[#1A1A1A] outline-none focus:border-[#b84289] bg-white">
            <option value="">Selecciona un formato</option>
            <optgroup label="Para empleadas">
              {WORKSHOP_FORMATS.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
            </optgroup>
            <optgroup label="Para equipos directivos y RRHH">
              {MANAGEMENT_WORKSHOPS.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
            </optgroup>
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-[#444444] mb-1 block">Fecha preferida</label>
          <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-[#1A1A1A] outline-none focus:border-[#b84289]" />
        </div>
        <div>
          <label className="text-xs font-semibold text-[#444444] mb-1 block">Número estimado de asistentes</label>
          <input type="number" min="5" value={form.attendees} onChange={e => setForm(f => ({ ...f, attendees: e.target.value }))} required
            placeholder="Ej. 25"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-[#1A1A1A] outline-none focus:border-[#b84289]" />
        </div>
        <div>
          <label className="text-xs font-semibold text-[#444444] mb-1 block">Notas adicionales (opcional)</label>
          <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={3}
            placeholder="Departamento específico, necesidades especiales, presupuesto..."
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-[#1A1A1A] outline-none focus:border-[#b84289] resize-none" />
        </div>
        <button type="submit" className="w-full py-3 rounded-2xl gradient-primary text-white font-semibold text-sm">
          Enviar solicitud
        </button>
      </form>
    </div>
  )
}

export default function OrganizarEventos() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('catalogo')

  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      <div className="gradient-primary px-4 pt-14 pb-5">
        <div className="flex items-center gap-3 mb-1">
          <button onClick={() => navigate('/company/dashboard')} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <ArrowLeft size={16} className="text-white" />
          </button>
          <h1 className="font-heading text-xl font-bold text-white">Organizar con Herya</h1>
        </div>
        <p className="text-white/70 text-xs ml-11">Talleres y eventos para tu organización</p>
      </div>

      <div className="flex bg-gray-100 mx-4 mt-4 rounded-2xl p-1">
        {[
          { key: 'catalogo', label: 'Catálogo' },
          { key: 'solicitar', label: 'Solicitar' },
          { key: 'historial', label: 'Historial' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${tab === t.key ? 'bg-white shadow-sm text-[#1A1A1A]' : 'text-[#444444]'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="px-4 py-4 pb-16 space-y-4">
        {tab === 'catalogo' && (
          <>
            <div className="card p-4 bg-gradient-to-r from-[#b84289]/5 to-[#b84289]/5">
              <p className="text-xs text-[#444444] leading-relaxed">
                Todos los formatos están diseñados por especialistas en menopausia y se adaptan al contexto y cultura de tu empresa. Impacto documentado en bienestar y productividad.
              </p>
            </div>
            <div className="border border-amber-200 rounded-2xl p-3 bg-amber-50">
              <p className="text-[10px] text-amber-700 leading-relaxed">{PRICE_NOTE_COMMON}</p>
            </div>
            {WORKSHOP_FORMATS.map(ws => <WorkshopCard key={ws.id} ws={ws} />)}

            <div className="pt-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-[10px] font-bold text-[#1E3A8A] uppercase tracking-wide px-2 whitespace-nowrap">
                  Formación para equipos directivos y RRHH
                </span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              <div className="card p-4 bg-[#1E3A8A]/5 border border-[#1E3A8A]/10 mb-3">
                <p className="text-xs text-[#1E3A8A] leading-relaxed">
                  Programas específicos para mánagers, RRHH y dirección. El cambio cultural empieza por quienes lideran — no solo por las mujeres afectadas.
                </p>
              </div>
              {MANAGEMENT_WORKSHOPS.map(ws => <WorkshopCard key={ws.id} ws={ws} isManagement />)}
            </div>
          </>
        )}

        {tab === 'solicitar' && (
          <RequestForm onSubmit={() => {}} />
        )}

        {tab === 'historial' && (
          <div className="space-y-4">
            {COMPANY_EVENT_HISTORY.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-3xl mb-2">📅</p>
                <p className="text-sm text-[#444444]">No hay eventos pasados aún.</p>
              </div>
            ) : (
              COMPANY_EVENT_HISTORY.map(ev => {
                const ws = [...WORKSHOP_FORMATS, ...MANAGEMENT_WORKSHOPS].find(w => w.id === ev.workshopId)
                if (!ws) return null
                return (
                  <div key={ev.id} className="card p-5">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
                        style={{ backgroundColor: (ws.color || '#1E3A8A') + '18' }}>
                        {ws.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-[#1A1A1A]">{ws.name}</div>
                        <div className="text-[10px] text-[#666666]">{ev.date}</div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Star size={12} className="text-amber-400 fill-amber-400" />
                        <span className="text-sm font-bold text-[#1A1A1A]">{ev.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-blue-50 rounded-xl px-3 py-1.5 text-center">
                        <div className="text-sm font-bold text-[#b84289]">{ev.attendees}/{ev.maxAttendees}</div>
                        <div className="text-[9px] text-[#666666]">asistentes</div>
                      </div>
                      <div className="bg-green-50 rounded-xl px-3 py-1.5 text-center">
                        <div className="text-sm font-bold text-[#10B981]">{Math.round(ev.attendees / ev.maxAttendees * 100)}%</div>
                        <div className="text-[9px] text-[#666666]">ocupación</div>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-[10px] text-[#666666] font-semibold mb-0.5 uppercase tracking-wide">Feedback destacado</p>
                      <p className="text-xs text-[#444444] italic">"{ev.feedback}"</p>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}
      </div>
    </div>
  )
}
