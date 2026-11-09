const UsuarioService = require('../services/usuario.service');
<<<<<<< HEAD
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
=======

// Capa HTTP: lee la petición, llama al servicio y arma la respuesta.
const listar = async (req, res, next) => {
  try {
    res.json(await UsuarioService.listar());
  } catch (e) { next(e); }
};

const obtener = async (req, res, next) => {
  try {
    res.json(await UsuarioService.obtener(req.params.id));
  } catch (e) { next(e); }
};

const crear = async (req, res, next) => {
  try {
    const usuario = await UsuarioService.crear(req.body);
    res.status(201).json(usuario);
  } catch (e) { next(e); }
};

const actualizar = async (req, res, next) => {
  try {
    res.json(await UsuarioService.actualizar(req.params.id, req.body));
  } catch (e) { next(e); }
};

const eliminar = async (req, res, next) => {
  try {
    await UsuarioService.eliminar(req.params.id);
    res.json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (e) { next(e); }
};
>>>>>>> f07299732d4d49260762e4f908dbfd0c91a7cf2a

module.exports = { listar, obtener, crear, actualizar, eliminar };
