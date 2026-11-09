const S = require('../services/mascota.service');
const ah = require('../utils/asyncHandler');

const listar = ah(async (req, res) => res.json(await S.listar(req.usuario.id)));
const obtener = ah(async (req, res) => res.json(await S.obtener(req.params.id, req.usuario.id)));
const crear = ah(async (req, res) => res.status(201).json(await S.crear(req.usuario.id, req.body)));
const actualizar = ah(async (req, res) => res.json(await S.actualizar(req.params.id, req.usuario.id, req.body)));
const eliminar = ah(async (req, res) => {
  await S.eliminar(req.params.id, req.usuario.id);
  res.json({ mensaje: 'Mascota eliminada' });
});

module.exports = { listar, obtener, crear, actualizar, eliminar };
