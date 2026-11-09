// Todas las fechas viajan al backend normalizadas (ISO-8601 con zona horaria, UTC)
// y aquí solo se formatean para mostrarlas. Los estados se CALCULAN, no se guardan.
const fmtFecha = new Intl.DateTimeFormat('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
const fmtFechaHora = new Intl.DateTimeFormat('es-CO', {
  day: '2-digit', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit',
})

const pad = (n) => String(n).padStart(2, '0')

// 'AAAA-MM-DD' se interpreta como fecha LOCAL (evita que se corra un día por la zona horaria)
export function parseFecha(valor) {
  if (typeof valor === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(valor)) {
    const [y, m, d] = valor.split('-').map(Number)
    return new Date(y, m - 1, d)
  }
  return new Date(valor)
}

export const formatearFecha = (v) => (v ? fmtFecha.format(parseFecha(v)) : '—')
export const formatearFechaHora = (v) => (v ? fmtFechaHora.format(parseFecha(v)) : '—')

const inicioDelDia = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate())

export function diasHasta(valor) {
  const ms = inicioDelDia(parseFecha(valor)) - inicioDelDia(new Date())
  return Math.round(ms / 86400000)
}

export function textoFaltan(valor) {
  const d = diasHasta(valor)
  if (d === 0) return 'Hoy'
  if (d === 1) return 'Mañana'
  if (d > 1) return `En ${d} días`
  return `Hace ${Math.abs(d)} días`
}

export function calcularEdad(fechaNacimiento) {
  if (!fechaNacimiento) return '—'
  const nac = parseFecha(fechaNacimiento)
  const hoy = new Date()
  let meses = (hoy.getFullYear() - nac.getFullYear()) * 12 + (hoy.getMonth() - nac.getMonth())
  if (hoy.getDate() < nac.getDate()) meses -= 1
  if (meses < 0) return '—'
  if (meses < 12) return meses === 1 ? '1 mes' : `${meses} meses`
  const anios = Math.floor(meses / 12)
  return anios === 1 ? '1 año' : `${anios} años`
}

// Valores para <input type="date|datetime-local"> (hora local del usuario)
export const hoyInput = () => {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}
export const ahoraInput = () => {
  const d = new Date()
  return `${hoyInput()}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

// Conversión input -> ISO (UTC)
export const fechaLocalAISO = (v) => (v ? parseFecha(v).toISOString() : null) // medianoche local
export const fechaHoraLocalAISO = (v) => (v ? new Date(v).toISOString() : null)
