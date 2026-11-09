const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const HttpError = require('../utils/HttpError');
const V = require('../utils/validar');
const Usuario = require('../models/usuario.model');
const RefreshToken = require('../models/refreshToken.model');

// Hash falso para que el tiempo de respuesta sea igual exista o no el email (evita enumeración)
const HASH_FALSO = bcrypt.hashSync('Contrasena-falsa-1', env.bcryptRounds);

const sha256 = (txt) => crypto.createHash('sha256').update(txt).digest('hex');

async function emitirTokens(usuario) {
  const accessToken = jwt.sign({ rol: usuario.rol }, env.jwt.secret, {
    algorithm: env.jwt.algorithm,
    expiresIn: env.jwt.accessTtl,
    issuer: env.jwt.issuer,
    audience: env.jwt.audience,
    subject: String(usuario.id),
  });
  // Refresh token opaco y aleatorio; en BD solo se guarda su hash
  const refreshToken = crypto.randomBytes(48).toString('base64url');
  const expira = new Date(Date.now() + env.refreshDays * 24 * 60 * 60 * 1000);
  await RefreshToken.crear(usuario.id, sha256(refreshToken), expira);
  return { usuario, accessToken, refreshToken, refreshExpira: expira };
}

const AuthService = {
  async registrar(body) {
    V.exigirObjeto(body);
    const datos = {
      nombre: V.texto(body.nombre, 'El nombre', { max: 80 }),
      apellido: V.texto(body.apellido, 'El apellido', { max: 80 }),
      email: V.email(body.email),
      telefono: V.telefono(body.telefono),
      avatar: V.url(body.avatar, 'El avatar', { max: 255 }),
    };
    const pass = V.password(body.password);
    if (await Usuario.obtenerPorEmail(datos.email)) throw new HttpError(409, 'Ya existe un usuario con ese email');

    const passwordHash = await bcrypt.hash(pass, env.bcryptRounds);
    // El rol NUNCA viene del cliente: todo registro público es "usuario"
    const id = await Usuario.crear({ ...datos, passwordHash, rol: 'usuario' });
    return emitirTokens(await Usuario.obtenerPorId(id));
  },

  async login(body) {
    V.exigirObjeto(body);
    const email = V.email(body.email);
    if (typeof body.password !== 'string' || !body.password || body.password.length > 200) {
      throw new HttpError(400, 'La contraseña es obligatoria');
    }

    const cred = await Usuario.obtenerCredenciales(email);
    const ahora = new Date();
    const bloqueado = cred?.bloqueadoHasta && new Date(cred.bloqueadoHasta) > ahora;
    if (bloqueado) {
      throw new HttpError(429, 'Demasiados intentos fallidos. Intenta de nuevo en unos minutos');
    }

    const ok = await bcrypt.compare(body.password, cred?.passwordHash || HASH_FALSO);
    if (!cred || !cred.passwordHash || !ok) {
      if (cred) {
        // Si el bloqueo anterior ya venció, el contador reinicia
        const previos = cred.bloqueadoHasta ? 0 : cred.intentos;
        const intentos = previos + 1;
        const hasta = intentos >= env.maxIntentosLogin
          ? new Date(Date.now() + env.minutosBloqueo * 60 * 1000)
          : null;
        await Usuario.registrarFallo(cred.id, intentos, hasta);
      }
      throw new HttpError(401, 'Email o contraseña incorrectos'); // mensaje genérico a propósito
    }

    await Usuario.limpiarFallos(cred.id);
    return emitirTokens(await Usuario.obtenerPorId(cred.id));
  },

  // Rotación: cada refresh token sirve UNA vez. Si se reutiliza uno viejo, se asume robo
  // y se cierran todas las sesiones del usuario.
  async refrescar(tokenPlano) {
    if (typeof tokenPlano !== 'string' || !tokenPlano) throw new HttpError(401, 'Sesión no válida');
    const reg = await RefreshToken.buscar(sha256(tokenPlano));
    if (!reg) throw new HttpError(401, 'Sesión no válida');
    if (reg.revocado) {
      await RefreshToken.revocarTodos(reg.usuarioId);
      throw new HttpError(401, 'Sesión no válida');
    }
    if (new Date(reg.expiraEn) < new Date()) throw new HttpError(401, 'Sesión expirada');

    await RefreshToken.revocar(reg.id);
    const usuario = await Usuario.obtenerPorId(reg.usuarioId);
    if (!usuario) throw new HttpError(401, 'Sesión no válida');
    return emitirTokens(usuario);
  },

  async logout(tokenPlano) {
    if (typeof tokenPlano !== 'string' || !tokenPlano) return;
    const reg = await RefreshToken.buscar(sha256(tokenPlano));
    if (reg) await RefreshToken.revocar(reg.id);
    RefreshToken.limpiarExpirados().catch(() => {});
  },

  async cambiarPassword(usuarioId, body) {
    V.exigirObjeto(body);
    if (typeof body.passwordActual !== 'string' || !body.passwordActual) {
      throw new HttpError(400, 'La contraseña actual es obligatoria');
    }
    const nueva = V.password(body.passwordNueva, 'La nueva contraseña');
    const hash = await Usuario.obtenerPasswordHash(usuarioId);
    if (!hash || !(await bcrypt.compare(body.passwordActual, hash))) {
      throw new HttpError(401, 'La contraseña actual es incorrecta');
    }
    if (body.passwordActual === nueva) throw new HttpError(400, 'La nueva contraseña debe ser distinta');
    await Usuario.actualizarPassword(usuarioId, await bcrypt.hash(nueva, env.bcryptRounds));
    await RefreshToken.revocarTodos(usuarioId); // cierra las demás sesiones
  },
};

module.exports = AuthService;
