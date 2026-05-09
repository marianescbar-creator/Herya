import { useEffect, useRef } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { Activity, Calendar, MessageCircle, BookOpen, User, HeartPulse, ClipboardList, MapPin } from 'lucide-react'
import HeryaLogo from '../../assets/HeryaLogo'

const tabs = [
  { to: '/user/health',    icon: Activity,      label: 'Panel' },
  { to: '/user/routines',  icon: Calendar,      label: 'Rutinas' },
  { to: '/user/plan',      icon: ClipboardList, label: 'Mi plan' },
  { to: '/user/chat',      icon: MessageCircle, label: 'Chat' },
  { to: '/user/education', icon: BookOpen,      label: 'Aprende' },
  { to: '/user/profile',   icon: User,          label: 'Perfil' },
]

const bottomTabs = tabs.slice(0, 5)

export default function UserLayout() {
  const location = useLocation()
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-[#FAF9F7] lg:flex">

      {/* ── Desktop sidebar ─────────────────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-60 bg-white border-r border-[#F0E0EA] fixed inset-y-0 left-0 z-40">
        {/* Brand */}
        <div className="px-5 py-5 border-b border-[#F0E0EA] flex-shrink-0">
          <HeryaLogo className="w-28 h-auto" />
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {tabs.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'gradient-primary text-white shadow-sm'
                    : 'text-[#444444] hover:bg-[#f9eef5] hover:text-[#b84289]'
                }`
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-[#F0E0EA] flex-shrink-0">
          <p className="text-[10px] text-[#666666] leading-relaxed">
            🔒 Tus datos son privados y seguros
          </p>
        </div>
      </aside>

      {/* ── Main content ────────────────────────────────────────────────── */}
      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">
        <div ref={scrollRef} className="flex-1 overflow-y-auto pb-24 lg:pb-8">
          <div className="max-w-2xl lg:max-w-4xl mx-auto">
            <Outlet />
          </div>
        </div>

        {/* ── Bottom nav (mobile/tablet only) ─────────────────────────── */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#F0E0EA] z-40 lg:hidden">
          <div className="flex items-center justify-around py-2 px-1 max-w-lg mx-auto">
            {bottomTabs.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 px-2 py-1.5 rounded-xl transition-all ${
                    isActive ? 'text-[#b84289]' : 'text-[#AAAAAA] hover:text-[#666666]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'gradient-primary' : ''}`}>
                      <Icon size={18} className={isActive ? 'text-white' : ''} />
                    </div>
                    <span className="text-[10px] font-medium">{label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </div>
  )
}
