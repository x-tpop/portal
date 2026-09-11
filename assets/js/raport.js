/* =================================================================
   raport.js — Raport Kinerja per Jabatan
   - Indikator berbeda per role
   - Skor + predikat + delta
   - Riwayat per semester
   ================================================================= */

const Raport = {
  state: {
    sem: 'ganjil-2025'
  },

  pegawai: null,

  /* Data dummy raport per role */
  DATA_RAPORT: {
    korlap: {
      'ganjil-2024': { skor: 88.5, catatan: 'Koordinasi dengan HIPPA berjalan baik. Perlu tingkatkan kecepatan verifikasi laporan tim.' },
      'genap-2024':  { skor: 90.2, catatan: 'Peningkatan signifikan dalam penanganan konflik air. Pertahankan komunikasi rutin dengan GHIPPA.' },
      'ganjil-2025': { skor: 93.4, catatan: 'Kinerja excellent. Inisiatif digitalisasi jadwal giling air diadopsi BBWS pusat.' }
    },
    ppa: {
      'ganjil-2024': { skor: 86.0, catatan: 'Ketepatan operasi pintu air baik. Perlu lengkapi dokumentasi foto sebelum/sesudah.' },
      'genap-2024':  { skor: 89.5, catatan: 'Akurasi debit meningkat. Konsisten catat tinggi muka air setiap 2 jam.' },
      'ganjil-2025': { skor: 94.2, catatan: 'Semester terbaik. Zero error operasi pintu air selama 6 bulan berturut-turut.' }
    },
    pekarya: {
      'ganjil-2024': { skor: 84.5, catatan: 'Panjang saluran terpelihara tercapai. Perlu perbaiki kualitas hasil pekerjaan.' },
      'genap-2024':  { skor: 87.8, catatan: 'Respons kerusakan cepat. Dokumentasi foto masih kurang lengkap.' },
      'ganjil-2025': { skor: 91.5, catatan: 'Kualitas pekerjaan sangat baik. Jadi contoh untuk pekarya lain di krosda.' }
    }
  },

  /* Indikator per role */
  INDIKATOR: {
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
  },

  /* Nilai per aspek (dummy) */
  NILAI_ASPEK: {
    'ganjil-2024': [88, 86, 90, 87, 91],
    'genap-2024':  [90, 88, 92, 89, 93],
    'ganjil-2025': [93, 94, 92, 95, 93]
  },

  /* ============================================================
     RENDER
     ============================================================ */
  async render() {
    const role = Portal.state.role;
    const pegawai = Auth.getPegawaiAktif();
    this.pegawai = pegawai;

    this.renderHeader(role);
    this.renderScore(role, pegawai);
    this.renderAspek(role);
    this.renderRekap(role);

    if (window.lucide) lucide.createIcons();
  },

  /* ---------- Header & select semester ---------- */
  renderHeader(role) {
    const el = document.getElementById('rapHeader');
    if (!el) return;

    el.innerHTML = `
      <div class="card-head">
        <div>
          <span class="kicker">Raport Kinerja</span>
          <h3>Penilaian Semester</h3>
        </div>
        <div class="sel-wrap" style="min-width:180px">
          <select id="rapSem">
            <option value="ganjil-2024" ${this.state.sem === 'ganjil-2024' ? 'selected' : ''}>Ganjil 2024</option>
            <option value="genap-2024" ${this.state.sem === 'genap-2024' ? 'selected' : ''}>Genap 2024</option>
            <option value="ganjil-2025" ${this.state.sem === 'ganjil-2025' ? 'selected' : ''}>Ganjil 2025</option>
          </select>
          <i data-lucide="chevron-down"></i>
        </div>
      </div>`;

    document.getElementById('rapSem')?.addEventListener('change', (e) => {
      this.state.sem = e.target.value;
      this.render();
    });
  },

  /* ---------- Skor utama ---------- */
  renderScore(role, pegawai) {
    const el = document.getElementById('rapScore');
    if (!el) return;

    const data = this.DATA_RAPORT[role] || {};
    const current = data[this.state.sem] || { skor: 0, catatan: '—' };
    const semList = Object.keys(data);
    const idx = semList.indexOf(this.state.sem);
    const prev = idx > 0 ? data[semList[idx - 1]] : null;
    const delta = prev ? current.skor - prev.skor : 0;

    const pred = this.getPredikat(current.skor);
    const predCls = pred.toLowerCase().replace(' ', '-');

    // Ring progress (radius 70, circumference = 2 * PI * 70 = 439.8)
    const circumference = 439.8;
    const offset = circumference - (current.skor / 100) * circumference;

    el.innerHTML = `
      <div class="score-head">
        <div>
          <span class="kicker">Skor Akhir</span>
          <h3 style="margin-top:4px">Nilai Kinerja</h3>
        </div>
        <span class="predikat ${predCls}">
          <i data-lucide="${pred === 'Sangat Baik' ? 'award' : pred === 'Baik' ? 'thumbs-up' : 'alert-triangle'}"></i>
          ${pred}
        </span>
      </div>

      <div class="score-big">
        <span class="sb-num" id="rapNum">0</span>
        <span class="sb-max">/ 100</span>
      </div>

      ${prev ? `
        <span class="score-delta ${delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat'}">
          <i data-lucide="trending-${delta > 0 ? 'up' : delta < 0 ? 'down' : 'right'}"></i>
          ${delta > 0 ? '+' : ''}${delta.toFixed(1)} dari semester lalu
        </span>` : `
        <span class="score-delta flat">
          <i data-lucide="minus"></i>
          Semester awal penilaian
        </span>`}

      <div class="score-ring">
        <svg viewBox="0 0 140 140">
          <circle class="sr-track" cx="70" cy="70" r="70"></circle>
          <circle class="sr-fill ${predCls}" id="rapRing" cx="70" cy="70" r="70"
                  style="stroke-dasharray:${circumference};stroke-dashoffset:${circumference}"></circle>
        </svg>
      </div>

      <p style="font:500 12.5px/1.6 var(--font);color:var(--muted);text-align:center;margin-top:8px">
        Nilai gabungan capaian SKP & perilaku kerja.<br>
        Mengacu PermenPANRB No. 6 Tahun 2022.
      </p>`;

    // Animasi angka
    setTimeout(() => {
      this.animateNumber(document.getElementById('rapNum'), current.skor);
      const ring = document.getElementById('rapRing');
      if (ring) ring.style.strokeDashoffset = offset;
    }, 150);

    if (window.lucide) lucide.createIcons();
  },

  animateNumber(el, target) {
    if (!el) return;
    const duration = 1200;
    const start = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(1);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  },

  getPredikat(skor) {
    if (skor >= 91) return 'Sangat Baik';
    if (skor >= 76) return 'Baik';
    if (skor >= 61) return 'Butuh Perbaikan';
    return 'Kurang';
  },

  /* ---------- Bar aspek ---------- */
  renderAspek(role) {
    const el = document.getElementById('rapAspek');
    if (!el) return;

    const indikator = this.INDIKATOR[role] || [];
    const nilai = this.NILAI_ASPEK[this.state.sem] || [];

    el.innerHTML = `
      <div class="card-head">
        <div>
          <span class="kicker">Rincian Penilaian</span>
          <h3>Aspek yang Dinilai</h3>
        </div>
        <span class="meta-chip">
          <i data-lucide="layers"></i>
          ${indikator.length} indikator
        </span>
      </div>

      <div class="aspek-list">
        ${indikator.map((ind, i) => {
          const val = nilai[i] || 0;
          const cls = this.getPredikat(val).toLowerCase().replace(' ', '-');
          return `
            <div class="aspek-item">
              <div class="aspek-head">
                <b>${ind.nama}</b>
                <span class="aspek-val">${val}</span>
              </div>
              <div class="aspek-track">
                <div class="aspek-fill ${cls}" data-target="${val}"></div>
              </div>
            </div>`;
        }).join('')}
      </div>

      <div class="catatan-card" style="margin-top:20px">
        <span class="kicker">Catatan Atasan Langsung</span>
        <div class="catatan-box" id="rapCatatan">—</div>
        <div class="ttd-row">
          <img class="ttd-avatar" src="https://i.pravatar.cc/100?u=korlap" alt="">
          <div class="ttd-info">
            <b>Drs. Hendra Wijaya, M.T.</b>
            <small>Kepala Seksi O&P · NIP 19681205 199203 1 004</small>
          </div>
        </div>
      </div>`;

    // Animate bars
    setTimeout(() => {
      document.querySelectorAll('.aspek-fill').forEach(el => {
        el.style.width = el.dataset.target + '%';
      });
    }, 200);

    // Catatan
    const data = this.DATA_RAPORT[role] || {};
    const current = data[this.state.sem];
    document.getElementById('rapCatatan').textContent = current?.catatan || '—';

    if (window.lucide) lucide.createIcons();
  },

  /* ---------- Rekap semua semester ---------- */
  renderRekap(role) {
    const el = document.getElementById('rapRekap');
    if (!el) return;

    const data = this.DATA_RAPORT[role] || {};
    const list = Object.entries(data).map(([key, val]) => ({
      sem: key,
      label: this.labelSem(key),
      skor: val.skor
    }));

    el.innerHTML = `
      <div class="card-head">
        <div>
          <span class="kicker">Riwayat Penilaian</span>
          <h3>Rekap Semua Semester</h3>
        </div>
      </div>

      <table class="rekap-table">
        <tbody>
          ${list.map(r => {
            const pred = this.getPredikat(r.skor);
            const predCls = pred.toLowerCase().replace(' ', '-');
            const predBg = pred === 'Sangat Baik' ? 'background:var(--green-soft);color:#166534'
              : pred === 'Baik' ? 'background:var(--blue-soft);color:var(--blue-dark)'
              : pred === 'Butuh Perbaikan' ? 'background:var(--amber-soft);color:#92400E'
              : 'background:var(--red-soft);color:#991B1B';

            return `
              <tr class="${r.sem === this.state.sem ? 'on' : ''}" data-sem="${r.sem}">
                <td class="rp-sem">${r.label}</td>
                <td class="rp-num">${r.skor.toFixed(1)}</td>
                <td>
                  <span class="rp-pred" style="${predBg}">${pred}</span>
                </td>
                <td style="text-align:right;color:var(--muted)">
                  <i data-lucide="chevron-right" style="width:16px;height:16px"></i>
                </td>
              </tr>`;
          }).join('')}
        </tbody>
      </table>`;

    // Bind klik row
    el.querySelectorAll('.rekap-table tr').forEach(tr => {
      tr.addEventListener('click', () => {
        this.state.sem = tr.dataset.sem;
        this.render();
      });
    });

    if (window.lucide) lucide.createIcons();
  },

  labelSem(key) {
    const [sem, year] = key.split('-');
    const s = sem === 'ganjil' ? 'Ganjil' : 'Genap';
    return `${s} ${year}`;
  }
};

window.Raport = Raport;