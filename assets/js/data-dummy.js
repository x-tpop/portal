/* =================================================================
   data-dummy.js — Data lengkap 33 pegawai TP-OP BBWS Brantas
   Setiap pegawai punya 25+ field (kepegawaian, identitas, pendidikan,
   kontak, PPPK, dokumen) + foto_pas, foto_hero, foto_dinas
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

/* ---------- Foto Pegawai (3 slot) ---------- */
const FOTO_PEGAWAI = {
  // Foto pop-out hero (PNG transparan)
  hero_korlap:  'https://lh3.googleusercontent.com/d/1UYYjsfyhWPkNPaAB2Pq-ntO0gQAuyJqx',
  hero_ppa:     'https://lh3.googleusercontent.com/d/1WTXmLAlzh2XZg4Mo-YfwCd1L0I2ssYJC',
  hero_pekarya: 'https://lh3.googleusercontent.com/d/19_kKwCaFzj0OQvtZZIGiC3hNQp6evZed',
  // Foto pas (formal)
  pas_default:  'https://i.pravatar.cc/300'
};

/* ---------- Helper: generate 33 pegawai dengan field lengkap ---------- */
function buildPegawai(id, nip, nama, role, jabatan, krosda, kejuron, opts = {}) {
  const fotoHeroKey = role === 'korlap' ? 'hero_korlap' : role === 'ppa' ? 'hero_ppa' : 'hero_pekarya';
  const jenisKelamin = opts.jk || 'Pria';
  const tglLahir = opts.tgl || '1985-01-01';

  return {
    // ===== ID & ROLE =====
    id,
    nip,
    nama,
    role,
    jabatan,
    krosda,
    kejuron,
    lokasi: kejuron,

    // ===== FOTO =====
    foto_pas: opts.foto_pas || FOTO_PEGAWAI.pas_default,
    foto_hero: FOTO_PEGAWAI[fotoHeroKey],
    foto_dinas: opts.foto_dinas || FOTO_PEGAWAI[fotoHeroKey],

    // ===== KEPEGAWAIAN =====
    tmt_kontrak: opts.tmt_kontrak || '2024-01-15',
    status_pegawai: 'TP-OP Aktif',
    masa_kerja: '3 tahun',

    // ===== IDENTITAS (KTP) =====
    nik: opts.nik || generateNIK(id),
    nama_ktp: nama.toUpperCase(),
    tempat_lahir: opts.tempat_lahir || 'Banyuwangi',
    tanggal_lahir: tglLahir,
    jenis_kelamin: jenisKelamin,
    agama: opts.agama || 'Islam',
    status_perkawinan: opts.status_perkawinan || 'Kawin',
    tinggi_badan: opts.tinggi_badan || 170,
    golongan_darah: opts.golongan_darah || '-',

    // ===== PENDIDIKAN =====
    gelar_depan: opts.gelar_depan || '-',
    gelar_belakang: opts.gelar_belakang || '-',
    nama_ijazah: nama.toUpperCase(),
    sekolah: opts.sekolah || 'SMK Negeri 1 Glagah Banyuwangi',
    pendidikan: opts.pendidikan || 'SLTA/SMA Sederajat',
    jurusan: opts.jurusan || 'Teknik Mesin',
    tahun_lulus: opts.tahun_lulus || 2003,
    no_ijazah: opts.no_ijazah || 'DN-05 Mk ' + (400000 + Math.floor(Math.random() * 99999)),
    tanggal_ijazah: opts.tanggal_ijazah || `${opts.tahun_lulus || 2003}-06-05`,
    ipk: opts.ipk || 83.22,

    // ===== KONTAK =====
    alamat: opts.alamat || `DSN YOSOWINANGUN RT 007 / RW 001, DS ${kejuron.split(',')[0]}, KEC ${krosda.toUpperCase()}`,
    kab_kota: opts.kab_kota || 'Banyuwangi',
    provinsi: opts.provinsi || 'Jawa Timur',
    no_hp: opts.no_hp || '0822-' + (50000000 + Math.floor(Math.random() * 9999999)),
    no_telp: opts.no_telp || '0822-' + (50000000 + Math.floor(Math.random() * 9999999)),
    email: opts.email || `${nama.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
    email_dinas: opts.email_dinas || `${nama.toLowerCase().replace(/\s+/g, '.')}@bbwsbrantas.go.id`,

    // ===== KONTAK DARURAT =====
    kontak_darurat_nama: opts.kontak_darurat_nama || 'Ibu Siti',
    kontak_darurat_hubungan: opts.kontak_darurat_hubungan || 'Istri',
    kontak_darurat_hp: opts.kontak_darurat_hp || '0812-' + (30000000 + Math.floor(Math.random() * 9999999)),

    // ===== PPPK =====
    jenis_seleksi: opts.jenis_seleksi || 'PPPK Teknis',
    instansi_pppk: opts.instansi_pppk || 'Pemerintah Provinsi Jawa Timur',
    formasi: opts.formasi || 'Operator Layanan Operasional (Khusus)',
    lokasi_formasi: opts.lokasi_formasi || 'PEMERINTAH PROVINSI JAWA TIMUR | JABATAN PELAKSANA',
    lokasi_test: opts.lokasi_test || 'Graha Unesa Surabaya',
    tahun_seleksi: opts.tahun_seleksi || 2024,
    database_bkn: opts.database_bkn || 'Kode R3',

    // ===== DOKUMEN =====
    npwp: opts.npwp || '12.345.678.9-012.000',
    bpjs: opts.bpjs || '000' + (1000000000 + Math.floor(Math.random() * 999999999)),
    bank_nama: opts.bank_nama || 'BRI',
    bank_rekening: opts.bank_rekening || '1234-5678-9012-' + (1000 + Math.floor(Math.random() * 8999)),

    // ===== KOORDINAT =====
    koordinat: opts.koordinat || { lat: -8.4839932, lng: 114.194848 }
  };
}

/* ---------- Helper: generate NIK (16 digit) ---------- */
function generateNIK(id) {
  const base = '351007210384';
  const suffix = String(id).padStart(4, '0');
  return base + suffix;
}

/* =================================================================
   33 PEGAWAI TP-OP
   ================================================================= */
const PEGAWAI = [
  // ============ STAF PENGAMAT (KORLAP) — 3 ============
  buildPegawai(
    'P001', 'NSP.05.84.15.13.027', 'Abdul Rahman Yusuf', 'korlap', 'Staf Pengamat',
    'Bangorejo', 'Karangdoro, Bulurejo, Temurejo, Sambirejo, Sidorejo',
    {
      tgl: '1984-03-21', tempat_lahir: 'Banyuwangi',
      sekolah: 'SMK Negeri 1 Glagah Banyuwangi', jurusan: 'Teknik Mesin',
      tahun_lulus: 2003, no_ijazah: 'DN-05 Mk 0438147',
      tanggal_ijazah: '2003-06-05', ipk: 83.22,
      tinggi_badan: 172, no_hp: '082255502226', no_telp: '082255502226',
      email: 'officeyusuf@gmail.com',
      alamat: 'DSN YOSOWINANGUN RT 007 / RW 001, DS JAJAG, KEC GAMBIRAN',
      koordinat: { lat: -8.4839932, lng: 114.194848 }
    }
  ),
  buildPegawai(
    'P002', 'NSP.05.76.09.13.002', 'Eko Adi Purwanto', 'korlap', 'Staf Pengamat',
    'Cluring', 'Cluring, Sraten, Kradenan, Benculuk, Tambakrejo, Plampangrejo',
    { tgl: '1976-08-19', tempat_lahir: 'Banyuwangi', tahun_lulus: 1995, koordinat: { lat: -8.47, lng: 114.25 } }
  ),
  buildPegawai(
    'P003', 'NSP.05.77.19.13.005', 'Wiwit Rahmad Hidayat', 'korlap', 'Staf Pengamat',
    'Pesanggaran', 'Kebondalem, Yudomulyo, Siliragung, Pesanggaran, Sumberagung',
    { tgl: '1977-05-25', tempat_lahir: 'Banyuwangi', tahun_lulus: 1996, jurusan: 'Listrik', koordinat: { lat: -8.55, lng: 114.10 } }
  ),

  // ============ PETUGAS PINTU AIR (PPA) — 15 ============
  buildPegawai('P004', 'NPA.05.86.09.13.016', 'Agus Riyadi', 'ppa', 'Petugas Pintu Air',
    'Bangorejo', 'Bulurejo',
    { tgl: '1986-08-20', tahun_lulus: 2005, koordinat: { lat: -8.4839932, lng: 114.194848 } }
  ),
  buildPegawai('P005', 'NPA.05.78.09.13.013', 'Anang Sujarwoko', 'ppa', 'Petugas Pintu Air',
    'Bangorejo', 'Sidorejo',
    { tgl: '1978-03-31', tahun_lulus: 1996, koordinat: { lat: -8.49397, lng: 114.2372633 } }
  ),
  buildPegawai('P006', 'NPA.05.86.07.13.007', 'Arif Evaruli', 'ppa', 'Petugas Pintu Air',
    'Bangorejo', 'Bulurejo',
    { tgl: '1986-10-15', tahun_lulus: 2005, jurusan: 'Listrik', koordinat: { lat: -8.4723064, lng: 114.1798009 } }
  ),
  buildPegawai('P007', 'NPA.05.87.12.13.014', 'Ariyanto', 'ppa', 'Petugas Pintu Air',
    'Bangorejo', 'Sidorejo',
    { tgl: '1987-03-05', tahun_lulus: 2006, jurusan: 'Otomotif', koordinat: { lat: -8.4921518, lng: 114.2578408 } }
  ),
  buildPegawai('P008', 'NPA.05.76.09.13.015', 'Bambang Subiarto', 'ppa', 'Petugas Pintu Air',
    'Bangorejo', 'Sidorejo',
    { tgl: '1976-05-12', tahun_lulus: 1994, koordinat: { lat: -8.4960029, lng: 114.2684359 } }
  ),
  buildPegawai('P009', 'NPA.05.91.13.13.011', 'Deni Kristiawan', 'ppa', 'Petugas Pintu Air',
    'Bangorejo', 'Temurejo',
    { tgl: '1991-02-27', tahun_lulus: 2009, koordinat: { lat: -8.52312, lng: 114.20288 } }
  ),
  buildPegawai('P010', 'NPA.05.87.12.13.004', 'Edi Susanto', 'ppa', 'Petugas Pintu Air',
    'Bangorejo', 'Karangdoro',
    { tgl: '1987-08-13', tahun_lulus: 2006, koordinat: { lat: -8.4479157, lng: 114.1004075 } }
  ),
  buildPegawai('P011', 'NPA.05.91.12.13.001', 'Imam Taufik', 'ppa', 'Petugas Pintu Air',
    'Bangorejo', 'Karangdoro',
    { tgl: '1991-10-30', tahun_lulus: 2013, koordinat: { lat: -8.4417101, lng: 114.1010505 } }
  ),
  buildPegawai('P012', 'NPA.05.70.11.13.010', 'Imam Suwarno', 'ppa', 'Petugas Pintu Air',
    'Bangorejo', 'Temurejo',
    { tgl: '1970-09-13', tahun_lulus: 1990, jurusan: 'Tata Usaha', koordinat: { lat: -8.4948827, lng: 114.1927711 } }
  ),
  buildPegawai('P013', 'NPA.05.71.12.13.003', 'Jamari', 'ppa', 'Petugas Pintu Air',
    'Bangorejo', 'Bangorejo',
    { tgl: '1971-01-28', tahun_lulus: 2019, koordinat: { lat: -8.4689394, lng: 114.1567031 } }
  ),
  buildPegawai('P014', 'NPA.05.77.12.13.009', 'Joko Supono', 'ppa', 'Petugas Pintu Air',
    'Bangorejo', 'Sambirejo',
    { tgl: '1977-03-29', tahun_lulus: 1994, koordinat: { lat: -8.515205, lng: 114.171125 } }
  ),
  buildPegawai('P015', 'NPA.05.87.11.13.008', 'Joko Susanto', 'ppa', 'Petugas Pintu Air',
    'Bangorejo', 'Sambirejo',
    { tgl: '1987-06-20', tahun_lulus: 2005, jurusan: 'Otomotif', koordinat: { lat: -8.48901, lng: 114.1827683 } }
  ),
  buildPegawai('P016', 'NPA.05.85.12.13.002', 'Mohamad Misbahkul Moenir', 'ppa', 'Petugas Pintu Air',
    'Bangorejo', 'Karangdoro',
    { tgl: '1985-09-20', tahun_lulus: 2004, koordinat: { lat: -8.446503, lng: 114.1190317 } }
  ),
  buildPegawai('P017', 'NPA.05.72.09.13.001', 'Hartoyo', 'ppa', 'Petugas Pintu Air',
    'Bangorejo', 'Bulurejo, Sidorejo',
    { tgl: '1972-06-06', tahun_lulus: 1992, koordinat: { lat: -8.4715463, lng: 114.1790383 } }
  ),
  buildPegawai('P018', 'NPA.05.70.09.13.005', 'Saekoni', 'ppa', 'Petugas Pintu Air',
    'Bangorejo', 'Bangorejo',
    { tgl: '1970-04-24', tahun_lulus: 2019, koordinat: { lat: -8.4614068, lng: 114.1657998 } }
  ),

  // ============ PEKARYA PENGAIRAN — 15 ============
  buildPegawai('P019', 'NPK.05.91.14.13.016', 'Aris Sucahyo', 'pekarya', 'Pekarya Pengairan',
    'Bangorejo', 'Temurejo',
    { tgl: '1991-07-09', tahun_lulus: 2009, koordinat: { lat: -8.52312, lng: 114.20288 } }
  ),
  buildPegawai('P020', 'NPK.05.97.26.13.001', 'Ayis Choirul Anam', 'pekarya', 'Pekarya Pengairan',
    'Bangorejo', 'Karangdoro',
    { tgl: '1997-03-01', tahun_lulus: 2015, koordinat: { lat: -8.446503, lng: 114.1190317 } }
  ),
  buildPegawai('P021', 'NPK.05.81.09.13.002', 'Bonawan', 'pekarya', 'Pekarya Pengairan',
    'Bangorejo', 'Karangdoro',
    { tgl: '1981-07-25', tahun_lulus: 2023, koordinat: { lat: -8.446503, lng: 114.1190317 } }
  ),
  buildPegawai('P022', 'NPK.05.98.23.13.003', 'Cahyo Budi Prasetyo', 'pekarya', 'Pekarya Pengairan',
    'Bangorejo', 'Bulurejo',
    { tgl: '1998-06-09', tahun_lulus: 2016, koordinat: { lat: -8.4715463, lng: 114.1790383 } }
  ),
  buildPegawai('P023', 'NPK.05.93.17.13.050', 'Dedy Kurniawan', 'pekarya', 'Pekarya Pengairan',
    'Bangorejo', 'Karangdoro',
    { tgl: '1993-09-08', tahun_lulus: 2012, koordinat: { lat: -8.4417101, lng: 114.1010505 } }
  ),
  buildPegawai('P024', 'NPK.05.81.22.13.038', 'Defa Heri Atama', 'pekarya', 'Pekarya Pengairan',
    'Bangorejo', 'Karangdoro',
    { tgl: '1981-12-20', tahun_lulus: 2000, koordinat: { lat: -8.446503, lng: 114.1190317 } }
  ),
  buildPegawai('P025', 'NPK.05.74.19.13.010', 'Haris Hariyadi', 'pekarya', 'Pekarya Pengairan',
    'Bangorejo', 'Bangorejo',
    { tgl: '1974-09-11', tahun_lulus: 1993, jurusan: 'Teknik Mesin', koordinat: { lat: -8.4614068, lng: 114.1657998 } }
  ),
  buildPegawai('P026', 'NPK.05.86.08.13.013', 'Heru Supriyadi', 'pekarya', 'Pekarya Pengairan',
    'Bangorejo', 'Sambirejo',
    { tgl: '1986-11-22', tahun_lulus: 2014, koordinat: { lat: -8.48901, lng: 114.1827683 } }
  ),
  buildPegawai('P027', 'NPK.05.84.20.13.022', 'Jamalul Ikhsan', 'pekarya', 'Pekarya Pengairan',
    'Bangorejo', 'Sidorejo',
    { tgl: '1984-07-18', tahun_lulus: 2003, koordinat: { lat: -8.4960029, lng: 114.2684359 } }
  ),
  buildPegawai('P028', 'NPK.05.79.19.13.018', 'Mahropin', 'pekarya', 'Pekarya Pengairan',
    'Bangorejo', 'Temurejo',
    { tgl: '1979-08-04', tahun_lulus: 1997, koordinat: { lat: -8.52312, lng: 114.20288 } }
  ),
  buildPegawai('P029', 'NPK.05.69.13.13.020', "Mohammad Rifa'i", 'pekarya', 'Pekarya Pengairan',
    'Bangorejo', 'Sidorejo',
    { tgl: '1969-07-18', tahun_lulus: 1988, koordinat: { lat: -8.49397, lng: 114.2372633 } }
  ),
  buildPegawai('P030', 'NPK.05.71.09.13.009', 'Misdianto', 'pekarya', 'Pekarya Pengairan',
    'Bangorejo', 'Karangdoro',
    { tgl: '1971-09-15', tahun_lulus: 1991, koordinat: { lat: -8.4479157, lng: 114.1004075 } }
  ),
  buildPegawai('P031', 'NPK.05.87.09.13.015', 'Mursikat', 'pekarya', 'Pekarya Pengairan',
    'Bangorejo', 'Temurejo',
    { tgl: '1987-05-21', tahun_lulus: 2000, pendidikan: 'SD', jurusan: '-', koordinat: { lat: -8.52312, lng: 114.20288 } }
  ),
  buildPegawai('P032', 'NPK.05.89.09.13.006', 'Nurkholis', 'pekarya', 'Pekarya Pengairan',
    'Bangorejo', 'Bangorejo',
    { tgl: '1989-10-15', tahun_lulus: 2008, koordinat: { lat: -8.4689394, lng: 114.1567031 } }
  ),
  buildPegawai('P033', 'NPK.05.75.11.13.040', 'Priyo Suwarso', 'pekarya', 'Pekarya Pengairan',
    'Bangorejo', 'Sambirejo',
    { tgl: '1975-10-17', tahun_lulus: 1994, koordinat: { lat: -8.48901, lng: 114.1827683 } }
  )
];

/* =================================================================
   DATA OPERASIONAL (Presensi, Operasi, Pemeliharaan, Laporan)
   ================================================================= */

/* ---------- Presensi dummy ---------- */
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

/* ---------- Operasi pintu dummy ---------- */
function generateOperasiDummy() {
  const out = [];
  const today = new Date();
  const jenis = ['buka', 'tutup', 'setengah'];
  const ppaList = PEGAWAI.filter(p => p.role === 'ppa');
  for (let i = 0; i < 40; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - Math.floor(i / 2));
    const sample = ppaList[i % ppaList.length];
    out.push({
      id: 'OPR-' + isoDate(d) + '-' + String(i + 1).padStart(3, '0'),
      pegawaiId: sample.id,
      pegawaiNama: sample.nama,
      pegawaiFotoPas: sample.foto_pas,
      krosda: sample.krosda,
      pintu: sample.kejuron.split(',')[0].trim(),
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

/* ---------- Pemeliharaan dummy ---------- */
function generatePemeliharaanDummy() {
  const out = [];
  const today = new Date();
  const jenis = ['Babat rumput', 'Bersih sedimen', 'Perbaikan talud', 'Perbaikan bocoran', 'Pengecatan pintu'];
  const status = ['selesai', 'proses', 'belum'];
  const pekaryaList = PEGAWAI.filter(p => p.role === 'pekarya');
  for (let i = 0; i < 35; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - Math.floor(i / 1.5));
    const sample = pekaryaList[i % pekaryaList.length];
    out.push({
      id: 'PML-' + isoDate(d) + '-' + String(i + 1).padStart(3, '0'),
      pegawaiId: sample.id,
      pegawaiNama: sample.nama,
      pegawaiFotoPas: sample.foto_pas,
      krosda: sample.krosda,
      ruas: sample.kejuron.split(',')[0].trim(),
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

/* ---------- HIPPA/GHIPPA ---------- */
const HIPPA = [
  { id: 'H001', nama: 'HIPPA Sumber Rejeki', jenis: 'HIPPA', ketua: 'Slamet Riyadi', anggota: 120, luas: 85.5, krosda: 'Bangorejo', kejuron: 'Bulurejo', kontak: '0812-1111-2222' },
  { id: 'H002', nama: 'HIPPA Tani Makmur', jenis: 'HIPPA', ketua: 'Sutrisno', anggota: 95, luas: 62.0, krosda: 'Bangorejo', kejuron: 'Sidorejo', kontak: '0812-3333-4444' },
  { id: 'H003', nama: 'HIPPA Sri Rejeki', jenis: 'HIPPA', ketua: 'Wahyudi', anggota: 150, luas: 110.5, krosda: 'Cluring', kejuron: 'Cluring', kontak: '0812-5555-6666' },
  { id: 'H004', nama: 'GHIPPA Brantas Hilir', jenis: 'GHIPPA', ketua: 'H. Suparman', anggota: 450, luas: 320.0, krosda: 'Pesanggaran', kejuron: 'Pesanggaran', kontak: '0812-7777-8888' },
  { id: 'H005', nama: 'HIPPA Sumber Urip', jenis: 'HIPPA', ketua: 'Mulyono', anggota: 80, luas: 55.0, krosda: 'Cluring', kejuron: 'Sraten', kontak: '0812-9999-0000' }
];

const JADWAL_GILING = [
  { id: 'JG001', hippaId: 'H001', hippaNama: 'HIPPA Sumber Rejeki', mulai: isoDate(new Date()), selesai: isoDate(new Date(Date.now() + 3 * 86400000)), debit: 2.5, status: 'berjalan' },
  { id: 'JG002', hippaId: 'H002', hippaNama: 'HIPPA Tani Makmur', mulai: isoDate(new Date(Date.now() + 4 * 86400000)), selesai: isoDate(new Date(Date.now() + 7 * 86400000)), debit: 2.0, status: 'dijadwalkan' },
  { id: 'JG003', hippaId: 'H003', hippaNama: 'HIPPA Sri Rejeki', mulai: isoDate(new Date(Date.now() + 8 * 86400000)), selesai: isoDate(new Date(Date.now() + 11 * 86400000)), debit: 3.0, status: 'dijadwalkan' }
];

/* ---------- Statistik dashboard per role ---------- */
const STATS_DASHBOARD = {
  korlap: { kejuron: 6, pintu: 45, tim: 30, laporanPending: 8, presensiPending: 3 },
  ppa: { pintu: 9, operasiHariIni: 4, laporanBulanIni: 18, kehadiran: 95 },
  pekarya: { ruas: 5, pemeliharaanBulanIni: 22, temuanKerusakan: 3, kehadiran: 92 }
};

/* ---------- Indikator Raport per role ---------- */
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