import { Plus, AlertTriangle } from 'lucide-react'
import { alergias, condicionesMedicas } from '../data/mockData'

export default function AlergiasCondiciones() {
  return (
    <div>
      <div className="page-header">
        <h1>Alergias y condiciones</h1>
      </div>

      <section className="ac-section">
        <div className="ac-section-head">
          <h2>Alergias</h2>
          <button className="btn btn-secondary btn-sm">
            <Plus size={14} /> Agregar
          </button>
        </div>
        <div className="stack-list ac-list">
          {alergias.map((a) => (
            <div key={a.id} className="card ac-item">
              <div className="ac-icon">
                <AlertTriangle size={18} />
              </div>
              <div className="ac-body">
                <strong>{a.nombre}</strong>
                <span>{a.desde}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="ac-section">
        <div className="ac-section-head">
          <h2>Condiciones médicas</h2>
          <button className="btn btn-secondary btn-sm">
            <Plus size={14} /> Agregar
          </button>
        </div>
        <div className="stack-list ac-list">
          {condicionesMedicas.map((c) => (
            <div key={c.id} className="card ac-item">
              <div className="ac-icon ac-icon-info">
                <Plus size={18} />
              </div>
              <div className="ac-body">
                <strong>{c.nombre}</strong>
                <span>{c.estado}</span>
              </div>
            </div>
          ))}
          {condicionesMedicas.length === 0 && (
            <p className="empty-state">No hay condiciones médicas registradas.</p>
          )}
        </div>
      </section>

      <style>{`
        .ac-section { margin-bottom: 26px; max-width: 620px; }
        .ac-section-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .ac-section-head h2 { font-size: 15px; font-weight: 800; margin: 0; }
        .ac-list { display: flex; flex-direction: column; gap: 12px; }
        .ac-item { display: flex; align-items: center; gap: 14px; padding: 16px 18px; }
        .ac-icon { width: 38px; height: 38px; border-radius: 11px; background: var(--danger-100); color: var(--danger-500); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .ac-icon-info { background: var(--info-100); color: var(--info-500); }
        .ac-body { display: flex; flex-direction: column; gap: 2px; }
        .ac-body strong { font-size: 14.5px; font-weight: 700; }
        .ac-body span { font-size: 12.5px; color: var(--ink-500); }
      `}</style>
    </div>
  )
}
