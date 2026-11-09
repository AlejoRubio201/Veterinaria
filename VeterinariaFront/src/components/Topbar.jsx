<<<<<<< HEAD
import { Menu } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import Avatar from './Avatar'
import './topbar.css'

// Muestra al usuario REAL de la sesión (antes usaba un usuario simulado)
export default function Topbar({ onMenuClick }) {
  const { usuario } = useAuth()
  const nombre = `${usuario.nombre} ${usuario.apellido}`

=======
import { Menu, Search } from 'lucide-react'
import { usuario } from '../data/mockData'
import './topbar.css'

export default function Topbar({ onMenuClick, showSearch = true }) {
>>>>>>> f07299732d4d49260762e4f908dbfd0c91a7cf2a
  return (
    <header className="topbar">
      <button type="button" className="topbar-menu-btn" onClick={onMenuClick} aria-label="Abrir menú">
        <Menu size={20} />
      </button>
<<<<<<< HEAD
      <div className="topbar-spacer" />
      <span className="topbar-nombre">{nombre}</span>
      <Avatar className="topbar-avatar" src={usuario.avatar} nombre={nombre} tamano={36} />
=======

      <div className="topbar-spacer" />

      {showSearch && (
        <div className="topbar-search">
          <Search size={16} />
          <input type="text" placeholder="Buscar..." />
        </div>
      )}

      <img className="avatar topbar-avatar" src={usuario.avatar} alt={usuario.nombreCompleto} width={36} height={36} />
>>>>>>> f07299732d4d49260762e4f908dbfd0c91a7cf2a
    </header>
  )
}
