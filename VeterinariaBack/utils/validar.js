const HttpError = require('./HttpError');

// Validaciones de tipo, longitud y formato reutilizables por todos los servicios.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TELEFONO_REGEX = /^\+?[0-9][0-9\s\-()]{5,18}[0-9]$/;
const ISO_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})$/;
const FECHA_REGEX = /^\d{4}-\d{2}-\d{2}$/;
// eslint-disable-next-line no-control-regex
const CONTROL_REGEX = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;

const esObjeto = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

// Garantiza que el cuerpo exista y sea un objeto (maneja null, arrays, strings...)
function exigirObjeto(body) {
  if (!esObjeto(body)) throw new HttpError(400, 'El cuerpo de la petición debe ser un objeto JSON');
  return body;
}

function texto(valor, campo, { min = 1, max, requerido = true } = {}) {
  if (valor === undefined || valor === null || valor === '') {
    if (requerido) throw new HttpError(400, `${campo} es obligatorio`);
    return null;
  }
  if (typeof valor !== 'string') throw new HttpError(400, `${campo} debe ser texto`);
  const limpio = valor.trim();
  if (CONTROL_REGEX.test(limpio)) throw new HttpError(400, `${campo} contiene caracteres no permitidos`);
  if (!limpio) {
    if (requerido) throw new HttpError(400, `${campo} es obligatorio`);
    return null;
  }
  if (limpio.length < min) throw new HttpError(400, `${campo} debe tener al menos ${min} caracteres`);
  if (max && limpio.length > max) throw new HttpError(400, `${campo} admite máximo ${max} caracteres`);
  return limpio;
}

function email(valor) {
  const e = texto(valor, 'El email', { max: 120 }).toLowerCase();
  if (!EMAIL_REGEX.test(e)) throw new HttpError(400, 'El email no es válido');
  return e;
}

function telefono(valor) {
  const t = texto(valor, 'El teléfono', { max: 30, requerido: false });
  if (t && !TELEFONO_REGEX.test(t)) throw new HttpError(400, 'El teléfono no es válido (solo dígitos, espacios, +, -, paréntesis)');
  return t;
}

// Solo http/https: bloquea javascript:, data:, file:, etc.
function url(valor, campo, { max = 500, requerido = false } = {}) {
  const u = texto(valor, campo, { max, requerido });
  if (!u) return null;
  let parsed;
  try {
    parsed = new URL(u);
  } catch {
    throw new HttpError(400, `${campo} no es una URL válida`);
  }
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new HttpError(400, `${campo} debe comenzar con http:// o https://`);
  }
  return u;
}

function enumerado(valor, campo, permitidos, { requerido = true } = {}) {
  if ((valor === undefined || valor === null || valor === '') && !requerido) return null;
  if (typeof valor !== 'string' || !permitidos.includes(valor)) {
    throw new HttpError(400, `${campo} debe ser uno de: ${permitidos.join(', ')}`);
  }
  return valor;
}

function numero(valor, campo, { min, max, requerido = false } = {}) {
  if (valor === undefined || valor === null || valor === '') {
    if (requerido) throw new HttpError(400, `${campo} es obligatorio`);
    return null;
  }
  const n = typeof valor === 'string' ? Number(valor) : valor;
  if (typeof n !== 'number' || !Number.isFinite(n)) throw new HttpError(400, `${campo} debe ser un número`);
  if (min !== undefined && n < min) throw new HttpError(400, `${campo} debe ser mayor o igual a ${min}`);
  if (max !== undefined && n > max) throw new HttpError(400, `${campo} debe ser menor o igual a ${max}`);
  return n;
}

// Fecha y hora ISO-8601 con zona horaria -> Date
function fechaHora(valor, campo, { requerido = true } = {}) {
  if (valor === undefined || valor === null || valor === '') {
    if (requerido) throw new HttpError(400, `${campo} es obligatoria`);
    return null;
  }
  if (typeof valor !== 'string' || !ISO_REGEX.test(valor)) {
    throw new HttpError(400, `${campo} debe tener formato ISO-8601 con zona horaria`);
  }
  const d = new Date(valor);
  if (Number.isNaN(d.getTime())) throw new HttpError(400, `${campo} no es una fecha válida`);
  return d;
}

// Fecha YYYY-MM-DD (sin hora) -> string validado
function soloFecha(valor, campo, { requerido = false } = {}) {
  if (valor === undefined || valor === null || valor === '') {
    if (requerido) throw new HttpError(400, `${campo} es obligatoria`);
    return null;
  }
  if (typeof valor !== 'string' || !FECHA_REGEX.test(valor)) {
    throw new HttpError(400, `${campo} debe tener formato AAAA-MM-DD`);
  }
  const d = new Date(`${valor}T00:00:00Z`);
  if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== valor) {
    throw new HttpError(400, `${campo} no es una fecha válida`);
  }
  return valor;
}

function id(valor, campo = 'El id') {
  const n = Number(valor);
  if (!Number.isInteger(n) || n <= 0) throw new HttpError(400, `${campo} debe ser un entero positivo`);
  return n;
}

// Contraseña fuerte. bcrypt solo procesa 72 bytes, por eso el máximo.
function password(valor, campo = 'La contraseña') {
  if (typeof valor !== 'string') throw new HttpError(400, `${campo} es obligatoria`);
  if (valor.length < 8) throw new HttpError(400, `${campo} debe tener al menos 8 caracteres`);
  if (Buffer.byteLength(valor, 'utf8') > 72) throw new HttpError(400, `${campo} admite máximo 72 caracteres`);
  if (!/[a-z]/.test(valor) || !/[A-Z]/.test(valor) || !/\d/.test(valor)) {
    throw new HttpError(400, `${campo} debe incluir mayúscula, minúscula y número`);
  }
  return valor;
}

module.exports = {
  esObjeto, exigirObjeto, texto, email, telefono, url, enumerado, numero,
  fechaHora, soloFecha, id, password,
};
