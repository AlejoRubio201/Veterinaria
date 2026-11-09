const { pool } = require('../config/db');

const SELECT = `SELECT c.id, c.mascota_id AS mascotaId, m.nombre AS mascotaNombre, c.titulo, c.lugar, c.fecha, c.estado
  FROM citas c JOIN mascotas m ON m.id = c.mascota_id`;

const Cita = {
  // periodo: 'proximas' | 'historial' | undefined. "ahora" lo aporta el servicio.
  async listar(usuarioId, { periodo, mascotaId, ahora }) {
    const where = ['c.usuario_id = ?'];
    const params = [usuarioId];
    if (mascotaId) { where.push('c.mascota_id = ?'); params.push(mascotaId); }
    if (periodo === 'proximas') { where.push("c.fecha >= ? AND c.estado <> 'Cancelada'"); params.push(ahora); }
    if (periodo === 'historial') { where.push("(c.fecha < ? OR c.estado = 'Cancelada')"); params.push(ahora); }
    const orden = periodo === 'historial' ? 'DESC' : 'ASC';
    const [rows] = await pool.query(`${SELECT} WHERE ${where.join(' AND ')} ORDER BY c.fecha ${orden}`, params);
    return rows;
  },
  async obtener(id, usuarioId) {
    const [rows] = await pool.query(`${SELECT} WHERE c.id = ? AND c.usuario_id = ?`, [id, usuarioId]);
    return rows[0] || null;
  },
  async crear(usuarioId, d) {
    const [r] = await pool.query(
      'INSERT INTO citas (usuario_id, mascota_id, titulo, lugar, fecha, estado) VALUES (?, ?, ?, ?, ?, ?)',
      [usuarioId, d.mascotaId, d.titulo, d.lugar, d.fecha, d.estado]
    );
    return r.insertId;
  },
  async actualizar(id, usuarioId, d) {
    const [r] = await pool.query(
      'UPDATE citas SET mascota_id=?, titulo=?, lugar=?, fecha=?, estado=? WHERE id = ? AND usuario_id = ?',
      [d.mascotaId, d.titulo, d.lugar, d.fecha, d.estado, id, usuarioId]
    );
    return r.affectedRows;
  },
  async eliminar(id, usuarioId) {
    const [r] = await pool.query('DELETE FROM citas WHERE id = ? AND usuario_id = ?', [id, usuarioId]);
    return r.affectedRows;
  },
};

module.exports = Cita;
