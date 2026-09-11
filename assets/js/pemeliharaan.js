/* =================================================================
   pemeliharaan.js — Logic Pemeliharaan Saluran (Pekarya)
   - Checklist pekerjaan
   - Progress ruas
   - Foto bukti
   ================================================================= */

const Pemeliharaan = {
  state: {
    jenis: [],
    status: 'selesai',
    ruas: '',
    deskripsi: '',
    foto: null,
    fotoMeta: null,
    checklist: {}
  },

  pegawai: null,

  // Checklist standar pemeliharaan
  CHECKLIST: [
    { id: 'babat',     label: 'Babat Rumput',       desc: 'Pembersihan rumput di tepi saluran' },
    { id: 'sedimen',   label: 'Bersih Sedimen',     desc: 'Pengangkatan endapan/lumpur' },
    { id: 'talud',     label: 'Perbaikan Talud',    desc: 'Perbaikan dinding saluran' },
    { id: 'bocoran',   label: 'Perbaikan Bocoran',  desc: 'Penutupan kebocoran kecil' },
    { id: 'pintu',     label: 'Perawatan Pintu',    desc: 'Pengecatan & pelumasan pintu' }
  ],

  /* ============================================================
     RENDER
     ============================================================ */
  async render() {
    const pegawai = Auth.getPegawaiAktif();
    this.pegawai = pegawai;

    this.renderForm(pegawai);
    this.renderRiwayat(pegawai);
    this.renderStats(pegawai);

    if (window.lucide) lucide.createIcons();
  },

  /* ============================================================
     FORM PEMELIHARAAN
     ============================================================ */
  renderForm(pegawai) {
    const el = document.getElementById('pemForm');
    if (!el) return;

    // Daftar ruas
    const ruasList = pegawai?.ruas
      ? [pegawai.ruas]
      : ['Sekunder Glagahagung', 'Primer Baru', 'Sekunder Bulurejo', 'Sekunder Bangorejo'];

    el.innerHTML = `
      <div class="card form-card">
        <div class="card-head">
          <div>
            <span class="kicker">Formulir Pemeliharaan</span>
            <h3><i data-lucide="shovel"></i> Catat Pemeliharaan</h3>
          </div>
        </div>

        <form id="formPem" novalidate>

          <!-- Ruas Saluran -->
          <div class="field" id="fRuas">
            <label for="pemRuas">Ruas Saluran</label>
            <div class="sel-wrap">
              <select id="pemRuas">
                <option value="">Pilih ruas…</option>
                ${ruasList.map(r => `<option value="${r}">${r}</option>`).join('')}
              </select>
              <i data-lucide="chevron-down"></i>
            </div>
            <span class="err">Pilih ruas saluran yang dipelihara.</span>
          </div>

          <!-- Checklist Pekerjaan -->
          <div class="field">
            <label>Jenis Pekerjaan (pilih satu atau lebih)</label>
            <div class="checklist" id="pemChecklist">
              ${this.CHECKLIST.map(c => `
                <div class="check-item" data-check="${c.id}">
                  <span class="ci-box"><i data-lucide="check"></i></span>
                  <span class="ci-lbl">
                    <b>${c.label}</b>
                    <span>${c.desc}</span>
                  </span>
                  <span class="ci-foto" data-foto="${c.id}" title="Ambil foto">
                    <i data-lucide="camera"></i>
                  </span>
                </div>`).join('')}
            </div>
          </div>

          <!-- Status -->
          <div class="field">
            <label>Status Pekerjaan</label>
            <div class="jenis-pick" id="pemStatus" style="grid-template-columns:1fr 1fr 1fr">
              <button type="button" class="jenis-opt on" data-status="selesai">
                <span class="jo-ic" style="background:var(--green-soft);color:var(--green)">
                  <i data-lucide="check-circle"></i>
                </span>
                <span class="jo-txt">
                  <span class="jo-lbl">Selesai</span>
                </span>
              </button>
              <button type="button" class="jenis-opt" data-status="proses">
                <span class="jo-ic" style="background:var(--amber-soft);color:var(--amber)">
                  <i data-lucide="loader"></i>
                </span>
                <span class="jo-txt">
                  <span class="jo-lbl">Proses</span>
                </span>
              </button>
              <button type="button" class="jenis-opt" data-status="belum">
                <span class="jo-ic" style="background:var(--line-soft);color:var(--muted)">
                  <i data-lucide="circle"></i>
                </span>
                <span class="jo-txt">
                  <span class="jo-lbl">Belum</span>
                </span>
              </button>
            </div>
          </div>

          <!-- Deskripsi -->
          <div class="field">
            <label for="pemDesk">Catatan (opsional)</label>
            <textarea id="pemDesk" rows="2" placeholder="Kondisi khusus, kendala, dll..."></textarea>
          </div>

          <!-- Foto Utama -->
          <div class="field">
            <label>Foto Bukti Pemeliharaan</label>
            <div class="foto-compare" style="grid-template-columns:1fr">
              <div class="foto-box" id="fotoPem" role="button" tabindex="0" style="min-height:140px">
                <div class="fb-ic"><i data-lucide="camera"></i></div>
                <div class="fb-txt">
                  <b>Foto Pekerjaan</b>
                  <small>Ketuk untuk ambil</small>
                </div>
              </div>
            </div>
          </div>

          <!-- Submit -->
          <button class="btn btn-blue btn-block" type="submit" style="padding:14px;font-size:14.5px">
            <i data-lucide="save"></i> Simpan Pemeliharaan
          </button>

        </form>
      </div>`;

    // Bind checklist
    document.querySelectorAll('#pemChecklist .check-item').forEach(item => {
      item.addEventListener('click', (e) => {
        // Klik tombol foto → buka kamera
        if (e.target.closest('.ci-foto')) {
          e.stopPropagation();
          this.ambilFotoCheck(item.dataset.check);
          return;
        }
        // Klik item → toggle
        item.classList.toggle('on');
        const id = item.dataset.check;
        if (item.classList.contains('on')) {
          this.state.checklist[id] = true;
        } else {
          delete this.state.checklist[id];
        }
      });
    });

    // Bind status picker
    document.querySelectorAll('#pemStatus .jenis-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#pemStatus .jenis-opt').forEach(b => b.classList.remove('on'));
        btn.classList.add('on');
        this.state.status = btn.dataset.status;
      });
    });

    // Bind foto utama
    document.getElementById('fotoPem')?.addEventListener('click', (e) => {
      if (e.target.closest('.fb-overlay')) return;
      if (this.state.foto) return;
      this.ambilFoto('foto');
    });

    // Bind submit
    document.getElementById('formPem')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.submit();
    });

    if (window.lucide) lucide.createIcons();
  },

  /* ============================================================
     FOTO
     ============================================================ */
  async ambilFoto(targetKey) {
    await Camera.open(targetKey, async (blob, meta) => {
      this.state[targetKey] = blob;
      this.state[targetKey + 'Meta'] = meta;
      this.renderFotoPreview(targetKey);
    });
  },

  renderFotoPreview(targetKey) {
    const box = document.getElementById('fotoPem');
    if (!box) return;

    const blob = this.state[targetKey];
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
        <b>Foto Pekerjaan</b>
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
    const box = document.getElementById('fotoPem');
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
        <b>Foto Pekerjaan</b>
        <small>Ketuk untuk ambil</small>
      </div>`;
    if (window.lucide) lucide.createIcons();
  },

  ambilFotoCheck(checkId) {
    // Sama seperti ambil foto biasa, tapi simpan di checklist
    Camera.open('fotoPem', async (blob, meta) => {
      const item = document.querySelector(`[data-check="${checkId}"]`);
      if (item) {
        item.classList.add('has-photo', 'on');
        this.state.checklist[checkId] = true;
      }
      // Simpan sebagai foto utama kalau belum ada
      if (!this.state.foto) {
        this.state.foto = blob;
        this.state.fotoMeta = meta;
        this.renderFotoPreview('foto');
      }
      toast('Foto pekerjaan tersimpan.', 'success');
    });
  },

  /* ============================================================
     SUBMIT
     ============================================================ */
  async submit() {
    const ruas = document.getElementById('pemRuas').value.trim();
    const desk = document.getElementById('pemDesk').value.trim();

    let ok = true;
    const mark = (id, bad) => {
      document.getElementById(id).classList.toggle('invalid', bad);
      if (bad) ok = false;
    };

    mark('fRuas', !ruas);

    // Minimal pilih 1 checklist
    if (Object.keys(this.state.checklist).length === 0) {
      toast('Pilih minimal 1 jenis pekerjaan.', 'warn');
      return;
    }

    if (!ok) {
      toast('Periksa kembali isian yang ditandai merah.', 'warn');
      return;
    }

    toast('Menyimpan pemeliharaan...', 'info');

    try {
      const now = new Date();
      const pegawai = this.pegawai;
      const namaDepan = pegawai?.nama?.split(' ')[0] || 'Pekarya';

      const jenisList = Object.keys(this.state.checklist).map(id => {
        const c = this.CHECKLIST.find(x => x.id === id);
        return c ? c.label : id;
      });

      const watermarkTxt =
        `${namaDepan}\n${dateLong(now)}\n${timeFull(now)} WIB\n` +
        `Ruas: ${ruas}`;

      let fotoUrl = null;
      if (this.state.foto) {
        const wm = await watermarkFoto(this.state.foto, watermarkTxt);
        fotoUrl = await this.blobToDataURL(wm);
      }

      await API.submitPemeliharaan({
        pegawaiId: pegawai?.id,
        pegawaiNama: pegawai?.nama,
        pegawaiFotoPas: pegawai?.foto_pas,
        role: 'pekarya',
        krosda: pegawai?.krosda,
        ruas: ruas,
        jenis: jenisList.join(', '),
        status: this.state.status,
        foto: fotoUrl,
        deskripsi: desk || null,
        tanggal: isoDate(now)
      });

      toast(`Pemeliharaan <b>${ruas}</b> berhasil dicatat.`, 'success');

      this.resetForm();
      this.renderRiwayat(pegawai);
      this.renderStats(pegawai);

    } catch (e) {
      console.error(e);
      toast('Gagal menyimpan pemeliharaan: ' + e.message, 'error');
    }
  },

  resetForm() {
    this.state = {
      jenis: [],
      status: 'selesai',
      ruas: '',
      deskripsi: '',
      foto: null,
      fotoMeta: null,
      checklist: {}
    };

    document.getElementById('pemRuas').value = '';
    document.getElementById('pemDesk').value = '';

    document.querySelectorAll('#pemChecklist .check-item').forEach(item => {
      item.classList.remove('on', 'has-photo');
    });

    document.querySelectorAll('#pemStatus .jenis-opt').forEach((b, i) => {
      b.classList.toggle('on', i === 0);
    });

    this.hapusFoto();
  },

  /* ============================================================
     RIWAYAT
     ============================================================ */
  async renderRiwayat(pegawai) {
    const el = document.getElementById('pemRiwayat');
    if (!el) return;

    const list = await API.getPemeliharaan(pegawai?.id, 15);

    if (!list.length) {
      el.innerHTML = '<div class="empty"><i data-lucide="inbox"></i>Belum ada pemeliharaan</div>';
      if (window.lucide) lucide.createIcons();
      return;
    }

    el.innerHTML = list.map(p => {
      const statusCls = p.status === 'selesai' ? 'ok' : p.status === 'proses' ? 'warn' : '';
      const statusIcon = p.status === 'selesai' ? 'check-circle' : p.status === 'proses' ? 'loader' : 'circle';
      const statusColor = p.status === 'selesai' ? 'ic-green' : p.status === 'proses' ? 'ic-amber' : 'ic-ink';

      return `
        <div class="ruas-item">
          <div class="ruas-ic" style="background:${p.status === 'selesai' ? 'var(--green-soft)' : p.status === 'proses' ? 'var(--amber-soft)' : 'var(--line-soft)'};color:${p.status === 'selesai' ? 'var(--green)' : p.status === 'proses' ? 'var(--amber)' : 'var(--muted)'}">
            <i data-lucide="${statusIcon}"></i>
          </div>
          <div class="ruas-body">
            <b>${p.ruas}</b>
            <span>${p.jenis}</span>
            <div class="ruas-progress">
              <div class="rp-track">
                <div class="rp-fill ${statusCls}" style="width:${p.status === 'selesai' ? 100 : p.status === 'proses' ? 50 : 0}%"></div>
              </div>
              <span class="rp-val">${p.status === 'selesai' ? '100%' : p.status === 'proses' ? '50%' : '0%'}</span>
            </div>
            <div style="font:600 11px var(--mono);color:var(--muted);margin-top:6px">
              ${dateShort(p.tanggal)} · ${p.status.toUpperCase()}
            </div>
          </div>
        </div>`;
    }).join('');

    if (window.lucide) lucide.createIcons();
  },

  /* ============================================================
     STATS
     ============================================================ */
  async renderStats(pegawai) {
    const el = document.getElementById('pemStats');
    if (!el) return;

    const list = await API.getPemeliharaan(pegawai?.id, 100);
    const bulanIni = list.filter(p => p.tanggal.startsWith(isoMonth(new Date())));

    const selesai = bulanIni.filter(p => p.status === 'selesai').length;
    const proses = bulanIni.filter(p => p.status === 'proses').length;
    const belum = bulanIni.filter(p => p.status === 'belum').length;

    el.innerHTML = `
      <div class="stat">
        <span class="ic ic-green"><i data-lucide="check-circle"></i></span>
        <div><b>${selesai}</b><span>Selesai</span></div>
      </div>
      <div class="stat">
        <span class="ic ic-amber"><i data-lucide="loader"></i></span>
        <div><b>${proses}</b><span>Proses</span></div>
      </div>
      <div class="stat">
        <span class="ic ic-ink"><i data-lucide="circle"></i></span>
        <div><b>${belum}</b><span>Belum</span></div>
      </div>
      <div class="stat">
        <span class="ic ic-blue"><i data-lucide="activity"></i></span>
        <div><b>${bulanIni.length}</b><span>Total Bulan Ini</span></div>
      </div>`;

    if (window.lucide) lucide.createIcons();
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

window.Pemeliharaan = Pemeliharaan;