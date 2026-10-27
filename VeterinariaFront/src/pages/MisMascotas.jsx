import { Link } from 'react-router-dom'
import { Plus, ChevronRight } from 'lucide-react'
import { mascotas } from '../data/mockData'

export default function MisMascotas() {
  return (
    <div>
      <div className="page-header">
        <h1>Mis mascotas</h1>
        <Link to="/agregar-mascota" className="btn btn-primary">
          <Plus size={16} /> Agregar mascota
        </Link>
      </div>

      <div className="pet-list">
        {mascotas.map((m) => (
          <Link to={`/perfil/${m.id}`} key={m.id} className="card pet-row">
            <img className="avatar" src={m.foto} alt={m.nombre} width={56} height={56} />
            <div className="pet-row-body">
              <strong>{m.nombre}</strong>
              <span>
                {m.especie} · {m.raza}
              </span>
              <span className="pet-row-meta">
                {m.edad} · {m.peso}
              </span>
            </div>
            <ChevronRight size={20} className="pet-row-chevron" />
          </Link>
        ))}
      </div>

      <style>{`
        .pet-list { display: flex; flex-direction: column; gap: 14px; max-width: 520px; }
        .pet-row { display: flex; align-items: center; gap: 14px; padding: 16px 18px; transition: box-shadow .15s ease, transform .15s ease; }
        .pet-row:hover { box-shadow: var(--shadow-pop); transform: translateY(-1px); }
        .pet-row-body { display: flex; flex-direction: column; flex: 1; }
        .pet-row-body strong { font-size: 16px; font-weight: 800; }
        .pet-row-body span { font-size: 13px; color: var(--ink-500); }
        .pet-row-meta { color: var(--ink-400) !important; margin-top: 2px; }
        .pet-row-chevron { color: var(--ink-300); }
      `}</style>
    </div>
  )
}
