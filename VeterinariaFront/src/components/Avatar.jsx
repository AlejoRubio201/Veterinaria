import { useState } from 'react'

// Muestra la foto; si no hay o falla la carga, muestra las iniciales
export default function Avatar({ src, nombre = '', tamano = 36, className = '' }) {
  const [fallo, setFallo] = useState(false)
  const iniciales = nombre.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase() || '?'
  const estilo = { width: tamano, height: tamano, fontSize: tamano * 0.38 }
  if (!src || fallo) {
    return (
      <span className={`avatar avatar-iniciales ${className}`} style={estilo} aria-label={nombre}>
        {iniciales}
      </span>
    )
  }
  return (
    <img className={`avatar ${className}`} src={src} alt={nombre} width={tamano} height={tamano} onError={() => setFallo(true)} />
  )
}
