import { HashRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
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
    <HashRouter>
      <Routes>
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
          <Route path="/configuracion" element={<Configuracion />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
