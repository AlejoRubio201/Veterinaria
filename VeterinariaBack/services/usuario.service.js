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

const UsuarioService = {
  listar: () => Usuario.obtenerTodos(),

  async obtener(id) {
    const usuario = await Usuario.obtenerPorId(V.id(id));
    if (!usuario) throw new HttpError(404, 'Usuario no encontrado');
    return usuario;
  },

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
    const otro = await Usuario.obtenerPorEmail(datos.email);
    if (otro && otro.id !== uid) throw new HttpError(409, 'Ya existe un usuario con ese email');
    await Usuario.actualizar(uid, datos);
    return Usuario.obtenerPorId(uid);
  },

  async eliminar(id) {
    const filas = await Usuario.eliminar(V.id(id));
    if (!filas) throw new HttpError(404, 'Usuario no encontrado');
  },
};

module.exports = UsuarioService;
