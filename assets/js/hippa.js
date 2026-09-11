/* =================================================================
   hippa.js — Logic HIPPA / GHIPPA (Korlap)
   - Daftar HIPPA/GHIPPA
   - Jadwal giling air
   - Statistik distribusi
   ================================================================= */

const Hippa = {
  pegawai: null,
  hippaList: [],
  jadwalList: [],

  /* ============================================================
     RENDER
     ============================================================ */
  async render() {
    const pegawai = Auth.getPegawaiAktif();
    this.pegawai = pegawai;

    await this.loadData();
    this.renderStats();
    this.renderHippaList();
    this.renderJadwalList();

    if (window.lucide) lucide.createIcons();
  },

  /* ============================================================
     LOAD DATA
     ============================================================ */
  async loadData() {
    this.hippaList = await API.getHippa();
    this.jadwalList = await API.getJadwalGiling();
  },

  /* ============================================================
     STATS
     ============================================================ */
  renderStats() {
    const el = document.getElementById('hippaStats');
    if (!el) return;

    const totalHippa = this.hippaList.filter(h => h.jenis === 'HIPPA').length;
    const totalGhippa = this.hippaList.filter(h => h.jenis === 'GHIPPA').length;
    const totalPetani = this.hippaList.reduce((sum, h) => sum + (h.anggota || 0), 0);
    const totalLuas = this.hippaList.reduce((sum, h) => sum + (h.luas || 0), 0);

    el.innerHTML = `
      <div class="stat">
        <span class="ic ic-green"><i data-lucide="users"></i></span>
        <div><b>${totalHippa}</b><span>HIPPA</span></div>
      </div>
      <div class="stat">
        <span class="ic ic-blue"><i data-lucide="network"></i></span>
        <div><b>${totalGhippa}</b><span>GHIPPA</span></div>
      </div>
      <div class="stat">
        <span class="ic ic-amber"><i data-lucide="user-check"></i></span>
        <div><b>${totalPetani.toLocaleString('id-ID')}</b><span>Petani</span></div>
      </div>
      <div class="stat">
        <span class="ic ic-ink"><i data-lucide="map"></i></span>
        <div><b>${totalLuas.toFixed(0)}</b><span>Hektar</span></div>
      </div>`;
    if (window.lucide) lucide.createIcons();
  },

  /* ============================================================
     DAFTAR HIPPA
     ============================================================ */
  renderHippaList() {
    const el = document.getElementById('hippaList');
    if (!el) return;

    if (!this.hippaList.length) {
      el.innerHTML = '<div class="empty"><i data-lucide="inbox"></i>Belum ada data HIPPA</div>';
      if (window.lucide) lucide.createIcons();
      return;
    }

    el.innerHTML = this.hippaList.map(h => `
      <div class="hippa-card">
        <div class="hippa-ic ${h.jenis.toLowerCase()}">
          <i data-lucide="${h.jenis === 'GHIPPA' ? 'network' : 'users'}"></i>
        </div>
        <div class="hippa-body">
          <b>${h.nama}</b>
          <div class="hb-meta">
            Ketua: <strong>${h.ketua}</strong><br>
            ${h.anggota} anggota · ${h.luas} ha · Krosda ${h.krosda}
          </div>
          <div class="hippa-tags">
            <span class="hippa-tag">${h.jenis}</span>
            <span class="hippa-tag">
              <i data-lucide="phone" style="width:11px;height:11px"></i>
              ${h.kontak}
            </span>
          </div>
        </div>
      </div>`).join('');
    if (window.lucide) lucide.createIcons();
  },

  /* ============================================================
     JADWAL GILING
     ============================================================ */
  renderJadwalList() {
    const el = document.getElementById('jadwalList');
    if (!el) return;

    if (!this.jadwalList.length) {
      el.innerHTML = '<div class="empty"><i data-lucide="calendar"></i>Belum ada jadwal giling</div>';
      if (window.lucide) lucide.createIcons();
      return;
    }

    el.innerHTML = this.jadwalList.map(j => {
      const mulai = new Date(j.mulai);
      const selesai = new Date(j.selesai);
      const now = new Date();
      let progress = 0;
      if (now >= selesai) progress = 100;
      else if (now >= mulai) {
        progress = Math.round(((now - mulai) / (selesai - mulai)) * 100);
      }

      const badgeCls = j.status === 'berjalan' ? 'aktif' : 'dijadwalkan';

      return `
        <div class="jadwal-card">
          <div class="jadwal-head">
            <b>${j.hippaNama}</b>
            <span class="hippa-tag ${badgeCls}">${j.status}</span>
          </div>
          <div class="jadwal-body">
            <span><i data-lucide="calendar"></i>${dateShort(j.mulai)} – ${dateShort(j.selesai)}</span>
            <span><i data-lucide="droplets"></i>${j.debit} m³/dtk</span>
          </div>
          <div class="jadwal-progress">
            <span style="width:${progress}%"></span>
          </div>
          <div style="font:600 11px var(--mono);color:var(--muted);margin-top:6px">
            Progress: ${progress}%
          </div>
        </div>`;
    }).join('');
    if (window.lucide) lucide.createIcons();
  }
};

window.Hippa = Hippa;