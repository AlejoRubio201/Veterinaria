import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { useAsync } from '../hooks/useAsync'
import { registroService } from '../services/registroService'
import { mascotaService } from '../services/mascotaService'
import PageHeader from '../components/PageHeader'
import Estado from '../components/Estado'
import FormularioCampos from '../components/FormularioCampos'
import BotonEliminar from '../components/BotonEliminar'

const campos = [
  { name: 'url', label: 'URL de la foto', type: 'url', required: true, max: 500, placeholder: 'https://...' },
  { name: 'titulo', label: 'Descripción', max: 120 },
  { name: 'mascotaId', label: 'Mascota', type: 'mascota' },
]

export default function GaleriaFotos() {
  const [mostrarForm, setMostrarForm] = useState(false)
  const { data, cargando, error, recargar } = useAsync(() => registroService.listar({ categoria: 'foto' }), [])
  const mascotas = useAsync(mascotaService.listar, [])

  const crear = async ({ titulo, ...resto }) => {
    await registroService.crear('foto', { ...resto, titulo: titulo || 'Foto' })
    setMostrarForm(false)
    recargar()
  }

  return (
    <div>
      <PageHeader titulo="Galería de fotos">
        <button className="btn btn-primary" type="button" onClick={() => setMostrarForm((v) => !v)}>
          {mostrarForm ? <X size={16} /> : <Plus size={16} />} {mostrarForm ? 'Cerrar' : 'Agregar foto'}
        </button>
      </PageHeader>

      {mostrarForm && <FormularioCampos campos={campos} mascotas={mascotas.data || []} textoEnviar="Agregar" onSubmit={crear} onCancelar={() => setMostrarForm(false)} />}

      <Estado cargando={cargando} error={error} onReintentar={recargar} vacio={data?.length === 0} textoVacio="Tu galería está vacía. Agrega la primera foto.">
        <div className="gallery-grid">
          {data?.map((f) => (
            <div className="gallery-tile" key={f.id}>
              <img src={f.url} alt={f.titulo} loading="lazy" referrerPolicy="no-referrer" />
              <BotonEliminar className="gallery-del" texto="¿Eliminar esta foto?" onEliminar={async () => { await registroService.eliminar(f.id); recargar() }} />
            </div>
          ))}
        </div>
      </Estado>
    </div>
  )
}
