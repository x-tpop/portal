/* =================================================================
   operasi.js — Logic Operasi Pintu Air (PPA)
   - Form buka/tutup pintu
   - Catat tinggi muka air & debit
   - Foto sebelum/sesudah + saksi
   - Riwayat operasi
   ================================================================= */

const Operasi = {
  state: {
    jenis: 'buka',
    tinggi: null,
    debit: null,
    pintu: '',
    saksi: '',
    catatan: '',
    fotoSebelum: null,
    fotoSesudah: null,
    fotoSebelumMeta: null,
    fotoSesudahMeta: null
  },

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
     FORM OPERASI
     ============================================================ */
  renderForm(pegawai) {
    const el = document.getElementById('opForm');
    if (!el) return;

    // Daftar pintu yang dijaga
    const pintuList = pegawai?.pintu
      ? pegawai.pintu.split(',').map(p => p.trim())
      : ['B.NGRO.1', 'B.NGRO.2', 'B.NGRO.3', 'B.NGRO.4', 'B.NGRO.5'];

    el.innerHTML = `
      <div class="card form-card">
        <div class="card-head">
          <div>
            <span class="kicker">Formulir Operasi</span>
            <h3><i data-lucide="droplets"></i> Catat Operasi Pintu</h3>
          </div>
          <span class="badge b-proc"><span class="dot"></span>${pintuList.length} pintu</span>
        </div>

        <form id="formOperasi" novalidate>

          <!-- Jenis Operasi -->
          <div class="field">
            <label>Jenis Operasi</label>
            <div class="jenis-pick" id="jenisPick">
              <button type="button" class="jenis-opt on" data-jenis="buka">
                <span class="jo-ic"><i data-lucide="arrow-up"></i></span>
                <span class="jo-txt">
                  <span class="jo-lbl">Buka</span>
                  <span class="jo-sub">Menambah debit</span>
                </span>
              </button>
              <button type="button" class="jenis-opt" data-jenis="tutup">
                <span class="jo-ic"><i data-lucide="arrow-down"></i></span>
                <span class="jo-txt">
                  <span class="jo-lbl">Tutup</span>
                  <span class="jo-sub">Mengurangi debit</span>
                </span>
              </button>
              <button type="button" class="jenis-opt" data-jenis="setengah">
                <span class="jo-ic"><i data-lucide="minus"></i></span>
                <span class="jo-txt">
                  <span class="jo-lbl">Setengah</span>
                  <span class="jo-sub">Posisi tengah</span>
                </span>
              </button>
            </div>
          </div>

          <!-- Pintu -->
          <div class="field" id="fPintu">
            <label for="opPintu">Pintu Air</label>
            <div class="sel-wrap">
              <select id="opPintu">
                <option value="">Pilih pintu…</option>
                ${pintuList.map(p => `<option value="${p}">${p}</option>`).join('')}
              </select>
              <i data-lucide="chevron-down"></i>
            </div>
            <span class="err">Pilih pintu air yang dioperasikan.</span>
          </div>

          <!-- Tinggi & Debit -->
          <div class="frow">
            <div class="field" id="fTinggi">
              <label for="opTinggi">Tinggi Muka Air</label>
              <div class="input-unit">
                <input id="opTinggi" type="number" min="0" max="500" placeholder="0" inputmode="numeric">
                <span class="unit">cm</span>
              </div>
              <span class="err">Masukkan tinggi muka air (0-500 cm).</span>
            </div>
            <div class="field" id="fDebit">
              <label for="opDebit">Debit</label>
              <div class="input-unit">
                <input id="opDebit" type="number" min="0" max="100" step="0.01" placeholder="0.00" inputmode="decimal">
                <span class="unit">m³/dtk</span>
              </div>
              <span class="err">Masukkan debit air (0-100 m³/dtk).</span>
            </div>
          </div>

          <!-- Saksi -->
          <div class="field">
            <label for="opSaksi">Saksi (opsional)</label>
            <input id="opSaksi" placeholder="Nama juru / petugas lain">
          </div>

          <!-- Catatan -->
          <div class="field">
            <label for="opCatatan">Catatan (opsional)</label>
            <textarea id="opCatatan" rows="2" placeholder="Kondisi khusus, cuaca, dll..."></textarea>
          </div>

          <!-- Foto Sebelum & Sesudah -->
          <div class="field">
            <label>Foto Bukti</label>
            <div class="foto-compare">
              <div class="foto-box" id="fotoSebelum" role="button" tabindex="0">
                <div class="fb-ic"><i data-lucide="camera"></i></div>
                <div class="fb-txt">
                  <b>Sebelum</b>
                  <small>Ketuk untuk ambil</small>
                </div>
              </div>
              <div class="foto-box" id="fotoSesudah" role="button" tabindex="0">
                <div class="fb-ic"><i data-lucide="camera"></i></div>
                <div class="fb-txt">
                  <b>Sesudah</b>
                  <small>Ketuk untuk ambil</small>
                </div>
              </div>
            </div>
          </div>

          <!-- Submit -->
          <button class="btn btn-blue btn-block" type="submit" style="padding:14px;font-size:14.5px">
            <i data-lucide="save"></i> Simpan Operasi
          </button>

        </form>
      </div>`;

    // Bind jenis picker
    document.querySelectorAll('#jenisPick .jenis-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#jenisPick .jenis-opt').forEach(b => b.classList.remove('on'));
        btn.classList.add('on');
        this.state.jenis = btn.dataset.jenis;
      });
    });

    // Bind foto
    document.getElementById('fotoSebelum')?.addEventListener('click', (e) => {
      if (e.target.closest('.fb-overlay')) return;
      if (this.state.fotoSebelum) return;
      this.ambilFoto('fotoSebelum');
    });
    document.getElementById('fotoSesudah')?.addEventListener('click', (e) => {
      if (e.target.closest('.fb-overlay')) return;
      if (this.state.fotoSesudah) return;
      this.ambilFoto('fotoSesudah');
    });

    // Bind submit
    document.getElementById('formOperasi')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.submit();
    });

    if (window.lucide) lucide.createIcons();
  },

  /* ============================================================
     AMBIL FOTO
     ============================================================ */
  async ambilFoto(targetKey) {
    await Camera.open(targetKey, async (blob, meta) => {
      this.state[targetKey] = blob;
      this.state[targetKey + 'Meta'] = meta;
      this.renderFotoPreview(targetKey);
    });
  },

  renderFotoPreview(targetKey) {
    const boxId = targetKey === 'fotoSebelum' ? 'fotoSebelum' : 'fotoSesudah';
    const box = document.getElementById(boxId);
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
        <b>${targetKey === 'fotoSebelum' ? 'Sebelum' : 'Sesudah'}</b>
        <button type="button" class="fb-del" data-hapus="${targetKey}" aria-label="Hapus">
          <i data-lucide="x"></i>
        </button>
      </div>`;

    box.querySelector('[data-hapus]')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.hapusFoto(targetKey);
    });

    if (window.lucide) lucide.createIcons();
  },

  hapusFoto(targetKey) {
    const boxId = targetKey === 'fotoSebelum' ? 'fotoSebelum' : 'fotoSesudah';
    const box = document.getElementById(boxId);
    if (box?._objectUrl) {
      URL.revokeObjectURL(box._objectUrl);
      box._objectUrl = null;
    }
    this.state[targetKey] = null;
    this.state[targetKey + 'Meta'] = null;

    if (!box) return;
    box.classList.remove('has-photo');
    box.innerHTML = `
      <div class="fb-ic"><i data-lucide="camera"></i></div>
      <div class="fb-txt">
        <b>${targetKey === 'fotoSebelum' ? 'Sebelum' : 'Sesudah'}</b>
        <small>Ketuk untuk ambil</small>
      </div>`;
    if (window.lucide) lucide.createIcons();
  },

  /* ============================================================
     SUBMIT OPERASI
     ============================================================ */
  async submit() {
    const pintu = document.getElementById('opPintu').value.trim();
    const tinggi = parseInt(document.getElementById('opTinggi').value);
    const debit = parseFloat(document.getElementById('opDebit').value);
    const saksi = document.getElementById('opSaksi').value.trim();
    const catatan = document.getElementById('opCatatan').value.trim();

    let ok = true;
    const mark = (id, bad) => {
      document.getElementById(id).classList.toggle('invalid', bad);
      if (bad) ok = false;
    };

    mark('fPintu', !pintu);
    mark('fTinggi', isNaN(tinggi) || tinggi < 0 || tinggi > 500);
    mark('fDebit', isNaN(debit) || debit < 0 || debit > 100);

    if (!ok) {
      toast('Periksa kembali isian yang ditandai merah.', 'warn');
      return;
    }

    toast('Menyimpan operasi...', 'info');

    try {
      const now = new Date();
      const pegawai = this.pegawai;
      const namaDepan = pegawai?.nama?.split(' ')[0] || 'PPA';

      const watermarkTxt =
        `${namaDepan}\n${dateLong(now)}\n${timeFull(now)} WIB\n` +
        `Pintu: ${pintu} · ${this.state.jenis.toUpperCase()}`;

      // Watermark foto (kalau ada)
      let fotoSebelumUrl = null;
      let fotoSesudahUrl = null;

      if (this.state.fotoSebelum) {
        const wm = await watermarkFoto(this.state.fotoSebelum, watermarkTxt);
        fotoSebelumUrl = await this.blobToDataURL(wm);
      }
      if (this.state.fotoSesudah) {
        const wm = await watermarkFoto(this.state.fotoSesudah, watermarkTxt);
        fotoSesudahUrl = await this.blobToDataURL(wm);
      }

      const hasil = await API.submitOperasi({
        pegawaiId: pegawai?.id,
        pegawaiNama: pegawai?.nama,
        pegawaiFotoPas: pegawai?.foto_pas,
        role: 'ppa',
        krosda: pegawai?.krosda,
        pintu: pintu,
        jenis: this.state.jenis,
        tinggi: tinggi,
        debit: debit,
        waktu: now.toISOString(),
        fotoSebelum: fotoSebelumUrl,
        fotoSesudah: fotoSesudahUrl,
        saksi: saksi || null,
        catatan: catatan || null
      });

      toast(`Operasi <b>${this.state.jenis}</b> di ${pintu} berhasil dicatat.`, 'success');

      // Reset form
      this.resetForm();
      this.renderRiwayat(pegawai);
      this.renderStats(pegawai);

    } catch (e) {
      console.error(e);
      toast('Gagal menyimpan operasi: ' + e.message, 'error');
    }
  },

  resetForm() {
    this.state = {
      jenis: 'buka',
      tinggi: null,
      debit: null,
      pintu: '',
      saksi: '',
      catatan: '',
      fotoSebelum: null,
      fotoSesudah: null,
      fotoSebelumMeta: null,
      fotoSesudahMeta: null
    };

    // Reset jenis picker
    document.querySelectorAll('#jenisPick .jenis-opt').forEach((b, i) => {
      b.classList.toggle('on', i === 0);
    });

    // Reset fields
    document.getElementById('opPintu').value = '';
    document.getElementById('opTinggi').value = '';
    document.getElementById('opDebit').value = '';
    document.getElementById('opSaksi').value = '';
    document.getElementById('opCatatan').value = '';

    // Reset foto
    ['fotoSebelum', 'fotoSesudah'].forEach(key => {
      const box = document.getElementById(key);
      if (box) {
        if (box._objectUrl) URL.revokeObjectURL(box._objectUrl);
        box.classList.remove('has-photo');
        box.innerHTML = `
          <div class="fb-ic"><i data-lucide="camera"></i></div>
          <div class="fb-txt">
            <b>${key === 'fotoSebelum' ? 'Sebelum' : 'Sesudah'}</b>
            <small>Ketuk untuk ambil</small>
          </div>`;
      }
    });

    if (window.lucide) lucide.createIcons();
  },

  /* ============================================================
     RIWAYAT OPERASI
     ============================================================ */
  async renderRiwayat(pegawai) {
    const el = document.getElementById('opRiwayat');
    if (!el) return;

    const list = await API.getOperasiPintu(pegawai?.id, 15);

    if (!list.length) {
      el.innerHTML = '<div class="empty"><i data-lucide="inbox"></i>Belum ada operasi</div>';
      if (window.lucide) lucide.createIcons();
      return;
    }

    el.innerHTML = list.map(o => `
      <div class="op-item">
        <div class="op-badge ${o.jenis}">
          <i data-lucide="${o.jenis === 'buka' ? 'arrow-up' : o.jenis === 'tutup' ? 'arrow-down' : 'minus'}"></i>
        </div>
        <div class="op-body">
          <div class="op-title">
            <b>${o.pintu}</b>
            <span class="op-jenis ${o.jenis}">${o.jenis}</span>
          </div>
          <div class="op-detail">
            Tinggi <code>${o.tinggi} cm</code> · Debit <code>${o.debit} m³/dtk</code>
            ${o.saksi ? `<br>Saksi: ${o.saksi}` : ''}
            ${o.catatan ? `<br>${o.catatan}` : ''}
          </div>
          <div class="op-meta">${dateShort(o.waktu)} · ${timeShort(o.waktu)} WIB</div>
          ${(o.fotoSebelum || o.fotoSesudah) ? `
            <div class="op-foto">
              ${o.fotoSebelum ? `<img src="${o.fotoSebelum}" alt="Sebelum" onclick="Operasi.lihatFoto('${o.fotoSebelum}')">` : ''}
              ${o.fotoSesudah ? `<img src="${o.fotoSesudah}" alt="Sesudah" onclick="Operasi.lihatFoto('${o.fotoSesudah}')">` : ''}
            </div>` : ''}
        </div>
      </div>`).join('');

    if (window.lucide) lucide.createIcons();
  },

  lihatFoto(url) {
    openModal(`
      <div class="m-head">
        <span class="m-file" style="background:var(--blue-soft);color:var(--blue)">
          <i data-lucide="image"></i>
        </span>
        <div class="m-tt">
          <h4>Foto Operasi</h4>
          <p>Bukti visual</p>
        </div>
        <button class="icon-btn" data-close aria-label="Tutup"><i data-lucide="x"></i></button>
      </div>
      <div class="m-body" style="text-align:center">
        <img src="${url}" style="max-width:100%;border-radius:16px;box-shadow:var(--shadow-lg)" alt="">
      </div>
      <div class="m-foot">
        <button class="btn btn-ghost" data-close>Tutup</button>
      </div>`);
  },

  /* ============================================================
     STATS
     ============================================================ */
  async renderStats(pegawai) {
    const el = document.getElementById('opStats');
    if (!el) return;

    const list = await API.getOperasiPintu(pegawai?.id, 100);
    const bulanIni = list.filter(o => o.waktu.startsWith(isoMonth(new Date())));

    const buka = bulanIni.filter(o => o.jenis === 'buka').length;
    const tutup = bulanIni.filter(o => o.jenis === 'tutup').length;
    const setengah = bulanIni.filter(o => o.jenis === 'setengah').length;
    const total = bulanIni.length;

    el.innerHTML = `
      <div class="stat">
        <span class="ic ic-blue"><i data-lucide="arrow-up"></i></span>
        <div><b>${buka}</b><span>Buka</span></div>
      </div>
      <div class="stat">
        <span class="ic ic-red"><i data-lucide="arrow-down"></i></span>
        <div><b>${tutup}</b><span>Tutup</span></div>
      </div>
      <div class="stat">
        <span class="ic ic-amber"><i data-lucide="minus"></i></span>
        <div><b>${setengah}</b><span>Setengah</span></div>
      </div>
      <div class="stat">
        <span class="ic ic-green"><i data-lucide="activity"></i></span>
        <div><b>${total}</b><span>Total Bulan Ini</span></div>
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

window.Operasi = Operasi;