import { useState } from 'react'
import { useParams, Navigate, Link } from 'react-router-dom'
import { Pencil, CheckCircle2 } from 'lucide-react'
import {
  mascotas,
  historialMedico,
  vacunasAplicadas,
  proximaVacuna,
  proximasCitas,
} from '../data/mockData'

const tabs = ['Resumen', 'Historial médico', 'Vacunas', 'Citas']

export default function PerfilMascota() {
  const { id } = useParams()
  const [tab, setTab] = useState('Resumen')

  const mascota = mascotas.find((m) => m.id === id) || mascotas[0]
  if (!id) return <Navigate to={`/perfil/${mascotas[0].id}`} replace />

  return (
    <div>
      <div className="profile-card card">
        <img className="avatar profile-photo" src={mascota.foto} alt={mascota.nombre} />
        <div className="profile-info">
          <div className="profile-info-top">
            <div>
              <h1>{mascota.nombre}</h1>
              <span className="profile-sub">
                {mascota.especie} · {mascota.raza}
              </span>
            </div>
            <button className="btn btn-secondary btn-sm">
              <Pencil size={14} /> Editar
            </button>
          </div>
          <div className="profile-tags">
            <span className="pill pill-info">{mascota.edad}</span>
            <span className="pill pill-info">{mascota.peso}</span>
            <span className="pill pill-info">{mascota.sexo}</span>
          </div>
        </div>
      </div>

      <div className="pet-select">
        {mascotas.map((m) => (
          <Link
            key={m.id}
            to={`/perfil/${m.id}`}
            className={`pet-select-chip ${m.id === mascota.id ? 'pet-select-chip-active' : ''}`}
          >
            <img src={m.foto} alt={m.nombre} />
            {m.nombre}
          </Link>
        ))}
      </div>

      <div className="tabs">
        {tabs.map((t) => (
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

      {tab === 'Resumen' && (
        <div className="card tab-panel">
          <h2 className="tab-panel-title">Información básica</h2>
          <div className="info-grid">
            <div>
              <span className="info-label">Raza</span>
              <p>{mascota.raza}</p>
            </div>
            <div>
              <span className="info-label">Peso</span>
              <p>{mascota.peso}</p>
            </div>
            <div>
              <span className="info-label">Fecha de nacimiento</span>
              <p>{mascota.fechaNacimiento}</p>
            </div>
            <div>
              <span className="info-label">Sexo</span>
              <p>{mascota.sexo}</p>
            </div>
            <div>
              <span className="info-label">Color</span>
              <p>{mascota.color}</p>
            </div>
          </div>
          <div className="info-desc">
            <span className="info-label">Descripción</span>
            <p>{mascota.descripcion}</p>
          </div>
        </div>
      )}

      {tab === 'Historial médico' && (
        <div className="card tab-panel">
          <div className="stack-list">
            {historialMedico.map((h) => (
              <div key={h.id} className="hist-item">
                <div className="hist-icon">
                  <CheckCircle2 size={18} />
                </div>
                <div className="hist-body">
                  <strong>{h.titulo}</strong>
                  <span>
                    {h.fecha} · {h.doctor}
                  </span>
                </div>
                <span className="pill pill-success">{h.estado}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'Vacunas' && (
        <div className="card tab-panel">
          <h2 className="tab-panel-title">Vacunas aplicadas</h2>
          <div className="vac-grid">
            {vacunasAplicadas.map((v) => (
              <div key={v.id} className="vac-chip">
                <strong>{v.nombre}</strong>
                <span className="pill pill-success">Aplicada</span>
                <small>{v.fecha}</small>
              </div>
            ))}
          </div>
          <h2 className="tab-panel-title" style={{ marginTop: 22 }}>
            Próxima vacuna
          </h2>
          <div className="vac-chip vac-chip-next">
            <strong>{proximaVacuna.nombre}</strong>
            <small>{proximaVacuna.fecha}</small>
          </div>
        </div>
      )}

      {tab === 'Citas' && (
        <div className="card tab-panel">
          <div className="stack-list">
            {proximasCitas
              .filter((c) => c.mascota === mascota.nombre)
              .map((c) => (
                <div key={c.id} className="hist-item">
                  <div className="hist-icon">
                    <CheckCircle2 size={18} />
                  </div>
                  <div className="hist-body">
                    <strong>{c.titulo}</strong>
                    <span>
                      {c.fecha} · {c.lugar}
                    </span>
                  </div>
                  <span className="pill pill-info">{c.estado}</span>
                </div>
              ))}
            {proximasCitas.filter((c) => c.mascota === mascota.nombre).length === 0 && (
              <p className="empty-state">No hay citas próximas para {mascota.nombre}.</p>
            )}
          </div>
        </div>
      )}

      <style>{`
        .profile-card { display: flex; gap: 18px; padding: 20px; margin-bottom: 16px; align-items: flex-start; }
        .profile-photo { width: 84px; height: 84px; }
        .profile-info { flex: 1; }
        .profile-info-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; flex-wrap: wrap; }
        .profile-info-top h1 { margin: 0; font-size: 21px; font-weight: 800; }
        .profile-sub { color: var(--ink-500); font-size: 13.5px; }
        .profile-tags { display: flex; gap: 8px; margin-top: 12px; flex-wrap: wrap; }

        .pet-select { display: flex; gap: 10px; margin-bottom: 18px; flex-wrap: wrap; }
        .pet-select-chip { display: flex; align-items: center; gap: 8px; padding: 6px 14px 6px 6px; border-radius: 999px; border: 1.5px solid var(--surface-border); background: var(--surface-0); font-size: 13px; font-weight: 700; color: var(--ink-500); }
        .pet-select-chip img { width: 26px; height: 26px; border-radius: 50%; object-fit: cover; }
        .pet-select-chip-active { border-color: var(--brand-500); background: var(--brand-50); color: var(--brand-700); }

        .tabs { display: flex; gap: 4px; border-bottom: 1.5px solid var(--surface-border); margin-bottom: 18px; overflow-x: auto; }
        .tab-btn { border: none; background: transparent; padding: 10px 16px; font-size: 13.5px; font-weight: 700; color: var(--ink-500); cursor: pointer; border-bottom: 2.5px solid transparent; white-space: nowrap; }
        .tab-btn-active { color: var(--brand-600); border-color: var(--brand-500); }

        .tab-panel { padding: 22px; }
        .tab-panel-title { font-size: 14px; font-weight: 800; margin: 0 0 14px; }
        .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px 24px; margin-bottom: 18px; }
        .info-label { font-size: 12px; font-weight: 700; color: var(--ink-400); text-transform: uppercase; letter-spacing: .03em; }
        .info-grid p, .info-desc p { margin: 4px 0 0; font-size: 14px; color: var(--ink-900); }
        .info-desc { padding-top: 14px; border-top: 1px solid var(--surface-border); }

        .hist-item { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid var(--surface-border); }
        .hist-item:last-child { border-bottom: none; }
        .hist-icon { width: 36px; height: 36px; border-radius: 10px; background: var(--brand-100); color: var(--brand-600); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .hist-body { flex: 1; display: flex; flex-direction: column; gap: 2px; min-width: 0; }
        .hist-body strong { font-size: 14px; font-weight: 700; }
        .hist-body span { font-size: 12.5px; color: var(--ink-500); }

        .vac-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 12px; }
        .vac-chip { border: 1px solid var(--surface-border); border-radius: var(--radius-md); padding: 14px; display: flex; flex-direction: column; gap: 6px; }
        .vac-chip strong { font-size: 14px; }
        .vac-chip small { color: var(--ink-500); font-size: 12px; }
        .vac-chip-next { border-color: var(--brand-400); background: var(--brand-50); max-width: 220px; }
      `}</style>
    </div>
  )
}
