const sqlite = require('better-sqlite3');
const jwt = require('jsonwebtoken');

const db = sqlite('ragi.db');

module.exports = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, 'secret_key');
    const userId = decoded.id;

    // Query riwayat dari database (contoh dari ktp_requests)
    const stmt = db.prepare(`
      SELECT id, 'KTP' as service_type, status, created_at as submitted_at, 'tracking_' || id as tracking_code
      FROM ktp_requests
      WHERE user_id = ?
      UNION ALL
      SELECT id, 'KK' as service_type, status, created_at as submitted_at, 'tracking_' || id as tracking_code
      FROM kk_requests
      WHERE user_id = ?
      ORDER BY submitted_at DESC
    `);
    const items = stmt.all(userId, userId);

    res.json({ items });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};