import { api } from './api'

export const mascotaService = {
  listar: () => api('/mascotas'),
  obtener: (id) => api(`/mascotas/${id}`),
  crear: (datos) => api('/mascotas', { method: 'POST', body: datos }),
  actualizar: (id, datos) => api(`/mascotas/${id}`, { method: 'PUT', body: datos }),
  eliminar: (id) => api(`/mascotas/${id}`, { method: 'DELETE' }),
}
