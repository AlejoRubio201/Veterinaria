import { Link } from 'react-router-dom'

// Fila reutilizable: icono + título + líneas de detalle + contenido a la derecha.
// tono: brand | warn | info | danger
export default function ListItem({ icono: Icono, tono = 'brand', titulo, detalles = [], aside, acciones, to, tarjeta = true }) {
  const contenido = (
    <>
      {Icono && (
        <div className={`li-icon li-icon-${tono}`}>
          <Icono size={18} />
        </div>
      )}
      <div className="li-body">
        <strong>{titulo}</strong>
        {detalles.filter(Boolean).map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>
      {aside}
      {acciones}
    </>
  )
  const clase = `list-item ${tarjeta ? 'card' : ''}`
  return to ? (
    <Link to={to} className={clase}>
      {contenido}
    </Link>
  ) : (
    <div className={clase}>{contenido}</div>
  )
}
