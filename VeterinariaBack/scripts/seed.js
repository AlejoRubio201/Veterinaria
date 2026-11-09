// Carga datos de ejemplo para la demo: node scripts/seed.js  (o npm run seed)
// Usuario: demo@petcare.com / Demo12345. Las fechas son relativas a HOY, así nunca quedan vencidas.
const bcrypt = require('bcryptjs');
const env = require('../config/env');
const { pool, inicializarDB } = require('../config/db');
const Usuario = require('../models/usuario.model');
const Mascota = require('../models/mascota.model');
const Cita = require('../models/cita.model');
const Registro = require('../models/registro.model');

const EMAIL = 'demo@petcare.com';
const dias = (n, hora = 10) => {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + n);
  d.setUTCHours(hora, 0, 0, 0);
  return d;
};
const dia = (n) => dias(n, 0).toISOString().slice(0, 10);

async function main() {
  await inicializarDB();
  if (await Usuario.obtenerPorEmail(EMAIL)) {
    console.log('El usuario demo ya existe; no se hace nada.');
    return;
  }
  const uid = await Usuario.crear({
    nombre: 'Juliana', apellido: 'Pérez', email: EMAIL, telefono: '+57 300 123 4567',
    passwordHash: await bcrypt.hash('Demo12345', env.bcryptRounds),
  });

  const luna = await Mascota.crear(uid, {
    nombre: 'Luna', especie: 'Perro', raza: 'Golden Retriever', sexo: 'Hembra', fechaNacimiento: '2022-01-15',
    pesoKg: 25, color: 'Dorado', descripcion: 'Muy cariñosa y juguetona. Le encanta pasear.',
    foto: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop',
  });
  const milo = await Mascota.crear(uid, {
    nombre: 'Milo', especie: 'Gato', raza: 'Europeo', sexo: 'Macho', fechaNacimiento: '2023-03-10',
    pesoKg: 5, color: 'Gris atigrado', descripcion: 'Curioso y tranquilo, ama las siestas junto a la ventana.',
    foto: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=400&h=400&fit=crop',
  });

  const cita = (mascotaId, titulo, lugar, fecha, estado) => Cita.crear(uid, { mascotaId, titulo, lugar, fecha, estado });
  await cita(luna, 'Revisión general', 'Clínica Veterinaria', dias(7), 'Confirmada');
  await cita(milo, 'Vacunación', 'Clínica VetSalud', dias(21, 9), 'Confirmada');
  await cita(luna, 'Revisión de piel', 'Dr. Gómez', dias(35, 11), 'Pendiente');
  await cita(luna, 'Consulta general', 'Dr. Pérez · Clínica Veterinaria', dias(-60), 'Confirmada'); // pasada -> "Completada"

  const reg = (categoria, mascotaId, tipo, titulo, detalle, fecha, url = null) =>
    Registro.crear(uid, { categoria, mascotaId, tipo, titulo, detalle, fecha, url });
  await reg('recordatorio', luna, 'vacuna', 'Vacuna antirrábica', null, dias(5));
  await reg('recordatorio', milo, 'desparasitacion', 'Desparasitación', null, dias(14, 8));
  await reg('recordatorio', luna, 'unas', 'Corte de uñas', null, dias(20, 15));
  await reg('cuidado', luna, 'Baño', 'Baño', null, dias(-20, 0));
  await reg('cuidado', milo, 'Corte de uñas', 'Corte de uñas', null, dias(-45, 0));
  await reg('cuidado', luna, 'Peluquería', 'Peluquería', null, dias(-90, 0));
  await reg('nota', luna, 'medicamento', 'Hoy tomó su medicamento', null, dias(-1, 8));
  await reg('nota', luna, 'animo', 'Muy juguetona hoy', null, dias(-5, 18));
  await reg('nota', luna, 'sintoma', 'Presentó vómito', null, dias(-12, 9));
  await reg('alergia', luna, null, 'Pollo', 'Reacción cutánea', dias(-300, 0));
  await reg('condicion', luna, null, 'Displasia de cadera', 'En tratamiento', dias(-200, 0));
  await reg('historial', luna, null, 'Consulta general', 'Dr. Pérez · Clínica Veterinaria', dias(-60, 0));
  await reg('historial', luna, null, 'Control de peso', 'Dr. López · VetSalud', dias(-100, 0));
  await reg('vacuna', luna, null, 'Rabia', null, dias(-150, 0));
  await reg('vacuna', luna, null, 'Moquillo', null, dias(-120, 0));
  await reg('foto', luna, null, 'Luna en el parque', null, null, 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=300&fit=crop');
  await reg('foto', milo, null, 'Milo descansando', null, null, 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=300&h=300&fit=crop');

  console.log(`Datos de ejemplo creados. Inicia sesión con ${EMAIL} / Demo12345`);
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => pool.end());
