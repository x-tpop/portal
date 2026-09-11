/* =================================================================
   data-dummy.js — Data sampel TP-OP untuk demo
   Setiap pegawai punya 2 foto: foto_pas (3x4) & foto_hero (PNG pop-out)
   ================================================================= */

/* ---------- Foto Unsplash (lapangan irigasi, pintu air, sawah) ---------- */
const FOTO = {
  selfie: [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop'
  ],
  lokasi: [
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?w=600&h=400&fit=crop'
  ]
};

/* ---------- Foto Pas (3x4) & Foto Hero (PNG) ---------- */
const FOTO_PEGAWAI = {
  // Foto hero PNG transparan (untuk pop-out)
  hero_korlap:  'https://lh3.googleusercontent.com/d/1UYYjsfyhWPkNPaAB2Pq-ntO0gQAuyJqx',
  hero_ppa:     'https://lh3.googleusercontent.com/d/1WTXmLAlzh2XZg4Mo-YfwCd1L0I2ssYJC',
  hero_pekarya: 'https://lh3.googleusercontent.com/d/19_kKwCaFzj0OQvtZZIGiC3hNQp6evZed',
  // Fallback foto pas (avatar)
  pas_default:  'https://i.pravatar.cc/300'
};

/* ---------- Master Pegawai (3 Korlap + 15 PPA + 15 Pekarya) ---------- */
const PEGAWAI = [
  // ============ STAF PENGAMAT (KORLAP) — 3 sampel ============
  {
    id: 'P001', nip: 'NSP.05.84.15.13.027', nama: 'Abdul Rahman Yusuf',
    role: 'korlap', jabatan: 'Staf Pengamat',
    krosda: 'Bangorejo', kejuron: 'Karangdoro, Bulurejo, Temurejo, Sambirejo, Sidorejo',
    lokasi: 'Kejuron Karangdoro, Bangorejo, Bulurejo, Temurejo, Sambirejo, Sidorejo',
    foto_pas: FOTO_PEGAWAI.hero_korlap,
    foto_hero: FOTO_PEGAWAI.hero_korlap,
    koordinat: { lat: -8.4839932, lng: 114.194848 }
  },
  {
    id: 'P002', nip: 'NSP.05.76.09.13.002', nama: 'Eko Adi Purwanto',
    role: 'korlap', jabatan: 'Staf Pengamat',
    krosda: 'Cluring', kejuron: 'Cluring, Sraten, Kradenan, Benculuk, Tambakrejo, Plampangrejo',
    lokasi: 'Kejuron Cluring, Sraten, Kradenan, Benculuk, Tambakrejo, Plampangrejo',
    foto_pas: FOTO_PEGAWAI.hero_korlap,
    foto_hero: FOTO_PEGAWAI.hero_korlap,
    koordinat: { lat: -8.47, lng: 114.25 }
  },
  {
    id: 'P003', nip: 'NSP.05.77.19.13.005', nama: 'Wiwit Rahmad Hidayat',
    role: 'korlap', jabatan: 'Staf Pengamat',
    krosda: 'Pesanggaran', kejuron: 'Kebondalem, Yudomulyo, Siliragung, Pesanggaran, Sumberagung',
    lokasi: 'Kejuron Kebondalem, Yudomulyo, Siliragung, Pesanggaran, Sumberagung',
    foto_pas: FOTO_PEGAWAI.hero_korlap,
    foto_hero: FOTO_PEGAWAI.hero_korlap,
    koordinat: { lat: -8.55, lng: 114.10 }
  },

  // ============ PETUGAS PINTU AIR (PPA) — 15 sampel ============
  {
    id: 'P004', nip: 'NPA.05.86.09.13.016', nama: 'Agus Riyadi',
    role: 'ppa', jabatan: 'Petugas Pintu Air',
    krosda: 'Bangorejo', kejuron: 'Bulurejo',
    pintu: 'B.NGRO. 1, 2, 3, 4, 5, 6, 7, 8, 9',
    foto_pas: FOTO_PEGAWAI.hero_ppa,
    foto_hero: FOTO_PEGAWAI.hero_ppa,
    koordinat: { lat: -8.4839932, lng: 114.194848 }
  },
  {
    id: 'P005', nip: 'NPA.05.78.09.13.013', nama: 'Anang Sujarwoko',
    role: 'ppa', jabatan: 'Petugas Pintu Air',
    krosda: 'Bangorejo', kejuron: 'Sidorejo',
    pintu: 'B.CG, B.SDO.1, B.SDO.2',
    foto_pas: FOTO_PEGAWAI.hero_ppa,
    foto_hero: FOTO_PEGAWAI.hero_ppa,
    koordinat: { lat: -8.49397, lng: 114.2372633 }
  },
  {
    id: 'P006', nip: 'NPA.05.86.07.13.007', nama: 'Arif Evaruli',
    role: 'ppa', jabatan: 'Petugas Pintu Air',
    krosda: 'Bangorejo', kejuron: 'Bulurejo',
    pintu: 'B.TSU. 1, 2, 3, 4, 5, 6',
    foto_pas: FOTO_PEGAWAI.hero_ppa,
    foto_hero: FOTO_PEGAWAI.hero_ppa,
    koordinat: { lat: -8.4723064, lng: 114.1798009 }
  },
  {
    id: 'P007', nip: 'NPA.05.87.12.13.014', nama: 'Ariyanto',
    role: 'ppa', jabatan: 'Petugas Pintu Air',
    krosda: 'Bangorejo', kejuron: 'Sidorejo',
    pintu: 'B.SDO.3, B.SDO.4, B.SDO.5',
    foto_pas: FOTO_PEGAWAI.hero_ppa,
    foto_hero: FOTO_PEGAWAI.hero_ppa,
    koordinat: { lat: -8.4921518, lng: 114.2578408 }
  },
  {
    id: 'P008', nip: 'NPA.05.76.09.13.015', nama: 'Bambang Subiarto',
    role: 'ppa', jabatan: 'Petugas Pintu Air',
    krosda: 'Bangorejo', kejuron: 'Sidorejo',
    pintu: 'B.WPT.1, B.WPT.2, B.WPT.3, B.WPT.4',
    foto_pas: FOTO_PEGAWAI.hero_ppa,
    foto_hero: FOTO_PEGAWAI.hero_ppa,
    koordinat: { lat: -8.4960029, lng: 114.2684359 }
  },
  {
    id: 'P009', nip: 'NPA.05.91.13.13.011', nama: 'Deni Kristiawan',
    role: 'ppa', jabatan: 'Petugas Pintu Air',
    krosda: 'Bangorejo', kejuron: 'Temurejo',
    pintu: 'B.GA.3, B.GA.4, B.GA.5',
    foto_pas: FOTO_PEGAWAI.hero_ppa,
    foto_hero: FOTO_PEGAWAI.hero_ppa,
    koordinat: { lat: -8.52312, lng: 114.20288 }
  },
  {
    id: 'P010', nip: 'NPA.05.87.12.13.004', nama: 'Edi Susanto',
    role: 'ppa', jabatan: 'Petugas Pintu Air',
    krosda: 'Bangorejo', kejuron: 'Karangdoro',
    pintu: 'B.RO.1, B.RO.2, B.RO.3',
    foto_pas: FOTO_PEGAWAI.hero_ppa,
    foto_hero: FOTO_PEGAWAI.hero_ppa,
    koordinat: { lat: -8.4479157, lng: 114.1004075 }
  },
  {
    id: 'P011', nip: 'NPA.05.91.12.13.001', nama: 'Imam Taufik',
    role: 'ppa', jabatan: 'Petugas Pintu Air',
    krosda: 'Bangorejo', kejuron: 'Karangdoro',
    pintu: 'B.BU.1, B.BU.2, B.BU.3',
    foto_pas: FOTO_PEGAWAI.hero_ppa,
    foto_hero: FOTO_PEGAWAI.hero_ppa,
    koordinat: { lat: -8.4417101, lng: 114.1010505 }
  },
  {
    id: 'P012', nip: 'NPA.05.70.11.13.010', nama: 'Imam Suwarno',
    role: 'ppa', jabatan: 'Petugas Pintu Air',
    krosda: 'Bangorejo', kejuron: 'Temurejo',
    pintu: 'B.GA.1, B.GA.2, B.TMO.1, B.TRO.1',
    foto_pas: FOTO_PEGAWAI.hero_ppa,
    foto_hero: FOTO_PEGAWAI.hero_ppa,
    koordinat: { lat: -8.4948827, lng: 114.1927711 }
  },
  {
    id: 'P013', nip: 'NPA.05.71.12.13.003', nama: 'Jamari',
    role: 'ppa', jabatan: 'Petugas Pintu Air',
    krosda: 'Bangorejo', kejuron: 'Bangorejo',
    pintu: 'B.BU.7, B.BU.8, B.BU.9, B.BU.10',
    foto_pas: FOTO_PEGAWAI.hero_ppa,
    foto_hero: FOTO_PEGAWAI.hero_ppa,
    koordinat: { lat: -8.4689394, lng: 114.1567031 }
  },
  {
    id: 'P014', nip: 'NPA.05.77.12.13.009', nama: 'Joko Supono',
    role: 'ppa', jabatan: 'Petugas Pintu Air',
    krosda: 'Bangorejo', kejuron: 'Sambirejo',
    pintu: 'B.SBI.4, B.SBI.5, B.SBI.6, B.SBI.7',
    foto_pas: FOTO_PEGAWAI.hero_ppa,
    foto_hero: FOTO_PEGAWAI.hero_ppa,
    koordinat: { lat: -8.515205, lng: 114.171125 }
  },
  {
    id: 'P015', nip: 'NPA.05.87.11.13.008', nama: 'Joko Susanto',
    role: 'ppa', jabatan: 'Petugas Pintu Air',
    krosda: 'Bangorejo', kejuron: 'Sambirejo',
    pintu: 'B.SBI.1, B.SBI.2, B.SBI.3',
    foto_pas: FOTO_PEGAWAI.hero_ppa,
    foto_hero: FOTO_PEGAWAI.hero_ppa,
    koordinat: { lat: -8.48901, lng: 114.1827683 }
  },
  {
    id: 'P016', nip: 'NPA.05.85.12.13.002', nama: 'Mohamad Misbahkul Moenir',
    role: 'ppa', jabatan: 'Petugas Pintu Air',
    krosda: 'Bangorejo', kejuron: 'Karangdoro',
    pintu: 'B.BU.4, B.BU.5, B.BU.6',
    foto_pas: FOTO_PEGAWAI.hero_ppa,
    foto_hero: FOTO_PEGAWAI.hero_ppa,
    koordinat: { lat: -8.446503, lng: 114.1190317 }
  },
  {
    id: 'P017', nip: 'NPA.05.72.09.13.001', nama: 'Hartoyo',
    role: 'ppa', jabatan: 'Petugas Pintu Air',
    krosda: 'Bangorejo', kejuron: 'Bulurejo, Sidorejo',
    pintu: 'B.LU.1, B.LU.2, B.LU.3, B.LU.4',
    foto_pas: FOTO_PEGAWAI.hero_ppa,
    foto_hero: FOTO_PEGAWAI.hero_ppa,
    koordinat: { lat: -8.4715463, lng: 114.1790383 }
  },
  {
    id: 'P018', nip: 'NPA.05.70.09.13.005', nama: 'Saekoni',
    role: 'ppa', jabatan: 'Petugas Pintu Air',
    krosda: 'Bangorejo', kejuron: 'Bangorejo',
    pintu: 'B.GO.1, B.GO.2, B.GO.3, B.GS.1',
    foto_pas: FOTO_PEGAWAI.hero_ppa,
    foto_hero: FOTO_PEGAWAI.hero_ppa,
    koordinat: { lat: -8.4614068, lng: 114.1657998 }
  },

  // ============ PEKARYA PENGAIRAN — 15 sampel ============
  {
    id: 'P019', nip: 'NPK.05.91.14.13.016', nama: 'Aris Sucahyo',
    role: 'pekarya', jabatan: 'Pekarya Pengairan',
    krosda: 'Bangorejo', kejuron: 'Temurejo',
    ruas: 'Sekunder Glagahagung - B.BGA. 2c - B.BGA. 2f',
    foto_pas: FOTO_PEGAWAI.hero_pekarya,
    foto_hero: FOTO_PEGAWAI.hero_pekarya,
    koordinat: { lat: -8.52312, lng: 114.20288 }
  },
  {
    id: 'P020', nip: 'NPK.05.97.26.13.001', nama: 'Ayis Choirul Anam',
    role: 'pekarya', jabatan: 'Pekarya Pengairan',
    krosda: 'Bangorejo', kejuron: 'Karangdoro',
    ruas: 'Primer Baru - B.BU. 5a - B.BU. 5',
    foto_pas: FOTO_PEGAWAI.hero_pekarya,
    foto_hero: FOTO_PEGAWAI.hero_pekarya,
    koordinat: { lat: -8.446503, lng: 114.1190317 }
  },
  {
    id: 'P021', nip: 'NPK.05.81.09.13.002', nama: 'Bonawan',
    role: 'pekarya', jabatan: 'Pekarya Pengairan',
    krosda: 'Bangorejo', kejuron: 'Karangdoro',
    ruas: 'Primer Baru - B.BU. 3b - B.BU. 5a',
    foto_pas: FOTO_PEGAWAI.hero_pekarya,
    foto_hero: FOTO_PEGAWAI.hero_pekarya,
    koordinat: { lat: -8.446503, lng: 114.1190317 }
  },
  {
    id: 'P022', nip: 'NPK.05.98.23.13.003', nama: 'Cahyo Budi Prasetyo',
    role: 'pekarya', jabatan: 'Pekarya Pengairan',
    krosda: 'Bangorejo', kejuron: 'Bulurejo',
    ruas: 'Sekunder Bulurejo - B.BLU. 1a - B.BLU. 2c',
    foto_pas: FOTO_PEGAWAI.hero_pekarya,
    foto_hero: FOTO_PEGAWAI.hero_pekarya,
    koordinat: { lat: -8.4715463, lng: 114.1790383 }
  },
  {
    id: 'P023', nip: 'NPK.05.93.17.13.050', nama: 'Dedy Kurniawan',
    role: 'pekarya', jabatan: 'Pekarya Pengairan',
    krosda: 'Bangorejo', kejuron: 'Karangdoro',
    ruas: 'Primer Baru - B.BU. 1a - B.BU. 3b',
    foto_pas: FOTO_PEGAWAI.hero_pekarya,
    foto_hero: FOTO_PEGAWAI.hero_pekarya,
    koordinat: { lat: -8.4417101, lng: 114.1010505 }
  },
  {
    id: 'P024', nip: 'NPK.05.81.22.13.038', nama: 'Defa Heri Atama',
    role: 'pekarya', jabatan: 'Pekarya Pengairan',
    krosda: 'Bangorejo', kejuron: 'Karangdoro',
    ruas: 'Primer Baru - B.BU. 5 - B.BU. 6',
    foto_pas: FOTO_PEGAWAI.hero_pekarya,
    foto_hero: FOTO_PEGAWAI.hero_pekarya,
    koordinat: { lat: -8.446503, lng: 114.1190317 }
  },
  {
    id: 'P025', nip: 'NPK.05.74.19.13.010', nama: 'Haris Hariyadi',
    role: 'pekarya', jabatan: 'Pekarya Pengairan',
    krosda: 'Bangorejo', kejuron: 'Bangorejo',
    ruas: 'Sekunder Bangorejo - B.BGO. 1a - B.BGO. 3',
    foto_pas: FOTO_PEGAWAI.hero_pekarya,
    foto_hero: FOTO_PEGAWAI.hero_pekarya,
    koordinat: { lat: -8.4614068, lng: 114.1657998 }
  },
  {
    id: 'P026', nip: 'NPK.05.86.08.13.013', nama: 'Heru Supriyadi',
    role: 'pekarya', jabatan: 'Pekarya Pengairan',
    krosda: 'Bangorejo', kejuron: 'Sambirejo',
    ruas: 'Sekunder Sambirejo - B.SBI. 1a - B.SBI. 1',
    foto_pas: FOTO_PEGAWAI.hero_pekarya,
    foto_hero: FOTO_PEGAWAI.hero_pekarya,
    koordinat: { lat: -8.48901, lng: 114.1827683 }
  },
  {
    id: 'P027', nip: 'NPK.05.84.20.13.022', nama: 'Jamalul Ikhsan',
    role: 'pekarya', jabatan: 'Pekarya Pengairan',
    krosda: 'Bangorejo', kejuron: 'Sidorejo',
    ruas: 'Sekunder Wringinpitu - B.WPT. 1a - B.WPT. 3c',
    foto_pas: FOTO_PEGAWAI.hero_pekarya,
    foto_hero: FOTO_PEGAWAI.hero_pekarya,
    koordinat: { lat: -8.4960029, lng: 114.2684359 }
  },
  {
    id: 'P028', nip: 'NPK.05.79.19.13.018', nama: 'Mahropin',
    role: 'pekarya', jabatan: 'Pekarya Pengairan',
    krosda: 'Bangorejo', kejuron: 'Temurejo',
    ruas: 'Sekunder Glagahagung - B.BGA. 4c - B.BGA. 5e',
    foto_pas: FOTO_PEGAWAI.hero_pekarya,
    foto_hero: FOTO_PEGAWAI.hero_pekarya,
    koordinat: { lat: -8.52312, lng: 114.20288 }
  },
  {
    id: 'P029', nip: 'NPK.05.69.13.13.020', nama: "Mohammad Rifa'i",
    role: 'pekarya', jabatan: 'Pekarya Pengairan',
    krosda: 'Bangorejo', kejuron: 'Sidorejo',
    ruas: 'Sekunder Sidorejo - B.SDO. 0 - B.SDO. 2',
    foto_pas: FOTO_PEGAWAI.hero_pekarya,
    foto_hero: FOTO_PEGAWAI.hero_pekarya,
    koordinat: { lat: -8.49397, lng: 114.2372633 }
  },
  {
    id: 'P030', nip: 'NPK.05.71.09.13.009', nama: 'Misdianto',
    role: 'pekarya', jabatan: 'Pekarya Pengairan',
    krosda: 'Bangorejo', kejuron: 'Karangdoro',
    ruas: 'Sekunder Barurejo - BRO. 1a - BRO. 3',
    foto_pas: FOTO_PEGAWAI.hero_pekarya,
    foto_hero: FOTO_PEGAWAI.hero_pekarya,
    koordinat: { lat: -8.4479157, lng: 114.1004075 }
  },
  {
    id: 'P031', nip: 'NPK.05.87.09.13.015', nama: 'Mursikat',
    role: 'pekarya', jabatan: 'Pekarya Pengairan',
    krosda: 'Bangorejo', kejuron: 'Temurejo',
    ruas: 'Sekunder Glagahagung - B.BGA. 1a - B.BGA. 2c',
    foto_pas: FOTO_PEGAWAI.hero_pekarya,
    foto_hero: FOTO_PEGAWAI.hero_pekarya,
    koordinat: { lat: -8.52312, lng: 114.20288 }
  },
  {
    id: 'P032', nip: 'NPK.05.89.09.13.006', nama: 'Nurkholis',
    role: 'pekarya', jabatan: 'Pekarya Pengairan',
    krosda: 'Bangorejo', kejuron: 'Bangorejo',
    ruas: 'Primer Baru - B.BU. 6a - B.BU. 7a',
    foto_pas: FOTO_PEGAWAI.hero_pekarya,
    foto_hero: FOTO_PEGAWAI.hero_pekarya,
    koordinat: { lat: -8.4689394, lng: 114.1567031 }
  },
  {
    id: 'P033', nip: 'NPK.05.75.11.13.040', nama: 'Priyo Suwarso',
    role: 'pekarya', jabatan: 'Pekarya Pengairan',
    krosda: 'Bangorejo', kejuron: 'Sambirejo',
    ruas: 'Sekunder Sambirejo - B.SBI. 1 - B.SBI. 7',
    foto_pas: FOTO_PEGAWAI.hero_pekarya,
    foto_hero: FOTO_PEGAWAI.hero_pekarya,
    koordinat: { lat: -8.48901, lng: 114.1827683 }
  }
];

