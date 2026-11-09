import { api, aQuery } from './api'

// Categorías: cuidado | nota | alergia | condicion | recordatorio | vacuna | historial | foto
export const registroService = {
  listar: (params) => api(`/registros${aQuery(params)}`),
  crear: (categoria, datos) => api('/registros', { method: 'POST', body: { ...datos, categoria } }),
  eliminar: (id) => api(`/registros/${id}`, { method: 'DELETE' }),
}
