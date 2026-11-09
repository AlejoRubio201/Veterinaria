const { pool } = require('../config/db');

const SELECT = `SELECT r.id, r.categoria, r.tipo, r.titulo, r.detalle, r.fecha, r.url,
  r.mascota_id AS mascotaId, m.nombre AS mascotaNombre
  FROM registros r LEFT JOIN mascotas m ON m.id = r.mascota_id`;

const Registro = {
  async listar(usuarioId, { categoria, mascotaId, periodo, ahora }) {
    const where = ['r.usuario_id = ?', 'r.categoria = ?'];
    const params = [usuarioId, categoria];
    if (mascotaId) { where.push('r.mascota_id = ?'); params.push(mascotaId); }
    if (periodo === 'proximas') { where.push('r.fecha >= ?'); params.push(ahora); }
    if (periodo === 'pasadas') { where.push('r.fecha < ?'); params.push(ahora); }
    const orden = periodo === 'proximas' ? 'ASC' : 'DESC';
    const [rows] = await pool.query(
      `${SELECT} WHERE ${where.join(' AND ')} ORDER BY r.fecha ${orden}, r.id DESC`, params
    );
    return rows;
  },
  async obtener(id, usuarioId) {
    const [rows] = await pool.query(`${SELECT} WHERE r.id = ? AND r.usuario_id = ?`, [id, usuarioId]);
    return rows[0] || null;
  },
  async crear(usuarioId, d) {
    const [r] = await pool.query(
      'INSERT INTO registros (usuario_id, mascota_id, categoria, tipo, titulo, detalle, fecha, url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [usuarioId, d.mascotaId, d.categoria, d.tipo, d.titulo, d.detalle, d.fecha, d.url]
    );
    return r.insertId;
  },
  async actualizar(id, usuarioId, d) {
    const [r] = await pool.query(
      'UPDATE registros SET mascota_id=?, tipo=?, titulo=?, detalle=?, fecha=?, url=? WHERE id = ? AND usuario_id = ?',
      [d.mascotaId, d.tipo, d.titulo, d.detalle, d.fecha, d.url, id, usuarioId]
    );
    return r.affectedRows;
  },
  async eliminar(id, usuarioId) {
    const [r] = await pool.query('DELETE FROM registros WHERE id = ? AND usuario_id = ?', [id, usuarioId]);
    return r.affectedRows;
  },
};

module.exports = Registro;
