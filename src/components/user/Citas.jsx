import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Video, Calendar, MessageSquare, AlertCircle, ChevronRight, Send, Star, Clock } from 'lucide-react'
import { DOCTOR_PROFILE, MOCK_SPECIALISTS } from '../../data/mockData'

const MOCK_MESSAGES = [
  { id: 1, from: 'doctor', text: 'Buenos días Carmen. He revisado tus últimos registros de síntomas. Veo que el insomnio sigue siendo el síntoma más activo esta semana. ¿Has podido probar la temperatura de 18°C en el dormitorio que hablamos?', time: 'Lun 10:24h' },
  { id: 2, from: 'user', text: 'Sí, lo he probado. La primera noche fue rara pero la segunda dormí bastante mejor. Los sofocos nocturnos siguen ahí pero me despertaron menos.', time: 'Lun 11:02h' },
  { id: 3, from: 'doctor', text: 'Eso es muy buena señal. La reducción de temperatura actúa sobre el mecanismo hipotalámico — el cuerpo tiene que ajustarse unos días. Sigue con ello. Para la próxima consulta del 8 de mayo revisamos si tiene sentido valorar progesterona micronizada.', time: 'Lun 11:18h' },
]

const AVAILABLE_SLOTS = [
  { date: 'Mañana', time: '10:00h', type: 'Videoconsulta', duration: '30 min' },
  { date: 'Mañana', time: '12:30h', type: 'Videoconsulta', duration: '30 min' },
  { date: '30 abr', time: '9:00h', type: 'Videoconsulta', duration: '45 min' },
  { date: '2 may', time: '11:00h', type: 'Presencial', duration: '30 min' },
]

function MessageBubble({ msg }) {
  const isUser = msg.from === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center mr-2 flex-shrink-0 mt-1">
          <span className="text-white text-[9px] font-bold">AM</span>
        </div>
      )}
      <div className="max-w-[78%]">
        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${isUser ? 'gradient-primary text-white rounded-tr-sm' : 'bg-white shadow-card text-[#1A1A1A] rounded-tl-sm'}`}>
          {msg.text}
        </div>
        <div className={`text-[10px] text-[#666666] mt-1 ${isUser ? 'text-right' : 'text-left'}`}>{msg.time}</div>
      </div>
    </div>
  )
}

