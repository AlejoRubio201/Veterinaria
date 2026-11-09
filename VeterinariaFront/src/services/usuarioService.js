<<<<<<< HEAD
import { api } from './api'

export const usuarioService = {
  listar: () => api('/usuarios'), // solo administradores
  obtener: (id) => api(`/usuarios/${id}`),
  actualizar: (id, datos) => api(`/usuarios/${id}`, { method: 'PUT', body: datos }),
  eliminar: (id) => api(`/usuarios/${id}`, { method: 'DELETE' }),
=======
// Cliente de la API de usuarios (VeterinariaBack)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

async function peticion(ruta, opciones = {}) {
  const res = await fetch(`${API_URL}${ruta}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opciones,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Error en la petición')
  return data
}

export const usuarioService = {
  listar: () => peticion('/usuarios'),
  obtener: (id) => peticion(`/usuarios/${id}`),
  crear: (usuario) => peticion('/usuarios', { method: 'POST', body: JSON.stringify(usuario) }),
  actualizar: (id, usuario) =>
    peticion(`/usuarios/${id}`, { method: 'PUT', body: JSON.stringify(usuario) }),
  eliminar: (id) => peticion(`/usuarios/${id}`, { method: 'DELETE' }),
>>>>>>> f07299732d4d49260762e4f908dbfd0c91a7cf2a
}
