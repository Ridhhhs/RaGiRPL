import bcrypt from "bcryptjs";
import { db } from "./db.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { username, email, nik, phone, password } = req.body;

    if (!username || !email || !nik || !phone || !password) {
      return res.status(400).json({ message: "Data tidak lengkap" });
    }

    // cek user sudah ada
    const [existing] = await db.query(
      "SELECT id FROM users WHERE email = ? OR username = ? OR nik = ?",
      [email, username, nik]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: "Akun sudah terdaftar" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      `INSERT INTO users (username, email, nik, phone, password)
       VALUES (?, ?, ?, ?, ?)`,
      [username, email, nik, phone, hashedPassword]
    );

    return res.status(201).json({ success: true, message: "Signup berhasil" });

  } catch (err) {
    console.error("SIGNUP ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
}
