const { Router } = require('express');
const ctrl = require('../controllers/usuario.controller');
const { autenticar, autorizar, propietarioOAdmin } = require('../middlewares/auth.middleware');
const { exigirCuerpo } = require('../middlewares/seguridad.middleware');

const router = Router();
router.use(autenticar); // TODAS las rutas de usuarios requieren token

router.get('/', autorizar('admin'), ctrl.listar);                                   // solo admin
router.post('/', autorizar('admin'), exigirCuerpo, ctrl.crear);                     // solo admin
router.get('/:id', propietarioOAdmin(), ctrl.obtener);                              // dueño o admin
router.put('/:id', propietarioOAdmin(), exigirCuerpo, ctrl.actualizar);             // dueño o admin
router.delete('/:id', propietarioOAdmin(), ctrl.eliminar);                          // dueño o admin

module.exports = router;