/* ---------- Presensi dummy (bulan ini) ---------- */
function generatePresensiDummy() {
  const out = [];
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    if (d.getDay() === 0 || d.getDay() === 6) continue;
    const sample = PEGAWAI[Math.floor(Math.random() * PEGAWAI.length)];
    const masuk = new Date(d); masuk.setHours(6, 30 + Math.floor(Math.random() * 60));
    const keluar = new Date(d); keluar.setHours(15, 30 + Math.floor(Math.random() * 60));
    const jarak = Math.floor(Math.random() * 300);
    out.push({
      id: 'PRS-' + isoDate(d) + '-' + sample.id,
      pegawaiId: sample.id,
      pegawaiNama: sample.nama,
      pegawaiFotoPas: sample.foto_pas,
      role: sample.role,
      krosda: sample.krosda,
      tanggal: isoDate(d),
      jamMasuk: masuk.toISOString(),
      jamKeluar: keluar.toISOString(),
      lat: sample.koordinat.lat + (Math.random() - 0.5) * 0.005,
      lng: sample.koordinat.lng + (Math.random() - 0.5) * 0.005,
      jarak: jarak,
      fotoMasuk: FOTO.selfie[i % FOTO.selfie.length],
      fotoLokasi: FOTO.lokasi[i % FOTO.lokasi.length],
      status: jarak > 200 ? 'pending' : 'verified',
      catatan: jarak > 200 ? 'Di luar radius — perlu verifikasi Korlap' : ''
    });
  }
  return out;
}

