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
    </div>
  )
}
