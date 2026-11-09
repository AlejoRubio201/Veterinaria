const rateLimit = require('express-rate-limit');
const HttpError = require('../utils/HttpError');
const { esObjeto } = require('../utils/validar');

// Límite general contra abuso / DoS básico
const limiteGeneral = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas peticiones, intenta más tarde' },
});

// Límite estricto para login / registro / refresh (fuerza bruta)
const limiteAuth = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados intentos, espera 15 minutos' },
});

// Las peticiones con cuerpo deben declararse JSON (frena formularios cross-site y tipos raros)
function exigirJson(req, res, next) {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const tieneCuerpo = Number(req.headers['content-length'] || 0) > 0 || req.headers['transfer-encoding'];
    if (tieneCuerpo && !req.is('application/json')) {
      return next(new HttpError(415, 'Content-Type debe ser application/json'));
    }
  }
  next();
}

// Rutas que reciben datos: el cuerpo debe existir y ser un objeto (no null, array ni string)
function exigirCuerpo(req, res, next) {
  if (!esObjeto(req.body) || Object.keys(req.body).length === 0) {
    return next(new HttpError(400, 'Se esperaba un cuerpo JSON con datos'));
  }
  next();
}

// Previene contaminación de prototipo (__proto__, constructor) en el cuerpo
function sanearCuerpo(req, res, next) {
  const peligroso = (obj, nivel = 0) => {
    if (!obj || typeof obj !== 'object' || nivel > 5) return false;
    return Object.keys(obj).some(
      (k) => k === '__proto__' || k === 'constructor' || k === 'prototype' || peligroso(obj[k], nivel + 1)
    );
  };
  if (peligroso(req.body)) return next(new HttpError(400, 'Cuerpo no permitido'));
  next();
}

module.exports = { limiteGeneral, limiteAuth, exigirJson, exigirCuerpo, sanearCuerpo };