const PRESENSI = generatePresensiDummy();

/* ---------- Operasi pintu dummy (bulan ini) ---------- */
function generateOperasiDummy() {
  const out = [];
  const today = new Date();
  const jenis = ['buka', 'tutup', 'setengah'];
  for (let i = 0; i < 40; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - Math.floor(i / 2));
    const sample = PEGAWAI.filter(p => p.role === 'ppa')[i % 15];
    out.push({
      id: 'OPR-' + isoDate(d) + '-' + String(i + 1).padStart(3, '0'),
      pegawaiId: sample.id,
      pegawaiNama: sample.nama,
      pegawaiFotoPas: sample.foto_pas,
      krosda: sample.krosda,
      pintu: sample.pintu.split(',')[0].trim(),
      jenis: jenis[i % 3],
      tinggi: 50 + Math.floor(Math.random() * 150),
      debit: (1 + Math.random() * 5).toFixed(2),
      waktu: d.toISOString(),
      fotoSebelum: FOTO.lokasi[i % FOTO.lokasi.length],
      fotoSesudah: FOTO.lokasi[(i + 1) % FOTO.lokasi.length],
      saksi: 'Juru Pengairan ' + (i + 1),
      catatan: ''
    });
  }
  return out;
}

const OPERASI = generateOperasiDummy();

