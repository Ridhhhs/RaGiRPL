const sqlite = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = sqlite('ragi.db');

// Create tables if not exist
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    email TEXT,
    nik TEXT,
    phone TEXT,
    password_hash TEXT,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username dan password wajib diisi' });
  }

  const stmt = db.prepare('SELECT id, username, role, password_hash FROM users WHERE username = ?');
  const user = stmt.get(username);

  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ message: 'Login gagal' });
  }

  const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, 'secret_key');

  res.json({
    success: true,
    message: 'Login berhasil',
    user: { id: user.id, username: user.username, role: user.role },
    token
  });
};