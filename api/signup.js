const sqlite = require('better-sqlite3');
const bcrypt = require('bcryptjs');

const db = sqlite('ragi.db');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username, email, nik, phone, password } = req.body;

  if (!username || !email || !nik || !phone || !password) {
    return res.status(400).json({ message: 'Semua field wajib diisi' });
  }

  const checkStmt = db.prepare('SELECT id FROM users WHERE username = ? OR email = ? OR nik = ?');
  const existing = checkStmt.get(username, email, nik);

  if (existing) {
    return res.status(409).json({ message: 'Akun sudah terdaftar' });
  }

  const hash = bcrypt.hashSync(password, 10);
  const insertStmt = db.prepare('INSERT INTO users (username, email, nik, phone, password_hash, role) VALUES (?, ?, ?, ?, ?, ?)');
  insertStmt.run(username, email, nik, phone, hash, 'masyarakat');

  res.json({ message: 'Signup berhasil' });
};