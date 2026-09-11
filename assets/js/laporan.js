/* =================================================================
   laporan.js — Logic Laporan Terpadu
   - Buat laporan (semua role)
   - Filter status
   - Verifikasi (Korlap)
   ================================================================= */

const Laporan = {
  state: {
    filterStatus: 'Semua',
    jenis: '',
    judul: '',
    lokasi: '',
    sifat: 'Normal',
    deskripsi: '',
    foto: null,
    fotoMeta: null
  },

  pegawai: null,
  allLaporan: [],

  /* ============================================================
     RENDER
     ============================================================ */
  async render() {
    const role = Portal.state.role;
    const pegawai = Auth.getPegawaiAktif();
    this.pegawai = pegawai;
    this.isKorlap = (role === 'korlap');

    this.renderForm();
    this.renderTabs();
    await this.loadLaporan();
    this.renderStats();

    if (window.lucide) lucide.createIcons();
  },

  /* ============================================================
     FORM LAPORAN
     ============================================================ */
  renderForm() {
    const el = document.getElementById('lapForm');
    if (!el) return;

    el.innerHTML = `
      <div class="card form-laporan">
        <div class="card-head">
          <div>
            <span class="kicker">Formulir Laporan</span>
            <h3><i data-lucide="file-text"></i> Buat Laporan</h3>
          </div>
        </div>

        <form id="formLaporan" novalidate>

          <!-- Judul -->
          <div class="field" id="fJudul">
            <label for="lapJudul">Judul Laporan</label>
            <input id="lapJudul" maxlength="120" placeholder="cth: Inspeksi rutin pintu air NGRO 1">
            <span class="err">Judul minimal 8 karakter.</span>
          </div>

          <!-- Jenis & Sifat -->
          <div class="frow">
            <div class="field" id="fJenis">
              <label for="lapJenis">Jenis</label>
              <div class="sel-wrap">
                <select id="lapJenis">
                  <option value="">Pilih jenis…</option>
                  <option>Operasi</option>
                  <option>Pemeliharaan</option>
                  <option>Inspeksi</option>
                  <option>Kerusakan</option>
                  <option>Keamanan</option>
                </select>
                <i data-lucide="chevron-down"></i>
              </div>
              <span class="err">Pilih jenis laporan.</span>
            </div>
            <div class="field">
              <label for="lapSifat">Sifat</label>
              <div class="sel-wrap">
                <select id="lapSifat">
                  <option>Normal</option>
                  <option>Prioritas</option>
                  <option>Darurat</option>
                </select>
                <i data-lucide="chevron-down"></i>
              </div>
            </div>
          </div>

          <!-- Lokasi -->
          <div class="field" id="fLokasi">
            <label for="lapLokasi">Lokasi / Aset</label>
            <input id="lapLokasi" placeholder="cth: B.NGRO.1, Krosda Bangorejo">
            <span class="err">Isi lokasi/aset.</span>
          </div>

          <!-- Deskripsi -->
          <div class="field" id="fDesk">
            <label for="lapDesk">Uraian</label>
            <textarea id="lapDesk" rows="3" maxlength="500" placeholder="Jelaskan temuan, kondisi, atau tindakan…"></textarea>
            <span class="err">Uraian minimal 20 karakter.</span>
          </div>

          <!-- Foto -->
          <div class="field">
            <label>Foto Bukti (opsional)</label>
            <div class="foto-compare" style="grid-template-columns:1fr">
              <div class="foto-box" id="fotoLap" role="button" tabindex="0" style="min-height:120px">
                <div class="fb-ic"><i data-lucide="camera"></i></div>
                <div class="fb-txt">
                  <b>Foto Laporan</b>
                  <small>Ketuk untuk ambil</small>
                </div>
              </div>
            </div>
          </div>

          <!-- Submit -->
          <button class="btn btn-blue btn-block" type="submit" style="padding:14px;font-size:14.5px">
            <i data-lucide="send"></i> Kirim Laporan
          </button>

        </form>
      </div>`;

    // Bind foto
    document.getElementById('fotoLap')?.addEventListener('click', (e) => {
      if (e.target.closest('.fb-overlay')) return;
      if (this.state.foto) return;
      this.ambilFoto();
    });

    // Bind submit
    document.getElementById('formLaporan')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.submit();
    });

    if (window.lucide) lucide.createIcons();
  },

  /* ============================================================
     FOTO
     ============================================================ */
  async ambilFoto() {
    await Camera.open('fotoLaporan', async (blob, meta) => {
      this.state.foto = blob;
      this.state.fotoMeta = meta;
      this.renderFotoPreview();
    });
  },

  renderFotoPreview() {
    const box = document.getElementById('fotoLap');
    if (!box) return;

    const blob = this.state.foto;
    if (!blob) {
      box.classList.remove('has-photo');
      return;
    }

    if (box._objectUrl) URL.revokeObjectURL(box._objectUrl);
    const url = URL.createObjectURL(blob);
    box._objectUrl = url;

    box.classList.add('has-photo');
    box.innerHTML = `
      <img src="${url}" alt="Preview">
      <div class="fb-overlay">
        <b>Foto Laporan</b>
        <button type="button" class="fb-del" data-hapus="foto" aria-label="Hapus">
          <i data-lucide="x"></i>
        </button>
      </div>`;

    box.querySelector('[data-hapus]')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.hapusFoto();
    });

    if (window.lucide) lucide.createIcons();
  },

  hapusFoto() {
    const box = document.getElementById('fotoLap');
    if (box?._objectUrl) {
      URL.revokeObjectURL(box._objectUrl);
      box._objectUrl = null;
    }
    this.state.foto = null;
    this.state.fotoMeta = null;

    if (!box) return;
    box.classList.remove('has-photo');
    box.innerHTML = `
      <div class="fb-ic"><i data-lucide="camera"></i></div>
      <div class="fb-txt">
        <b>Foto Laporan</b>
        <small>Ketuk untuk ambil</small>
      </div>`;
    if (window.lucide) lucide.createIcons();
  },

  /* ============================================================
     SUBMIT LAPORAN
     ============================================================ */
  async submit() {
    const judul = document.getElementById('lapJudul').value.trim();
    const jenis = document.getElementById('lapJenis').value;
    const sifat = document.getElementById('lapSifat').value;
    const lokasi = document.getElementById('lapLokasi').value.trim();
    const desk = document.getElementById('lapDesk').value.trim();

    let ok = true;
    const mark = (id, bad) => {
      document.getElementById(id).classList.toggle('invalid', bad);
      if (bad) ok = false;
    };

    mark('fJudul', judul.length < 8);
    mark('fJenis', !jenis);
    mark('fLokasi', !lokasi);
    mark('fDesk', desk.length < 20);

    if (!ok) {
      toast('Periksa kembali isian yang ditandai merah.', 'warn');
      return;
    }

    toast('Mengirim laporan...', 'info');

    try {
      const now = new Date();
      const pegawai = this.pegawai;
      const namaDepan = pegawai?.nama?.split(' ')[0] || 'Pegawai';

      let fotoUrl = null;
      if (this.state.foto) {
        const watermarkTxt =
          `${namaDepan}\n${dateLong(now)}\n${timeFull(now)} WIB\n${judul}`;
        const wm = await watermarkFoto(this.state.foto, watermarkTxt);
        fotoUrl = await this.blobToDataURL(wm);
      }

      const hasil = await API.submitLaporan({
        pegawaiId: pegawai?.id,
        pegawaiNama: pegawai?.nama,
        pegawaiFotoPas: pegawai?.foto_pas,
        role: pegawai?.role,
        krosda: pegawai?.krosda,
        judul: judul,
        jenis: jenis,
        sifat: sifat,
        lokasi: lokasi,
        deskripsi: desk,
        file: fotoUrl,
        tanggal: isoDate(now)
      });

      toast(`Laporan <b>${hasil?.id || ''}</b> berhasil dikirim.`, 'success');

      this.resetForm();
      await this.loadLaporan();
      this.renderStats();

    } catch (e) {
      console.error(e);
      toast('Gagal mengirim laporan: ' + e.message, 'error');
    }
  },

  resetForm() {
    document.getElementById('lapJudul').value = '';
    document.getElementById('lapJenis').value = '';
    document.getElementById('lapSifat').value = 'Normal';
    document.getElementById('lapLokasi').value = '';
    document.getElementById('lapDesk').value = '';
    this.state.foto = null;
    this.state.fotoMeta = null;
    this.hapusFoto();
  },

  /* ============================================================
     TAB FILTER
     ============================================================ */
  renderTabs() {
    const el = document.getElementById('lapTabs');
    if (!el) return;

    const statusList = this.isKorlap
      ? ['Semua', 'Menunggu', 'Diproses', 'Disetujui', 'Revisi']
      : ['Semua', 'Menunggu', 'Diproses', 'Disetujui', 'Revisi'];

    el.innerHTML = statusList.map(s => `
      <button class="lap-tab ${s === this.state.filterStatus ? 'on' : ''}" data-status="${s}">
        ${s}
        <span class="lt-count" data-count="${s}">0</span>
      </button>`).join('');

    el.querySelectorAll('.lap-tab').forEach(t => {
      t.addEventListener('click', () => {
        el.querySelectorAll('.lap-tab').forEach(x => x.classList.remove('on'));
        t.classList.add('on');
        this.state.filterStatus = t.dataset.status;
        this.renderList();
      });
    });
  },

  /* ============================================================
     LOAD & RENDER LIST
     ============================================================ */
  async loadLaporan() {
    // Korlap: lihat semua dari tim di krosda-nya
    // PPA/Pekarya: lihat milik sendiri
    if (this.isKorlap) {
      this.allLaporan = await API.getLaporan(null, null);
    } else {
      this.allLaporan = await API.getLaporan(this.pegawai?.id, null);
    }

    this.renderList();
    this.updateTabCounts();
  },

  renderList() {
    const el = document.getElementById('lapList');
    if (!el) return;

    const filter = this.state.filterStatus;
    const list = filter === 'Semua'
      ? this.allLaporan
      : this.allLaporan.filter(l => l.status === filter);

    if (!list.length) {
      el.innerHTML = `
        <div class="card">
          <div class="empty">
            <i data-lucide="inbox"></i>
            ${filter === 'Semua' ? 'Belum ada laporan' : `Tidak ada laporan dengan status "${filter}"`}
          </div>
        </div>`;
      if (window.lucide) lucide.createIcons();
      return;
    }

    el.innerHTML = list.map(l => this.renderItem(l)).join('');
    this.bindItemEvents();

    if (window.lucide) lucide.createIcons();
  },

  renderItem(l) {
    const statusCls = {
      'Menunggu': 'status-menunggu',
      'Diproses': 'status-diproses',
      'Disetujui': 'status-disetujui',
      'Revisi': 'status-revisi'
    }[l.status] || '';

    const badgeCls = {
      'Menunggu': 'b-wait',
      'Diproses': 'b-proc',
      'Disetujui': 'b-ok',
      'Revisi': 'b-rev'
    }[l.status] || 'b-wait';

    const sifatCls = l.sifat === 'Darurat' ? 'b-rev' : l.sifat === 'Prioritas' ? 'b-wait' : 'chip-o';

    return `
      <div class="lap-item ${statusCls}" data-lap-id="${l.id}">
        <div class="lap-head">
          <span class="lap-id">${l.id}</span>
          <span class="badge ${badgeCls}">
            <span class="dot"></span>${l.status}
          </span>
        </div>

        <div class="lap-title">${l.judul}</div>

        <div class="lap-meta">
          <span><i data-lucide="user"></i>${l.pegawaiNama || '—'}</span>
          <span><i data-lucide="map-pin"></i>${l.krosda || '—'}</span>
          <span><i data-lucide="calendar"></i>${dateShort(l.tanggal)}</span>
        </div>

        <div class="lap-tags">
          <span class="chip-o">${l.jenis}</span>
          ${l.sifat && l.sifat !== 'Normal' ? `<span class="badge ${sifatCls}" style="padding:3px 8px;font-size:10px">${l.sifat}</span>` : ''}
        </div>

        ${l.file ? `
          <div class="lap-foto">
            <img src="${l.file}" alt="Foto" onclick="event.stopPropagation();Laporan.lihatFoto('${l.file}')">
          </div>` : ''}

        ${this.isKorlap && l.status === 'Menunggu' ? `
          <div class="verif-actions-row">
            <button class="btn-ok" data-verif="ok" data-id="${l.id}">
              <i data-lucide="check"></i> Setujui
            </button>
            <button class="btn-no" data-verif="no" data-id="${l.id}">
              <i data-lucide="x"></i> Tolak
            </button>
            <button class="btn-det" data-verif="det" data-id="${l.id}">
              <i data-lucide="eye"></i> Detail
            </button>
          </div>` : ''}
      </div>`;
  },

  bindItemEvents() {
    document.querySelectorAll('.lap-item').forEach(item => {
      const id = item.dataset.lapId;

      // Klik item → detail
      item.addEventListener('click', (e) => {
        if (e.target.closest('.verif-actions-row')) return;
        if (e.target.closest('.lap-foto')) return;
        this.showDetail(id);
      });

      // Tombol verifikasi
      item.querySelectorAll('[data-verif]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const action = btn.dataset.verif;
          if (action === 'ok') this.approve(id);
          else if (action === 'no') this.reject(id);
          else if (action === 'det') this.showDetail(id);
        });
      });
    });
  },

  /* ============================================================
     VERIFIKASI (KORLAP)
     ============================================================ */
  async approve(id) {
    if (!confirm('Setujui laporan ini?')) return;
    try {
      await API.request(`laporan?id=eq.${id}`, 'PATCH', {
        status: 'Disetujui',
        verified_at: new Date().toISOString()
      }).catch(() => {
        // Fallback untuk dummy mode
        const l = this.allLaporan.find(x => x.id === id);
        if (l) l.status = 'Disetujui';
      });
      toast('Laporan disetujui.', 'success');
      await this.loadLaporan();
      this.renderStats();
    } catch (e) {
      toast('Gagal: ' + e.message, 'error');
    }
  },

  async reject(id) {
    const catatan = prompt('Alasan penolakan / revisi:', 'Perlu perbaikan data');
    if (catatan === null) return;
    try {
      await API.request(`laporan?id=eq.${id}`, 'PATCH', {
        status: 'Revisi',
        catatan: catatan
      }).catch(() => {
        const l = this.allLaporan.find(x => x.id === id);
        if (l) l.status = 'Revisi';
      });
      toast('Laporan dikembalikan untuk revisi.', 'warn');
      await this.loadLaporan();
      this.renderStats();
    } catch (e) {
      toast('Gagal: ' + e.message, 'error');
    }
  },

  showDetail(id) {
    const l = this.allLaporan.find(x => x.id === id);
    if (!l) return;

    openModal(`
      <div class="m-head">
        <span class="m-file" style="background:var(--blue-soft);color:var(--blue)">
          <i data-lucide="file-text"></i>
        </span>
        <div class="m-tt">
          <h4>${l.judul}</h4>
          <p>${l.id}</p>
        </div>
        <button class="icon-btn" data-close aria-label="Tutup"><i data-lucide="x"></i></button>
      </div>
      <div class="m-body">
        <div style="display:flex;flex-direction:column;gap:12px">
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <span class="chip-o">${l.jenis}</span>
            <span class="chip-o">${l.sifat || 'Normal'}</span>
            <span class="chip-o">${l.krosda || '—'}</span>
          </div>

          <div>
            <span class="kicker">Uraian</span>
            <p style="font:500 14px/1.6 var(--font);color:var(--ink-2);margin-top:6px">
              ${l.deskripsi || '—'}
            </p>
          </div>

          <div>
            <span class="kicker">Lokasi</span>
            <p style="font:600 13.5px var(--font);color:var(--ink);margin-top:6px">
              ${l.lokasi || '—'}
            </p>
          </div>

          ${l.file ? `
            <div>
              <span class="kicker">Foto Bukti</span>
              <img src="${l.file}" style="max-width:100%;border-radius:12px;margin-top:8px" alt="">
            </div>` : ''}

          <div style="padding-top:12px;border-top:1px dashed var(--line);font:600 12px var(--mono);color:var(--muted)">
            Dibuat: ${dateShort(l.tanggal)} · Pelapor: ${l.pegawaiNama || '—'}
          </div>
        </div>
      </div>
      <div class="m-foot">
        <button class="btn btn-ghost" data-close>Tutup</button>
      </div>`);
  },

  lihatFoto(url) {
    openModal(`
      <div class="m-head">
        <span class="m-file" style="background:var(--blue-soft);color:var(--blue)">
          <i data-lucide="image"></i>
        </span>
        <div class="m-tt">
          <h4>Foto Laporan</h4>
          <p>Bukti visual</p>
        </div>
        <button class="icon-btn" data-close aria-label="Tutup"><i data-lucide="x"></i></button>
      </div>
      <div class="m-body" style="text-align:center">
        <img src="${url}" style="max-width:100%;border-radius:16px" alt="">
      </div>
      <div class="m-foot">
        <button class="btn btn-ghost" data-close>Tutup</button>
      </div>`);
  },

  /* ============================================================
     STATS & COUNTS
     ============================================================ */
  renderStats() {
    const el = document.getElementById('lapStats');
    if (!el) return;

    const total = this.allLaporan.length;
    const menunggu = this.allLaporan.filter(l => l.status === 'Menunggu').length;
    const disetujui = this.allLaporan.filter(l => l.status === 'Disetujui').length;
    const revisi = this.allLaporan.filter(l => l.status === 'Revisi').length;

    el.innerHTML = `
      <div class="stat">
        <span class="ic ic-blue"><i data-lucide="file-text"></i></span>
        <div><b>${total}</b><span>Total</span></div>
      </div>
      <div class="stat">
        <span class="ic ic-amber"><i data-lucide="clock"></i></span>
        <div><b>${menunggu}</b><span>Menunggu</span></div>
      </div>
      <div class="stat">
        <span class="ic ic-green"><i data-lucide="check-circle"></i></span>
        <div><b>${disetujui}</b><span>Disetujui</span></div>
      </div>
      <div class="stat">
        <span class="ic ic-red"><i data-lucide="rotate-ccw"></i></span>
        <div><b>${revisi}</b><span>Revisi</span></div>
      </div>`;
    if (window.lucide) lucide.createIcons();
  },

  updateTabCounts() {
    document.querySelectorAll('[data-count]').forEach(el => {
      const status = el.dataset.count;
      const count = status === 'Semua'
        ? this.allLaporan.length
        : this.allLaporan.filter(l => l.status === status).length;
      el.textContent = count;
    });
  },

  /* ============================================================
     UTILITY
     ============================================================ */
  blobToDataURL(blob) {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.onerror = reject;
      r.readAsDataURL(blob);
    });
  }
};

window.Laporan = Laporan;