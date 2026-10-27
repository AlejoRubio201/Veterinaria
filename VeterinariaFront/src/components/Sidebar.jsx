import { NavLink, useNavigate } from 'react-router-dom'
import {
  Home,
  PawPrint,
  User,
  Bell,
  CalendarDays,
  Sparkles,
  ShieldAlert,
  NotebookPen,
  Images,
  Settings,
  LogOut,
} from 'lucide-react'
import './sidebar.css'

const navItems = [
  { to: '/', label: 'Inicio', icon: Home, end: true },
  { to: '/mascotas', label: 'Mis mascotas', icon: PawPrint },
  { to: '/perfil', label: 'Perfil', icon: User },
  { to: '/citas', label: 'Citas', icon: CalendarDays },
  { to: '/recordatorios', label: 'Recordatorios', icon: Bell },
  { to: '/cuidados', label: 'Cuidados', icon: Sparkles },
  { to: '/alergias', label: 'Alergias', icon: ShieldAlert },
  { to: '/notas', label: 'Notas', icon: NotebookPen },
  { to: '/galeria', label: 'Galería', icon: Images },
]

export default function Sidebar({ open, onClose }) {
  const navigate = useNavigate()

  const handleNav = () => {
    if (onClose) onClose()
  }

  return (
    <>
      {open && <div className="sidebar-backdrop" onClick={onClose} />}
      <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
        <div className="sidebar-brand">
          <span className="sidebar-brand-icon">
            <PawPrint size={20} strokeWidth={2.5} />
          </span>
          <span>PetCare</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={handleNav}
              className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
            >
              <Icon size={18} strokeWidth={2.2} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <NavLink
            to="/configuracion"
            onClick={handleNav}
            className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
          >
            <Settings size={18} strokeWidth={2.2} />
            <span>Configuración</span>
          </NavLink>
          <button
            type="button"
            className="sidebar-link sidebar-logout"
            onClick={() => {
              handleNav()
              navigate('/')
            }}
          >
            <LogOut size={18} strokeWidth={2.2} />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>
    </>
  )
}
