import { useState } from 'react'
import { PawPrint, Plus, X } from 'lucide-react'
import { useAsync } from '../hooks/useAsync'
import { citaService } from '../services/citaService'
import { registroService } from '../services/registroService'
import { mascotaService } from '../services/mascotaService'
import { combinarRecordatorios, filtroPorTipo, iconoPorTipo } from '../utils/recordatorios'
import { formatearFechaHora, textoFaltan } from '../utils/fechas'
import PageHeader from '../components/PageHeader'
import Estado from '../components/Estado'
import Tabs from '../components/Tabs'
import ListItem from '../components/ListItem'
import FormularioCampos from '../components/FormularioCampos'

const filtros = ['Todos', 'Vacunas', 'Citas', 'Otros']

const campos = [
  {
    name: 'tipo', label: 'Tipo', type: 'select', required: true,
    options: [
      { valor: 'vacuna', etiqueta: 'Vacuna' },
      { valor: 'desparasitacion', etiqueta: 'Desparasitación' },
      { valor: 'unas', etiqueta: 'Corte de uñas' },
      { valor: 'consulta', etiqueta: 'Consulta' },
    ],
  },
  { name: 'titulo', label: 'Título', required: true, max: 120, placeholder: 'Ej. Vacuna antirrábica' },
  { name: 'mascotaId', label: 'Mascota', type: 'mascota' },
  { name: 'fecha', label: 'Fecha y hora', type: 'datetime', limite: 'futuro', required: true },
]

export default function Recordatorios() {
  const [filtro, setFiltro] = useState('Todos')
  const [mostrarForm, setMostrarForm] = useState(false)

  const { data, cargando, error, recargar } = useAsync(
    () => Promise.all([registroService.listar({ categoria: 'recordatorio', periodo: 'proximas' }), citaService.listar({ periodo: 'proximas' })]),
    [],
  )
  const mascotas = useAsync(mascotaService.listar, [])

  // Las fechas se comparan en el momento de mostrar: nada queda como "próximo" si ya pasó
  const todos = data ? combinarRecordatorios(data[0], data[1]) : []
  const lista = todos.filter((r) => filtro === 'Todos' || filtroPorTipo[r.tipo] === filtro)

  const crear = async (datos) => {
    await registroService.crear('recordatorio', datos)
    setMostrarForm(false)
    recargar()
  }

  return (
    <div>
      <PageHeader titulo="Recordatorios">
        <button className="btn btn-primary" type="button" onClick={() => setMostrarForm((v) => !v)}>
          {mostrarForm ? <X size={16} /> : <Plus size={16} />} {mostrarForm ? 'Cerrar' : 'Nuevo recordatorio'}
        </button>
      </PageHeader>

      {mostrarForm && (
        <FormularioCampos campos={campos} mascotas={mascotas.data || []} textoEnviar="Crear" onSubmit={crear} onCancelar={() => setMostrarForm(false)} />
      )}

      <Tabs variante="chips" opciones={filtros} valor={filtro} onChange={setFiltro} />

      <Estado cargando={cargando} error={error} onReintentar={recargar} vacio={lista.length === 0} textoVacio="Sin recordatorios en esta categoría.">
        <div className="stack-list list-wrap">
          {lista.map((r) => (
            <ListItem
              key={r.id}
              icono={iconoPorTipo[r.tipo] || PawPrint}
              tono="warn"
              titulo={r.titulo}
              detalles={[formatearFechaHora(r.fecha)]}
              aside={<span className="pill pill-warn">{textoFaltan(r.fecha)}</span>}
            />
          ))}
        </div>
      </Estado>
    </div>
  )
}
