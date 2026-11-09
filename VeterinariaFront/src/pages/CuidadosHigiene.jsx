import { useState } from 'react'
import { Plus, Droplet, Scissors, Wand2, Bug, X } from 'lucide-react'
import { useAsync } from '../hooks/useAsync'
import { registroService } from '../services/registroService'
import { mascotaService } from '../services/mascotaService'
import { formatearFecha } from '../utils/fechas'
import PageHeader from '../components/PageHeader'
import Estado from '../components/Estado'
import Tabs from '../components/Tabs'
import ListItem from '../components/ListItem'
import FormularioCampos from '../components/FormularioCampos'
import BotonEliminar from '../components/BotonEliminar'

const filtros = ['Todos', 'Baños', 'Uñas', 'Peluquería', 'Otros']
const iconoPorTipo = { Baño: Droplet, 'Corte de uñas': Scissors, Peluquería: Wand2, Desparasitación: Bug }
const filtroPorTipo = { Baño: 'Baños', 'Corte de uñas': 'Uñas', Peluquería: 'Peluquería', Desparasitación: 'Otros' }

const campos = [
  { name: 'tipo', label: 'Tipo de cuidado', type: 'select', required: true, options: ['Baño', 'Corte de uñas', 'Peluquería', 'Desparasitación'] },
  { name: 'mascotaId', label: 'Mascota', type: 'mascota', required: true },
  { name: 'fecha', label: 'Fecha', type: 'date', limite: 'pasado', required: true },
  { name: 'detalle', label: 'Notas', max: 255 },
]

export default function CuidadosHigiene() {
  const [filtro, setFiltro] = useState('Todos')
  const [mostrarForm, setMostrarForm] = useState(false)
  const { data, cargando, error, recargar } = useAsync(() => registroService.listar({ categoria: 'cuidado' }), [])
  const mascotas = useAsync(mascotaService.listar, [])
  const lista = (data || []).filter((c) => filtro === 'Todos' || filtroPorTipo[c.tipo] === filtro)

  const crear = async (datos) => {
    await registroService.crear('cuidado', { ...datos, titulo: datos.tipo })
    setMostrarForm(false)
    recargar()
  }

  return (
    <div>
      <PageHeader titulo="Cuidados e higiene">
        <button className="btn btn-primary" type="button" onClick={() => setMostrarForm((v) => !v)}>
          {mostrarForm ? <X size={16} /> : <Plus size={16} />} {mostrarForm ? 'Cerrar' : 'Registrar cuidado'}
        </button>
      </PageHeader>

      {mostrarForm &&
        (mascotas.data?.length ? (
          <FormularioCampos campos={campos} mascotas={mascotas.data} textoEnviar="Registrar" onSubmit={crear} onCancelar={() => setMostrarForm(false)} />
        ) : (
          <p className="alert alert-error">Primero registra una mascota.</p>
        ))}

      <Tabs variante="chips" opciones={filtros} valor={filtro} onChange={setFiltro} />

      <Estado cargando={cargando} error={error} onReintentar={recargar} vacio={lista.length === 0} textoVacio="No hay registros en esta categoría.">
        <div className="stack-list list-wrap">
          {lista.map((c) => (
            <ListItem
              key={c.id}
              icono={iconoPorTipo[c.tipo] || Droplet}
              tono="info"
              titulo={c.tipo}
              detalles={[c.mascotaNombre, c.detalle]}
              aside={<span className="care-date">{formatearFecha(c.fecha)}</span>}
              acciones={<BotonEliminar onEliminar={async () => { await registroService.eliminar(c.id); recargar() }} />}
            />
          ))}
        </div>
      </Estado>
    </div>
  )
}
