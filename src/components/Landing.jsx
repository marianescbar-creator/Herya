import { useNavigate } from 'react-router-dom'
import { Sparkles, Building2, ArrowRight } from 'lucide-react'
import { useApp } from '../context/AppContext'
import HeryaLogo from '../assets/HeryaLogo'

export default function Landing() {
  const navigate = useNavigate()
  const { resetToDemo, clearProfile } = useApp()

  const goUser = () => navigate('/user/health')
  const goCompany = () => navigate('/company/dashboard')
  const startFresh = () => {
    clearProfile()
    navigate('/user/assessment')
  }

  return (
    <div className="min-h-screen bg-[#FAF9F7] flex flex-col">
      {/* Demo badge */}
      <div className="flex justify-center pt-4">
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium px-3 py-1.5 rounded-full">
          <Sparkles size={12} />
          Demo · Datos simulados para demostración
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Logo */}
        <div className="mb-8 text-center">
          <HeryaLogo className="w-48 h-auto mx-auto mb-3" />
          <p className="text-[#444444] text-sm">Salud hormonal femenina</p>
        </div>

        {/* Hero text */}
        <div className="text-center mb-12 max-w-sm">
          <h1 className="font-heading text-3xl font-bold text-[#1A1A1A] mb-4 leading-tight">
            Tu salud hormonal,<br />
            <span className="gradient-text">entendida y acompañada</span>
          </h1>
          <p className="text-[#444444] text-base leading-relaxed">
            Una plataforma de salud para mujeres en perimenopausia, menopausia y postmenopausia.
          </p>
        </div>

        {/* Access cards */}
        <div className="w-full max-w-sm space-y-4">
          {/* User card */}
          <button
            onClick={goUser}
            className="w-full card p-6 text-left hover:shadow-card-hover transition-all duration-200 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center flex-shrink-0">
                  <Heart size={22} className="text-white" />
                </div>
                <div>
                  <div className="font-semibold text-[#1A1A1A] text-base mb-0.5">Soy usuaria</div>
                  <div className="text-[#444444] text-sm">Accede a tu plan personalizado</div>
                </div>
              </div>
              <ArrowRight size={18} className="text-[#444444] group-hover:text-[#b84289] transition-colors" />
            </div>
            <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-2">
              <div className="text-xs text-[#444444]">Demo: perfil de Carmen (Menopausia, 22/40)</div>
            </div>
          </button>

          {/* Company card */}
          <button
            onClick={goCompany}
            className="w-full card p-6 text-left hover:shadow-card-hover transition-all duration-200 group border-2 border-transparent hover:border-[#b84289]/20"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#F3F4F6] flex items-center justify-center flex-shrink-0">
                  <Building2 size={22} className="text-[#b84289]" />
                </div>
                <div>
                  <div className="font-semibold text-[#1A1A1A] text-base mb-0.5">Acceso empresa</div>
                  <div className="text-[#444444] text-sm">Panel de bienestar corporativo</div>
                </div>
              </div>
              <ArrowRight size={18} className="text-[#444444] group-hover:text-[#b84289] transition-colors" />
            </div>
            <div className="mt-4 pt-4 border-t border-gray-50">
              <div className="text-xs text-[#444444]">Demo: TechCorp España · 47 empleadas activas</div>
            </div>
          </button>
        </div>

        {/* Start fresh option */}
        <div className="mt-8 text-center">
          <button
            onClick={startFresh}
            className="text-sm text-[#444444] underline underline-offset-2 hover:text-[#b84289] transition-colors"
          >
            Empezar desde cero (cuestionario completo)
          </button>
        </div>
      </div>

      <div className="text-center pb-6 text-xs text-[#666666]">
        © 2026 Herya · Datos simulados · No es un dispositivo médico
      </div>
    </div>
  )
}
