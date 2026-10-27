const Usuario = require('../models/usuario.model');

// Error con código HTTP para que el controlador responda correctamente
class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function limpiar(datos = {}) {
  const txt = (v) => (typeof v === 'string' ? v.trim() : v);
  return {
    nombre: txt(datos.nombre),
    apellido: txt(datos.apellido),
    email: typeof datos.email === 'string' ? datos.email.trim().toLowerCase() : datos.email,
    telefono: txt(datos.telefono) || null,
    avatar: txt(datos.avatar) || null,
  };
}

function validar(datos) {
  if (!datos.nombre) throw new HttpError(400, 'El nombre es obligatorio');
  if (!datos.apellido) throw new HttpError(400, 'El apellido es obligatorio');
  if (!datos.email) throw new HttpError(400, 'El email es obligatorio');
  if (!EMAIL_REGEX.test(datos.email)) throw new HttpError(400, 'El email no es válido');
  if (datos.nombre.length > 80 || datos.apellido.length > 80) {
    throw new HttpError(400, 'Nombre y apellido admiten máximo 80 caracteres');
  }
}

function validarId(id) {
  const n = Number(id);
  if (!Number.isInteger(n) || n <= 0) throw new HttpError(400, 'El id debe ser un entero positivo');
  return n;
}

// Reglas de negocio del CRUD
const UsuarioService = {
  listar: () => Usuario.obtenerTodos(),

  async obtener(id) {
    const usuario = await Usuario.obtenerPorId(validarId(id));
    if (!usuario) throw new HttpError(404, 'Usuario no encontrado');
    return usuario;
  },

  async crear(body) {
    const datos = limpiar(body);
    validar(datos);
    if (await Usuario.obtenerPorEmail(datos.email)) {
      throw new HttpError(409, 'Ya existe un usuario con ese email');
    }
    const id = await Usuario.crear(datos);
    return Usuario.obtenerPorId(id);
  },

  async actualizar(id, body) {
    const uid = validarId(id);
    const datos = limpiar(body);
    validar(datos);
    if (!(await Usuario.obtenerPorId(uid))) throw new HttpError(404, 'Usuario no encontrado');
    const otro = await Usuario.obtenerPorEmail(datos.email);
    if (otro && otro.id !== uid) throw new HttpError(409, 'Ya existe un usuario con ese email');
    await Usuario.actualizar(uid, datos);
    return Usuario.obtenerPorId(uid);
  },

  async eliminar(id) {
    const uid = validarId(id);
    const filas = await Usuario.eliminar(uid);
    if (!filas) throw new HttpError(404, 'Usuario no encontrado');
  },
};

module.exports = UsuarioService;
module.exports.HttpError = HttpError;
