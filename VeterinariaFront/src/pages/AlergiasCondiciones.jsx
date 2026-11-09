<<<<<<< HEAD
import { useState } from 'react'
import { Plus, AlertTriangle, X } from 'lucide-react'
import { useAsync } from '../hooks/useAsync'
import { registroService } from '../services/registroService'
import { mascotaService } from '../services/mascotaService'
import { formatearFecha } from '../utils/fechas'
import PageHeader from '../components/PageHeader'
import Estado from '../components/Estado'
import ListItem from '../components/ListItem'
import FormularioCampos from '../components/FormularioCampos'
import BotonEliminar from '../components/BotonEliminar'

const camposDe = (etiquetaNombre, etiquetaDetalle) => [
  { name: 'titulo', label: etiquetaNombre, required: true, max: 120 },
  { name: 'detalle', label: etiquetaDetalle, max: 255 },
  { name: 'mascotaId', label: 'Mascota', type: 'mascota', required: true },
  { name: 'fecha', label: 'Desde', type: 'date', limite: 'pasado' },
]

// Sección reutilizable: se usa para alergias y para condiciones médicas
function Seccion({ titulo, categoria, tono, icono, campos, vacio, mascotas }) {
  const [mostrar, setMostrar] = useState(false)
  const { data, cargando, error, recargar } = useAsync(() => registroService.listar({ categoria }), [categoria])

  const crear = async (datos) => {
    await registroService.crear(categoria, datos)
    setMostrar(false)
    recargar()
  }

  return (
    <section className="section">
      <div className="section-head">
        <h2>{titulo}</h2>
        <button className="btn btn-secondary btn-sm" type="button" onClick={() => setMostrar((v) => !v)}>
          {mostrar ? <X size={14} /> : <Plus size={14} />} {mostrar ? 'Cerrar' : 'Agregar'}
        </button>
      </div>

      {mostrar &&
        (mascotas.length ? (
          <FormularioCampos campos={campos} mascotas={mascotas} onSubmit={crear} onCancelar={() => setMostrar(false)} />
        ) : (
          <p className="alert alert-error">Primero registra una mascota.</p>
        ))}

      <Estado cargando={cargando} error={error} onReintentar={recargar} vacio={data?.length === 0} textoVacio={vacio}>
        <div className="stack-list">
          {data?.map((r) => (
            <ListItem
              key={r.id}
              icono={icono}
              tono={tono}
              titulo={`${r.titulo}${r.mascotaNombre ? ` · ${r.mascotaNombre}` : ''}`}
              detalles={[[r.detalle, r.fecha && `Desde ${formatearFecha(r.fecha)}`].filter(Boolean).join(' · ')]}
              acciones={<BotonEliminar onEliminar={async () => { await registroService.eliminar(r.id); recargar() }} />}
            />
          ))}
        </div>
      </Estado>
    </section>
  )
}

export default function AlergiasCondiciones() {
  const mascotas = useAsync(mascotaService.listar, [])
  const lista = mascotas.data || []
  return (
    <div>
      <PageHeader titulo="Alergias y condiciones" />
      <Seccion titulo="Alergias" categoria="alergia" tono="danger" icono={AlertTriangle} campos={camposDe('Alergia', 'Reacción')} vacio="No hay alergias registradas." mascotas={lista} />
      <Seccion titulo="Condiciones médicas" categoria="condicion" tono="info" icono={Plus} campos={camposDe('Condición', 'Estado / tratamiento')} vacio="No hay condiciones médicas registradas." mascotas={lista} />
=======
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
>>>>>>> f07299732d4d49260762e4f908dbfd0c91a7cf2a
    </div>
  )
}
