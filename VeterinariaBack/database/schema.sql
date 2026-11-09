CREATE DATABASE IF NOT EXISTS veterinaria
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE veterinaria;

<<<<<<< HEAD
-- Las tablas también se crean solas al iniciar la API (config/db.js).
CREATE TABLE IF NOT EXISTS usuarios (
  id                INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nombre            VARCHAR(80)  NOT NULL,
  apellido          VARCHAR(80)  NOT NULL,
  email             VARCHAR(120) NOT NULL UNIQUE,
  telefono          VARCHAR(30)  NULL,
  avatar            VARCHAR(255) NULL,
  password_hash     VARCHAR(100) NULL,            -- bcrypt, nunca texto plano
  rol               ENUM('usuario','admin') NOT NULL DEFAULT 'usuario',
  intentos_fallidos TINYINT UNSIGNED NOT NULL DEFAULT 0,
  bloqueado_hasta   DATETIME NULL,
  creado_en         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS refresh_tokens (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  usuario_id  INT UNSIGNED NOT NULL,
  token_hash  CHAR(64) NOT NULL UNIQUE,           -- SHA-256 del token
  expira_en   DATETIME NOT NULL,
  revocado    TINYINT(1) NOT NULL DEFAULT 0,
  creado_en   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

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
) ENGINE=InnoDB;

-- Fechas normalizadas en DATETIME (UTC). "Completada" se calcula, no se guarda.
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
) ENGINE=InnoDB;

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
=======
CREATE TABLE IF NOT EXISTS usuarios (
  id              INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nombre          VARCHAR(80)  NOT NULL,
  apellido        VARCHAR(80)  NOT NULL,
  email           VARCHAR(120) NOT NULL UNIQUE,
  telefono        VARCHAR(30)  NULL,
  avatar          VARCHAR(255) NULL,
  creado_en       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
>>>>>>> f07299732d4d49260762e4f908dbfd0c91a7cf2a
) ENGINE=InnoDB;
