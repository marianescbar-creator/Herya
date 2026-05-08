import { Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Landing from './components/Landing'
import UserLayout from './components/user/UserLayout'
import Assessment from './components/user/Assessment'
import HealthPanel from './components/user/HealthPanel'
import Routines from './components/user/Routines'
import Chat from './components/user/Chat'
import Tracking from './components/user/Tracking'
import Education from './components/user/Education'
import Profile from './components/user/Profile'
import Citas from './components/user/Citas'
import MiDia from './components/user/MiDia'
import BienestarActivo from './components/user/BienestarActivo'
import SaludIntima from './components/user/SaludIntima'
import MiCiclo from './components/user/MiCiclo'
import NutricionPrecision from './components/user/NutricionPrecision'
import InformeMedico from './components/user/InformeMedico'
import MiCuerpo from './components/user/MiCuerpo'
import MiHistorial from './components/user/MiHistorial'
import Plan from './components/user/Plan'
import CompanyLayout from './components/company/CompanyLayout'
import CompanyDashboard from './components/company/CompanyDashboard'
import WellbeingReport from './components/company/WellbeingReport'
import CompanySettings from './components/company/CompanySettings'
import OrganizarEventos from './components/company/OrganizarEventos'

export default function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/user/assessment" element={<Assessment />} />
        <Route path="/user" element={<UserLayout />}>
          <Route index element={<Navigate to="health" replace />} />
          <Route path="health" element={<HealthPanel />} />
          <Route path="routines" element={<Routines />} />
          <Route path="chat" element={<Chat />} />
          <Route path="tracking" element={<Tracking />} />
          <Route path="education" element={<Education />} />
          <Route path="profile" element={<Profile />} />
          <Route path="citas" element={<Citas />} />
          <Route path="myday" element={<MiDia />} />
          <Route path="bienestar" element={<BienestarActivo />} />
          <Route path="salud-intima" element={<SaludIntima />} />
          <Route path="mi-ciclo" element={<MiCiclo />} />
          <Route path="nutricion" element={<NutricionPrecision />} />
          <Route path="informe" element={<InformeMedico />} />
          <Route path="mi-cuerpo" element={<MiCuerpo />} />
          <Route path="mi-historial" element={<MiHistorial />} />
          <Route path="plan" element={<Plan />} />
        </Route>
        <Route path="/company" element={<CompanyLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<CompanyDashboard />} />
          <Route path="report" element={<WellbeingReport />} />
          <Route path="settings" element={<CompanySettings />} />
          <Route path="eventos" element={<OrganizarEventos />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppProvider>
  )
}
