const { pool } = require('../config/db');

// Solo se guarda el HASH (SHA-256) del refresh token: si se filtra la BD, los tokens no sirven.
const RefreshToken = {
  async crear(usuarioId, tokenHash, expiraEn) {
    await pool.query('INSERT INTO refresh_tokens (usuario_id, token_hash, expira_en) VALUES (?, ?, ?)', [
      usuarioId, tokenHash, expiraEn,
    ]);
  },
  async buscar(tokenHash) {
    const [rows] = await pool.query(
      'SELECT id, usuario_id AS usuarioId, expira_en AS expiraEn, revocado FROM refresh_tokens WHERE token_hash = ?',
      [tokenHash]
    );
    return rows[0] || null;
  },
  async revocar(id) {
    await pool.query('UPDATE refresh_tokens SET revocado = 1 WHERE id = ?', [id]);
  },
  async revocarTodos(usuarioId) {
    await pool.query('UPDATE refresh_tokens SET revocado = 1 WHERE usuario_id = ?', [usuarioId]);
  },
  async limpiarExpirados() {
    await pool.query('DELETE FROM refresh_tokens WHERE expira_en < UTC_TIMESTAMP() OR revocado = 1');
  },
};

module.exports = RefreshToken;
