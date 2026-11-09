const env = require('../config/env');
const AuthService = require('../services/auth.service');
const ah = require('../utils/asyncHandler');

const COOKIE = 'refresh_token';
// httpOnly: JavaScript del navegador NO puede leerla (protege ante XSS).
// sameSite strict + path acotado: no viaja en peticiones de otros sitios (protege ante CSRF).
const opcionesCookie = (expira) => ({
  httpOnly: true,
  secure: env.isProd,
  sameSite: 'strict',
  path: '/api/auth',
  expires: expira,
});

function responderSesion(res, sesion, status = 200) {
  res.cookie(COOKIE, sesion.refreshToken, opcionesCookie(sesion.refreshExpira));
  res.status(status).json({ usuario: sesion.usuario, accessToken: sesion.accessToken });
}

const registrar = ah(async (req, res) => responderSesion(res, await AuthService.registrar(req.body), 201));
const login = ah(async (req, res) => responderSesion(res, await AuthService.login(req.body)));
const refrescar = ah(async (req, res) => {
  try {
    responderSesion(res, await AuthService.refrescar(req.cookies?.[COOKIE]));
  } catch (e) {
    res.clearCookie(COOKIE, { path: '/api/auth' });
    throw e;
  }
});
const logout = ah(async (req, res) => {
  await AuthService.logout(req.cookies?.[COOKIE]);
  res.clearCookie(COOKIE, { path: '/api/auth' });
  res.json({ mensaje: 'Sesión cerrada' });
});
const yo = (req, res) => res.json({ usuario: req.usuario });
const cambiarPassword = ah(async (req, res) => {
  await AuthService.cambiarPassword(req.usuario.id, req.body);
  res.clearCookie(COOKIE, { path: '/api/auth' });
  res.json({ mensaje: 'Contraseña actualizada. Inicia sesión de nuevo.' });
});

module.exports = { registrar, login, refrescar, logout, yo, cambiarPassword };
