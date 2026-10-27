const { pool } = require('../config/db');

// Capa de acceso a datos: solo SQL, sin reglas de negocio.
const Usuario = {
  async obtenerTodos() {
    const [rows] = await pool.query('SELECT * FROM usuarios ORDER BY id DESC');
    return rows;
  },

  async obtenerPorId(id) {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async obtenerPorEmail(email) {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    return rows[0] || null;
  },

  async crear({ nombre, apellido, email, telefono, avatar }) {
    const [result] = await pool.query(
      'INSERT INTO usuarios (nombre, apellido, email, telefono, avatar) VALUES (?, ?, ?, ?, ?)',
      [nombre, apellido, email, telefono ?? null, avatar ?? null]
    );
    return result.insertId;
  },

  async actualizar(id, { nombre, apellido, email, telefono, avatar }) {
    const [result] = await pool.query(
      'UPDATE usuarios SET nombre = ?, apellido = ?, email = ?, telefono = ?, avatar = ? WHERE id = ?',
      [nombre, apellido, email, telefono ?? null, avatar ?? null, id]
    );
    return result.affectedRows;
  },

  async eliminar(id) {
    const [result] = await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);
    return result.affectedRows;
  },
};

module.exports = Usuario;
