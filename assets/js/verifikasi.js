/* =================================================================
   verifikasi.js — Logic Verifikasi Korlap
   Antrian presensi di luar radius → approve / reject
   ================================================================= */

const Verifikasi = {
  filter: 'pending',

  async render() {
    const el = document.getElementById('verifContent');
    if (!el) return;

    el.innerHTML = `
      <div class="card">
        <div class="card-head">
          <div>
            <span class="kicker">Verifikasi Korlap</span>
            <h3>Presensi di Luar Radius</h3>
          </div>
          <div class="tabs" id="verifTabs">
            <button class="tab on" data-filter="pending">Pending</button>
            <button class="tab" data-filter="verified">Disetujui</button>
            <button class="tab" data-filter="rejected">Ditolak</button>
            <button class="tab" data-filter="all">Semua</button>
          </div>
        </div>
        <div id="verifList"></div>
      </div>`;

    // Bind tabs
    document.querySelectorAll('#verifTabs .tab').forEach(t => {
      t.addEventListener('click', () => {
        document.querySelectorAll('#verifTabs .tab').forEach(x => x.classList.remove('on'));
        t.classList.add('on');
        this.filter = t.dataset.filter;
        this.renderList();
      });
    });

    await this.renderList();
    if (window.lucide) lucide.createIcons();
  },

  async renderList() {
    const el = document.getElementById('verifList');
    if (!el) return;

    const all = await API.getPresensiPendingVerifikasi();
    let list = all;

    if (this.filter === 'pending') {
      list = all.filter(p => p.status === 'pending');
    } else if (this.filter === 'verified') {
      list = await API.getPresensi(null, 100).then(r => r.filter(p => p.status === 'verified'));
    } else if (this.filter === 'rejected') {
      list = await API.getPresensi(null, 100).then(r => r.filter(p => p.status === 'rejected'));
    }

    if (!list.length) {
      el.innerHTML = `
        <div class="empty">
          <i data-lucide="check-circle"></i>
          ${this.filter === 'pending' ? 'Semua presensi sudah diverifikasi' : 'Tidak ada data'}
        </div>`;
      if (window.lucide) lucide.createIcons();
      return;
    }

    el.innerHTML = list.map(p => this.renderCard(p)).join('');

    // Bind actions
    el.querySelectorAll('[data-verif]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const action = btn.dataset.verif;
        if (action === 'ok') this.approve(id);
        else if (action === 'no') this.reject(id);
        else if (action === 'det') this.showDetail(id);
      });
    });

    if (window.lucide) lucide.createIcons();
  },

  renderCard(p) {
    const statusBadge = {
      pending: '<span class="badge b-wait"><span class="dot"></span>Menunggu</span>',
      verified: '<span class="badge b-ok"><span class="dot"></span>Disetujui</span>',
      rejected: '<span class="badge b-rev"><span class="dot"></span>Ditolak</span>'
    }[p.status] || '';

    const actions = p.status === 'pending' ? `
      <div class="verif-actions">
        <button class="btn-ok" data-verif="ok" data-id="${p.id}">
          <i data-lucide="check"></i> Setujui
        </button>
        <button class="btn-no" data-verif="no" data-id="${p.id}">
          <i data-lucide="x"></i> Tolak
        </button>
        <button class="btn-det" data-verif="det" data-id="${p.id}">
          <i data-lucide="eye"></i> Detail
        </button>
      </div>` : `
      <div class="verif-actions">
        <button class="btn-det" data-verif="det" data-id="${p.id}">
          <i data-lucide="eye"></i> Detail
        </button>
      </div>`;

    return `
      <div class="verif-card">
        <img class="verif-avatar" src="${p.pegawaiFotoPas || 'https://i.pravatar.cc/80'}" alt="">
        <div class="verif-body">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;flex-wrap:wrap">
            <div>
              <b>${p.pegawaiNama}</b>
              <div class="v-meta">${dateShort(p.tanggal)} · ${timeShort(p.jamMasuk)} WIB</div>
            </div>
            ${statusBadge}
          </div>

          <div class="v-tags">
            <span class="chip-o"><i data-lucide="map-pin" style="width:12px;height:12px;display:inline-block;vertical-align:-2px"></i> ${p.jarak} m dari titik</span>
            <span class="chip-o">Lat ${p.lat?.toFixed(4)}, Lng ${p.lng?.toFixed(4)}</span>
          </div>

          <div class="verif-foto">
            <img src="${p.fotoMasuk}" alt="Selfie" onclick="Verifikasi.showFoto('${p.fotoMasuk}')">
            <img src="${p.fotoLokasi}" alt="Lokasi" onclick="Verifikasi.showFoto('${p.fotoLokasi}')">
          </div>
        </div>
        ${actions}
      </div>`;
  },

  async approve(id) {
    if (!confirm('Setujui presensi ini?')) return;
    await API.verifyPresensi(id, 'verified', 'Disetujui oleh Korlap');
    toast('Presensi disetujui.', 'success');
    await this.renderList();
  },

  async reject(id) {
    const catatan = prompt('Alasan penolakan:', 'Di luar jangkauan tanpa keterangan');
    if (catatan === null) return;
    await API.verifyPresensi(id, 'rejected', catatan);
    toast('Presensi ditolak.', 'warn');
    await this.renderList();
  },

  showDetail(id) {
    toast('Detail presensi — akan ditambahkan di versi berikutnya.', 'info');
  },

  showFoto(url) {
    openModal(`
      <div class="m-head">
        <span class="m-file" style="background:var(--blue-soft);color:var(--blue)">
          <i data-lucide="image"></i>
        </span>
        <div class="m-tt">
          <h4>Foto Presensi</h4>
          <p>Bukti visual check-in</p>
        </div>
        <button class="icon-btn" data-close aria-label="Tutup"><i data-lucide="x"></i></button>
      </div>
      <div class="m-body" style="text-align:center">
        <img src="${url}" style="max-width:100%;border-radius:16px;box-shadow:var(--shadow-lg)" alt="">
      </div>
      <div class="m-foot">
        <button class="btn btn-ghost" data-close>Tutup</button>
      </div>`);
  }
};

window.Verifikasi = Verifikasi;