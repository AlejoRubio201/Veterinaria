import { useState } from 'react'
<<<<<<< HEAD
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
=======
import { Plus, PawPrint } from 'lucide-react'
import { proximasCitas, citasHistorial } from '../data/mockData'
>>>>>>> f07299732d4d49260762e4f908dbfd0c91a7cf2a

const estadoClase = {
  Confirmada: 'pill-success',
  Pendiente: 'pill-warn',
<<<<<<< HEAD
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
=======
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
>>>>>>> f07299732d4d49260762e4f908dbfd0c91a7cf2a
    </div>
  )
}
