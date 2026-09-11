/* =================================================================
   auth.js — Session, role, profil user, dan helper foto
   ================================================================= */

const Auth = {
  /* ---------- Ambil session ---------- */
  getSession() {
    try {
      return JSON.parse(localStorage.getItem('tpop_session'));
    } catch {
      return null;
    }
  },

  /* ---------- Simpan session ---------- */
  setSession(data) {
    localStorage.setItem('tpop_session', JSON.stringify(data));
  },

  /* ---------- Hapus session ---------- */
  clear() {
    localStorage.removeItem('tpop_session');
  },

  /* ---------- Cek login ---------- */
  isLoggedIn() {
    return !!this.getSession();
  },

  /* ---------- Ambil role ---------- */
  getRole() {
    const s = this.getSession();
    return s?.role || 'korlap';
  },

  /* ---------- Ganti role (demo) ---------- */
  switchRole(role) {
    const s = this.getSession();
    if (!s) return false;
    s.role = role;
    s.switchedAt = new Date().toISOString();
    this.setSession(s);
    return true;
  },

  /* ---------- Ambil data pegawai lengkap ---------- */
  getPegawaiAktif() {
    const s = this.getSession();
    if (!s) return null;

    // Cocokkan berdasarkan NIP kalau ada
    if (s.nip && window.DATA?.PEGAWAI) {
      const byNip = window.DATA.PEGAWAI.find(p => p.nip === s.nip);
      if (byNip) return byNip;
    }

    // Fallback: ambil sampel pertama sesuai role
    if (window.DATA?.PEGAWAI) {
      return window.DATA.PEGAWAI.find(p => p.role === s.role) || null;
    }
    return null;
  },

  /* ---------- Foto Pas (3x4) — untuk identitas & avatar ---------- */
  getFotoPas(pegawai) {
    if (!pegawai) return 'https://i.pravatar.cc/300';
    return pegawai.foto_pas 
      || pegawai.foto 
      || 'https://i.pravatar.cc/300';
  },

  /* ---------- Foto Hero (PNG pop-out) — untuk hero section ---------- */
  getFotoHero(pegawai) {
    if (!pegawai) return 'https://i.pravatar.cc/500';
    return pegawai.foto_hero 
      || pegawai.foto_pas 
      || pegawai.foto 
      || 'https://i.pravatar.cc/500';
  },

  /* ---------- Guard: redirect jika belum login ---------- */
  guard() {
    if (!this.isLoggedIn()) {
      window.location.replace('login.html');
      return false;
    }
    return true;
  },

  /* ---------- Logout ---------- */
  logout() {
    this.clear();
    window.location.href = 'login.html';
  }
};

window.Auth = Auth;