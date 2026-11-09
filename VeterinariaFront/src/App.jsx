import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import AuthProvider from './context/AuthProvider'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Registro from './pages/Registro'
import Inicio from './pages/Inicio'
import MisMascotas from './pages/MisMascotas'
import PerfilMascota from './pages/PerfilMascota'
import CitasVeterinarias from './pages/CitasVeterinarias'
import Recordatorios from './pages/Recordatorios'
import CuidadosHigiene from './pages/CuidadosHigiene'
import AlergiasCondiciones from './pages/AlergiasCondiciones'
import NotasDiario from './pages/NotasDiario'
import GaleriaFotos from './pages/GaleriaFotos'
import AgregarMascota from './pages/AgregarMascota'
import Configuracion from './pages/Configuracion'

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          {/* Públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

          {/* Protegidas: requieren sesión */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Inicio />} />
              <Route path="/mascotas" element={<MisMascotas />} />
              <Route path="/perfil" element={<PerfilMascota />} />
              <Route path="/perfil/:id" element={<PerfilMascota />} />
              <Route path="/citas" element={<CitasVeterinarias />} />
              <Route path="/recordatorios" element={<Recordatorios />} />
              <Route path="/cuidados" element={<CuidadosHigiene />} />
              <Route path="/alergias" element={<AlergiasCondiciones />} />
              <Route path="/notas" element={<NotasDiario />} />
              <Route path="/galeria" element={<GaleriaFotos />} />
              <Route path="/agregar-mascota" element={<AgregarMascota />} />
              <Route path="/mascotas/:id/editar" element={<AgregarMascota />} />
              <Route path="/configuracion" element={<Configuracion />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  )
}
