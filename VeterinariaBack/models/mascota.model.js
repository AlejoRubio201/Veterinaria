const { pool } = require('../config/db');

const COLS = `id, nombre, especie, raza, sexo, fecha_nacimiento AS fechaNacimiento,
  CAST(peso_kg AS DOUBLE) AS pesoKg, color, descripcion, foto, creado_en AS creadoEn`;

// Todas las consultas filtran por usuario_id: nadie puede ver mascotas ajenas.
const Mascota = {
  async listar(usuarioId) {
    const [rows] = await pool.query(`SELECT ${COLS} FROM mascotas WHERE usuario_id = ? ORDER BY id ASC`, [usuarioId]);
    return rows;
  },
  async obtener(id, usuarioId) {
    const [rows] = await pool.query(`SELECT ${COLS} FROM mascotas WHERE id = ? AND usuario_id = ?`, [id, usuarioId]);
    return rows[0] || null;
  },
  async crear(usuarioId, d) {
    const [r] = await pool.query(
      `INSERT INTO mascotas (usuario_id, nombre, especie, raza, sexo, fecha_nacimiento, peso_kg, color, descripcion, foto)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [usuarioId, d.nombre, d.especie, d.raza, d.sexo, d.fechaNacimiento, d.pesoKg, d.color, d.descripcion, d.foto]
    );
    return r.insertId;
  },
  async actualizar(id, usuarioId, d) {
    const [r] = await pool.query(
      `UPDATE mascotas SET nombre=?, especie=?, raza=?, sexo=?, fecha_nacimiento=?, peso_kg=?, color=?, descripcion=?, foto=?
       WHERE id = ? AND usuario_id = ?`,
      [d.nombre, d.especie, d.raza, d.sexo, d.fechaNacimiento, d.pesoKg, d.color, d.descripcion, d.foto, id, usuarioId]
    );
    return r.affectedRows;
  },
  async eliminar(id, usuarioId) {
    const [r] = await pool.query('DELETE FROM mascotas WHERE id = ? AND usuario_id = ?', [id, usuarioId]);
    return r.affectedRows;
  },
};

module.exports = Mascota;