/* ---------- Pemeliharaan dummy (bulan ini) ---------- */
function generatePemeliharaanDummy() {
  const out = [];
  const today = new Date();
  const jenis = ['Babat rumput', 'Bersih sedimen', 'Perbaikan talud', 'Perbaikan bocoran', 'Pengecatan pintu'];
  const status = ['selesai', 'proses', 'belum'];
  for (let i = 0; i < 35; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - Math.floor(i / 1.5));
    const sample = PEGAWAI.filter(p => p.role === 'pekarya')[i % 15];
    out.push({
      id: 'PML-' + isoDate(d) + '-' + String(i + 1).padStart(3, '0'),
      pegawaiId: sample.id,
      pegawaiNama: sample.nama,
      pegawaiFotoPas: sample.foto_pas,
      krosda: sample.krosda,
      ruas: sample.ruas,
      jenis: jenis[i % 5],
      status: status[i % 3],
      foto: FOTO.lokasi[i % FOTO.lokasi.length],
      deskripsi: 'Pemeliharaan rutin ruas saluran',
      tanggal: isoDate(d)
    });
  }
  return out;
}

const PEMELIHARAAN = generatePemeliharaanDummy();

/* ---------- Laporan dummy ---------- */
function generateLaporanDummy() {
  const out = [];
  const today = new Date();
  const jenis = ['Operasi', 'Pemeliharaan', 'Inspeksi', 'Kerusakan', 'Keamanan'];
  const status = ['Menunggu', 'Diproses', 'Disetujui', 'Revisi'];
  const judul = [
    'Inspeksi rutin pintu air',
    'Pemeliharaan mesin hidrolik',
    'Kerusakan talud saluran',
    'Rekap debit harian',
    'Patroli keamanan bendungan',
    'Pemantauan sedimentasi',
    'Perbaikan bocoran saluran',
    'Babat rumput ruas sekunder'
  ];
  for (let i = 0; i < 25; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i * 2);
    const sample = PEGAWAI[Math.floor(Math.random() * PEGAWAI.length)];
    out.push({
      id: `LPB-${d.getFullYear()}-${String(100 + i).padStart(4, '0')}`,
      pegawaiId: sample.id,
      pegawaiNama: sample.nama,
      pegawaiFotoPas: sample.foto_pas,
      role: sample.role,
      krosda: sample.krosda,
      tanggal: isoDate(d),
      judul: judul[i % judul.length] + ' — ' + sample.kejuron.split(',')[0],
      jenis: jenis[i % 5],
      status: status[i % 4],
      lampiran: i % 3 === 0 ? 'laporan.pdf' : null,
      ukuran: i % 3 === 0 ? (1 + Math.random() * 3).toFixed(1) + ' MB' : null,
      deskripsi: 'Laporan kegiatan rutin TP-OP di wilayah kerja.'
    });
  }
  return out;
}

