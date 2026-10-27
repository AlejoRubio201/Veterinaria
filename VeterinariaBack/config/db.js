require('dotenv').config();
const mysql = require('mysql2/promise');

// Pool de conexiones compartido por todos los modelos
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'veterinaria',
  waitForConnections: true,
  connectionLimit: 10,
  charset: 'utf8mb4',
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
}

module.exports = { pool, inicializarDB };
