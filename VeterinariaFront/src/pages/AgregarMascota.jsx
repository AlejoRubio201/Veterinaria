import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, Check } from 'lucide-react'

const pasos = [
  { n: 1, label: 'Datos básicos' },
  { n: 2, label: 'Foto' },
  { n: 3, label: 'Confirmar' },
]

export default function AgregarMascota() {
  const navigate = useNavigate()
  const [paso, setPaso] = useState(1)
  const [form, setForm] = useState({
    nombre: '',
    especie: 'Perro',
    raza: '',
    fechaNacimiento: '',
    sexo: 'Hembra',
  })

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const siguiente = () => setPaso((p) => Math.min(p + 1, 3))
  const anterior = () => setPaso((p) => Math.max(p - 1, 1))

  return (
    <div>
      <div className="page-header">
        <h1>Agregar mascota</h1>
      </div>

      <div className="card wizard-card">
        <div className="wizard-steps">
          {pasos.map((p) => (
            <div key={p.n} className={`wizard-step ${paso >= p.n ? 'wizard-step-active' : ''}`}>
              <span className="wizard-step-dot">{paso > p.n ? <Check size={13} /> : p.n}</span>
              {p.label}
            </div>
          ))}
        </div>

        {paso === 1 && (
          <div className="wizard-body">
            <div className="field">
              <label className="field-label">Nombre de la mascota *</label>
              <input type="text" placeholder="Ej. Luna" value={form.nombre} onChange={update('nombre')} />
            </div>
            <div className="wizard-row">
              <div className="field">
                <label className="field-label">Especie *</label>
                <select value={form.especie} onChange={update('especie')}>
                  <option>Perro</option>
                  <option>Gato</option>
                  <option>Otro</option>
                </select>
              </div>
              <div className="field">
                <label className="field-label">Raza</label>
                <input type="text" placeholder="Golden Retriever" value={form.raza} onChange={update('raza')} />
              </div>
            </div>
            <div className="wizard-row">
              <div className="field">
                <label className="field-label">Fecha de nacimiento *</label>
                <input type="date" value={form.fechaNacimiento} onChange={update('fechaNacimiento')} />
              </div>
              <div className="field">
                <label className="field-label">Sexo *</label>
                <div className="sex-toggle">
                  <button
                    type="button"
                    className={form.sexo === 'Macho' ? 'sex-btn sex-btn-active' : 'sex-btn'}
                    onClick={() => setForm((f) => ({ ...f, sexo: 'Macho' }))}
                  >
                    Macho
                  </button>
                  <button
                    type="button"
                    className={form.sexo === 'Hembra' ? 'sex-btn sex-btn-active' : 'sex-btn'}
                    onClick={() => setForm((f) => ({ ...f, sexo: 'Hembra' }))}
                  >
                    Hembra
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {paso === 2 && (
          <div className="wizard-body wizard-photo">
            <div className="photo-drop">
              <Camera size={26} />
              <span>Agregar foto</span>
            </div>
            <p className="empty-state" style={{ padding: '8px 0' }}>
              Sube una foto de {form.nombre || 'tu mascota'} para completar su perfil.
            </p>
          </div>
        )}

        {paso === 3 && (
          <div className="wizard-body">
            <h2 className="tab-panel-title">Confirma los datos</h2>
            <div className="info-grid">
              <div>
                <span className="info-label">Nombre</span>
                <p>{form.nombre || '—'}</p>
              </div>
              <div>
                <span className="info-label">Especie</span>
                <p>{form.especie}</p>
              </div>
              <div>
                <span className="info-label">Raza</span>
                <p>{form.raza || '—'}</p>
              </div>
              <div>
                <span className="info-label">Sexo</span>
                <p>{form.sexo}</p>
              </div>
              <div>
                <span className="info-label">Fecha de nacimiento</span>
                <p>{form.fechaNacimiento || '—'}</p>
              </div>
            </div>
          </div>
        )}

        <div className="wizard-actions">
          <button className="btn btn-secondary" onClick={paso === 1 ? () => navigate(-1) : anterior} type="button">
            Cancelar
          </button>
          {paso < 3 ? (
            <button className="btn btn-primary" onClick={siguiente} type="button">
              Siguiente
            </button>
          ) : (
            <button className="btn btn-primary" onClick={() => navigate('/mascotas')} type="button">
              Guardar mascota
            </button>
          )}
        </div>
      </div>

      <style>{`
        .wizard-card { max-width: 620px; padding: 24px; }
        .wizard-steps { display: flex; gap: 22px; margin-bottom: 22px; flex-wrap: wrap; }
        .wizard-step { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 700; color: var(--ink-400); }
        .wizard-step-active { color: var(--brand-600); }
        .wizard-step-dot { width: 22px; height: 22px; border-radius: 50%; background: var(--surface-100); color: var(--ink-400); display: flex; align-items: center; justify-content: center; font-size: 11.5px; }
        .wizard-step-active .wizard-step-dot { background: var(--brand-500); color: white; }
        .wizard-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .sex-toggle { display: flex; gap: 8px; }
        .sex-btn { flex: 1; padding: 10px; border-radius: var(--radius-sm); border: 1.5px solid var(--surface-border); background: var(--surface-0); font-weight: 700; font-size: 13.5px; color: var(--ink-500); cursor: pointer; }
        .sex-btn-active { background: var(--brand-500); border-color: var(--brand-500); color: white; }
        .photo-drop { border: 1.5px dashed var(--surface-border); border-radius: 50%; width: 120px; height: 120px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; color: var(--ink-400); font-size: 12px; font-weight: 700; margin: 10px auto; }
        .wizard-photo { text-align: center; }
        .wizard-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 24px; border-top: 1px solid var(--surface-border); padding-top: 18px; }
        @media (max-width: 540px) {
          .wizard-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  )
}
