const S = require('../services/registro.service');
const ah = require('../utils/asyncHandler');

const listar = ah(async (req, res) => res.json(await S.listar(req.usuario.id, req.query)));
const crear = ah(async (req, res) => res.status(201).json(await S.crear(req.usuario.id, req.body)));
const actualizar = ah(async (req, res) => res.json(await S.actualizar(req.params.id, req.usuario.id, req.body)));
const eliminar = ah(async (req, res) => {
  await S.eliminar(req.params.id, req.usuario.id);
  res.json({ mensaje: 'Registro eliminado' });
});

module.exports = { listar, crear, actualizar, eliminar };
