const { Router } = require('express');
const ctrl = require('../controllers/auth.controller');
const { autenticar } = require('../middlewares/auth.middleware');
const { limiteAuth, exigirCuerpo } = require('../middlewares/seguridad.middleware');

const router = Router();

// Públicas (con límite estricto contra fuerza bruta)
router.post('/registro', limiteAuth, exigirCuerpo, ctrl.registrar);   // POST /api/auth/registro
router.post('/login', limiteAuth, exigirCuerpo, ctrl.login);          // POST /api/auth/login
router.post('/refresh', limiteAuth, ctrl.refrescar);                  // POST /api/auth/refresh (cookie)
router.post('/logout', ctrl.logout);                                  // POST /api/auth/logout

// Protegidas
router.get('/me', autenticar, ctrl.yo);                                           // GET /api/auth/me
router.put('/password', autenticar, exigirCuerpo, ctrl.cambiarPassword);          // PUT /api/auth/password

module.exports = router;
