<<<<<<< HEAD
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
=======
import { Plus, Camera } from 'lucide-react'
import { galeria } from '../data/mockData'

export default function GaleriaFotos() {
  return (
    <div>
      <div className="page-header">
        <h1>Galería de fotos</h1>
        <button className="btn btn-primary">
          <Plus size={16} /> Agregar foto
        </button>
      </div>

      <div className="gallery-grid">
        {galeria.map((src, i) => (
          <div className="gallery-tile" key={i}>
            <img src={src} alt={`Foto ${i + 1}`} />
          </div>
        ))}
        <button type="button" className="gallery-tile gallery-add">
          <Camera size={22} />
          <span>Agregar foto</span>
        </button>
      </div>

      <style>{`
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 14px;
          max-width: 720px;
        }
        .gallery-tile {
          aspect-ratio: 1;
          border-radius: var(--radius-md);
          overflow: hidden;
          background: var(--surface-100);
        }
        .gallery-tile img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .gallery-add {
          border: 1.5px dashed var(--surface-border);
          background: var(--surface-0);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 6px; color: var(--ink-400); font-size: 12.5px; font-weight: 700; cursor: pointer;
        }
        .gallery-add:hover { border-color: var(--brand-400); color: var(--brand-600); }
      `}</style>
>>>>>>> f07299732d4d49260762e4f908dbfd0c91a7cf2a
    </div>
  )
}
