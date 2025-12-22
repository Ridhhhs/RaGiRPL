const sqlite = require('better-sqlite3');

const db = sqlite('ragi.db');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { user_id, nik, nama_lengkap, tempat_lahir, tanggal_lahir, jenis_kelamin, alamat, rt, rw, kelurahan, kecamatan, kabupaten, provinsi, agama, status_perkawinan, pekerjaan, kewarganegaraan } = req.body;

  if (!user_id) {
    return res.status(401).json({ success: false, message: 'Belum login' });
  }

  // Insert into database
  const stmt = db.prepare(`
    INSERT INTO ktp_requests (user_id, nik, nama_lengkap, tempat_lahir, tanggal_lahir, jenis_kelamin, alamat, rt, rw, kelurahan, kecamatan, kabupaten, provinsi, agama, status_perkawinan, pekerjaan, kewarganegaraan, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
  `);

  try {
    stmt.run(user_id, nik, nama_lengkap, tempat_lahir, tanggal_lahir, jenis_kelamin, alamat, rt, rw, kelurahan, kecamatan, kabupaten, provinsi, agama, status_perkawinan, pekerjaan, kewarganegaraan);
    res.json({ success: true, message: 'Pengajuan KTP berhasil dikirim' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal menyimpan data' });
  }
};