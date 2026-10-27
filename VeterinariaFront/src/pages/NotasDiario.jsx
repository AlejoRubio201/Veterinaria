import { Plus, Pill, Smile, Frown, Utensils } from 'lucide-react'
import { notas } from '../data/mockData'

const iconoPorTipo = {
  medicamento: Pill,
  animo: Smile,
  sintoma: Frown,
  apetito: Utensils,
}

const colorPorTipo = {
  medicamento: 'nota-icon-info',
  animo: 'nota-icon-success',
  sintoma: 'nota-icon-danger',
  apetito: 'nota-icon-warn',
}

export default function NotasDiario() {
  return (
    <div>
      <div className="page-header">
        <h1>Notas y diario</h1>
        <button className="btn btn-primary">
          <Plus size={16} /> Agregar nota
        </button>
      </div>

      <div className="stack-list nota-list">
        {notas.map((n) => {
          const Icon = iconoPorTipo[n.tipo] || Smile
          return (
            <div key={n.id} className="card nota-item">
              <div className={`nota-icon ${colorPorTipo[n.tipo]}`}>
                <Icon size={18} />
              </div>
              <div className="nota-body">
                <strong>{n.titulo}</strong>
                <span>{n.fecha}</span>
              </div>
            </div>
          )
        })}
      </div>

      <style>{`
        .nota-list { max-width: 620px; }
        .nota-item { display: flex; align-items: center; gap: 14px; padding: 16px 18px; }
        .nota-icon { width: 38px; height: 38px; border-radius: 11px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .nota-icon-info { background: var(--info-100); color: var(--info-500); }
        .nota-icon-success { background: var(--brand-100); color: var(--brand-600); }
        .nota-icon-danger { background: var(--danger-100); color: var(--danger-500); }
        .nota-icon-warn { background: var(--warn-100); color: var(--warn-500); }
        .nota-body { display: flex; flex-direction: column; gap: 2px; }
        .nota-body strong { font-size: 14.5px; font-weight: 700; }
        .nota-body span { font-size: 12.5px; color: var(--ink-500); }
      `}</style>
    </div>
  )
}
