import { api, aQuery } from './api'

// periodo: 'proximas' | 'historial'
export const citaService = {
  listar: (params) => api(`/citas${aQuery(params)}`),
  crear: (datos) => api('/citas', { method: 'POST', body: datos }),
  actualizar: (id, datos) => api(`/citas/${id}`, { method: 'PUT', body: datos }),
  cancelar: (id) => api(`/citas/${id}`, { method: 'PUT', body: { estado: 'Cancelada' } }),
  eliminar: (id) => api(`/citas/${id}`, { method: 'DELETE' }),
}
