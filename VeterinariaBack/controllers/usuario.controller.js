const UsuarioService = require('../services/usuario.service');

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

module.exports = { listar, obtener, crear, actualizar, eliminar };
