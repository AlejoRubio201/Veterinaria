const { Router } = require('express');
const ctrl = require('../controllers/mascota.controller');
const { autenticar } = require('../middlewares/auth.middleware');
const { exigirCuerpo } = require('../middlewares/seguridad.middleware');

const router = Router();
router.use(autenticar); // requiere token; cada consulta filtra por el usuario autenticado

router.get('/', ctrl.listar);
router.get('/:id', ctrl.obtener);
router.post('/', exigirCuerpo, ctrl.crear);
router.put('/:id', exigirCuerpo, ctrl.actualizar);
router.delete('/:id', ctrl.eliminar);

module.exports = router;
