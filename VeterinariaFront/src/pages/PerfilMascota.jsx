import { useState } from 'react'
<<<<<<< HEAD
import { useParams, Navigate, Link, useNavigate } from 'react-router-dom'
import { Pencil, CheckCircle2, Plus, Trash2, X } from 'lucide-react'
import { useAsync } from '../hooks/useAsync'
import { mascotaService } from '../services/mascotaService'
import { citaService } from '../services/citaService'
import { registroService } from '../services/registroService'
import { calcularEdad, formatearFecha, formatearFechaHora } from '../utils/fechas'
import Estado from '../components/Estado'
import Tabs from '../components/Tabs'
import ListItem from '../components/ListItem'
import Avatar from '../components/Avatar'
import FormularioCampos from '../components/FormularioCampos'
import BotonEliminar from '../components/BotonEliminar'

const tabs = ['Resumen', 'Historial médico', 'Vacunas', 'Citas']

function Resumen({ m }) {
  const datos = [
    ['Raza', m.raza],
    ['Peso', m.pesoKg && `${m.pesoKg} kg`],
    ['Fecha de nacimiento', formatearFecha(m.fechaNacimiento)],
    ['Sexo', m.sexo],
    ['Color', m.color],
  ]
  return (
    <div className="card tab-panel">
      <h2 className="tab-panel-title">Información básica</h2>
      <div className="info-grid">
        {datos.map(([k, v]) => (
          <div key={k}>
            <span className="info-label">{k}</span>
            <p>{v || '—'}</p>
          </div>
        ))}
      </div>
      <div className="info-desc">
        <span className="info-label">Descripción</span>
        <p>{m.descripcion || 'Sin descripción.'}</p>
      </div>
    </div>
  )
}

// Panel de registros por mascota (historial médico y vacunas)
function PanelRegistros({ mascota, categoria, campos, textoVacio, render }) {
  const [mostrar, setMostrar] = useState(false)
  const { data, cargando, error, recargar } = useAsync(() => registroService.listar({ categoria, mascotaId: mascota.id }), [categoria, mascota.id])

  const crear = async (datos) => {
    await registroService.crear(categoria, { ...datos, mascotaId: mascota.id })
    setMostrar(false)
    recargar()
  }

  return (
    <div className="card tab-panel">
      <div className="panel-toolbar">
        <button className="btn btn-secondary btn-sm" type="button" onClick={() => setMostrar((v) => !v)}>
          {mostrar ? <X size={14} /> : <Plus size={14} />} {mostrar ? 'Cerrar' : 'Agregar'}
        </button>
      </div>
      {mostrar && <FormularioCampos campos={campos} onSubmit={crear} onCancelar={() => setMostrar(false)} />}
      <Estado cargando={cargando} error={error} onReintentar={recargar} vacio={data?.length === 0} textoVacio={textoVacio}>
        {render(data, recargar)}
      </Estado>
    </div>
  )
}

const camposHistorial = [
  { name: 'titulo', label: 'Motivo', required: true, max: 120 },
  { name: 'detalle', label: 'Doctor · Clínica', max: 255 },
  { name: 'fecha', label: 'Fecha', type: 'date', limite: 'pasado', required: true },
]
const camposVacuna = [
  { name: 'titulo', label: 'Vacuna', required: true, max: 120 },
  { name: 'fecha', label: 'Fecha de aplicación', type: 'date', limite: 'pasado', required: true },
]

function Historial({ m }) {
  return (
    <PanelRegistros mascota={m} categoria="historial" campos={camposHistorial} textoVacio="Sin historial médico registrado." render={(lista, recargar) => (
      <div className="stack-list">
        {lista.map((h) => (
          <ListItem key={h.id} tarjeta={false} icono={CheckCircle2} titulo={h.titulo} detalles={[`${formatearFecha(h.fecha)}${h.detalle ? ` · ${h.detalle}` : ''}`]}
            aside={<span className="pill pill-success">Completado</span>}
            acciones={<BotonEliminar onEliminar={async () => { await registroService.eliminar(h.id); recargar() }} />} />
        ))}
      </div>
    )} />
  )
}

function Vacunas({ m }) {
  const proxima = useAsync(() => registroService.listar({ categoria: 'recordatorio', mascotaId: m.id, periodo: 'proximas' }), [m.id])
  const siguiente = proxima.data?.find((r) => r.tipo === 'vacuna')
  return (
    <>
      <PanelRegistros mascota={m} categoria="vacuna" campos={camposVacuna} textoVacio="Aún no hay vacunas aplicadas." render={(lista, recargar) => (
        <>
          <h2 className="tab-panel-title">Vacunas aplicadas</h2>
          <div className="vac-grid">
            {lista.map((v) => (
              <div key={v.id} className="vac-chip">
                <strong>{v.titulo}</strong>
                <span className="pill pill-success">Aplicada</span>
                <small>{formatearFecha(v.fecha)}</small>
                <BotonEliminar onEliminar={async () => { await registroService.eliminar(v.id); recargar() }} />
              </div>
            ))}
          </div>
        </>
      )} />
      <div className="card tab-panel" style={{ marginTop: 16 }}>
        <h2 className="tab-panel-title">Próxima vacuna</h2>
        {siguiente ? (
          <div className="vac-chip vac-chip-next">
            <strong>{siguiente.titulo}</strong>
            <small>{formatearFechaHora(siguiente.fecha)}</small>
          </div>
        ) : (
          <p className="empty-state">No hay una vacuna programada. Crea un recordatorio de tipo vacuna.</p>
        )}
      </div>
    </>
  )
}

