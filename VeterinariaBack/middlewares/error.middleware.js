const HttpError = require('../utils/HttpError');

const noEncontrada = (req, res, next) => next(new HttpError(404, 'Ruta no encontrada'));

// Manejador central: nunca filtra detalles internos al cliente
// eslint-disable-next-line no-unused-vars
function manejadorErrores(err, req, res, next) {
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'JSON inválido o mal formado' });
  if (err.type === 'entity.too.large') return res.status(413).json({ error: 'El cuerpo es demasiado grande' });
  if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Ya existe un registro con esos datos' });
  if (err.code === 'ER_NO_REFERENCED_ROW_2') return res.status(400).json({ error: 'Referencia inválida' });
  if (err.message === 'Origen no permitido por CORS') return res.status(403).json({ error: err.message });

  const status = err.status || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({ error: status >= 500 ? 'Error interno del servidor' : err.message });
}

module.exports = { noEncontrada, manejadorErrores };
