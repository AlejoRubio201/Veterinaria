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
    </div>
  )
}
