const HttpError = require('../utils/HttpError');
const V = require('../utils/validar');
const Mascota = require('../models/mascota.model');

function validar(body) {
  V.exigirObjeto(body);
  const fechaNacimiento = V.soloFecha(body.fechaNacimiento, 'La fecha de nacimiento', { requerido: true });
  // Tolerancia de 1 día por zonas horarias
  if (new Date(`${fechaNacimiento}T00:00:00Z`).getTime() > Date.now() + 24 * 60 * 60 * 1000) {
    throw new HttpError(400, 'La fecha de nacimiento no puede ser futura');
  }
  return {
    nombre: V.texto(body.nombre, 'El nombre', { max: 60 }),
    especie: V.enumerado(body.especie, 'La especie', ['Perro', 'Gato', 'Otro']),
    raza: V.texto(body.raza, 'La raza', { max: 60, requerido: false }),
    sexo: V.enumerado(body.sexo, 'El sexo', ['Macho', 'Hembra']),
    fechaNacimiento,
    pesoKg: V.numero(body.pesoKg, 'El peso', { min: 0.01, max: 200 }),
    color: V.texto(body.color, 'El color', { max: 40, requerido: false }),
    descripcion: V.texto(body.descripcion, 'La descripción', { max: 500, requerido: false }),
    foto: V.url(body.foto, 'La foto'),
  };
}

const MascotaService = {
  listar: (usuarioId) => Mascota.listar(usuarioId),

  async obtener(id, usuarioId) {
    const m = await Mascota.obtener(V.id(id), usuarioId);
    if (!m) throw new HttpError(404, 'Mascota no encontrada');
    return m;
  },

  async crear(usuarioId, body) {
    const id = await Mascota.crear(usuarioId, validar(body));
    return Mascota.obtener(id, usuarioId);
  },

  async actualizar(id, usuarioId, body) {
    const mid = V.id(id);
    if (!(await Mascota.obtener(mid, usuarioId))) throw new HttpError(404, 'Mascota no encontrada');
    await Mascota.actualizar(mid, usuarioId, validar(body));
    return Mascota.obtener(mid, usuarioId);
  },

  async eliminar(id, usuarioId) {
    if (!(await Mascota.eliminar(V.id(id), usuarioId))) throw new HttpError(404, 'Mascota no encontrada');
  },
};

module.exports = MascotaService;
