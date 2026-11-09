import { useState } from 'react'
<<<<<<< HEAD
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Camera, Check } from 'lucide-react'
import { mascotaService } from '../services/mascotaService'
import { useAsync } from '../hooks/useAsync'
import { hoyInput, formatearFecha } from '../utils/fechas'
import PageHeader from '../components/PageHeader'
import Estado from '../components/Estado'
import Campo from '../components/Campo'
=======
import { useNavigate } from 'react-router-dom'
import { Camera, Check } from 'lucide-react'
>>>>>>> f07299732d4d49260762e4f908dbfd0c91a7cf2a

const pasos = [
  { n: 1, label: 'Datos básicos' },
  { n: 2, label: 'Foto' },
  { n: 3, label: 'Confirmar' },
]

<<<<<<< HEAD
const VACIO = { nombre: '', especie: 'Perro', raza: '', fechaNacimiento: '', sexo: 'Hembra', pesoKg: '', color: '', descripcion: '', foto: '' }

function validar(paso, f) {
  const e = {}
  if (paso === 1) {
    if (!f.nombre.trim()) e.nombre = 'El nombre es obligatorio'
    else if (f.nombre.trim().length > 60) e.nombre = 'Máximo 60 caracteres'
    if (f.raza.length > 60) e.raza = 'Máximo 60 caracteres'
    if (f.color.length > 40) e.color = 'Máximo 40 caracteres'
    if (!f.fechaNacimiento) e.fechaNacimiento = 'La fecha de nacimiento es obligatoria'
    else if (f.fechaNacimiento > hoyInput()) e.fechaNacimiento = 'No puede ser futura'
    if (f.pesoKg !== '') {
      const n = Number(f.pesoKg)
      if (!Number.isFinite(n) || n <= 0 || n > 200) e.pesoKg = 'Ingresa un peso entre 0.01 y 200 kg'
    }
  }
  if (paso === 2) {
    if (f.foto && !/^https?:\/\/\S+$/i.test(f.foto.trim())) e.foto = 'Debe comenzar con http:// o https://'
    if (f.foto.length > 500) e.foto = 'Máximo 500 caracteres'
    if (f.descripcion.length > 500) e.descripcion = 'Máximo 500 caracteres'
  }
  return e
}

