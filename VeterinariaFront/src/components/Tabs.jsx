// Pestañas (variant "tabs") o chips de filtro (variant "chips"). Reemplaza el CSS repetido por pantalla.
export default function Tabs({ opciones, valor, onChange, variante = 'tabs' }) {
  const claseContenedor = variante === 'chips' ? 'filter-row' : 'tabs'
  const clase = variante === 'chips' ? 'filter-chip' : 'tab-btn'
  return (
    <div className={claseContenedor} role="tablist">
      {opciones.map((o) => (
        <button
          key={o}
          type="button"
          role="tab"
          aria-selected={valor === o}
          className={`${clase} ${valor === o ? `${clase}-active` : ''}`}
          onClick={() => onChange(o)}
        >
          {o}
        </button>
      ))}
    </div>
  )
}
