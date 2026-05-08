import { useState, useRef, useEffect } from 'react'
import { Send, Mic, X, Sparkles } from 'lucide-react'
import { useApp } from '../../context/AppContext'

// ── AI keyword → response map ─────────────────────────────────────────────────
const AI_RESPONSES = [
  {
    keys: ['insomnio', 'dormir', 'sueño', 'descanso', 'duermo'],
    text: 'El insomnio es el síntoma más frecuente en tu etapa y también el que más impacta en todo lo demás. Algunas cosas que funcionan bien: mantener un horario fijo de levantarte (incluso fines de semana), evitar pantallas 45 minutos antes de dormir, y bajar la temperatura de la habitación a 17-19°C. ¿Quieres que revisemos tu rutina de noche?',
  },
  {
    keys: ['cansancio', 'fatigada', 'energía', 'agotada', 'niebla', 'cansada', 'energia'],
    text: 'La niebla mental y el cansancio en perimenopausia y menopausia tienen una causa física real: la fluctuación de estrógenos afecta directamente la calidad del sueño y la regulación de energía. No es "estar mayor". Tres cosas que ayudan: proteína en el desayuno, no saltarse el movimiento aunque sea suave, e hidratación constante. ¿Cómo tienes el sueño últimamente?',
  },
  {
    keys: ['ansiedad', 'irritable', 'irritabilidad', 'nervios', 'humor', 'ánimo', 'animo', 'nerviosa'],
    text: 'Los cambios de humor e irritabilidad son una consecuencia directa de la fluctuación hormonal, no un problema de carácter. El magnesio glicinato por la noche, la reducción de cafeína después de las 12h y las técnicas de regulación del sistema nervioso como la respiración 4-7-8 pueden marcar diferencia. ¿Lo estás trabajando ya en tu plan?',
  },
  {
    keys: ['sofoco', 'sofocos', 'calor', 'sudoración', 'sudoracion', 'sudor'],
    text: 'Los sofocos son más intensos cuando hay picos de estrés, cafeína, alcohol o comidas muy condimentadas. Tener capas de ropa, mantener la habitación fresca y practicar respiración lenta en el momento del sofoco ayuda a reducir su duración. ¿Con qué frecuencia los tienes?',
  },
  {
    keys: ['médico', 'medico', 'especialista', 'ginecóloga', 'ginecologa', 'consulta', 'ths', 'hormonal', 'hormona'],
    text: 'Si sientes que tus síntomas están afectando tu calidad de vida de forma importante, consultar con una ginecóloga especializada en menopausia es el paso correcto. La Terapia Hormonal Sustitutiva es segura para la mayoría de mujeres sin contraindicaciones y es el tratamiento más eficaz para síntomas moderados-severos. Herya te puede conectar con especialistas cuando lo necesites.',
  },
  {
    keys: ['ejercicio', 'moverse', 'deporte', 'actividad', 'caminar', 'fuerza', 'yoga'],
    text: 'En esta etapa el ejercicio más beneficioso combina fuerza (2-3 días/semana) con movimiento suave como caminar o yoga. La fuerza es especialmente importante porque protege la masa muscular y ósea que se pierde con el descenso de estrógenos. ¿Tienes incluido entrenamiento de fuerza en tu rutina actual?',
  },
]

const DEFAULT_RESPONSE = 'Entiendo. Cuéntame un poco más sobre cómo te encuentras y te ayudo a orientarte. Puedes preguntarme sobre cualquiera de tus síntomas, tu plan, o qué hacer en momentos concretos del día.'

const QUICK_REPLIES = [
  '¿Por qué no duermo bien?',
  'Me siento muy cansada',
  '¿Qué puedo hacer hoy?',
]

function getAIResponse(text) {
  const lower = text.toLowerCase()
  const match = AI_RESPONSES.find(r => r.keys.some(k => lower.includes(k)))
  return match ? match.text : DEFAULT_RESPONSE
}