function CitasMascota({ m }) {
  const { data, cargando, error, recargar } = useAsync(() => citaService.listar({ periodo: 'proximas', mascotaId: m.id }), [m.id])
  return (
    <div className="card tab-panel">
      <Estado cargando={cargando} error={error} onReintentar={recargar} vacio={data?.length === 0} textoVacio={`No hay citas próximas para ${m.nombre}.`}>
        <div className="stack-list">
          {data?.map((c) => (
            <ListItem key={c.id} tarjeta={false} icono={CheckCircle2} titulo={c.titulo} detalles={[`${formatearFechaHora(c.fecha)} · ${c.lugar}`]} aside={<span className="pill pill-info">{c.estado}</span>} />
          ))}
        </div>
      </Estado>
    </div>
  )
}

function Contenido({ mascota, mascotas }) {
  const navigate = useNavigate()
  const [tab, setTab] = useState('Resumen')

  const eliminar = async () => {
    if (!window.confirm(`¿Eliminar a ${mascota.nombre}? Se borrarán también sus citas y registros.`)) return
    try {
      await mascotaService.eliminar(mascota.id)
      navigate('/mascotas')
    } catch (e) {
      window.alert(e.message)
    }
  }
=======
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
>>>>>>> f07299732d4d49260762e4f908dbfd0c91a7cf2a

  return (
    <div>
      <div className="profile-card card">
<<<<<<< HEAD
        <Avatar src={mascota.foto} nombre={mascota.nombre} tamano={84} />
=======
        <img className="avatar profile-photo" src={mascota.foto} alt={mascota.nombre} />
>>>>>>> f07299732d4d49260762e4f908dbfd0c91a7cf2a
        <div className="profile-info">
          <div className="profile-info-top">
            <div>
              <h1>{mascota.nombre}</h1>
<<<<<<< HEAD
              <span className="profile-sub">{mascota.especie}{mascota.raza ? ` · ${mascota.raza}` : ''}</span>
            </div>
            <div className="profile-actions">
              <Link to={`/mascotas/${mascota.id}/editar`} className="btn btn-secondary btn-sm"><Pencil size={14} /> Editar</Link>
              <button type="button" className="btn btn-danger-ghost btn-sm" onClick={eliminar}><Trash2 size={14} /> Eliminar</button>
            </div>
          </div>
          <div className="profile-tags">
            <span className="pill pill-info">{calcularEdad(mascota.fechaNacimiento)}</span>
            {mascota.pesoKg && <span className="pill pill-info">{mascota.pesoKg} kg</span>}
=======
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
>>>>>>> f07299732d4d49260762e4f908dbfd0c91a7cf2a
            <span className="pill pill-info">{mascota.sexo}</span>
          </div>
        </div>
      </div>

      <div className="pet-select">
        {mascotas.map((m) => (
<<<<<<< HEAD
          <Link key={m.id} to={`/perfil/${m.id}`} className={`pet-select-chip ${m.id === mascota.id ? 'pet-select-chip-active' : ''}`}>
            <Avatar src={m.foto} nombre={m.nombre} tamano={26} />
=======
          <Link
            key={m.id}
            to={`/perfil/${m.id}`}
            className={`pet-select-chip ${m.id === mascota.id ? 'pet-select-chip-active' : ''}`}
          >
            <img src={m.foto} alt={m.nombre} />
>>>>>>> f07299732d4d49260762e4f908dbfd0c91a7cf2a
            {m.nombre}
          </Link>
        ))}
      </div>

<<<<<<< HEAD
      <Tabs opciones={tabs} valor={tab} onChange={setTab} />
      {tab === 'Resumen' && <Resumen m={mascota} />}
      {tab === 'Historial médico' && <Historial m={mascota} />}
      {tab === 'Vacunas' && <Vacunas m={mascota} />}
      {tab === 'Citas' && <CitasMascota m={mascota} />}
    </div>
  )
}

export default function PerfilMascota() {
  const { id } = useParams()
  const { data: mascotas, cargando, error, recargar } = useAsync(mascotaService.listar, [])

  if (cargando || error) return <Estado cargando={cargando} error={error} onReintentar={recargar} />

  if (mascotas.length === 0) {
    return (
      <Estado vacio textoVacio="Aún no tienes mascotas registradas." accionVacio={<Link to="/agregar-mascota" className="btn btn-primary">Agregar mascota</Link>} />
    )
  }

  // Sin id en la URL: se lleva explícitamente a la primera mascota
  if (!id) return <Navigate to={`/perfil/${mascotas[0].id}`} replace />

  // Con id inexistente: se avisa del error de navegación (antes se mostraba otra mascota sin decir nada)
  const mascota = mascotas.find((m) => String(m.id) === id)
  if (!mascota) {
    return (
      <Estado vacio textoVacio="No encontramos esa mascota. Es posible que el enlace sea incorrecto o que haya sido eliminada." accionVacio={<Link to="/mascotas" className="btn btn-secondary">Ver mis mascotas</Link>} />
    )
  }

  return <Contenido mascota={mascota} mascotas={mascotas} key={mascota.id} />
}
=======
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
>>>>>>> f07299732d4d49260762e4f908dbfd0c91a7cf2a