const LAPORAN = generateLaporanDummy();

/* ---------- HIPPA/GHIPPA dummy ---------- */
const HIPPA = [
  { id: 'H001', nama: 'HIPPA Sumber Rejeki', jenis: 'HIPPA', ketua: 'Slamet Riyadi', anggota: 120, luas: 85.5, krosda: 'Bangorejo', kejuron: 'Bulurejo', kontak: '0812-1111-2222' },
  { id: 'H002', nama: 'HIPPA Tani Makmur', jenis: 'HIPPA', ketua: 'Sutrisno', anggota: 95, luas: 62.0, krosda: 'Bangorejo', kejuron: 'Sidorejo', kontak: '0812-3333-4444' },
  { id: 'H003', nama: 'HIPPA Sri Rejeki', jenis: 'HIPPA', ketua: 'Wahyudi', anggota: 150, luas: 110.5, krosda: 'Cluring', kejuron: 'Cluring', kontak: '0812-5555-6666' },
  { id: 'H004', nama: 'GHIPPA Brantas Hilir', jenis: 'GHIPPA', ketua: 'H. Suparman', anggota: 450, luas: 320.0, krosda: 'Pesanggaran', kejuron: 'Pesanggaran', kontak: '0812-7777-8888' },
  { id: 'H005', nama: 'HIPPA Sumber Urip', jenis: 'HIPPA', ketua: 'Mulyono', anggota: 80, luas: 55.0, krosda: 'Cluring', kejuron: 'Sraten', kontak: '0812-9999-0000' }
];

