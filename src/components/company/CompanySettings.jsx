import { useState } from 'react'
import { Shield, Bell, Mail, Globe, UserPlus, Phone, X, Check } from 'lucide-react'

function Toggle({ label, description, defaultOn }) {
  const [on, setOn] = useState(defaultOn)
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
      <div className="flex-1 pr-4">
        <div className="font-medium text-sm text-[#1A1A1A]">{label}</div>
        {description && <div className="text-xs text-[#444444] mt-0.5">{description}</div>}
      </div>
      <button
        onClick={() => setOn(v => !v)}
        className={`w-12 h-6 rounded-full transition-colors flex-shrink-0 relative ${on ? 'bg-[#b84289]' : 'bg-gray-200'}`}
      >
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${on ? 'left-7' : 'left-1'}`} />
      </button>
    </div>
  )
}

function InviteModal({ onClose }) {
  const [step, setStep] = useState(0)
  const [email, setEmail] = useState('')
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-heading text-lg font-bold text-[#1A1A1A]">Añadir empleadas</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <X size={16} />
          </button>
        </div>
        {step === 0 ? (
          <>
            <p className="text-sm text-[#444444] mb-4">
              Introduce el email corporativo de las empleadas que quieres invitar. Recibirán un enlace de acceso a Herya.
            </p>
            <input
              type="email"
              placeholder="nombre@techcorp.es"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:border-[#b84289]"
            />
            <div className="mt-3 p-3 bg-green-50 rounded-xl">
              <p className="text-xs text-green-700">
                🔒 La empleada invitada solo comparte datos anónimos y agregados con la empresa. Sus datos individuales son privados.
              </p>
            </div>
            <button
              onClick={() => email && setStep(1)}
              className="w-full mt-4 py-3 rounded-2xl gradient-primary text-white font-semibold text-sm"
            >
              Enviar invitación
            </button>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Check size={24} className="text-green-600" />
            </div>
            <h4 className="font-semibold text-[#1A1A1A] mb-2">¡Invitación enviada!</h4>
            <p className="text-sm text-[#444444] mb-4">
              Se ha enviado un email de invitación a <strong>{email}</strong>
            </p>
            <button onClick={onClose} className="gradient-primary text-white px-6 py-2.5 rounded-xl text-sm font-semibold">
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function CompanySettings() {
  const [showInvite, setShowInvite] = useState(false)
  const [language, setLanguage] = useState('Español')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-[#1A1A1A]">Configuración y privacidad</h1>
        <p className="text-[#444444] text-sm mt-1">TechCorp España · Plan Empresarial</p>
      </div>

      {/* Privacy section */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center">
            <Shield size={16} className="text-green-600" />
          </div>
          <h2 className="font-heading text-base font-semibold text-[#1A1A1A]">Privacidad y datos</h2>
        </div>

        <div className="space-y-3 mb-5">
          <div className="p-3 bg-green-50 rounded-xl flex items-start gap-2">
            <div className="text-green-600 text-sm flex-shrink-0 mt-0.5">✓</div>
            <div>
              <div className="text-sm font-medium text-green-800">Datos que ves</div>
              <div className="text-xs text-green-700">Métricas agregadas y anónimas del grupo de empleadas</div>
            </div>
          </div>
          <div className="p-3 bg-red-50 rounded-xl flex items-start gap-2">
            <div className="text-red-500 text-sm flex-shrink-0 mt-0.5">✕</div>
            <div>
              <div className="text-sm font-medium text-red-800">Nunca accesible</div>
              <div className="text-xs text-red-700">Datos individuales, síntomas específicos, historial médico, identidad de cada empleada</div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-[#b84289]/5 rounded-2xl">
          <h3 className="font-semibold text-xs text-[#b84289] uppercase tracking-wide mb-2">Arquitectura técnica</h3>
          <p className="text-xs text-[#444444] leading-relaxed">
            Los datos individuales están cifrados con claves específicas de cada usuaria y solo son accesibles
            para la propia usuaria y, si ella lo autoriza explícitamente, su especialista de salud. La empresa
            recibe únicamente métricas estadísticas calculadas sobre el conjunto anónimo.
          </p>
        </div>
      </div>

      {/* Program settings */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-xl bg-[#b84289]/10 flex items-center justify-center">
            <Bell size={16} className="text-[#b84289]" />
          </div>
          <h2 className="font-heading text-base font-semibold text-[#1A1A1A]">Ajustes del programa</h2>
        </div>

        <Toggle
          label="Notificaciones de engagement semanal"
          description="Recibe un resumen de actividad cada lunes"
          defaultOn={true}
        />
        <Toggle
          label="Informe mensual automático por email"
          description="PDF con métricas del mes enviado el día 1"
          defaultOn={true}
        />

        <div className="py-4 border-b border-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-sm text-[#1A1A1A]">Idioma del dashboard</div>
              <div className="text-xs text-[#444444] mt-0.5">Idioma de la interfaz de empresa</div>
            </div>
            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
              className="border border-gray-200 rounded-xl text-sm px-3 py-2 focus:outline-none focus:border-[#b84289] bg-white"
            >
              <option>Español</option>
              <option>English</option>
              <option>Català</option>
            </select>
          </div>
        </div>

        <div className="py-4">
          <div className="font-medium text-sm text-[#1A1A1A] mb-1">Añadir empleadas</div>
          <div className="text-xs text-[#444444] mb-3">Invita a más empleadas al programa Herya</div>
          <button
            onClick={() => setShowInvite(true)}
            className="flex items-center gap-2 gradient-primary text-white px-4 py-2.5 rounded-xl text-sm font-semibold"
          >
            <UserPlus size={15} />
            Enviar invitaciones
          </button>
        </div>
      </div>

      {/* Support section */}
      <div className="card p-5">
        <h2 className="font-heading text-base font-semibold text-[#1A1A1A] mb-4">Soporte y contacto</h2>
        <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-[#b84289]/5 to-[#b84289]/5 rounded-2xl">
          <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-white font-bold flex-shrink-0">
            SR
          </div>
          <div className="flex-1">
            <div className="font-semibold text-sm text-[#1A1A1A]">Sara Rodríguez</div>
            <div className="text-xs text-[#444444]">Account Manager — TechCorp España</div>
            <div className="text-xs text-[#b84289] mt-1">sara.rodriguez@herya.com</div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-2 border border-gray-200 py-3 rounded-xl text-sm text-[#444444] hover:bg-gray-50 transition-colors">
            <Mail size={14} />
            Email
          </button>
          <button className="flex items-center justify-center gap-2 border border-gray-200 py-3 rounded-xl text-sm text-[#444444] hover:bg-gray-50 transition-colors">
            <Phone size={14} />
            Llamar
          </button>
        </div>
      </div>

      {showInvite && <InviteModal onClose={() => setShowInvite(false)} />}
    </div>
  )
}
