/* =================================================================
   dashboard.js — Logic dashboard per role
   Hero putih 63:37 dengan foto_hero pop-out kanan
   ================================================================= */

const Dashboard = {
  map: null,
  markers: [],

  async render() {
    const role = Portal.state.role;
    const pegawai = Auth.getPegawaiAktif();
    const stats = await API.getStatsDashboard(role);

    this.renderHero(role, pegawai, stats);
    this.renderStatsGrid(role, stats);

    setTimeout(() => this.renderMap(role), 100);

    if (role === 'korlap') await this.renderKorlapContent();
    else if (role === 'ppa') await this.renderPpaContent();
    else if (role === 'pekarya') await this.renderPekaryaContent();

    if (window.lucide) lucide.createIcons();
  },

  /* ---------- Hero Putih 63:37 ---------- */
  renderHero(role, pegawai, stats) {
    const el = document.getElementById('dashHero');
    if (!el) return;

    const greet = sapaan();
    const namaDepan = pegawai?.nama?.split(' ')[0] || 'Rekan';

    // Foto hero (PNG pop-out) — dari helper Auth
    const fotoHero = Auth.getFotoHero(pegawai);

    const roleLabelShort = {
      korlap: 'Staf Pengamat (Korlap)',
      ppa: 'Petugas Pintu Air (PPA)',
      pekarya: 'Pekarya Pengairan'
    }[role] || 'TP-OP';

    el.innerHTML = `
      <div class="hero-card">

        <!-- Kolom Kiri: Konten (63%) -->
        <div class="hero-content">
          <span class="kicker">Portal Kinerja · ${CONFIG.APP_OWNER}</span>

          <h1 class="hero-greet">
            ${greet}, <span class="blue">${namaDepan}</span>
          </h1>

          <div class="hero-meta">
            <span class="meta-chip"><i data-lucide="badge-check"></i>${roleLabelShort}</span>
            <span class="meta-chip"><i data-lucide="building-2"></i>Krosda ${pegawai?.krosda || '-'}</span>
            <span class="meta-chip mono"><i data-lucide="fingerprint"></i>${pegawai?.nip || '-'}</span>
          </div>

          <div class="hero-stats">
            ${this.statCard('calendar', 'Hadir Bulan Ini', stats.kehadiran ? stats.kehadiran + '%' : '-', 'ic-blue')}
            ${this.statCard('file-check', 'Laporan Bulan Ini', stats.laporanBulanIni || stats.laporanPending || 0, 'ic-green')}
            ${this.statCard('clock', 'Masa Kerja', '3 thn', 'ic-amber')}
            ${this.statCard('shield-check', 'Status', 'Aktif', 'ic-ink')}
          </div>
        </div>

        <!-- Kolom Kanan: Foto Hero Pop-Out (37%) -->
        <div class="hero-photo-wrap">
          <div class="hero-photo-glow"></div>
          <img class="hero-photo-img"
               src="${fotoHero}"
               alt="${pegawai?.nama || 'Foto Pegawai'}"
               onerror="this.src='https://i.pravatar.cc/500?u=${role}'">
        </div>

      </div>`;
  },

  statCard(icon, label, value, color) {
    return `
      <div class="stat">
        <span class="ic ${color}"><i data-lucide="${icon}"></i></span>
        <div><b>${value}</b><span>${label}</span></div>
      </div>`;
  },

  /* ---------- Stats Grid ---------- */
  renderStatsGrid(role, stats) {
    const el = document.getElementById('dashStats');
    if (!el) return;

    const items = {
      korlap: [
        { icon: 'map', label: 'Kejuron', value: stats.kejuron || 0, color: 'ic-blue' },
        { icon: 'droplets', label: 'Pintu Air', value: stats.pintu || 0, color: 'ic-ink' },
        { icon: 'users', label: 'Tim', value: stats.tim || 0, color: 'ic-green' },
        { icon: 'clock', label: 'Presensi Pending', value: stats.presensiPending || 0, color: 'ic-amber' },
        { icon: 'file-text', label: 'Laporan Pending', value: stats.laporanPending || 0, color: 'ic-red' }
      ],
      ppa: [
        { icon: 'droplets', label: 'Pintu Dijaga', value: stats.pintu || 0, color: 'ic-ink' },
        { icon: 'activity', label: 'Operasi Hari Ini', value: stats.operasiHariIni || 0, color: 'ic-blue' },
        { icon: 'file-text', label: 'Laporan Bulan Ini', value: stats.laporanBulanIni || 0, color: 'ic-green' },
        { icon: 'calendar-check', label: 'Kehadiran', value: (stats.kehadiran || 0) + '%', color: 'ic-amber' }
      ],
      pekarya: [
        { icon: 'route', label: 'Ruas Saluran', value: stats.ruas || 0, color: 'ic-ink' },
        { icon: 'shovel', label: 'Pemeliharaan Bulan Ini', value: stats.pemeliharaanBulanIni || 0, color: 'ic-green' },
        { icon: 'alert-triangle', label: 'Temuan Kerusakan', value: stats.temuanKerusakan || 0, color: 'ic-amber' },
        { icon: 'calendar-check', label: 'Kehadiran', value: (stats.kehadiran || 0) + '%', color: 'ic-blue' }
      ]
    }[role] || [];

    el.innerHTML = items.map(it => `
      <div class="stat">
        <span class="ic ${it.color}"><i data-lucide="${it.icon}"></i></span>
        <div><b>${it.value}</b><span>${it.label}</span></div>
      </div>`).join('');
  },

  /* ---------- Peta Leaflet ---------- */
  renderMap(role) {
    const el = document.getElementById('mapDashboard');
    if (!el || !window.L) return;

    if (this.map) { this.map.remove(); this.map = null; }

    this.map = L.map(el, {
      center: CONFIG.MAP_DEFAULT_CENTER,
      zoom: CONFIG.MAP_DEFAULT_ZOOM,
      zoomControl: true,
      attributionControl: false,
      scrollWheelZoom: true,
      dragging: true,
      tap: true,
      doubleClickZoom: true,
      boxZoom: true,
      keyboard: true
    });

    L.tileLayer(CONFIG.MAP_TILE_URL, {
      maxZoom: 19,
      detectRetina: true,
      crossOrigin: true
    }).addTo(this.map);

    L.control.scale({
      position: 'bottomleft',
      imperial: false,
      metric: true,
      maxWidth: 120
    }).addTo(this.map);

    const list = role === 'korlap'
      ? DATA.PEGAWAI
      : DATA.PEGAWAI.filter(p => p.role === role);

    this.markers = [];
    list.forEach(p => {
      if (!p.koordinat) return;

      const cls = 'marker-' + p.role;
      const iconSvg = p.role === 'korlap'
        ? '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>'
        : p.role === 'ppa'
        ? '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>'
        : '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 22l1-1h3l1 1h3l1-1h3l1 1h3l1-1h3"/><path d="M6 18V8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v10"/></svg>';

      const icon = L.divIcon({
        className: '',
        html: `<div class="marker-dot ${cls}">${iconSvg}</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
      });

      const marker = L.marker([p.koordinat.lat, p.koordinat.lng], { icon })
        .addTo(this.map)
        .bindPopup(`
          <div class="map-pop">
            <b>${p.nama}</b>
            <span>${roleLabel(p.role)}</span><br>
            <span>Krosda ${p.krosda} · ${p.kejuron || '-'}</span>
            <span class="role-chip chip-${p.role}">${p.jabatan}</span>
          </div>`);

      this.markers.push(marker);
    });

    const countEl = document.getElementById('mapCount');
    if (countEl) countEl.textContent = this.markers.length;

    if (this.markers.length) {
      const group = L.featureGroup(this.markers);
      this.map.fitBounds(group.getBounds().pad(0.15));
    }

    setTimeout(() => this.map && this.map.invalidateSize(), 250);
  },

  /* ---------- Konten Korlap ---------- */
  async renderKorlapContent() {
    const el = document.getElementById('dashRoleContent');
    if (!el) return;

    const pending = await API.getPresensiPendingVerifikasi();
    const jadwal = await API.getJadwalGiling();

    el.innerHTML = `
      <div class="grid-dash-full">
        <div class="card">
          <div class="card-head">
            <div>
              <span class="kicker">Antrian Verifikasi</span>
              <h3>Presensi di Luar Radius</h3>
            </div>
            <span class="badge b-wait"><span class="dot"></span>${pending.length} pending</span>
          </div>
          ${pending.length ? `
            <div class="timeline">
              ${pending.slice(0, 5).map(p => `
                <div class="tl-item">
                  <img src="${p.pegawaiFotoPas || 'https://i.pravatar.cc/80'}" 
                       alt="${p.pegawaiNama}"
                       style="width:38px;height:38px;border-radius:99px;object-fit:cover;flex:none;border:2px solid var(--line)">
                  <div class="tl-body">
                    <b>${p.pegawaiNama}</b>
                    <span>${dateShort(p.tanggal)} · jarak ${p.jarak} m dari titik</span>
                    <small>${timeShort(p.jamMasuk)}</small>
                  </div>
                  <button class="btn btn-ghost sm" data-go="verifikasi">Verifikasi</button>
                </div>`).join('')}
            </div>` : '<div class="empty"><i data-lucide="check-circle"></i>Semua presensi sudah diverifikasi</div>'}
          <button class="link-more" data-go="verifikasi">Lihat semua <i data-lucide="arrow-right"></i></button>
        </div>

        <div class="card">
          <div class="card-head">
            <div>
              <span class="kicker">Jadwal Giling Air</span>
              <h3>HIPPA / GHIPPA</h3>
            </div>
            <span class="badge b-proc"><span class="dot"></span>${jadwal.length} jadwal</span>
          </div>
          <div class="timeline">
            ${jadwal.slice(0, 4).map(j => `
              <div class="tl-item">
                <span class="tl-ic ${j.status === 'berjalan' ? 'ic-green' : 'ic-blue'}">
                  <i data-lucide="${j.status === 'berjalan' ? 'play' : 'calendar'}"></i>
                </span>
                <div class="tl-body">
                  <b>${j.hippaNama}</b>
                  <span>${dateShort(j.mulai)} – ${dateShort(j.selesai)}</span>
                  <small>Debit ${j.debit} m³/dtk</small>
                </div>
              </div>`).join('')}
          </div>
          <button class="link-more" data-go="hippa">Kelola HIPPA <i data-lucide="arrow-right"></i></button>
        </div>
      </div>`;
  },

  /* ---------- Konten PPA ---------- */
  async renderPpaContent() {
    const el = document.getElementById('dashRoleContent');
    if (!el) return;

    const operasi = await API.getOperasiPintu(null, 5);

    el.innerHTML = `
      <div class="grid-dash-full">
        <div class="card">
          <div class="card-head">
            <div>
              <span class="kicker">Log Terakhir</span>
              <h3>Operasi Pintu Air</h3>
            </div>
            <button class="btn btn-blue sm" data-go="operasi">
              <i data-lucide="plus"></i> Operasi Baru
            </button>
          </div>
          ${operasi.length ? `
            <div class="tbl-wrap">
              <table>
                <thead><tr><th>Waktu</th><th>Pintu</th><th>Jenis</th><th>Tinggi</th><th>Debit</th></tr></thead>
                <tbody>
                  ${operasi.map(o => `
                    <tr>
                      <td class="td-date">${dateShort(o.waktu)} ${timeShort(o.waktu)}</td>
                      <td><b>${o.pintu}</b></td>
                      <td><span class="chip-o">${o.jenis}</span></td>
                      <td class="mono">${o.tinggi} cm</td>
                      <td class="mono">${o.debit} m³/dtk</td>
                    </tr>`).join('')}
                </tbody>
              </table>
            </div>` : '<div class="empty"><i data-lucide="inbox"></i>Belum ada operasi</div>'}
          <button class="link-more" data-go="operasi">Lihat semua operasi <i data-lucide="arrow-right"></i></button>
        </div>

        <div class="card cta-card">
          <span class="kicker">Presensi Lapangan</span>
          <h3>Sudah check-in hari ini?</h3>
          <p>Lakukan presensi dengan GPS + foto selfie &amp; lokasi. Pastikan Anda berada di area pintu air.</p>
          <button class="btn" data-go="presensi">
            <i data-lucide="fingerprint"></i> Presensi Sekarang
          </button>
        </div>
      </div>`;
  },

  /* ---------- Konten Pekarya ---------- */
  async renderPekaryaContent() {
    const el = document.getElementById('dashRoleContent');
    if (!el) return;

    const pem = await API.getPemeliharaan(null, 5);

    el.innerHTML = `
      <div class="grid-dash-full">
        <div class="card">
          <div class="card-head">
            <div>
              <span class="kicker">Pemeliharaan Terakhir</span>
              <h3>Ruas Saluran</h3>
            </div>
            <button class="btn btn-blue sm" data-go="pemeliharaan">
              <i data-lucide="plus"></i> Pemeliharaan Baru
            </button>
          </div>
          ${pem.length ? `
            <div class="timeline">
              ${pem.map(p => `
                <div class="tl-item">
                  <span class="tl-ic ${p.status === 'selesai' ? 'ic-green' : p.status === 'proses' ? 'ic-amber' : 'ic-ink'}">
                    <i data-lucide="shovel"></i>
                  </span>
                  <div class="tl-body">
                    <b>${p.jenis}</b>
                    <span>${p.ruas}</span>
                    <small>${dateShort(p.tanggal)} · ${p.status}</small>
                  </div>
                </div>`).join('')}
            </div>` : '<div class="empty"><i data-lucide="inbox"></i>Belum ada pemeliharaan</div>'}
          <button class="link-more" data-go="pemeliharaan">Lihat semua <i data-lucide="arrow-right"></i></button>
        </div>

        <div class="card cta-card">
          <span class="kicker">Presensi Lapangan</span>
          <h3>Sudah check-in hari ini?</h3>
          <p>Lakukan presensi dengan GPS + foto selfie &amp; lokasi. Pastikan Anda berada di area saluran.</p>
          <button class="btn" data-go="presensi">
            <i data-lucide="fingerprint"></i> Presensi Sekarang
          </button>
        </div>
      </div>`;
  }
};

window.Dashboard = Dashboard;