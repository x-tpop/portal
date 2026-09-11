/* =================================================================
   utils.js — Helper functions
   ================================================================= */

const $  = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const pad = n => String(n).padStart(2, '0');

/* ---------- Format angka ---------- */
const fid = (n, dec = 0) => Number(n).toLocaleString('id-ID', {
  minimumFractionDigits: dec,
  maximumFractionDigits: dec
});

/* ---------- Format tanggal & waktu ---------- */
const dateLong = d => new Date(d).toLocaleDateString('id-ID', {
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
});
const dateShort = d => new Date(d).toLocaleDateString('id-ID', {
  day: 'numeric', month: 'short', year: 'numeric'
});
const timeShort = d => new Date(d).toLocaleTimeString('id-ID', {
  hour: '2-digit', minute: '2-digit'
});
const timeFull = d => new Date(d).toLocaleTimeString('id-ID', {
  hour: '2-digit', minute: '2-digit', second: '2-digit'
});
const isoDate = (d = new Date()) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const isoMonth = (d = new Date()) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;

/* ---------- Hitung jarak dua koordinat (Haversine) ---------- */
function hitungJarak(lat1, lng1, lat2, lng2) {
  const R = 6371000; // meter
  const toRad = x => x * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat/2)**2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLng/2)**2;
  return Math.round(2 * R * Math.asin(Math.sqrt(a)));
}

/* ---------- Toast ---------- */
function toast(msg, type = 'success') {
  const ic = {
    success: 'circle-check',
    info: 'info',
    warn: 'triangle-alert',
    error: 'circle-alert'
  }[type];
  const el = document.createElement('div');
  el.className = 'toast t-' + type;
  el.innerHTML = `<i data-lucide="${ic}"></i><div>${msg}</div>`;
  $('#toasts').append(el);
  if (window.lucide) lucide.createIcons();
  setTimeout(() => {
    el.classList.add('out');
    setTimeout(() => el.remove(), 320);
  }, 3400);
}

/* ---------- Modal ---------- */
function openModal(html) {
  $('#mCard').innerHTML = html;
  $('#modal').classList.add('open');
  document.body.style.overflow = 'hidden';
  if (window.lucide) lucide.createIcons();
}
function closeModal() {
  $('#modal').classList.remove('open');
  document.body.style.overflow = '';
}

/* ---------- Refresh ikon Lucide ---------- */
function refreshIcons() {
  if (window.lucide) lucide.createIcons();
}

/* ---------- Sapaan berdasarkan jam ---------- */
function sapaan() {
  const h = new Date().getHours();
  if (h < 11) return 'Selamat pagi';
  if (h < 15) return 'Selamat siang';
  if (h < 19) return 'Selamat sore';
  return 'Selamat malam';
}

