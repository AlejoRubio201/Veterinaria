import { useState } from 'react'
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

  return (
    <div>
      <div className="profile-card card">
        <Avatar src={mascota.foto} nombre={mascota.nombre} tamano={84} />
        <div className="profile-info">
          <div className="profile-info-top">
            <div>
              <h1>{mascota.nombre}</h1>
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
            <span className="pill pill-info">{mascota.sexo}</span>
          </div>
        </div>
      </div>

      <div className="pet-select">
        {mascotas.map((m) => (
          <Link key={m.id} to={`/perfil/${m.id}`} className={`pet-select-chip ${m.id === mascota.id ? 'pet-select-chip-active' : ''}`}>
            <Avatar src={m.foto} nombre={m.nombre} tamano={26} />
            {m.nombre}
          </Link>
        ))}
      </div>

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
