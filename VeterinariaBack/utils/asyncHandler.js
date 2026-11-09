// Envuelve controladores async para enviar cualquier error al manejador central
module.exports = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