export default function Citas() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('cita')
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState(MOCK_MESSAGES)
  const [showUrgent, setShowUrgent] = useState(false)
  const [scheduledSlot, setScheduledSlot] = useState(null)
  const doc = DOCTOR_PROFILE

  const sendMessage = () => {
    if (!input.trim()) return
    setMessages(m => [...m, { id: Date.now(), from: 'user', text: input.trim(), time: 'Ahora' }])
    setInput('')
    setTimeout(() => {
      setMessages(m => [...m, { id: Date.now() + 1, from: 'doctor', text: 'Gracias por tu mensaje, Carmen. Lo reviso y te respondo en breve. Si es urgente, usa el botón de consulta urgente.', time: 'Ahora' }])
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      {/* Header */}
      <div className="gradient-primary px-4 pt-14 pb-5">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate('/user/health')} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <ArrowLeft size={16} className="text-white" />
          </button>
          <h1 className="font-heading text-xl font-bold text-white">Mis especialistas</h1>
        </div>

        {/* Doctor mini-profile */}
        <div className="bg-white/15 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">{doc.avatar}</span>
          </div>
          <div className="flex-1">
            <div className="text-white font-semibold text-sm">{doc.name}</div>
            <div className="text-white/70 text-xs">{doc.specialty}</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] text-amber-300">{'★'.repeat(Math.round(doc.rating))}</span>
              <span className="text-[10px] text-white/50">{doc.rating} · {doc.consultations} consultas contigo</span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className={`w-2.5 h-2.5 rounded-full ${doc.available ? 'bg-green-400' : 'bg-gray-400'}`} />
            <span className="text-[9px] text-white/60">{doc.available ? 'Disponible' : 'Ocupada'}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 mx-4 mt-4 rounded-2xl p-1">
        {[{ key: 'cita', label: 'Cita' }, { key: 'mensajes', label: `Mensajes ${doc.unreadMessages > 0 ? `(${doc.unreadMessages})` : ''}` }].map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === t.key ? 'bg-white shadow-sm text-[#1A1A1A]' : 'text-[#444444]'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="px-4 py-4 pb-28 space-y-4">
        {activeTab === 'cita' && (
          <>
            {/* Next appointment */}
            <div className="card p-5">
              <h2 className="font-heading text-base font-semibold text-[#1A1A1A] mb-3">Próxima cita</h2>
              <div className="bg-[#b84289]/5 rounded-2xl p-4 flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-[#b84289]/10 flex items-center justify-center flex-shrink-0">
                  <Video size={20} className="text-[#b84289]" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm text-[#1A1A1A]">{doc.nextAppointment.type}</div>
                  <div className="text-xs text-[#444444]">{doc.nextAppointment.date} a las {doc.nextAppointment.time}</div>
                  <div className="text-xs text-[#b84289] font-medium mt-0.5">Dra. Ana Martínez · 30 min</div>
                </div>
              </div>
              <button className="w-full py-3 rounded-2xl gradient-primary text-white font-semibold text-sm flex items-center justify-center gap-2">
                <Video size={16} /> Unirse a la videoconsulta
              </button>
            </div>

            {/* Urgent consultation */}
            <div className="card p-5 border-l-4 border-[#EF4444]">
              <div className="flex items-start gap-3 mb-3">
                <AlertCircle size={18} className="text-[#EF4444] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-sm text-[#1A1A1A]">Consulta urgente</div>
                  <div className="text-xs text-[#444444]">Si tus síntomas son severos o tienes dudas que no pueden esperar</div>
                </div>
              </div>
              {!showUrgent ? (
                <button onClick={() => setShowUrgent(true)}
                  className="w-full py-3 rounded-2xl border-2 border-[#EF4444] text-[#EF4444] font-semibold text-sm">
                  Solicitar consulta urgente
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="bg-red-50 rounded-xl p-3">
                    <p className="text-xs text-red-700 leading-relaxed">
                      Tu solicitud de consulta urgente ha sido enviada a la Dra. Martínez. Te contactará en un máximo de 2 horas en horario laboral (9-18h) o en el primer hueco disponible mañana.
                    </p>
                  </div>
                  <button onClick={() => setActiveTab('mensajes')}
                    className="w-full py-2.5 rounded-xl bg-red-50 text-[#EF4444] font-semibold text-sm">
                    Ver chat con la doctora
                  </button>
                </div>
              )}
            </div>

            {/* Schedule new appointment */}
            <div className="card p-5">
              <h2 className="font-heading text-base font-semibold text-[#1A1A1A] mb-3">Agendar nueva cita</h2>
              <div className="space-y-2">
                {AVAILABLE_SLOTS.map((slot, i) => (
                  <button key={i} onClick={() => setScheduledSlot(scheduledSlot === i ? null : i)}
                    className={`w-full p-3 rounded-2xl text-left flex items-center gap-3 transition-all border ${scheduledSlot === i ? 'border-[#b84289] bg-[#b84289]/5' : 'border-gray-100 bg-gray-50'}`}>
                    <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center flex-shrink-0">
                      <Clock size={14} className={scheduledSlot === i ? 'text-[#b84289]' : 'text-[#666666]'} />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-[#1A1A1A]">{slot.date} · {slot.time}</div>
                      <div className="text-xs text-[#444444]">{slot.type} · {slot.duration}</div>
                    </div>
                    {scheduledSlot === i && <span className="text-[#b84289] text-xs font-bold">Seleccionado</span>}
                  </button>
                ))}
              </div>
              {scheduledSlot !== null && (
                <button className="w-full mt-4 py-3 rounded-2xl gradient-primary text-white font-semibold text-sm">
                  Confirmar cita · {AVAILABLE_SLOTS[scheduledSlot].date} {AVAILABLE_SLOTS[scheduledSlot].time}
                </button>
              )}
            </div>

            {/* Other specialists */}
            <div className="card p-5">
              <h2 className="font-heading text-sm font-semibold text-[#1A1A1A] mb-3">Equipo de especialistas</h2>
              <div className="space-y-3">
                {MOCK_SPECIALISTS.slice(1).map((spec, i) => (
                  <div key={i} className="flex items-center gap-3 py-2">
                    <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">{spec.avatar}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-[#1A1A1A]">{spec.name}</div>
                      <div className="text-xs text-[#444444] truncate">{spec.specialty}</div>
                    </div>
                    <button className="text-xs text-[#b84289] font-semibold border border-[#b84289]/30 px-3 py-1.5 rounded-xl">
                      Ver perfil
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'mensajes' && (
          <div className="flex flex-col" style={{ minHeight: '60vh' }}>
            <div className="flex-1 space-y-1 pb-4">
              <div className="text-center text-xs text-[#666666] mb-4">
                Conversación con Dra. Ana Martínez · Privada y confidencial
              </div>
              {messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}
            </div>

            {/* Input */}
            <div className="bg-white rounded-2xl border border-gray-100 p-3 flex items-center gap-2 sticky bottom-4">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Escribe a tu ginecóloga..."
                className="flex-1 bg-transparent text-sm text-[#1A1A1A] placeholder-[#666666] outline-none"
              />
              <button onClick={sendMessage} disabled={!input.trim()}
                className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center disabled:opacity-40">
                <Send size={14} className="text-white" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
