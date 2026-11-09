import { useState } from 'react'
<<<<<<< HEAD
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
=======
import { Syringe, PawPrint, Scissors, Stethoscope } from 'lucide-react'
import { recordatorios } from '../data/mockData'

const iconoPorTipo = {
  vacuna: Syringe,
  desparasitacion: PawPrint,
  unas: Scissors,
  consulta: Stethoscope,
}

const filtros = ['Todos', 'Vacunas', 'Citas', 'Otros']

const tipoAFiltro = {
  vacuna: 'Vacunas',
  consulta: 'Citas',
  desparasitacion: 'Otros',
  unas: 'Otros',
}

export default function Recordatorios() {
  const [filtro, setFiltro] = useState('Todos')

  const lista = recordatorios.filter((r) => filtro === 'Todos' || tipoAFiltro[r.tipo] === filtro)

  return (
    <div>
      <div className="page-header">
        <h1>Recordatorios</h1>
      </div>

      <div className="filter-row">
        {filtros.map((f) => (
          <button
            key={f}
            className={`filter-chip ${filtro === f ? 'filter-chip-active' : ''}`}
            onClick={() => setFiltro(f)}
            type="button"
          >
            {f}
          </button>
        ))}
      </div>

      <div className="stack-list rec-list">
        {lista.map((r) => {
          const Icon = iconoPorTipo[r.tipo] || PawPrint
          return (
            <div key={r.id} className="card rec-item">
              <div className="rec-icon">
                <Icon size={18} />
              </div>
              <div className="rec-body">
                <strong>{r.titulo}</strong>
                <span>{r.fecha}</span>
              </div>
              <span className="pill pill-warn">{r.faltan}</span>
            </div>
          )
        })}
        {lista.length === 0 && <p className="empty-state">Sin recordatorios en esta categoría.</p>}
      </div>

      <style>{`
        .filter-row { display: flex; gap: 8px; margin-bottom: 18px; flex-wrap: wrap; }
        .filter-chip { border: 1.5px solid var(--surface-border); background: var(--surface-0); padding: 7px 14px; border-radius: 999px; font-size: 13px; font-weight: 700; color: var(--ink-500); cursor: pointer; }
        .filter-chip-active { background: var(--brand-500); border-color: var(--brand-500); color: white; }
        .rec-list { max-width: 620px; }
        .rec-item { display: flex; align-items: center; gap: 14px; padding: 16px 18px; }
        .rec-icon { width: 38px; height: 38px; border-radius: 11px; background: var(--warn-100); color: var(--warn-500); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .rec-body { flex: 1; display: flex; flex-direction: column; gap: 2px; }
        .rec-body strong { font-size: 14.5px; font-weight: 700; }
        .rec-body span { font-size: 12.5px; color: var(--ink-500); }
      `}</style>
>>>>>>> f07299732d4d49260762e4f908dbfd0c91a7cf2a
    </div>
  )
}
