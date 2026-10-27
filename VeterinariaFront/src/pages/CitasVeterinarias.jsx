import { useState } from 'react'
import { Plus, PawPrint } from 'lucide-react'
import { proximasCitas, citasHistorial } from '../data/mockData'

const estadoClase = {
  Confirmada: 'pill-success',
  Pendiente: 'pill-warn',
  Completado: 'pill-info',
}

export default function CitasVeterinarias() {
  const [tab, setTab] = useState('Próximas')
  const lista = tab === 'Próximas' ? proximasCitas : citasHistorial

  return (
    <div>
      <div className="page-header">
        <h1>Citas veterinarias</h1>
        <button className="btn btn-primary">
          <Plus size={16} /> Agendar cita
        </button>
      </div>

      <div className="tabs">
        {['Próximas', 'Historial'].map((t) => (
          <button
            key={t}
            className={`tab-btn ${tab === t ? 'tab-btn-active' : ''}`}
            onClick={() => setTab(t)}
            type="button"
          >
            {t}
          </button>
        ))}
      </div>

      <div className="stack-list appt-list">
        {lista.map((c) => (
          <div key={c.id} className="card appt-item">
            <div className="hist-icon">
              <PawPrint size={18} />
            </div>
            <div className="hist-body">
              <strong>{c.titulo}</strong>
              <span>{c.fecha}</span>
              <span>{c.lugar}</span>
            </div>
            <span className={`pill ${estadoClase[c.estado] || 'pill-info'}`}>{c.estado}</span>
          </div>
        ))}
        {lista.length === 0 && <p className="empty-state">No hay citas para mostrar.</p>}
      </div>

      <style>{`
        .tabs { display: flex; gap: 4px; border-bottom: 1.5px solid var(--surface-border); margin-bottom: 18px; }
        .tab-btn { border: none; background: transparent; padding: 10px 16px; font-size: 13.5px; font-weight: 700; color: var(--ink-500); cursor: pointer; border-bottom: 2.5px solid transparent; }
        .tab-btn-active { color: var(--brand-600); border-color: var(--brand-500); }
        .appt-list { max-width: 620px; }
        .appt-item { display: flex; align-items: center; gap: 14px; padding: 16px 18px; }
        .hist-icon { width: 38px; height: 38px; border-radius: 11px; background: var(--brand-100); color: var(--brand-600); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .hist-body { flex: 1; display: flex; flex-direction: column; gap: 2px; }
        .hist-body strong { font-size: 14.5px; font-weight: 700; }
        .hist-body span { font-size: 12.5px; color: var(--ink-500); }
      `}</style>
    </div>
  )
}
