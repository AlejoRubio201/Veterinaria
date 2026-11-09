// Maneja los 3 estados que toda pantalla con datos remotos debe mostrar:
// cargando, error (con reintento) y ausencia de datos.
export default function Estado({ cargando, error, vacio, textoVacio = 'No hay datos para mostrar.', onReintentar, accionVacio, children }) {
  if (cargando) {
    return (
      <div className="estado estado-cargando" role="status" aria-live="polite">
        <span className="spinner" aria-hidden="true" />
        Cargando...
      </div>
    )
  }
  if (error) {
    return (
      <div className="estado estado-error" role="alert">
        <p>{error}</p>
        {onReintentar && (
          <button type="button" className="btn btn-secondary btn-sm" onClick={onReintentar}>
            Reintentar
          </button>
        )}
      </div>
    )
  }
  if (vacio) {
    return (
      <div className="estado">
        <p className="empty-state">{textoVacio}</p>
        {accionVacio}
      </div>
    )
  }
  return children
}
