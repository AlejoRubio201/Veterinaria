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
