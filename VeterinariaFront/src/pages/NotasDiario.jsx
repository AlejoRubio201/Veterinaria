<<<<<<< HEAD
import { useState } from 'react'
import { Plus, Pill, Smile, Frown, Utensils, X } from 'lucide-react'
import { useAsync } from '../hooks/useAsync'
import { registroService } from '../services/registroService'
import { mascotaService } from '../services/mascotaService'
import { formatearFechaHora } from '../utils/fechas'
import PageHeader from '../components/PageHeader'
import Estado from '../components/Estado'
import ListItem from '../components/ListItem'
import FormularioCampos from '../components/FormularioCampos'
import BotonEliminar from '../components/BotonEliminar'

const iconoPorTipo = { medicamento: Pill, animo: Smile, sintoma: Frown, apetito: Utensils }
const tonoPorTipo = { medicamento: 'info', animo: 'brand', sintoma: 'danger', apetito: 'warn' }

const campos = [
  {
    name: 'tipo', label: 'Tipo', type: 'select', required: true,
    options: [
      { valor: 'medicamento', etiqueta: 'Medicamento' },
      { valor: 'animo', etiqueta: 'Ánimo' },
      { valor: 'sintoma', etiqueta: 'Síntoma' },
      { valor: 'apetito', etiqueta: 'Apetito' },
    ],
  },
  { name: 'titulo', label: 'Nota', required: true, max: 120, placeholder: 'Ej. Hoy tomó su medicamento' },
  { name: 'mascotaId', label: 'Mascota', type: 'mascota' },
  { name: 'fecha', label: 'Fecha y hora', type: 'datetime', limite: 'pasado', required: true },
]

export default function NotasDiario() {
  const [mostrarForm, setMostrarForm] = useState(false)
  const { data, cargando, error, recargar } = useAsync(() => registroService.listar({ categoria: 'nota' }), [])
  const mascotas = useAsync(mascotaService.listar, [])

  const crear = async (datos) => {
    await registroService.crear('nota', datos)
    setMostrarForm(false)
    recargar()
  }

  return (
    <div>
      <PageHeader titulo="Notas y diario">
        <button className="btn btn-primary" type="button" onClick={() => setMostrarForm((v) => !v)}>
          {mostrarForm ? <X size={16} /> : <Plus size={16} />} {mostrarForm ? 'Cerrar' : 'Agregar nota'}
        </button>
      </PageHeader>

      {mostrarForm && <FormularioCampos campos={campos} mascotas={mascotas.data || []} textoEnviar="Guardar nota" onSubmit={crear} onCancelar={() => setMostrarForm(false)} />}

      <Estado cargando={cargando} error={error} onReintentar={recargar} vacio={data?.length === 0} textoVacio="Aún no hay notas.">
        <div className="stack-list list-wrap">
          {data?.map((n) => (
            <ListItem
              key={n.id}
              icono={iconoPorTipo[n.tipo] || Smile}
              tono={tonoPorTipo[n.tipo]}
              titulo={n.titulo}
              detalles={[formatearFechaHora(n.fecha), n.mascotaNombre]}
              acciones={<BotonEliminar onEliminar={async () => { await registroService.eliminar(n.id); recargar() }} />}
            />
          ))}
        </div>
      </Estado>
=======
import { Plus, Pill, Smile, Frown, Utensils } from 'lucide-react'
import { notas } from '../data/mockData'

const iconoPorTipo = {
  medicamento: Pill,
  animo: Smile,
  sintoma: Frown,
  apetito: Utensils,
}

const colorPorTipo = {
  medicamento: 'nota-icon-info',
  animo: 'nota-icon-success',
  sintoma: 'nota-icon-danger',
  apetito: 'nota-icon-warn',
}

export default function NotasDiario() {
  return (
    <div>
      <div className="page-header">
        <h1>Notas y diario</h1>
        <button className="btn btn-primary">
          <Plus size={16} /> Agregar nota
        </button>
      </div>

      <div className="stack-list nota-list">
        {notas.map((n) => {
          const Icon = iconoPorTipo[n.tipo] || Smile
          return (
            <div key={n.id} className="card nota-item">
              <div className={`nota-icon ${colorPorTipo[n.tipo]}`}>
                <Icon size={18} />
              </div>
              <div className="nota-body">
                <strong>{n.titulo}</strong>
                <span>{n.fecha}</span>
              </div>
            </div>
          )
        })}
      </div>

      <style>{`
        .nota-list { max-width: 620px; }
        .nota-item { display: flex; align-items: center; gap: 14px; padding: 16px 18px; }
        .nota-icon { width: 38px; height: 38px; border-radius: 11px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .nota-icon-info { background: var(--info-100); color: var(--info-500); }
        .nota-icon-success { background: var(--brand-100); color: var(--brand-600); }
        .nota-icon-danger { background: var(--danger-100); color: var(--danger-500); }
        .nota-icon-warn { background: var(--warn-100); color: var(--warn-500); }
        .nota-body { display: flex; flex-direction: column; gap: 2px; }
        .nota-body strong { font-size: 14.5px; font-weight: 700; }
        .nota-body span { font-size: 12.5px; color: var(--ink-500); }
      `}</style>
>>>>>>> f07299732d4d49260762e4f908dbfd0c91a7cf2a
    </div>
  )
}
