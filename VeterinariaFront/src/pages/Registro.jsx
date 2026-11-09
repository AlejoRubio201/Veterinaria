import { Link, Navigate, useNavigate } from 'react-router-dom'
import { PawPrint } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import FormularioCampos from '../components/FormularioCampos'
import { validarPassword } from '../utils/validaciones'

const campos = [
  { name: 'nombre', label: 'Nombre', required: true, max: 80, autoComplete: 'given-name' },
  { name: 'apellido', label: 'Apellido', required: true, max: 80, autoComplete: 'family-name' },
  { name: 'email', label: 'Correo electrónico', type: 'email', required: true, max: 120, autoComplete: 'email' },
  { name: 'telefono', label: 'Teléfono', type: 'tel', max: 30, autoComplete: 'tel' },
  {
    name: 'password', label: 'Contraseña', type: 'password', required: true, max: 72,
    autoComplete: 'new-password', validar: validarPassword,
    ayuda: 'Mínimo 8 caracteres, con mayúscula, minúscula y número',
  },
  {
    name: 'confirmar', label: 'Confirmar contraseña', type: 'password', required: true, max: 72,
    autoComplete: 'new-password',
    validar: (v, valores) => (v !== valores.password ? 'Las contraseñas no coinciden' : ''),
  },
]

export default function Registro() {
  const { usuario, registrar } = useAuth()
  const navigate = useNavigate()
  if (usuario) return <Navigate to="/" replace />

  return (
    <div className="auth-shell">
      <div className="card auth-card">
        <div className="auth-brand">
          <span className="auth-brand-icon"><PawPrint size={20} strokeWidth={2.5} /></span>
          PetCare
        </div>
        <h1>Crea tu cuenta</h1>
        <p className="auth-sub">Tu contraseña se guarda cifrada; nadie puede leerla.</p>
        <FormularioCampos
          className="auth-form"
          campos={campos}
          textoEnviar="Registrarme"
          onSubmit={async ({ confirmar, ...datos }) => { // eslint-disable-line no-unused-vars
            await registrar(datos)
            navigate('/', { replace: true })
          }}
        />
        <p className="auth-alt">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  )
}
