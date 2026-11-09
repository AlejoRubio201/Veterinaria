import { Trash2 } from 'lucide-react'

// Botón de papelera con confirmación; muestra el error si falla
export default function BotonEliminar({ onEliminar, texto = '¿Eliminar este registro?', className = '' }) {
  const manejar = async () => {
    if (!window.confirm(texto)) return
    try {
      await onEliminar()
    } catch (e) {
      window.alert(e.message || 'No se pudo eliminar')
    }
  }
  return (
    <button type="button" className={`icon-btn ${className}`} title="Eliminar" aria-label="Eliminar" onClick={manejar}>
      <Trash2 size={16} />
    </button>
  )
}