/* ---------- Jadwal giling air dummy ---------- */
const JADWAL_GILING = [
  { id: 'JG001', hippaId: 'H001', hippaNama: 'HIPPA Sumber Rejeki', mulai: isoDate(new Date()), selesai: isoDate(new Date(Date.now() + 3 * 86400000)), debit: 2.5, status: 'berjalan' },
  { id: 'JG002', hippaId: 'H002', hippaNama: 'HIPPA Tani Makmur', mulai: isoDate(new Date(Date.now() + 4 * 86400000)), selesai: isoDate(new Date(Date.now() + 7 * 86400000)), debit: 2.0, status: 'dijadwalkan' },
  { id: 'JG003', hippaId: 'H003', hippaNama: 'HIPPA Sri Rejeki', mulai: isoDate(new Date(Date.now() + 8 * 86400000)), selesai: isoDate(new Date(Date.now() + 11 * 86400000)), debit: 3.0, status: 'dijadwalkan' }
];

/* ---------- Raport dummy (per jabatan) ---------- */
const INDIKATOR_RAPORT = {
  korlap: [
    { nama: 'Koordinasi dengan HIPPA/GHIPPA', bobot: 25 },
    { nama: 'Verifikasi laporan tim', bobot: 25 },
    { nama: 'Penanganan konflik air', bobot: 20 },
    { nama: 'Pelaporan ke BBWS', bobot: 20 },
    { nama: 'Inisiatif & inovasi', bobot: 10 }
  ],
  ppa: [
    { nama: 'Ketepatan waktu operasi pintu', bobot: 30 },
    { nama: 'Akurasi pencatatan debit', bobot: 25 },
    { nama: 'Kelengkapan dokumentasi', bobot: 20 },
    { nama: 'Kepatuhan jadwal giling', bobot: 15 },
    { nama: 'Keselamatan kerja', bobot: 10 }
  ],
  pekarya: [
    { nama: 'Panjang saluran terpelihara', bobot: 30 },
    { nama: 'Kualitas pekerjaan', bobot: 25 },
    { nama: 'Kecepatan respons kerusakan', bobot: 20 },
    { nama: 'Keselamatan kerja', bobot: 15 },
    { nama: 'Kerja sama tim', bobot: 10 }
  ]
};

/* ---------- Statistik dashboard per role ---------- */
const STATS_DASHBOARD = {
  korlap: { kejuron: 6, pintu: 45, tim: 30, laporanPending: 8, presensiPending: 3 },
  ppa: { pintu: 9, operasiHariIni: 4, laporanBulanIni: 18, kehadiran: 95 },
  pekarya: { ruas: 5, pemeliharaanBulanIni: 22, temuanKerusakan: 3, kehadiran: 92 }
};

/* ---------- Ekspor global ---------- */
window.DATA = {
  FOTO,
  FOTO_PEGAWAI,
  PEGAWAI,
  PRESENSI,
  OPERASI,
  PEMELIHARAAN,
  LAPORAN,
  HIPPA,
  JADWAL_GILING,
  INDIKATOR_RAPORT,
  STATS_DASHBOARD
};