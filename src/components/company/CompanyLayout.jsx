import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, FileText, Settings, HeartPulse, ArrowLeft } from 'lucide-react'

const tabs = [
  { to: '/company/dashboard', icon: LayoutDashboard, label: 'Panel' },
  { to: '/company/report', icon: FileText, label: 'Informe' },
  { to: '/company/settings', icon: Settings, label: 'Configuración' },
]

export default function CompanyLayout() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center">
              <HeartPulse size={16} className="text-white" />
            </div>
            <div>
              <div className="font-heading font-bold text-[#1A1A1A] text-sm">herya</div>
              <div className="text-[10px] text-[#444444]">TechCorp España</div>
            </div>
          </div>

          {/* Desktop tabs */}
          <nav className="hidden sm:flex items-center gap-1">
            {tabs.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'gradient-primary text-white'
                      : 'text-[#444444] hover:bg-gray-100'
                  }`
                }
              >
                <Icon size={15} />
                {label}
              </NavLink>
            ))}
          </nav>

          <button onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-xs text-[#444444] border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
            <ArrowLeft size={12} />
            Cambiar vista
          </button>
        </div>

        {/* Mobile tabs */}
        <div className="sm:hidden flex border-t border-gray-100">
          {tabs.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center gap-1 py-2.5 text-xs font-medium transition-all ${
                  isActive ? 'text-[#b84289] border-b-2 border-[#b84289]' : 'text-[#666666]'
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </div>
      </header>

      {/* Privacy notice */}
      <div className="bg-green-50 border-b border-green-100 px-4 py-2 text-center">
        <p className="text-xs text-green-700 font-medium">
          🔒 Todos los datos son anónimos y agregados. Herya no comparte datos individuales de tus empleadas.
        </p>
      </div>

      <main className="max-w-5xl mx-auto px-4 lg:px-8 py-6">
        <Outlet />
      </main>
    </div>
  )
}
