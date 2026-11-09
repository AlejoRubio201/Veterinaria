<<<<<<< HEAD
const env = require('./config/env');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { inicializarDB } = require('./config/db');
const { limiteGeneral, exigirJson, sanearCuerpo } = require('./middlewares/seguridad.middleware');
const { noEncontrada, manejadorErrores } = require('./middlewares/error.middleware');

const app = express();

app.disable('x-powered-by');
if (env.trustProxy) app.set('trust proxy', 1);

// --- Middlewares de seguridad (orden importa) ---
app.use(helmet());                         // cabeceras seguras (HSTS, nosniff, frame-ancestors...)
app.use(cors({
  origin: (origin, cb) => (!origin || env.corsOrigins.includes(origin)
    ? cb(null, true)
    : cb(new Error('Origen no permitido por CORS'))),
  credentials: true,                       // necesario para la cookie del refresh token
}));
app.use(limiteGeneral);                    // rate limiting global
app.use(express.json({ limit: '10kb' }));  // limita el tamaño del cuerpo
app.use(cookieParser());
app.use(exigirJson);                       // Content-Type application/json
app.use(sanearCuerpo);                     // evita prototype pollution

// --- Rutas ---
app.get('/', (req, res) => res.json({ mensaje: 'API Veterinaria funcionando' }));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/usuarios', require('./routes/usuario.routes'));
app.use('/api/mascotas', require('./routes/mascota.routes'));
app.use('/api/citas', require('./routes/cita.routes'));
app.use('/api/registros', require('./routes/registro.routes'));

app.use(noEncontrada);
app.use(manejadorErrores);

module.exports = app;

if (require.main === module) {
  inicializarDB()
    .then(() => app.listen(env.port, () => console.log(`Servidor en http://localhost:${env.port}`)))
    .catch((err) => {
      console.error('No se pudo conectar a la base de datos:', err);
      process.exit(1);
    });
}
=======
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { inicializarDB } = require('./config/db');
const usuarioRoutes = require('./routes/usuario.routes');

const app = express();

app.use(cors({ origin: (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',') }));
app.use(express.json());

app.get('/', (req, res) => res.json({ mensaje: 'API Veterinaria funcionando' }));
app.use('/api/usuarios', usuarioRoutes);

// 404
app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));

// Manejador central de errores
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'JSON inválido' });
  }
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ error: 'Ya existe un usuario con ese email' });
  }
  const status = err.status || 500;
  if (status === 500) console.error(err);
  res.status(status).json({ error: status === 500 ? 'Error interno del servidor' : err.message });
});

const PORT = process.env.PORT || 3000;

inicializarDB()
  .then(() => app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`)))
  .catch((err) => {
    console.error('No se pudo conectar a la base de datos:', err);
    process.exit(1);
  });
>>>>>>> f07299732d4d49260762e4f908dbfd0c91a7cf2a
