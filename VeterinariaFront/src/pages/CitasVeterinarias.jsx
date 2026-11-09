import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, PawPrint, X } from 'lucide-react'
import { useAsync } from '../hooks/useAsync'
import { citaService } from '../services/citaService'
import { mascotaService } from '../services/mascotaService'
import { formatearFechaHora } from '../utils/fechas'
import PageHeader from '../components/PageHeader'
import Estado from '../components/Estado'
import Tabs from '../components/Tabs'
import ListItem from '../components/ListItem'
import FormularioCampos from '../components/FormularioCampos'

const estadoClase = {
  Confirmada: 'pill-success',
  Pendiente: 'pill-warn',
  Completada: 'pill-info',
  Cancelada: 'pill-danger',
}

// La fecha solo admite momentos futuros (también se valida en el servidor)
const campos = [
  { name: 'mascotaId', label: 'Mascota', type: 'mascota', required: true },
  { name: 'titulo', label: 'Motivo', required: true, max: 100, placeholder: 'Ej. Vacunación' },
  { name: 'lugar', label: 'Lugar', required: true, max: 120, placeholder: 'Ej. Clínica VetSalud' },
  { name: 'fecha', label: 'Fecha y hora', type: 'datetime', limite: 'futuro', required: true },
]

export default function CitasVeterinarias() {
  const [tab, setTab] = useState('Próximas')
  const [mostrarForm, setMostrarForm] = useState(false)
  const [errorAccion, setErrorAccion] = useState('')
  const periodo = tab === 'Próximas' ? 'proximas' : 'historial'

  const citas = useAsync(() => citaService.listar({ periodo }), [periodo])
  const mascotas = useAsync(mascotaService.listar, [])

  const agendar = async (datos) => {
    await citaService.crear(datos)
    setMostrarForm(false)
    setTab('Próximas')
    citas.recargar()
  }

  const cancelar = async (id) => {
    if (!window.confirm('¿Cancelar esta cita?')) return
    setErrorAccion('')
    try {
      await citaService.cancelar(id)
      citas.recargar()
    } catch (e) {
      setErrorAccion(e.message)
    }
  }

  return (
    <div>
      <PageHeader titulo="Citas veterinarias">
        <button className="btn btn-primary" type="button" onClick={() => setMostrarForm((v) => !v)}>
          {mostrarForm ? <X size={16} /> : <Plus size={16} />} {mostrarForm ? 'Cerrar' : 'Agendar cita'}
        </button>
      </PageHeader>

      {mostrarForm &&
        (mascotas.data?.length ? (
          <FormularioCampos campos={campos} mascotas={mascotas.data} textoEnviar="Agendar" onSubmit={agendar} onCancelar={() => setMostrarForm(false)} />
        ) : (
          <p className="alert alert-error">
            Primero registra una mascota: <Link to="/agregar-mascota">agregar mascota</Link>.
          </p>
        ))}

      <Tabs opciones={['Próximas', 'Historial']} valor={tab} onChange={setTab} />
      {errorAccion && <p className="alert alert-error" role="alert">{errorAccion}</p>}

      <Estado cargando={citas.cargando} error={citas.error} onReintentar={citas.recargar} vacio={citas.data?.length === 0} textoVacio="No hay citas para mostrar.">
        <div className="stack-list list-wrap">
          {citas.data?.map((c) => (
            <ListItem
              key={c.id}
              icono={PawPrint}
              titulo={`${c.titulo} · ${c.mascotaNombre}`}
              detalles={[formatearFechaHora(c.fecha), c.lugar]}
              aside={<span className={`pill ${estadoClase[c.estado] || 'pill-info'}`}>{c.estado}</span>}
              acciones={
                c.esFutura && c.estado !== 'Cancelada' ? (
                  <button type="button" className="icon-btn" title="Cancelar cita" aria-label="Cancelar cita" onClick={() => cancelar(c.id)}>
                    <X size={16} />
                  </button>
                ) : null
              }
            />
          ))}
        </div>
      </Estado>
    </div>
  )
}
