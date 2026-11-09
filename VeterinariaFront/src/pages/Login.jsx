import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { PawPrint } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import FormularioCampos from '../components/FormularioCampos'

const campos = [
  { name: 'email', label: 'Correo electrónico', type: 'email', required: true, max: 120, autoComplete: 'email' },
  { name: 'password', label: 'Contraseña', type: 'password', required: true, max: 72, autoComplete: 'current-password' },
]

export default function Login() {
  const { usuario, login } = useAuth()
  const navigate = useNavigate()
  const ubicacion = useLocation()
  const destino = ubicacion.state?.desde || '/'

  if (usuario) return <Navigate to={destino} replace />

  return (
    <div className="auth-shell">
      <div className="card auth-card">
        <div className="auth-brand">
          <span className="auth-brand-icon"><PawPrint size={20} strokeWidth={2.5} /></span>
          PetCare
        </div>
        <h1>Inicia sesión</h1>
        <p className="auth-sub">Ingresa para ver la salud y el bienestar de tus mascotas.</p>
        <FormularioCampos
          className="auth-form"
          campos={campos}
          textoEnviar="Entrar"
          onSubmit={async ({ email, password }) => {
            await login({ email, password })
            navigate(destino, { replace: true })
          }}
        />
        <p className="auth-alt">
          ¿No tienes cuenta? <Link to="/registro">Crear cuenta</Link>
        </p>
      </div>
    </div>
  )
}
