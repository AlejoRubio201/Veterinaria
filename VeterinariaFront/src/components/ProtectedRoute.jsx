import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

// Solo deja pasar a usuarios autenticados; si no, redirige al login
export default function ProtectedRoute() {
  const { usuario, cargando } = useAuth()
  const ubicacion = useLocation()

  if (cargando) {
    return (
      <div className="estado estado-cargando pantalla-completa" role="status">
        <span className="spinner" aria-hidden="true" /> Verificando sesión...
      </div>
    )
  }
  if (!usuario) return <Navigate to="/login" replace state={{ desde: ubicacion.pathname }} />
  return <Outlet />
}
