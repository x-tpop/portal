/* =================================================================
   profil.js — Profil Pegawai dengan 6 Tab + Edit Mode
   - Tab: Kepegawaian | Identitas | Pendidikan | Kontak | PPPK | Foto & Dokumen
   - Edit mode: semua field editable kecuali NIP & NIK
   - Simpan ke localStorage
   - NIK masking: 35100721****0006
   - 3 slot foto: pas, hero, dinas
   - Timeline kontribusi & portofolio kinerja
   ================================================================= */

const Profil = {
  pegawai: null,
  originalData: null,
  isEditing: false,
  activeTab: 'kepegawaian',

  /* ============================================================
     RENDER UTAMA
     ============================================================ */
  async render() {
    const session = Auth.getSession();
    const pegawai = Auth.getPegawaiAktif();

    if (!pegawai) {
      document.getElementById('profilLeft').innerHTML = `
        <div class="card"><div class="empty"><i data-lucide="user-x"></i>Data pegawai tidak ditemukan</div></div>`;
      if (window.lucide) lucide.createIcons();
      return;
    }

    // Ambil data dari localStorage kalau ada (hasil edit sebelumnya)
    const savedData = this.loadFromStorage(pegawai.id);
    this.pegawai = savedData ? { ...pegawai, ...savedData } : { ...pegawai };
    this.originalData = { ...this.pegawai };

    this.renderLeft(this.pegawai);
    this.renderBiodata(this.pegawai);
    this.renderTimeline(this.pegawai);
    this.renderPortofolio(this.pegawai);

    if (window.lucide) lucide.createIcons();
  },

  /* ============================================================
     KARTU PEGAWAI (KIRI)
     ============================================================ */
  renderLeft(pegawai) {
    const el = document.getElementById('profilLeft');
    if (!el) return;

    const roleLabel = {
      korlap: 'Staf Pengamat (Korlap)',
      ppa: 'Petugas Pintu Air (PPA)',
      pekarya: 'Pekarya Pengairan'
    }[pegawai.role] || 'TP-OP';

    el.innerHTML = `
      <div class="profil-card">
        <span class="kicker">Kartu Pegawai</span>

        <div class="profil-avatar-wrap">
          <img id="profilAvatar" src="${pegawai.foto_hero || pegawai.foto_pas || 'https://i.pravatar.cc/300'}" alt="">
          <label class="pa-edit" for="profilFotoInput" title="Ubah foto hero">
            <i data-lucide="camera"></i>
            <input type="file" id="profilFotoInput" accept="image/*" hidden>
          </label>
        </div>

        <h3>${pegawai.nama}</h3>
        <p class="profil-role">${roleLabel}</p>

        <div class="profil-chips">
          <span class="meta-chip mono"><i data-lucide="fingerprint"></i>${pegawai.nip}</span>
          <span class="meta-chip"><i data-lucide="shield-check"></i>${pegawai.status_pegawai || 'TP-OP Aktif'}</span>
        </div>

        <ul class="profil-meta">
          <li><i data-lucide="building-2"></i>Krosda ${pegawai.krosda || '—'}</li>
          <li><i data-lucide="map-pin"></i>${pegawai.kejuron || '—'}</li>
          <li><i data-lucide="calendar"></i>Kontrak sejak ${pegawai.tmt_kontrak ? pegawai.tmt_kontrak.substring(0, 4) : '2024'}</li>
          <li><i data-lucide="clock"></i>Masa kerja ${pegawai.masa_kerja || '3 tahun'}</li>
        </ul>

        <button class="btn btn-ghost btn-block" style="margin-top:18px" id="btnLogoutProfil">
          <i data-lucide="log-out"></i> Keluar
        </button>
      </div>`;

    // Bind ganti foto hero
    document.getElementById('profilFotoInput')?.addEventListener('change', (e) => {
      this.gantiFoto(e.target.files[0], 'foto_hero', 'profilAvatar');
    });

    document.getElementById('btnLogoutProfil')?.addEventListener('click', () => Auth.logout());
  },

  /* ============================================================
     BIODATA — 6 TAB
     ============================================================ */
  renderBiodata(pegawai) {
    const el = document.getElementById('profilRight');
    if (!el) return;

    el.innerHTML = `
      <div class="biodata-panel" id="biodataPanel">

        <!-- Header dengan tombol edit -->
        <div class="biodata-head">
          <h3>Biodata Lengkap</h3>
          <div class="biodata-head-actions">
            <button class="btn btn-ghost sm" id="btnCancelEdit" hidden>
              <i data-lucide="rotate-ccw"></i> Batal
            </button>
            <button class="btn btn-ghost sm" id="btnEditBiodata">
              <i data-lucide="pencil"></i> Edit Biodata
            </button>
            <button class="btn btn-blue sm" id="btnSaveBiodata" hidden>
              <i data-lucide="save"></i> Simpan
            </button>
          </div>
        </div>

        <!-- Tab Navigation -->
        <div class="biodata-tabs" id="biodataTabs">
          <button class="bt-tab on" data-tab="kepegawaian">
            <i data-lucide="badge-check"></i> Kepegawaian
          </button>
          <button class="bt-tab" data-tab="identitas">
            <i data-lucide="user"></i> Identitas
          </button>
          <button class="bt-tab" data-tab="pendidikan">
            <i data-lucide="graduation-cap"></i> Pendidikan
          </button>
          <button class="bt-tab" data-tab="kontak">
            <i data-lucide="mail"></i> Kontak
          </button>
          <button class="bt-tab" data-tab="pppk">
            <i data-lucide="shield-check"></i> PPPK
          </button>
          <button class="bt-tab" data-tab="dokumen">
            <i data-lucide="file-text"></i> Foto & Dokumen
          </button>
        </div>

        <!-- Tab Body -->
        <div class="biodata-body" id="biodataBody">
          ${this.renderTabKepegawaian(pegawai)}
          ${this.renderTabIdentitas(pegawai)}
          ${this.renderTabPendidikan(pegawai)}
          ${this.renderTabKontak(pegawai)}
          ${this.renderTabPppk(pegawai)}
          ${this.renderTabDokumen(pegawai)}
        </div>

      </div>`;

    // Bind tab navigation
    document.querySelectorAll('#biodataTabs .bt-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('#biodataTabs .bt-tab').forEach(t => t.classList.remove('on'));
        tab.classList.add('on');
        this.activeTab = tab.dataset.tab;
        document.querySelectorAll('#biodataBody .bt-panel').forEach(p => {
          p.classList.toggle('on', p.dataset.panel === this.activeTab);
        });
      });
    });

    // Set tab aktif
    document.querySelectorAll('#biodataBody .bt-panel').forEach(p => {
      p.classList.toggle('on', p.dataset.panel === this.activeTab);
    });

    // Bind tombol edit/simpan/batal
    this.bindEditButtons();

    if (window.lucide) lucide.createIcons();
  },

  /* ---------- Helper: render field ---------- */
  field(label, key, value, opts = {}) {
    const ro = opts.readonly || false;
    const full = opts.full || false;
    const type = opts.type || 'text';
    const roBadge = ro ? '<span class="ro-badge">Read-only</span>' : '';

    return `
      <div class="bt-field ${full ? 'full' : ''}">
        <label>${label}${roBadge}</label>
        <input class="bt-input"
               data-key="${key}"
               type="${type}"
               value="${value || ''}"
               ${ro ? 'readonly' : ''}
               placeholder="${label}">
      </div>`;
  },

  /* ---------- TAB 1: Kepegawaian ---------- */
  renderTabKepegawaian(p) {
    return `
      <div class="bt-panel on" data-panel="kepegawaian">
        <div class="bt-section">
          <div class="bt-section-head">
            <i data-lucide="badge-check"></i>
            <h4>Data Kepegawaian</h4>
          </div>
          <div class="bt-grid">
            ${this.field('NIP / NSP / NPA / NPK', 'nip', p.nip, { readonly: true })}
            ${this.field('Jabatan', 'jabatan', p.jabatan)}
            ${this.field('Krosda', 'krosda', p.krosda)}
            ${this.field('Kejuron', 'kejuron', p.kejuron)}
            ${this.field('TMT Kontrak', 'tmt_kontrak', p.tmt_kontrak, { type: 'date' })}
            ${this.field('Status', 'status_pegawai', p.status_pegawai)}
            ${this.field('Masa Kerja', 'masa_kerja', p.masa_kerja)}
            ${this.field('Jenis Kepegawaian', 'jenis_kepegawaian', p.jenis_kepegawaian || 'TP-OP')}
          </div>
        </div>
      </div>`;
  },

  /* ---------- TAB 2: Identitas ---------- */
  renderTabIdentitas(p) {
    return `
      <div class="bt-panel" data-panel="identitas">
        <div class="bt-section">
          <div class="bt-section-head">
            <i data-lucide="user"></i>
            <h4>Identitas (KTP)</h4>
          </div>
          <div class="bt-grid">
            ${this.field('NIK (Read-only)', 'nik', this.maskNIK(p.nik), { readonly: true })}
            ${this.field('Nama Sesuai KTP', 'nama_ktp', p.nama_ktp)}
            ${this.field('Tempat Lahir', 'tempat_lahir', p.tempat_lahir)}
            ${this.field('Tanggal Lahir', 'tanggal_lahir', p.tanggal_lahir, { type: 'date' })}
            ${this.field('Jenis Kelamin', 'jenis_kelamin', p.jenis_kelamin)}
            ${this.field('Agama', 'agama', p.agama)}
            ${this.field('Status Perkawinan', 'status_perkawinan', p.status_perkawinan)}
            ${this.field('Tinggi Badan (cm)', 'tinggi_badan', p.tinggi_badan, { type: 'number' })}
            ${this.field('Golongan Darah', 'golongan_darah', p.golongan_darah)}
          </div>
        </div>
      </div>`;
  },

  /* ---------- TAB 3: Pendidikan ---------- */
  renderTabPendidikan(p) {
    return `
      <div class="bt-panel" data-panel="pendidikan">
        <div class="bt-section">
          <div class="bt-section-head">
            <i data-lucide="graduation-cap"></i>
            <h4>Riwayat Pendidikan</h4>
          </div>
          <div class="bt-grid">
            ${this.field('Nama Sekolah / PT', 'sekolah', p.sekolah, { full: true })}
            ${this.field('Jenjang Pendidikan', 'pendidikan', p.pendidikan)}
            ${this.field('Jurusan', 'jurusan', p.jurusan)}
            ${this.field('Tahun Lulus', 'tahun_lulus', p.tahun_lulus, { type: 'number' })}
            ${this.field('No. Ijazah', 'no_ijazah', p.no_ijazah)}
            ${this.field('Tanggal Ijazah', 'tanggal_ijazah', p.tanggal_ijazah, { type: 'date' })}
            ${this.field('IPK / Nilai', 'ipk', p.ipk, { type: 'number' })}
            ${this.field('Gelar Depan', 'gelar_depan', p.gelar_depan)}
            ${this.field('Gelar Belakang', 'gelar_belakang', p.gelar_belakang)}
          </div>
        </div>
      </div>`;
  },

  /* ---------- TAB 4: Kontak ---------- */
  renderTabKontak(p) {
    return `
      <div class="bt-panel" data-panel="kontak">
        <div class="bt-section">
          <div class="bt-section-head">
            <i data-lucide="mail"></i>
            <h4>Kontak & Alamat</h4>
          </div>
          <div class="bt-grid">
            ${this.field('Alamat Domisili', 'alamat', p.alamat, { full: true })}
            ${this.field('Kabupaten / Kota', 'kab_kota', p.kab_kota)}
            ${this.field('Provinsi', 'provinsi', p.provinsi)}
            ${this.field('No. HP', 'no_hp', p.no_hp)}
            ${this.field('No. Telp', 'no_telp', p.no_telp)}
            ${this.field('Email Pribadi', 'email', p.email, { type: 'email' })}
            ${this.field('Email Dinas', 'email_dinas', p.email_dinas, { type: 'email' })}
          </div>
        </div>

        <div class="bt-section">
          <div class="bt-section-head">
            <i data-lucide="phone-call"></i>
            <h4>Kontak Darurat</h4>
          </div>
          <div class="bt-grid-3 bt-grid">
            ${this.field('Nama', 'kontak_darurat_nama', p.kontak_darurat_nama)}
            ${this.field('Hubungan', 'kontak_darurat_hubungan', p.kontak_darurat_hubungan)}
            ${this.field('No. HP', 'kontak_darurat_hp', p.kontak_darurat_hp)}
          </div>
        </div>
      </div>`;
  },

  /* ---------- TAB 5: PPPK ---------- */
  renderTabPppk(p) {
    return `
      <div class="bt-panel" data-panel="pppk">
        <div class="bt-section">
          <div class="bt-section-head">
            <i data-lucide="shield-check"></i>
            <h4>Data Seleksi PPPK</h4>
          </div>
          <div class="bt-grid">
            ${this.field('Jenis Seleksi', 'jenis_seleksi', p.jenis_seleksi)}
            ${this.field('Tahun Seleksi', 'tahun_seleksi', p.tahun_seleksi, { type: 'number' })}
            ${this.field('Nama Instansi', 'instansi_pppk', p.instansi_pppk, { full: true })}
            ${this.field('Formasi', 'formasi', p.formasi, { full: true })}
            ${this.field('Lokasi Formasi', 'lokasi_formasi', p.lokasi_formasi, { full: true })}
            ${this.field('Lokasi Test', 'lokasi_test', p.lokasi_test)}
            ${this.field('Database BKN', 'database_bkn', p.database_bkn)}
          </div>
        </div>
      </div>`;
  },

  /* ---------- TAB 6: Foto & Dokumen ---------- */
  renderTabDokumen(p) {
    return `
      <div class="bt-panel" data-panel="dokumen">

        <div class="bt-section">
          <div class="bt-section-head">
            <i data-lucide="image"></i>
            <h4>Foto Pegawai</h4>
          </div>
          <div class="bt-grid-3 bt-grid">
            ${this.fotoSlot('Foto Pas (3×4)', 'foto_pas', p.foto_pas)}
            ${this.fotoSlot('Foto Hero (PNG)', 'foto_hero', p.foto_hero)}
            ${this.fotoSlot('Foto Dinas', 'foto_dinas', p.foto_dinas)}
          </div>
        </div>

        <div class="bt-section">
          <div class="bt-section-head">
            <i data-lucide="file-text"></i>
            <h4>Dokumen Kepegawaian</h4>
          </div>
          <div class="bt-grid">
            ${this.field('NPWP', 'npwp', p.npwp)}
            ${this.field('BPJS Kesehatan', 'bpjs', p.bpjs)}
            ${this.field('Bank', 'bank_nama', p.bank_nama)}
            ${this.field('No. Rekening', 'bank_rekening', p.bank_rekening)}
          </div>
        </div>

      </div>`;
  },

  /* ---------- Helper: foto slot ---------- */
  fotoSlot(label, key, url) {
    return `
      <div class="bt-field">
        <label>${label}</label>
        <div class="foto-slot" style="position:relative;border:1.5px dashed var(--line);border-radius:14px;overflow:hidden;aspect-ratio:1;background:var(--bg);cursor:pointer;display:flex;align-items:center;justify-content:center">
          <img src="${url || 'https://i.pravatar.cc/300'}" 
               alt="${label}"
               style="width:100%;height:100%;object-fit:cover;display:block">
          <label style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.5);opacity:0;transition:.2s;cursor:pointer;color:#fff;font:700 11.5px var(--font);flex-direction:column;gap:6px"
                 onmouseover="this.style.opacity=1" 
                 onmouseout="this.style.opacity=0">
            <i data-lucide="camera" style="width:22px;height:22px"></i>
            Ganti
            <input type="file" accept="image/*" hidden data-foto-key="${key}">
          </label>
        </div>
      </div>`;
  },

  /* ============================================================
     EDIT MODE
     ============================================================ */
  bindEditButtons() {
    const btnEdit = document.getElementById('btnEditBiodata');
    const btnSave = document.getElementById('btnSaveBiodata');
    const btnCancel = document.getElementById('btnCancelEdit');
    const panel = document.getElementById('biodataPanel');

    // Klik Edit
    btnEdit?.addEventListener('click', () => {
      this.isEditing = true;
      panel.classList.add('editing');
      document.querySelectorAll('.bt-input:not([readonly])').forEach(inp => {
        inp.classList.add('bt-input');
      });
      btnEdit.hidden = true;
      btnSave.hidden = false;
      btnCancel.hidden = false;
      // Focus ke field pertama yang editable
      document.querySelector('.bt-input:not([readonly])')?.focus();
    });

    // Klik Batal
    btnCancel?.addEventListener('click', () => {
      this.cancelEdit();
    });

    // Klik Simpan
    btnSave?.addEventListener('click', () => {
      this.saveEdit();
    });

    // Bind ganti foto di tab dokumen
    document.querySelectorAll('[data-foto-key]').forEach(input => {
      input.addEventListener('change', (e) => {
        const key = input.dataset.fotoKey;
        this.gantiFoto(e.target.files[0], key, null, input.closest('.foto-slot'));
      });
    });
  },

  cancelEdit() {
    // Reset ke data original
    Object.entries(this.originalData).forEach(([key, val]) => {
      const input = document.querySelector(`.bt-input[data-key="${key}"]`);
      if (input) input.value = val || '';
    });

    this.isEditing = false;
    document.getElementById('biodataPanel').classList.remove('editing');
    document.getElementById('btnEditBiodata').hidden = false;
    document.getElementById('btnSaveBiodata').hidden = true;
    document.getElementById('btnCancelEdit').hidden = true;

    toast('Perubahan dibatalkan.', 'info');
  },

  saveEdit() {
    // Kumpulkan data dari semua input
    const newData = {};
    document.querySelectorAll('.bt-input').forEach(input => {
      const key = input.dataset.key;
      if (key) newData[key] = input.value;
    });

    // Validasi basic
    if (!newData.nama || newData.nama.trim().length < 3) {
      toast('Nama minimal 3 karakter.', 'warn');
      return;
    }

    // Update data di memory
    this.pegawai = { ...this.pegawai, ...newData };
    this.originalData = { ...this.pegawai };

    // Simpan ke localStorage
    this.saveToStorage(this.pegawai.id, newData);

    // Update UI kartu kiri (nama, jabatan, dll)
    this.renderLeft(this.pegawai);

    // Exit edit mode
    this.isEditing = false;
    document.getElementById('biodataPanel').classList.remove('editing');
    document.getElementById('btnEditBiodata').hidden = false;
    document.getElementById('btnSaveBiodata').hidden = true;
    document.getElementById('btnCancelEdit').hidden = true;

    toast('Biodata berhasil disimpan.', 'success');

    if (window.lucide) lucide.createIcons();
  },

  /* ============================================================
     GANTI FOTO
     ============================================================ */
  async gantiFoto(file, key, imgId, containerEl) {
    if (!file) return;

    try {
      const blob = await kompresiFoto(file, 150, 1000, 0.85);
      const url = URL.createObjectURL(blob);

      if (imgId) {
        // Update img dengan ID
        const img = document.getElementById(imgId);
        if (img) img.src = url;
      }
      if (containerEl) {
        // Update foto slot
        const img = containerEl.querySelector('img');
        if (img) img.src = url;
      }

      // Simpan ke localStorage
      this.pegawai[key] = url;
      this.saveToStorage(this.pegawai.id, { [key]: url });

      toast('Foto berhasil diperbarui.', 'success');
    } catch (e) {
      toast('Gagal memproses foto: ' + e.message, 'error');
    }
  },

  /* ============================================================
     TIMELINE KONTRIBUSI (Perjalanan Karier)
     ============================================================ */
  renderTimeline(pegawai) {
    const el = document.getElementById('profilTimeline');
    if (!el) return;

    const timeline = [
      {
        year: '2024',
        title: 'Kontrak TP-OP',
        desc: 'Direkrut sebagai Tenaga Operasi & Pemeliharaan Irigasi oleh Kementerian PUPR',
        status: 'done'
      },
      {
        year: '2025',
        title: 'Seleksi PPPK',
        desc: 'Mengikuti seleksi PPPK melalui Pemprov Jawa Timur (terdata database BKN Kode R3)',
        status: 'done'
      },
      {
        year: '2025',
        title: 'Pengalihan ke BBWS Brantas',
        desc: 'Dialihkan ke BBWS Brantas sebagai bagian dari penghentian TP-OP',
        status: 'done'
      },
      {
        year: '2026',
        title: 'Aktif di Portal Kinerja',
        desc: 'Terintegrasi dalam sistem presensi & pelaporan digital BBWS Brantas',
        status: 'done'
      },
      {
        year: '2027',
        title: 'Menuju Pengangkatan PPPK',
        desc: 'Menunggu regulasi & formasi dari Kementerian PUPR + KemenPANRB',
        status: 'future'
      }
    ];

    el.innerHTML = `
      <div class="card-head">
        <div>
          <span class="kicker">Perjalanan Karier</span>
          <h3>Timeline Kontribusi</h3>
        </div>
        <span class="meta-chip"><i data-lucide="clock"></i>3 tahun</span>
      </div>

      <div class="timeline-kontribusi">
        ${timeline.map(t => `
          <div class="tk-item ${t.status}">
            <div class="tk-year">${t.year}</div>
            <div class="tk-title">${t.title}</div>
            <div class="tk-desc">${t.desc}</div>
          </div>
        `).join('')}
      </div>`;

    if (window.lucide) lucide.createIcons();
  },

  /* ============================================================
     PORTOFOLIO KINERJA
     ============================================================ */
  async renderPortofolio(pegawai) {
    const el = document.getElementById('profilPortofolio');
    if (!el) return;

    let presensi = [], operasi = [], pemeliharaan = [], laporan = [];
    try {
      presensi = await API.getPresensi(pegawai.id, 100);
      if (pegawai.role === 'ppa') operasi = await API.getOperasiPintu(pegawai.id, 100);
      if (pegawai.role === 'pekarya') pemeliharaan = await API.getPemeliharaan(pegawai.id, 100);
      laporan = await API.getLaporan(pegawai.id, null);
    } catch (e) {}

    const hadir = presensi.filter(p => p.status === 'verified').length;
    const totalLaporan = laporan.length;
    const totalOperasi = operasi.length;
    const totalPemeliharaan = pemeliharaan.length;

    el.innerHTML = `
      <div class="card-head">
        <div>
          <span class="kicker">Portofolio Kinerja</span>
          <h3>Statistik Kontribusi</h3>
        </div>
        <span class="meta-chip">
          <i data-lucide="shield-check"></i>Bukti Kelayakan
        </span>
      </div>

      <div class="portofolio-grid">
        <div class="pf-item">
          <div class="pf-ic ic-blue"><i data-lucide="calendar-check"></i></div>
          <div><b>${hadir}</b><span>Presensi Terverifikasi</span></div>
        </div>
        <div class="pf-item">
          <div class="pf-ic ic-green"><i data-lucide="file-check"></i></div>
          <div><b>${totalLaporan}</b><span>Laporan Dibuat</span></div>
        </div>
        ${pegawai.role === 'ppa' ? `
          <div class="pf-item">
            <div class="pf-ic ic-ink"><i data-lucide="droplets"></i></div>
            <div><b>${totalOperasi}</b><span>Operasi Pintu</span></div>
          </div>` : ''}
        ${pegawai.role === 'pekarya' ? `
          <div class="pf-item">
            <div class="pf-ic ic-ink"><i data-lucide="shovel"></i></div>
            <div><b>${totalPemeliharaan}</b><span>Pemeliharaan</span></div>
          </div>` : ''}
        <div class="pf-item">
          <div class="pf-ic ic-amber"><i data-lucide="trending-up"></i></div>
          <div><b>92%</b><span>Kehadiran</span></div>
        </div>
      </div>

      <div style="margin-top:18px;padding-top:16px;border-top:1px dashed var(--line);text-align:center">
        <button class="btn btn-blue" id="btnExportPortofolio">
          <i data-lucide="download"></i> Unduh Portofolio PDF
        </button>
      </div>`;

    document.getElementById('btnExportPortofolio')?.addEventListener('click', () => {
      toast('Portofolio PDF sedang disiapkan… (fitur demo)', 'info');
    });

    if (window.lucide) lucide.createIcons();
  },

  /* ============================================================
     UTILITY
     ============================================================ */
  maskNIK(nik) {
    if (!nik || nik.length < 16) return nik || '-';
    return nik.substring(0, 8) + '****' + nik.substring(12);
  },

  /* ---------- Storage: Local Storage ---------- */
  saveToStorage(pegawaiId, data) {
    try {
      const key = `tpop_profil_${pegawaiId}`;
      const existing = JSON.parse(localStorage.getItem(key) || '{}');
      const merged = { ...existing, ...data };
      localStorage.setItem(key, JSON.stringify(merged));
    } catch (e) {
      console.warn('Gagal simpan ke localStorage:', e);
    }
  },

  loadFromStorage(pegawaiId) {
    try {
      const key = `tpop_profil_${pegawaiId}`;
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }
};

window.Profil = Profil;