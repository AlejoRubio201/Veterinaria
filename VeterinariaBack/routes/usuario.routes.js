const { Router } = require('express');
const ctrl = require('../controllers/usuario.controller');
<<<<<<< HEAD
const { autenticar, autorizar, propietarioOAdmin } = require('../middlewares/auth.middleware');
const { exigirCuerpo } = require('../middlewares/seguridad.middleware');

const router = Router();
router.use(autenticar); // TODAS las rutas de usuarios requieren token

router.get('/', autorizar('admin'), ctrl.listar);                                   // solo admin
router.post('/', autorizar('admin'), exigirCuerpo, ctrl.crear);                     // solo admin
router.get('/:id', propietarioOAdmin(), ctrl.obtener);                              // dueño o admin
router.put('/:id', propietarioOAdmin(), exigirCuerpo, ctrl.actualizar);             // dueño o admin
router.delete('/:id', propietarioOAdmin(), ctrl.eliminar);                          // dueño o admin
=======

const router = Router();

router.get('/', ctrl.listar);          // GET    /api/usuarios
router.get('/:id', ctrl.obtener);      // GET    /api/usuarios/:id
router.post('/', ctrl.crear);          // POST   /api/usuarios
router.put('/:id', ctrl.actualizar);   // PUT    /api/usuarios/:id
router.delete('/:id', ctrl.eliminar);  // DELETE /api/usuarios/:id
>>>>>>> f07299732d4d49260762e4f908dbfd0c91a7cf2a

module.exports = router;
