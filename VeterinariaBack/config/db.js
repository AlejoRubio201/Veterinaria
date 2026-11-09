<<<<<<< HEAD
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const env = require('./env');

// Pool compartido. Todo se guarda/lee en UTC para evitar desfases de zona horaria.
=======
require('dotenv').config();
const mysql = require('mysql2/promise');

// Pool de conexiones compartido por todos los modelos
>>>>>>> f07299732d4d49260762e4f908dbfd0c91a7cf2a
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'veterinaria',
  waitForConnections: true,
  connectionLimit: 10,
  charset: 'utf8mb4',
<<<<<<< HEAD
  timezone: 'Z',
  dateStrings: ['DATE'],
});
pool.pool.on('connection', (conn) => conn.query("SET time_zone = '+00:00'"));

async function asegurarColumna(tabla, columna, definicion) {
  const [rows] = await pool.query(
    `SELECT 1 FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
    [tabla, columna]
  );
  if (!rows.length) await pool.query(`ALTER TABLE ${tabla} ADD COLUMN ${columna} ${definicion}`);
}

// Crea las tablas si no existen (equivale a database/schema.sql)
async function inicializarDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id               INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      nombre           VARCHAR(80)  NOT NULL,
      apellido         VARCHAR(80)  NOT NULL,
      email            VARCHAR(120) NOT NULL UNIQUE,
      telefono         VARCHAR(30)  NULL,
      avatar           VARCHAR(255) NULL,
      password_hash    VARCHAR(100) NULL,
      rol              ENUM('usuario','admin') NOT NULL DEFAULT 'usuario',
      intentos_fallidos TINYINT UNSIGNED NOT NULL DEFAULT 0,
      bloqueado_hasta  DATETIME NULL,
      creado_en        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      actualizado_en   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB
  `);
  // Migración para bases creadas con la versión anterior (solo CRUD de usuarios)
  await asegurarColumna('usuarios', 'password_hash', 'VARCHAR(100) NULL');
  await asegurarColumna('usuarios', 'rol', "ENUM('usuario','admin') NOT NULL DEFAULT 'usuario'");
  await asegurarColumna('usuarios', 'intentos_fallidos', 'TINYINT UNSIGNED NOT NULL DEFAULT 0');
  await asegurarColumna('usuarios', 'bloqueado_hasta', 'DATETIME NULL');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS refresh_tokens (
      id          INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      usuario_id  INT UNSIGNED NOT NULL,
      token_hash  CHAR(64) NOT NULL UNIQUE,
      expira_en   DATETIME NOT NULL,
      revocado    TINYINT(1) NOT NULL DEFAULT 0,
      creado_en   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
    ) ENGINE=InnoDB
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS mascotas (
      id               INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      usuario_id       INT UNSIGNED NOT NULL,
      nombre           VARCHAR(60)  NOT NULL,
      especie          ENUM('Perro','Gato','Otro') NOT NULL,
      raza             VARCHAR(60)  NULL,
      sexo             ENUM('Macho','Hembra') NOT NULL,
      fecha_nacimiento DATE NOT NULL,
      peso_kg          DECIMAL(5,2) NULL,
      color            VARCHAR(40)  NULL,
      descripcion      VARCHAR(500) NULL,
      foto             VARCHAR(500) NULL,
      creado_en        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      actualizado_en   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
    ) ENGINE=InnoDB
  `);

  // Fechas en DATETIME (UTC). El estado "Completada" se calcula, no se guarda.
  await pool.query(`
    CREATE TABLE IF NOT EXISTS citas (
      id          INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      usuario_id  INT UNSIGNED NOT NULL,
      mascota_id  INT UNSIGNED NOT NULL,
      titulo      VARCHAR(100) NOT NULL,
      lugar       VARCHAR(120) NOT NULL,
      fecha       DATETIME NOT NULL,
      estado      ENUM('Pendiente','Confirmada','Cancelada') NOT NULL DEFAULT 'Pendiente',
      creado_en   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
      FOREIGN KEY (mascota_id) REFERENCES mascotas(id) ON DELETE CASCADE,
      INDEX idx_citas_usuario_fecha (usuario_id, fecha)
    ) ENGINE=InnoDB
  `);

  // Registros del cuidado de la mascota: cuidados, notas, alergias, condiciones,
  // recordatorios, vacunas, historial médico y fotos.
  await pool.query(`
    CREATE TABLE IF NOT EXISTS registros (
      id          INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      usuario_id  INT UNSIGNED NOT NULL,
      mascota_id  INT UNSIGNED NULL,
      categoria   ENUM('cuidado','nota','alergia','condicion','recordatorio','vacuna','historial','foto') NOT NULL,
      tipo        VARCHAR(40)  NULL,
      titulo      VARCHAR(120) NOT NULL,
      detalle     VARCHAR(255) NULL,
      fecha       DATETIME NULL,
      url         VARCHAR(500) NULL,
      creado_en   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
      FOREIGN KEY (mascota_id) REFERENCES mascotas(id) ON DELETE CASCADE,
      INDEX idx_registros_usuario_cat (usuario_id, categoria, fecha)
    ) ENGINE=InnoDB
  `);

  await crearAdminSiHaceFalta();
}

async function crearAdminSiHaceFalta() {
  if (!env.adminEmail || !env.adminPassword) return;
  const [rows] = await pool.query('SELECT id FROM usuarios WHERE email = ?', [env.adminEmail]);
  if (rows.length) return;
  const hash = await bcrypt.hash(env.adminPassword, env.bcryptRounds);
  await pool.query(
    "INSERT INTO usuarios (nombre, apellido, email, password_hash, rol) VALUES ('Admin', 'Sistema', ?, ?, 'admin')",
    [env.adminEmail, hash]
  );
  console.log(`Administrador creado: ${env.adminEmail}`);
=======
});

// Crea la tabla si no existe (equivale a database/schema.sql)
async function inicializarDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id              INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      nombre          VARCHAR(80)  NOT NULL,
      apellido        VARCHAR(80)  NOT NULL,
      email           VARCHAR(120) NOT NULL UNIQUE,
      telefono        VARCHAR(30)  NULL,
      avatar          VARCHAR(255) NULL,
      creado_en       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      actualizado_en  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB
  `);
>>>>>>> f07299732d4d49260762e4f908dbfd0c91a7cf2a
}

module.exports = { pool, inicializarDB };
