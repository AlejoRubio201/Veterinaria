import { useAuth } from '../hooks/useAuth'
import { usuarioService } from '../services/usuarioService'
import { validarPassword } from '../utils/validaciones'
import PageHeader from '../components/PageHeader'
import Avatar from '../components/Avatar'
import FormularioCampos from '../components/FormularioCampos'

const camposPerfil = [
  { name: 'nombre', label: 'Nombre', required: true, max: 80, autoComplete: 'given-name' },
  { name: 'apellido', label: 'Apellido', required: true, max: 80, autoComplete: 'family-name' },
  { name: 'email', label: 'Correo electrónico', type: 'email', required: true, max: 120, autoComplete: 'email' },
  { name: 'telefono', label: 'Teléfono', type: 'tel', max: 30, autoComplete: 'tel' },
  { name: 'avatar', label: 'URL de la foto de perfil', type: 'url', max: 255, placeholder: 'https://...' },
]

const camposPassword = [
  { name: 'actual', label: 'Contraseña actual', type: 'password', required: true, max: 72, autoComplete: 'current-password' },
  {
    name: 'nueva', label: 'Nueva contraseña', type: 'password', required: true, max: 72, autoComplete: 'new-password',
    validar: (v, vals) => validarPassword(v) || (v === vals.actual ? 'Debe ser distinta a la actual' : ''),
    ayuda: 'Mínimo 8 caracteres, con mayúscula, minúscula y número',
  },
  {
    name: 'confirmar', label: 'Confirmar nueva contraseña', type: 'password', required: true, max: 72, autoComplete: 'new-password',
    validar: (v, vals) => (v !== vals.nueva ? 'Las contraseñas no coinciden' : ''),
  },
]

export default function Configuracion() {
  // Usa SIEMPRE al usuario autenticado (el mismo que ve la barra superior)
  const { usuario, setUsuario, cambiarPassword } = useAuth()
  const nombreCompleto = `${usuario.nombre} ${usuario.apellido}`

  const guardarPerfil = async (datos) => {
    const actualizado = await usuarioService.actualizar(usuario.id, datos)
    setUsuario(actualizado)
    return 'Perfil actualizado correctamente'
  }

  // Al cambiar la contraseña el servidor cierra todas las sesiones: se vuelve al login
  const guardarPassword = async ({ actual, nueva }) => cambiarPassword(actual, nueva)

  return (
    <div>
      <PageHeader titulo="Configuración" />

      <div className="card user-card">
        <Avatar src={usuario.avatar} nombre={nombreCompleto} tamano={52} />
        <div>
          <strong>{nombreCompleto}</strong>
          <span>{usuario.email}</span>
          <span className={`pill badge-rol ${usuario.rol === 'admin' ? 'pill-warn' : 'pill-info'}`}>
            {usuario.rol === 'admin' ? 'Administrador' : 'Usuario'}
          </span>
        </div>
      </div>

      <section className="section">
        <div className="section-head"><h2>Datos personales</h2></div>
        <FormularioCampos key={usuario.actualizadoEn} campos={camposPerfil} inicial={usuario} textoEnviar="Guardar cambios" onSubmit={guardarPerfil} />
      </section>

      <section className="section">
        <div className="section-head"><h2>Cambiar contraseña</h2></div>
        <FormularioCampos campos={camposPassword} textoEnviar="Actualizar contraseña" onSubmit={guardarPassword} />
      </section>

      <p className="app-info">PetCare · Versión 1.0.0</p>
    </div>
  )
}
