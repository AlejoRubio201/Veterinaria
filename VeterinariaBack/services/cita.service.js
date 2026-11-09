const HttpError = require('../utils/HttpError');
const V = require('../utils/validar');
const Cita = require('../models/cita.model');
const Mascota = require('../models/mascota.model');

const ESTADOS = ['Pendiente', 'Confirmada', 'Cancelada'];

// El estado "Completada" no se guarda: se calcula comparando la fecha con el momento actual
function presentar(c) {
  const pasada = new Date(c.fecha) < new Date();
  return { ...c, estado: c.estado !== 'Cancelada' && pasada ? 'Completada' : c.estado, esFutura: !pasada };
}

async function validar(body, usuarioId, actual) {
  V.exigirObjeto(body);
  const campo = (k) => (body[k] !== undefined ? body[k] : actual?.[k]);
  const mascotaId = V.id(campo('mascotaId'), 'La mascota');
  if (!(await Mascota.obtener(mascotaId, usuarioId))) throw new HttpError(400, 'La mascota no existe');

  const fecha = V.fechaHora(body.fecha !== undefined ? body.fecha : actual?.fecha?.toISOString(), 'La fecha');
  // Regla de negocio: no se permiten citas en el pasado (al crear o al reprogramar)
  const cambioFecha = !actual || fecha.getTime() !== new Date(actual.fecha).getTime();
  if (cambioFecha && fecha.getTime() <= Date.now()) {
    throw new HttpError(400, 'No se pueden agendar citas con fecha anterior a la actual');
  }
  return {
    mascotaId,
    titulo: V.texto(campo('titulo'), 'El motivo', { max: 100 }),
    lugar: V.texto(campo('lugar'), 'El lugar', { max: 120 }),
    fecha,
    estado: V.enumerado(campo('estado') ?? 'Pendiente', 'El estado', ESTADOS),
  };
}

const CitaService = {
  async listar(usuarioId, query) {
    const periodo = V.enumerado(query.periodo, 'El periodo', ['proximas', 'historial'], { requerido: false });
    const mascotaId = query.mascotaId ? V.id(query.mascotaId, 'La mascota') : null;
    const filas = await Cita.listar(usuarioId, { periodo, mascotaId, ahora: new Date() });
    return filas.map(presentar);
  },

  async crear(usuarioId, body) {
    const id = await Cita.crear(usuarioId, await validar(body, usuarioId));
    return presentar(await Cita.obtener(id, usuarioId));
  },

  async actualizar(id, usuarioId, body) {
    const cid = V.id(id);
    const actual = await Cita.obtener(cid, usuarioId);
    if (!actual) throw new HttpError(404, 'Cita no encontrada');
    await Cita.actualizar(cid, usuarioId, await validar(body, usuarioId, actual));
    return presentar(await Cita.obtener(cid, usuarioId));
  },

  async eliminar(id, usuarioId) {
    if (!(await Cita.eliminar(V.id(id), usuarioId))) throw new HttpError(404, 'Cita no encontrada');
  },
};

module.exports = CitaService;