// ── Message bubble ────────────────────────────────────────────────────────────
function Bubble({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center mr-2 flex-shrink-0 mt-1">
          <Sparkles size={12} className="text-white" />
        </div>
      )}
      <div
        className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? 'gradient-primary text-white rounded-tr-sm'
            : 'bg-white shadow-card text-[#1A1A1A] rounded-tl-sm'
        }`}
        style={{ wordBreak: 'break-word' }}
      >
        {msg.text}
      </div>
    </div>
  )
}

// ── Typing indicator ──────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex justify-start mb-3">
      <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center mr-2 flex-shrink-0">
        <Sparkles size={12} className="text-white" />
      </div>
      <div className="bg-white shadow-card px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
        {[0, 1, 2].map(i => (
          <span
            key={i}
            className="w-2 h-2 bg-gray-300 rounded-full inline-block"
            style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
          />
        ))}
      </div>
      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  )
}

// ── Voice modal ───────────────────────────────────────────────────────────────
function VoiceModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-4 md:p-6">
      <div className="bg-white rounded-3xl w-full max-w-sm p-6 text-center">
        <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4">
          <Mic size={24} className="text-white" />
        </div>
        <h3 className="font-heading text-lg font-bold text-[#1A1A1A] mb-2">Entrada por voz</h3>
        <p className="text-[#444444] text-sm mb-5">
          La entrada por voz estará disponible próximamente en la versión instalable de Herya.
        </p>
        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl gradient-primary text-white font-semibold"
        >
          Entendido
        </button>
      </div>
    </div>
  )
}

export default function Chat() {
  const { userProfile, chatHistory, addChatMessage, clearChat } = useApp()
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showVoice, setShowVoice] = useState(false)
  const [showQuick, setShowQuick] = useState(chatHistory.length === 0)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatHistory, isTyping])

  const sendMessage = (text) => {
    if (!text.trim()) return
    const userMsg = { role: 'user', text: text.trim(), id: Date.now() }
    addChatMessage(userMsg)
    setInput('')
    setShowQuick(false)
    setIsTyping(true)

    setTimeout(() => {
      setIsTyping(false)
      const aiMsg = { role: 'ai', text: getAIResponse(text), id: Date.now() + 1 }
      addChatMessage(aiMsg)
    }, 1500)
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) }
  }

  return (
    <div className="flex flex-col h-screen bg-[#FAF9F7]">
      {/* Header */}
      <div className="gradient-primary px-4 pt-14 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
            <Sparkles size={18} className="text-white" />
          </div>
          <div>
            <div className="font-heading text-base font-bold text-white">Asistente Herya</div>
            <div className="text-white/70 text-xs">Basado en tu perfil y síntomas</div>
          </div>
        </div>
        {chatHistory.length > 0 && (
          <button
            onClick={clearChat}
            className="text-white/70 text-xs border border-white/30 px-2.5 py-1 rounded-lg"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {chatHistory.length === 0 && (
          <div className="text-center py-8 px-4">
            <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4">
              <Sparkles size={24} className="text-white" />
            </div>
            <p className="font-heading text-lg font-semibold text-[#1A1A1A] mb-2">
              Hola{userProfile?.name ? `, ${userProfile.name}` : ''}
            </p>
            <p className="text-[#444444] text-sm leading-relaxed">
              Estoy aquí para ayudarte con tus síntomas, tu plan y cualquier duda sobre esta etapa. ¿Por dónde empezamos?
            </p>
          </div>
        )}

        {chatHistory.map(msg => <Bubble key={msg.id} msg={msg} />)}
        {isTyping && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Quick replies */}
      {showQuick && (
        <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide">
          {QUICK_REPLIES.map(qr => (
            <button
              key={qr}
              onClick={() => sendMessage(qr)}
              className="flex-shrink-0 bg-white border border-gray-200 text-[#b84289] text-xs font-medium px-3 py-2 rounded-full shadow-sm whitespace-nowrap"
            >
              {qr}
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div className="px-4 pb-safe pb-24 pt-2 bg-white border-t border-gray-100">
        <div className="flex items-center gap-2 bg-[#F3F4F6] rounded-2xl px-3 py-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Escribe tu pregunta..."
            className="flex-1 bg-transparent text-sm text-[#1A1A1A] placeholder-[#666666] outline-none min-w-0 py-1"
          />
          <button
            onClick={() => setShowVoice(true)}
            className="w-8 h-8 flex items-center justify-center text-[#666666] hover:text-[#b84289] transition-colors flex-shrink-0"
          >
            <Mic size={18} />
          </button>
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isTyping}
            className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center flex-shrink-0 disabled:opacity-40 transition-opacity"
          >
            <Send size={14} className="text-white" />
          </button>
        </div>
      </div>

      {showVoice && <VoiceModal onClose={() => setShowVoice(false)} />}
    </div>
  )
}
