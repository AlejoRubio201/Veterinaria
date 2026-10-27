import { useState } from 'react'
import { Plus, Droplet, Scissors, Wand2, Bug, ChevronRight } from 'lucide-react'
import { cuidados } from '../data/mockData'

const filtros = ['Todos', 'Baños', 'Uñas', 'Peluquería', 'Otros']

const iconoPorTipo = {
  Baño: Droplet,
  'Corte de uñas': Scissors,
  Peluquería: Wand2,
  Desparasitación: Bug,
}

const filtroPorTipo = {
  Baño: 'Baños',
  'Corte de uñas': 'Uñas',
  Peluquería: 'Peluquería',
  Desparasitación: 'Otros',
}

export default function CuidadosHigiene() {
  const [filtro, setFiltro] = useState('Todos')
  const lista = cuidados.filter((c) => filtro === 'Todos' || filtroPorTipo[c.tipo] === filtro)

  return (
    <div>
      <div className="page-header">
        <h1>Cuidados e higiene</h1>
        <button className="btn btn-primary">
          <Plus size={16} /> Registrar cuidado
        </button>
      </div>

      <div className="filter-row">
        {filtros.map((f) => (
          <button
            key={f}
            className={`filter-chip ${filtro === f ? 'filter-chip-active' : ''}`}
            onClick={() => setFiltro(f)}
            type="button"
          >
            {f}
          </button>
        ))}
      </div>

      <div className="stack-list care-list">
        {lista.map((c) => {
          const Icon = iconoPorTipo[c.tipo] || Droplet
          return (
            <div key={c.id} className="card care-item">
              <div className="care-icon">
                <Icon size={18} />
              </div>
              <div className="care-body">
                <strong>{c.tipo}</strong>
                <span>{c.mascota}</span>
              </div>
              <span className="care-date">{c.fecha}</span>
              <ChevronRight size={18} className="row-chevron" />
            </div>
          )
        })}
        {lista.length === 0 && <p className="empty-state">No hay registros en esta categoría.</p>}
      </div>

      <style>{`
        .filter-row { display: flex; gap: 8px; margin-bottom: 18px; flex-wrap: wrap; }
        .filter-chip { border: 1.5px solid var(--surface-border); background: var(--surface-0); padding: 7px 14px; border-radius: 999px; font-size: 13px; font-weight: 700; color: var(--ink-500); cursor: pointer; }
        .filter-chip-active { background: var(--brand-500); border-color: var(--brand-500); color: white; }
        .care-list { max-width: 620px; }
        .care-item { display: flex; align-items: center; gap: 14px; padding: 16px 18px; }
        .care-icon { width: 38px; height: 38px; border-radius: 11px; background: var(--info-100); color: var(--info-500); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .care-body { flex: 1; display: flex; flex-direction: column; gap: 2px; }
        .care-body strong { font-size: 14.5px; font-weight: 700; }
        .care-body span { font-size: 12.5px; color: var(--ink-500); }
        .care-date { font-size: 12.5px; color: var(--ink-400); }
        .row-chevron { color: var(--ink-300); }
      `}</style>
    </div>
  )
}
