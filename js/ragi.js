/* =========================
   LOGIN
========================= */
async function login(username, password) {
  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  if (data.success) {
    localStorage.setItem("token", data.token);
    alert("Login berhasil");
  } else {
    alert(data.message);
  }
}

/* =========================
   AMBIL RIWAYAT
========================= */
async function loadRiwayat() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Belum login");
    return;
  }

  const res = await fetch("/api/riwayat", {
    headers: {
      Authorization: "Bearer " + token
    }
  });

  const data = await res.json();
  console.log("Riwayat:", data.items);
}
