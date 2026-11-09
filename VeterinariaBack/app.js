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
