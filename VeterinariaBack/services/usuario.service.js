<<<<<<< HEAD
const bcrypt = require('bcryptjs');
const env = require('../config/env');
const HttpError = require('../utils/HttpError');
const V = require('../utils/validar');
const Usuario = require('../models/usuario.model');

// Lista blanca de campos (evita "mass assignment"). Los ausentes conservan su valor actual.
function datosValidados(body, actual = {}, { esAdmin = false } = {}) {
  V.exigirObjeto(body);
  const campo = (k) => (body[k] !== undefined ? body[k] : actual[k]);
  return {
    nombre: V.texto(campo('nombre'), 'El nombre', { max: 80 }),
    apellido: V.texto(campo('apellido'), 'El apellido', { max: 80 }),
    email: V.email(campo('email')),
    telefono: V.telefono(campo('telefono')),
    avatar: V.url(campo('avatar'), 'El avatar', { max: 255 }),
    // Solo un administrador puede cambiar roles
    rol: esAdmin && body.rol !== undefined
      ? V.enumerado(body.rol, 'El rol', ['usuario', 'admin'])
      : actual.rol || 'usuario',
  };
}

=======
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
>>>>>>> f07299732d4d49260762e4f908dbfd0c91a7cf2a
const UsuarioService = {
  listar: () => Usuario.obtenerTodos(),

  async obtener(id) {
<<<<<<< HEAD
    const usuario = await Usuario.obtenerPorId(V.id(id));
=======
    const usuario = await Usuario.obtenerPorId(validarId(id));
>>>>>>> f07299732d4d49260762e4f908dbfd0c91a7cf2a
    if (!usuario) throw new HttpError(404, 'Usuario no encontrado');
    return usuario;
  },

<<<<<<< HEAD
  // Alta hecha por un administrador
  async crear(body) {
    const datos = datosValidados(body, {}, { esAdmin: true });
    const pass = V.password(body.password);
    if (await Usuario.obtenerPorEmail(datos.email)) throw new HttpError(409, 'Ya existe un usuario con ese email');
    const passwordHash = await bcrypt.hash(pass, env.bcryptRounds);
    const id = await Usuario.crear({ ...datos, passwordHash });
    return Usuario.obtenerPorId(id);
  },

  async actualizar(id, body, actor) {
    const uid = V.id(id);
    const actual = await Usuario.obtenerPorId(uid);
    if (!actual) throw new HttpError(404, 'Usuario no encontrado');
    const datos = datosValidados(body, actual, { esAdmin: actor.rol === 'admin' });
=======
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
>>>>>>> f07299732d4d49260762e4f908dbfd0c91a7cf2a
    const otro = await Usuario.obtenerPorEmail(datos.email);
    if (otro && otro.id !== uid) throw new HttpError(409, 'Ya existe un usuario con ese email');
    await Usuario.actualizar(uid, datos);
    return Usuario.obtenerPorId(uid);
  },

  async eliminar(id) {
<<<<<<< HEAD
    const filas = await Usuario.eliminar(V.id(id));
=======
    const uid = validarId(id);
    const filas = await Usuario.eliminar(uid);
>>>>>>> f07299732d4d49260762e4f908dbfd0c91a7cf2a
    if (!filas) throw new HttpError(404, 'Usuario no encontrado');
  },
};

module.exports = UsuarioService;
<<<<<<< HEAD
=======
module.exports.HttpError = HttpError;
>>>>>>> f07299732d4d49260762e4f908dbfd0c91a7cf2a
