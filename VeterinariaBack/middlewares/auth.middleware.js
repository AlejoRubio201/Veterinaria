const jwt = require('jsonwebtoken');
const env = require('../config/env');
const HttpError = require('../utils/HttpError');
const Usuario = require('../models/usuario.model');

// AUTENTICACIÓN: exige un access token JWT válido en "Authorization: Bearer <token>".
// Fija el algoritmo, emisor y audiencia para evitar ataques de "alg: none" o tokens ajenos.
async function autenticar(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const [esquema, token] = header.split(' ');
    if (esquema !== 'Bearer' || !token) throw new HttpError(401, 'Token requerido');

    let payload;
    try {
      payload = jwt.verify(token, env.jwt.secret, {
        algorithms: [env.jwt.algorithm],
        issuer: env.jwt.issuer,
        audience: env.jwt.audience,
      });
    } catch (e) {
      throw new HttpError(401, e.name === 'TokenExpiredError' ? 'Token expirado' : 'Token inválido');
    }

    // Consulta el usuario real: si fue eliminado o cambió de rol, el token deja de servir
    const usuario = await Usuario.obtenerPorId(Number(payload.sub));
    if (!usuario) throw new HttpError(401, 'Token inválido');
    req.usuario = usuario;
    next();
  } catch (e) { next(e); }
}

// AUTORIZACIÓN por rol: autorizar('admin')
const autorizar = (...roles) => (req, res, next) => {
  if (!req.usuario) return next(new HttpError(401, 'No autenticado'));
  if (!roles.includes(req.usuario.rol)) return next(new HttpError(403, 'No tienes permisos para esta acción'));
  next();
};

// AUTORIZACIÓN por propiedad: el usuario solo opera sobre su propio recurso (o es admin)
const propietarioOAdmin = (param = 'id') => (req, res, next) => {
  if (req.usuario.rol === 'admin' || String(req.usuario.id) === String(req.params[param])) return next();
  next(new HttpError(403, 'No tienes permisos sobre este recurso'));
};

module.exports = { autenticar, autorizar, propietarioOAdmin };
