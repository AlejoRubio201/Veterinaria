// Cliente HTTP base: manda el access token (guardado SOLO en memoria, no en localStorage)
// y, si expira, pide uno nuevo con la cookie httpOnly del refresh token.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export class ApiError extends Error {
  constructor(mensaje, status = 0) {
    super(mensaje)
    this.status = status
  }
}

let accessToken = null
let refreshEnCurso = null
let alPerderSesion = () => {}

export const setAccessToken = (token) => {
  accessToken = token
}
export const onSesionPerdida = (fn) => {
  alPerderSesion = fn
}

async function peticionCruda(ruta, { method = 'GET', body, auth = true } = {}) {
  const headers = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (auth && accessToken) headers.Authorization = `Bearer ${accessToken}`

  let res
  try {
    res = await fetch(`${API_URL}${ruta}`, {
      method,
      headers,
      credentials: 'include', // necesario para enviar/recibir la cookie del refresh token
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError('No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.')
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new ApiError(data.error || 'Error en la petición', res.status)
  return data
}

// Varias llamadas simultáneas comparten UN solo refresh (el token rota en cada uso)
export function refrescarSesion() {
  if (!refreshEnCurso) {
    refreshEnCurso = peticionCruda('/auth/refresh', { method: 'POST', auth: false })
      .then((data) => {
        accessToken = data.accessToken
        return data
      })
      .finally(() => {
        refreshEnCurso = null
      })
  }
  return refreshEnCurso
}

export async function api(ruta, opciones = {}) {
  try {
    return await peticionCruda(ruta, opciones)
  } catch (e) {
    if (e.status === 401 && opciones.auth !== false) {
      try {
        await refrescarSesion()
        return await peticionCruda(ruta, opciones)
      } catch (e2) {
        if (e2.status === 401) {
          accessToken = null
          alPerderSesion()
        }
        throw e2
      }
    }
    throw e
  }
}

export const aQuery = (params = {}) => {
  const q = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') q.set(k, v)
  })
  const s = q.toString()
  return s ? `?${s}` : ''
}
