import { api } from './api'

export const usuarioService = {
  listar: () => api('/usuarios'), // solo administradores
  obtener: (id) => api(`/usuarios/${id}`),
  actualizar: (id, datos) => api(`/usuarios/${id}`, { method: 'PUT', body: datos }),
  eliminar: (id) => api(`/usuarios/${id}`, { method: 'DELETE' }),
}