/* ---------- Inisial nama ---------- */
function inisial(nama) {
  return nama
    .replace(/,.*$/, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase();
}

/* ---------- Ambil nama depan ---------- */
function namaDepan(nama) {
  return nama.replace(/,.*$/, '').split(' ')[0];
}

/* ---------- Role label & chip ---------- */
function roleLabel(role) { return CONFIG.ROLE_LABEL[role] || role; }
function roleChipClass(role) { return CONFIG.ROLE_COLOR[role] || 'chip-o'; }

/* ---------- Predikat raport ---------- */
function predikat(nilai) {
  if (nilai >= 91) return 'Sangat Baik';
  if (nilai >= 76) return 'Baik';
  if (nilai >= 61) return 'Butuh Perbaikan';
  return 'Kurang';
}

/* ---------- Kompresi foto (client-side) ---------- */
async function kompresiFoto(file, maxKB = 100, maxDim = 1200, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          const ratio = Math.min(maxDim / width, maxDim / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        let q = quality;
        let dataUrl = canvas.toDataURL('image/jpeg', q);

        // Turunkan kualitas sampai di bawah maxKB
        while (dataUrl.length / 1024 > maxKB && q > 0.3) {
          q -= 0.1;
          dataUrl = canvas.toDataURL('image/jpeg', q);
        }

        canvas.toBlob(blob => resolve(blob), 'image/jpeg', q);
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* ---------- Watermark foto (canvas) ---------- */
async function watermarkFoto(file, text) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        // Watermark di bawah
        const padding = 16;
        const fontSize = Math.max(14, Math.round(img.width / 40));
        ctx.font = `bold ${fontSize}px 'Plus Jakarta Sans', sans-serif`;
        const lines = text.split('\n');
        const lineH = fontSize * 1.4;
        const boxH = lines.length * lineH + padding * 2;
        const boxW = Math.max(...lines.map(l => ctx.measureText(l).width)) + padding * 2;

        ctx.fillStyle = 'rgba(30,58,138,.75)';
        ctx.fillRect(0, img.height - boxH, boxW, boxH);

        ctx.fillStyle = '#FBB917';
        lines.forEach((line, i) => {
          ctx.fillText(line, padding, img.height - boxH + padding + fontSize + i * lineH);
        });

        canvas.toBlob(blob => resolve(blob), 'image/jpeg', 0.8);
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* ---------- Dapatkan posisi GPS ---------- */
function getPosisi() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject(new Error('Geolocation tidak didukung browser'));
    }
    navigator.geolocation.getCurrentPosition(
      pos => resolve({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        accuracy: pos.coords.accuracy
      }),
      err => reject(err),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
}

/* ---------- Simpan & ambil session ---------- */
const Session = {
  set(key, val) { localStorage.setItem('tpop_' + key, JSON.stringify(val)); },
  get(key) {
    try { return JSON.parse(localStorage.getItem('tpop_' + key)); }
    catch { return null; }
  },
  remove(key) { localStorage.removeItem('tpop_' + key); },
  clear() {
    Object.keys(localStorage)
      .filter(k => k.startsWith('tpop_'))
      .forEach(k => localStorage.removeItem(k));
  }
};

/* ---------- Ekspor global ---------- */
window.$ = $;
window.$$ = $$;
window.pad = pad;
window.fid = fid;
window.dateLong = dateLong;
window.dateShort = dateShort;
window.timeShort = timeShort;
window.timeFull = timeFull;
window.isoDate = isoDate;
window.isoMonth = isoMonth;
window.hitungJarak = hitungJarak;
window.toast = toast;
window.openModal = openModal;
window.closeModal = closeModal;
window.refreshIcons = refreshIcons;
window.sapaan = sapaan;
window.inisial = inisial;
window.namaDepan = namaDepan;
window.roleLabel = roleLabel;
window.roleChipClass = roleChipClass;
window.predikat = predikat;
window.kompresiFoto = kompresiFoto;
window.watermarkFoto = watermarkFoto;
window.getPosisi = getPosisi;
window.Session = Session;

/* =================================================================
   TAMBAHAN: Kompresi ke target byte (binary search) + WebP support
   ================================================================= */

/* ---------- Cek dukungan WebP ---------- */
function supportsWebP() {
  try {
    const c = document.createElement('canvas');
    c.width = 1; c.height = 1;
    return c.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  } catch {
    return false;
  }
}

/* ---------- Kompresi dengan target byte (binary search) ---------- */
/**
 * Kompres gambar ke target ukuran (KB) dengan binary search quality.
 * @param {Blob|File} file - File gambar sumber
 * @param {Object} opts
 * @param {number} opts.targetKB - Target ukuran dalam KB (default 100)
 * @param {number} opts.maxDim - Dimensi maksimal (default 1280)
 * @param {boolean} opts.preferWebP - Pakai WebP jika browser support (default true)
 * @returns {Promise<{blob: Blob, format: string, quality: number, sizeKB: number}>}
 */
async function kompresiKeTarget(file, opts = {}) {
  const targetKB = opts.targetKB || 100;
  const maxDim = opts.maxDim || 1280;
  const useWebP = (opts.preferWebP !== false) && supportsWebP();
  const mime = useWebP ? 'image/webp' : 'image/jpeg';

  // Load gambar
  const img = await loadImage(file);

  // Resize jika perlu
  let { width, height } = img;
  if (width > maxDim || height > maxDim) {
    const ratio = Math.min(maxDim / width, maxDim / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }

  // Siapkan canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, width, height);

  // Binary search quality
  let low = 0.1;
  let high = 1.0;
  let bestBlob = null;
  let bestQuality = 0.8;
  const targetBytes = targetKB * 1024;

  for (let i = 0; i < 8 && low <= high; i++) {
    const mid = (low + high) / 2;
    const blob = await canvasToBlob(canvas, mime, mid);

    // Simpan yang terkecil sebagai fallback
    if (!bestBlob || blob.size < bestBlob.size) {
      // skip — kita track separately
    }

    if (blob.size <= targetBytes) {
      // Masih muat → coba quality lebih tinggi
      bestBlob = blob;
      bestQuality = mid;
      low = mid + 0.05;
    } else {
      // Terlalu besar → turunkan
      high = mid - 0.05;
      if (!bestBlob) {
        bestBlob = blob;
        bestQuality = mid;
      }
    }
  }

  return {
    blob: bestBlob,
    format: useWebP ? 'webp' : 'jpeg',
    quality: Math.round(bestQuality * 100) / 100,
    sizeKB: Math.round(bestBlob.size / 1024)
  };
}

/* ---------- Helper: load image dari Blob/File ---------- */
function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Gagal load gambar'));
    };
    img.src = url;
  });
}

/* ---------- Helper: canvas → Blob ---------- */
function canvasToBlob(canvas, mime, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      blob => blob ? resolve(blob) : reject(new Error('Canvas toBlob gagal')),
      mime,
      quality
    );
  });
}

/* ---------- Ekspor global ---------- */
window.supportsWebP = supportsWebP;
window.kompresiKeTarget = kompresiKeTarget;
window.loadImage = loadImage;
window.canvasToBlob = canvasToBlob;