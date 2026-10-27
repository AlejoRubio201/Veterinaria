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
}
