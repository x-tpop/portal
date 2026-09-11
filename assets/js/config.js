/* =================================================================
   config.js — Konfigurasi global Portal Kinerja TP-OP
   ================================================================= */

const CONFIG = {
  // Info aplikasi
  APP_NAME: 'Portal Kinerja TP-OP',
  APP_OWNER: 'BBWS Brantas — Kementerian PUPR',
  APP_VERSION: '1.0.0-dummy',

  // Mode: 'dummy' (pakai data lokal) atau 'live' (pakai Supabase)
  MODE: 'dummy',

  // Supabase (untuk nanti saat MODE='live')
  SUPABASE_URL: 'https://xxx.supabase.co',
  SUPABASE_ANON_KEY: 'eyJxxx...',

  // Google Apps Script Web App (untuk nanti)
  GAS_WEBAPP_URL: 'https://script.google.com/macros/s/xxx/exec',

  // Peta — OpenStreetMap (gratis, tanpa API key)
  MAP_TILE_URL: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  MAP_TILE_URL_ALT: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  MAP_ATTRIBUTION: '',
  MAP_DEFAULT_CENTER: [-8.45, 114.20],
  MAP_DEFAULT_ZOOM: 11,

  // Presensi
  PRESENSI_RADIUS_DEFAULT: 200,
  PRESENSI_RADIUS_TOLERANSI: 500,

  // Foto
  FOTO_MAX_SIZE_KB: 100,
  FOTO_MAX_DIMENSION: 1200,
  FOTO_QUALITY: 0.8,

  // Format
  TANGGAL_FORMAT: 'id-ID',
  WAKTU_FORMAT: { hour:'2-digit', minute:'2-digit' },
  WAKTU_FORMAT_LENGKAP: { hour:'2-digit', minute:'2-digit', second:'2-digit' },

  // Role
  ROLES: ['korlap', 'ppa', 'pekarya'],
  ROLE_LABEL: {
    korlap: 'Staf Pengamat (Korlap)',
    ppa: 'Petugas Pintu Air (PPA)',
    pekarya: 'Pekarya Pengairan'
  },
  ROLE_COLOR: {
    korlap: 'chip-korlap',
    ppa: 'chip-ppa',
    pekarya: 'chip-pekarya'
  }
};

Object.freeze(CONFIG);
Object.freeze(CONFIG.ROLE_LABEL);
Object.freeze(CONFIG.ROLE_COLOR);