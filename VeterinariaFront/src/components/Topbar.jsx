import { Menu } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import Avatar from './Avatar'
import './topbar.css'

// Muestra al usuario REAL de la sesión (antes usaba un usuario simulado)
export default function Topbar({ onMenuClick }) {
  const { usuario } = useAuth()
  const nombre = `${usuario.nombre} ${usuario.apellido}`

  return (
    <header className="topbar">
      <button type="button" className="topbar-menu-btn" onClick={onMenuClick} aria-label="Abrir menú">
        <Menu size={20} />
      </button>
      <div className="topbar-spacer" />
      <span className="topbar-nombre">{nombre}</span>
      <Avatar className="topbar-avatar" src={usuario.avatar} nombre={nombre} tamano={36} />
    </header>
  )
}
