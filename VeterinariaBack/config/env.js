require('dotenv').config();

function obligatoria(nombre) {
  const valor = process.env[nombre];
  if (!valor) throw new Error(`Falta la variable de entorno ${nombre} (revisa .env.example)`);
  return valor;
}

const jwtSecret = obligatoria('JWT_SECRET');
if (jwtSecret.length < 32) {
  throw new Error('JWT_SECRET debe tener al menos 32 caracteres');
}

module.exports = {
  port: Number(process.env.PORT) || 3000,
  isProd: process.env.NODE_ENV === 'production',
  trustProxy: process.env.TRUST_PROXY === '1',
  corsOrigins: (process.env.CORS_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean),
  jwt: {
    secret: jwtSecret,
    accessTtl: process.env.JWT_ACCESS_TTL || '15m',
    issuer: 'veterinaria-api',
    audience: 'veterinaria-app',
    algorithm: 'HS256',
  },
  refreshDays: Number(process.env.REFRESH_DAYS) || 7,
  bcryptRounds: 12,
  maxIntentosLogin: 5,
  minutosBloqueo: 15,
  adminEmail: (process.env.ADMIN_EMAIL || '').trim().toLowerCase(),
  adminPassword: process.env.ADMIN_PASSWORD || '',
};
