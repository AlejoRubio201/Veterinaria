import { useState } from 'react'
import { Syringe, PawPrint, Scissors, Stethoscope } from 'lucide-react'
import { recordatorios } from '../data/mockData'

const iconoPorTipo = {
  vacuna: Syringe,
  desparasitacion: PawPrint,
  unas: Scissors,
  consulta: Stethoscope,
}

const filtros = ['Todos', 'Vacunas', 'Citas', 'Otros']

const tipoAFiltro = {
  vacuna: 'Vacunas',
  consulta: 'Citas',
  desparasitacion: 'Otros',
  unas: 'Otros',
}

export default function Recordatorios() {
  const [filtro, setFiltro] = useState('Todos')

  const lista = recordatorios.filter((r) => filtro === 'Todos' || tipoAFiltro[r.tipo] === filtro)

  return (
    <div>
      <div className="page-header">
        <h1>Recordatorios</h1>
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

      <div className="stack-list rec-list">
        {lista.map((r) => {
          const Icon = iconoPorTipo[r.tipo] || PawPrint
          return (
            <div key={r.id} className="card rec-item">
              <div className="rec-icon">
                <Icon size={18} />
              </div>
              <div className="rec-body">
                <strong>{r.titulo}</strong>
                <span>{r.fecha}</span>
              </div>
              <span className="pill pill-warn">{r.faltan}</span>
            </div>
          )
        })}
        {lista.length === 0 && <p className="empty-state">Sin recordatorios en esta categoría.</p>}
      </div>

      <style>{`
        .filter-row { display: flex; gap: 8px; margin-bottom: 18px; flex-wrap: wrap; }
        .filter-chip { border: 1.5px solid var(--surface-border); background: var(--surface-0); padding: 7px 14px; border-radius: 999px; font-size: 13px; font-weight: 700; color: var(--ink-500); cursor: pointer; }
        .filter-chip-active { background: var(--brand-500); border-color: var(--brand-500); color: white; }
        .rec-list { max-width: 620px; }
        .rec-item { display: flex; align-items: center; gap: 14px; padding: 16px 18px; }
        .rec-icon { width: 38px; height: 38px; border-radius: 11px; background: var(--warn-100); color: var(--warn-500); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .rec-body { flex: 1; display: flex; flex-direction: column; gap: 2px; }
        .rec-body strong { font-size: 14.5px; font-weight: 700; }
        .rec-body span { font-size: 12.5px; color: var(--ink-500); }
      `}</style>
    </div>
  )
}
