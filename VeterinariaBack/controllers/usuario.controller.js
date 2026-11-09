const UsuarioService = require('../services/usuario.service');
const ah = require('../utils/asyncHandler');

const listar = ah(async (req, res) => res.json(await UsuarioService.listar()));
const obtener = ah(async (req, res) => res.json(await UsuarioService.obtener(req.params.id)));
const crear = ah(async (req, res) => res.status(201).json(await UsuarioService.crear(req.body)));
const actualizar = ah(async (req, res) =>
  res.json(await UsuarioService.actualizar(req.params.id, req.body, req.usuario)));
const eliminar = ah(async (req, res) => {
  await UsuarioService.eliminar(req.params.id);
  res.json({ mensaje: 'Usuario eliminado correctamente' });
});

module.exports = { listar, obtener, crear, actualizar, eliminar };
