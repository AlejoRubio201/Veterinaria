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
    </div>
  )
}
