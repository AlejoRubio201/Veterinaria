import { Menu, Search } from 'lucide-react'
import { usuario } from '../data/mockData'
import './topbar.css'

export default function Topbar({ onMenuClick, showSearch = true }) {
  return (
    <header className="topbar">
      <button type="button" className="topbar-menu-btn" onClick={onMenuClick} aria-label="Abrir menú">
        <Menu size={20} />
      </button>

      <div className="topbar-spacer" />

      {showSearch && (
        <div className="topbar-search">
          <Search size={16} />
          <input type="text" placeholder="Buscar..." />
        </div>
      )}

      <img className="avatar topbar-avatar" src={usuario.avatar} alt={usuario.nombreCompleto} width={36} height={36} />
    </header>
  )
}
