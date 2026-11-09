<<<<<<< HEAD
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
=======
import { useEffect, useState } from 'react'
import { Bell, Lock, ShieldCheck, HelpCircle, Palette, Info, Moon, Sun, ChevronRight } from 'lucide-react'
import { usuario as usuarioMock } from '../data/mockData'
import { usuarioService } from '../services/usuarioService'

const opciones = [
  { icon: Bell, titulo: 'Notificaciones', sub: 'Gestiona tus notificaciones' },
  { icon: Lock, titulo: 'Cambiar contraseña', sub: 'Actualiza tu contraseña' },
  { icon: ShieldCheck, titulo: 'Privacidad', sub: 'Controla tu información' },
  { icon: Palette, titulo: 'Tema', sub: 'Claro / Oscuro' },
  { icon: HelpCircle, titulo: 'Ayuda', sub: 'Preguntas frecuentes' },
  { icon: Info, titulo: 'Información de la app', sub: 'Versión 1.0.0' },
]

export default function Configuracion() {
  const [tema, setTema] = useState('claro')
  const [usuario, setUsuario] = useState(usuarioMock)

  // Carga el primer usuario desde la API; si el backend no responde, se mantiene el mock
  useEffect(() => {
    usuarioService
      .listar()
      .then((lista) => {
        const u = lista[lista.length - 1]
        if (u) {
          setUsuario({
            ...usuarioMock,
            nombre: u.nombre,
            nombreCompleto: `${u.nombre} ${u.apellido}`,
            email: u.email,
            avatar: u.avatar || usuarioMock.avatar,
          })
        }
      })
      .catch(() => {})
  }, [])

  return (
    <div>
      <div className="page-header">
        <h1>Configuración</h1>
        <button
          className="btn btn-secondary btn-sm"
          type="button"
          onClick={() => setTema((t) => (t === 'claro' ? 'oscuro' : 'claro'))}
        >
          {tema === 'claro' ? <Moon size={14} /> : <Sun size={14} />}
          {tema === 'claro' ? 'Oscuro' : 'Claro'}
        </button>
      </div>

      <div className="card user-card">
        <img className="avatar" src={usuario.avatar} alt={usuario.nombreCompleto} width={52} height={52} />
        <div>
          <strong>{usuario.nombreCompleto}</strong>
          <span>{usuario.email}</span>
        </div>
      </div>

      <div className="settings-grid">
        {opciones.map(({ icon: Icon, titulo, sub }) => (
          <button type="button" className="card settings-item" key={titulo}>
            <div className="settings-icon">
              <Icon size={18} />
            </div>
            <div className="settings-body">
              <strong>{titulo}</strong>
              <span>{sub}</span>
            </div>
            <ChevronRight size={18} className="row-chevron" />
          </button>
        ))}
      </div>

      <style>{`
        .user-card { display: flex; align-items: center; gap: 14px; padding: 18px 20px; margin-bottom: 22px; max-width: 620px; }
        .user-card div { display: flex; flex-direction: column; gap: 2px; }
        .user-card strong { font-size: 15px; }
        .user-card span { font-size: 13px; color: var(--ink-500); }

        .settings-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; max-width: 620px; }
        .settings-item { display: flex; align-items: center; gap: 12px; padding: 16px; border: 1px solid var(--surface-border); background: var(--surface-0); cursor: pointer; text-align: left; }
        .settings-item:hover { box-shadow: var(--shadow-pop); }
        .settings-icon { width: 38px; height: 38px; border-radius: 11px; background: var(--brand-100); color: var(--brand-600); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .settings-body { flex: 1; display: flex; flex-direction: column; gap: 2px; min-width: 0; }
        .settings-body strong { font-size: 13.5px; font-weight: 700; }
        .settings-body span { font-size: 12px; color: var(--ink-500); }
        .row-chevron { color: var(--ink-300); flex-shrink: 0; }

        @media (max-width: 560px) {
          .settings-grid { grid-template-columns: 1fr; }
        }
      `}</style>
>>>>>>> f07299732d4d49260762e4f908dbfd0c91a7cf2a
    </div>
  )
}