function Asistente({ inicial, id }) {
  const navigate = useNavigate()
  const [paso, setPaso] = useState(1)
  const [form, setForm] = useState(inicial)
  const [errores, setErrores] = useState({})
  const [enviando, setEnviando] = useState(false)
  const [errorGeneral, setErrorGeneral] = useState('')

  const cambiar = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    setErrores((er) => ({ ...er, [k]: '' }))
  }

  const siguiente = () => {
    const e = validar(paso, form)
    setErrores(e)
    if (!Object.keys(e).length) setPaso((p) => Math.min(p + 1, 3))
  }

  const guardar = async () => {
    const e = { ...validar(1, form), ...validar(2, form) }
    if (Object.keys(e).length) {
      setErrores(e)
      setPaso(Object.keys(validar(1, form)).length ? 1 : 2)
      return
    }
    setEnviando(true)
    setErrorGeneral('')
    try {
      const datos = {
        nombre: form.nombre.trim(),
        especie: form.especie,
        raza: form.raza.trim() || null,
        sexo: form.sexo,
        fechaNacimiento: form.fechaNacimiento,
        pesoKg: form.pesoKg === '' ? null : Number(form.pesoKg),
        color: form.color.trim() || null,
        descripcion: form.descripcion.trim() || null,
        foto: form.foto.trim() || null,
      }
      const m = id ? await mascotaService.actualizar(id, datos) : await mascotaService.crear(datos)
      navigate(`/perfil/${m.id}`)
    } catch (err) {
      setErrorGeneral(err.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
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
        <div>
          <Campo id="m-nombre" etiqueta="Nombre de la mascota *" error={errores.nombre}>
            <input id="m-nombre" type="text" maxLength={60} placeholder="Ej. Luna" value={form.nombre} onChange={cambiar('nombre')} />
          </Campo>
          <div className="wizard-row">
            <Campo id="m-especie" etiqueta="Especie *">
              <select id="m-especie" value={form.especie} onChange={cambiar('especie')}>
                <option>Perro</option>
                <option>Gato</option>
                <option>Otro</option>
              </select>
            </Campo>
            <Campo id="m-raza" etiqueta="Raza" error={errores.raza}>
              <input id="m-raza" type="text" maxLength={60} placeholder="Golden Retriever" value={form.raza} onChange={cambiar('raza')} />
            </Campo>
          </div>
          <div className="wizard-row">
            <Campo id="m-nac" etiqueta="Fecha de nacimiento *" error={errores.fechaNacimiento}>
              <input id="m-nac" type="date" max={hoyInput()} value={form.fechaNacimiento} onChange={cambiar('fechaNacimiento')} />
            </Campo>
            <Campo id="m-sexo" etiqueta="Sexo *">
              <select id="m-sexo" value={form.sexo} onChange={cambiar('sexo')}>
                <option>Hembra</option>
                <option>Macho</option>
              </select>
            </Campo>
          </div>
          <div className="wizard-row">
            <Campo id="m-peso" etiqueta="Peso (kg)" error={errores.pesoKg}>
              <input id="m-peso" type="number" step="0.01" min="0.01" max="200" value={form.pesoKg} onChange={cambiar('pesoKg')} />
            </Campo>
            <Campo id="m-color" etiqueta="Color" error={errores.color}>
              <input id="m-color" type="text" maxLength={40} value={form.color} onChange={cambiar('color')} />
            </Campo>
          </div>
        </div>
      )}

      {paso === 2 && (
        <div className="wizard-photo">
          <div className="photo-preview">
            {form.foto && !errores.foto ? <img src={form.foto} alt="Vista previa" referrerPolicy="no-referrer" /> : <Camera size={26} />}
          </div>
          <Campo id="m-foto" etiqueta="URL de la foto" error={errores.foto} ayuda="Pega el enlace de una imagen (https://...)">
            <input id="m-foto" type="url" maxLength={500} value={form.foto} onChange={cambiar('foto')} />
          </Campo>
          <Campo id="m-desc" etiqueta="Descripción" error={errores.descripcion}>
            <textarea id="m-desc" rows={3} maxLength={500} value={form.descripcion} onChange={cambiar('descripcion')} />
          </Campo>
        </div>
      )}

      {paso === 3 && (
        <div>
          <h2 className="tab-panel-title">Confirma los datos</h2>
          <div className="info-grid">
            {[
              ['Nombre', form.nombre],
              ['Especie', form.especie],
              ['Raza', form.raza],
              ['Sexo', form.sexo],
              ['Fecha de nacimiento', formatearFecha(form.fechaNacimiento)],
              ['Peso', form.pesoKg && `${form.pesoKg} kg`],
              ['Color', form.color],
            ].map(([k, v]) => (
              <div key={k}>
                <span className="info-label">{k}</span>
                <p>{v || '—'}</p>
              </div>
            ))}
          </div>
          {errorGeneral && <p className="alert alert-error" role="alert">{errorGeneral}</p>}
        </div>
      )}

      <div className="wizard-actions">
        <button className="btn btn-secondary" type="button" onClick={paso === 1 ? () => navigate(-1) : () => setPaso((p) => p - 1)}>
          {paso === 1 ? 'Cancelar' : 'Atrás'}
        </button>
        {paso < 3 ? (
          <button className="btn btn-primary" type="button" onClick={siguiente}>Siguiente</button>
        ) : (
          <button className="btn btn-primary" type="button" onClick={guardar} disabled={enviando}>
            {enviando ? 'Guardando...' : id ? 'Guardar cambios' : 'Guardar mascota'}
          </button>
        )}
      </div>
    </div>
  )
}

export default function AgregarMascota() {
  const { id } = useParams()
  // En modo edición se carga la mascota real; si el id no existe se informa el error
  const { data, cargando, error, recargar } = useAsync(() => (id ? mascotaService.obtener(id) : Promise.resolve(null)), [id])

  const inicial = data
    ? { ...VACIO, ...Object.fromEntries(Object.entries(data).map(([k, v]) => [k, v ?? ''])), pesoKg: data.pesoKg ?? '' }
    : VACIO

  return (
    <div>
      <PageHeader titulo={id ? 'Editar mascota' : 'Agregar mascota'} />
      <Estado cargando={cargando} error={error} onReintentar={recargar} accionVacio={<Link to="/mascotas" className="btn btn-secondary btn-sm">Volver a mis mascotas</Link>}>
        <Asistente key={id || 'nueva'} inicial={inicial} id={id} />
      </Estado>
=======
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
>>>>>>> f07299732d4d49260762e4f908dbfd0c91a7cf2a
    </div>
  )
}
