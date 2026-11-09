// Etiqueta + control + mensaje de error accesible
export default function Campo({ id, etiqueta, error, ayuda, children }) {
  return (
    <div className={`field ${error ? 'field-error' : ''}`}>
      <label className="field-label" htmlFor={id}>
        {etiqueta}
      </label>
      {children}
      {ayuda && !error && <small className="field-help">{ayuda}</small>}
      {error && (
        <small className="field-msg" role="alert">
          {error}
        </small>
      )}
    </div>
  )
}
