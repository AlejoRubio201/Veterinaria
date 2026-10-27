const { Router } = require('express');
const ctrl = require('../controllers/usuario.controller');

const router = Router();

router.get('/', ctrl.listar);          // GET    /api/usuarios
router.get('/:id', ctrl.obtener);      // GET    /api/usuarios/:id
router.post('/', ctrl.crear);          // POST   /api/usuarios
router.put('/:id', ctrl.actualizar);   // PUT    /api/usuarios/:id
router.delete('/:id', ctrl.eliminar);  // DELETE /api/usuarios/:id

module.exports = router;
