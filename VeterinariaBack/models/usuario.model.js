const { pool } = require('../config/db');

<<<<<<< HEAD
// Capa de acceso a datos: solo SQL. NUNCA se devuelve password_hash salvo en obtenerCredenciales.
const PUBLICAS =
  'id, nombre, apellido, email, telefono, avatar, rol, creado_en AS creadoEn, actualizado_en AS actualizadoEn';

const Usuario = {
  async obtenerTodos() {
    const [rows] = await pool.query(`SELECT ${PUBLICAS} FROM usuarios ORDER BY id DESC`);
=======
// Capa de acceso a datos: solo SQL, sin reglas de negocio.
const Usuario = {
  async obtenerTodos() {
    const [rows] = await pool.query('SELECT * FROM usuarios ORDER BY id DESC');
>>>>>>> f07299732d4d49260762e4f908dbfd0c91a7cf2a
    return rows;
  },

  async obtenerPorId(id) {
<<<<<<< HEAD
    const [rows] = await pool.query(`SELECT ${PUBLICAS} FROM usuarios WHERE id = ?`, [id]);
=======
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id]);
>>>>>>> f07299732d4d49260762e4f908dbfd0c91a7cf2a
    return rows[0] || null;
  },

  async obtenerPorEmail(email) {
<<<<<<< HEAD
    const [rows] = await pool.query(`SELECT ${PUBLICAS} FROM usuarios WHERE email = ?`, [email]);
    return rows[0] || null;
  },

  // Solo para el login
  async obtenerCredenciales(email) {
    const [rows] = await pool.query(
      'SELECT id, password_hash AS passwordHash, intentos_fallidos AS intentos, bloqueado_hasta AS bloqueadoHasta FROM usuarios WHERE email = ?',
      [email]
    );
    return rows[0] || null;
  },

  async obtenerPasswordHash(id) {
    const [rows] = await pool.query('SELECT password_hash AS passwordHash FROM usuarios WHERE id = ?', [id]);
    return rows[0]?.passwordHash || null;
  },

  async crear({ nombre, apellido, email, telefono, avatar, passwordHash, rol = 'usuario' }) {
    const [result] = await pool.query(
      'INSERT INTO usuarios (nombre, apellido, email, telefono, avatar, password_hash, rol) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nombre, apellido, email, telefono ?? null, avatar ?? null, passwordHash, rol]
=======
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    return rows[0] || null;
  },

  async crear({ nombre, apellido, email, telefono, avatar }) {
    const [result] = await pool.query(
      'INSERT INTO usuarios (nombre, apellido, email, telefono, avatar) VALUES (?, ?, ?, ?, ?)',
      [nombre, apellido, email, telefono ?? null, avatar ?? null]
>>>>>>> f07299732d4d49260762e4f908dbfd0c91a7cf2a
    );
    return result.insertId;
  },

<<<<<<< HEAD
  async actualizar(id, { nombre, apellido, email, telefono, avatar, rol }) {
    const [result] = await pool.query(
      'UPDATE usuarios SET nombre = ?, apellido = ?, email = ?, telefono = ?, avatar = ?, rol = ? WHERE id = ?',
      [nombre, apellido, email, telefono ?? null, avatar ?? null, rol, id]
=======
  async actualizar(id, { nombre, apellido, email, telefono, avatar }) {
    const [result] = await pool.query(
      'UPDATE usuarios SET nombre = ?, apellido = ?, email = ?, telefono = ?, avatar = ? WHERE id = ?',
      [nombre, apellido, email, telefono ?? null, avatar ?? null, id]
>>>>>>> f07299732d4d49260762e4f908dbfd0c91a7cf2a
    );
    return result.affectedRows;
  },

<<<<<<< HEAD
  async actualizarPassword(id, passwordHash) {
    await pool.query('UPDATE usuarios SET password_hash = ? WHERE id = ?', [passwordHash, id]);
  },

  async registrarFallo(id, intentos, bloqueadoHasta) {
    await pool.query('UPDATE usuarios SET intentos_fallidos = ?, bloqueado_hasta = ? WHERE id = ?', [
      intentos, bloqueadoHasta, id,
    ]);
  },

  async limpiarFallos(id) {
    await pool.query('UPDATE usuarios SET intentos_fallidos = 0, bloqueado_hasta = NULL WHERE id = ?', [id]);
  },

=======
>>>>>>> f07299732d4d49260762e4f908dbfd0c91a7cf2a
  async eliminar(id) {
    const [result] = await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);
    return result.affectedRows;
  },
};

module.exports = Usuario;
