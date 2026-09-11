/* =================================================================
   presensi.js — Layout Artistik: Judul + Maps + Badge Radius
   3 Kartu Compact + 2 Tombol Check-in/out Besar
   ================================================================= */

const Presensi = {
  state: {
    lat: null,
    lng: null,
    accuracy: null,
    jarakKeTitik: null,
    fotoMasuk: null,
    fotoLokasi: null,
    fotoMasukMeta: null,
    fotoLokasiMeta: null,
    sudahCheckIn: false,
    sudahCheckOut: false,
    jamMasuk: null,
    jamKeluar: null,
    presensiId: null
  },

  titikTugas: null,
  map: null,
  userMarker: null,
  tugasMarker: null,
  accuracyCircle: null,
  radiusCircle: null,
  connectingLine: null,
  _heroClockInterval: null,

  /* ============================================================
     RENDER
     ============================================================ */
  async render() {
    const pegawai = Auth.getPegawaiAktif();
    this.titikTugas = pegawai?.koordinat || { lat: -8.45, lng: 114.20 };

    this.loadStatusHariIni();

    // Reset foto
    this.state.fotoMasuk = null;
    this.state.fotoLokasi = null;
    this.state.fotoMasukMeta = null;
    this.state.fotoLokasiMeta = null;

    this.renderHero(pegawai);
    this.renderRiwayat(pegawai);
    this.renderRingkasan(pegawai);
    this.updateActions();
    this.bindKamera();

    setTimeout(() => this.initMap(), 150);
    this.startGPS();

    if (window.lucide) lucide.createIcons();
  },

  /* ============================================================
     HERO — Judul + Maps + Badge Radius + 3 Kartu + 2 Tombol
     ============================================================ */
  renderHero(pegawai) {
    const el = document.getElementById('presHero');
    if (!el) return;

    const statusCls = this.state.sudahCheckOut
      ? 'selesai'
      : this.state.sudahCheckIn ? 'kerja' : 'belum';
    const statusIcon = this.state.sudahCheckOut
      ? 'check-circle'
      : this.state.sudahCheckIn ? 'clock' : 'alarm-clock';

    el.innerHTML = `
      <!-- Judul mengambang -->
      <div class="pres-title-bar ${statusCls}" id="presTitleBar">
        <div class="ptb-icon">
          <i data-lucide="${statusIcon}"></i>
        </div>
        <div class="ptb-text">
          <h3 id="presTitleText">${this.getStatusText()}</h3>
          <p>${dateLong(new Date())}</p>
        </div>
      </div>

      <!-- Maps dengan badge + 3 kartu -->
      <div class="pres-map-wrap">
        <div id="presMap"></div>

        <!-- Badge radius mengambang di atas maps -->
        <div class="map-badge loading" id="mapBadge">
          <i data-lucide="loader"></i>
          <span id="mapBadgeText">Mendeteksi lokasi...</span>
        </div>

        <!-- 3 kartu compact di bawah maps -->
        <div class="pres-overlay">

          <div class="mini-card">
            <span class="mc-label">
              <i data-lucide="clock"></i>
              Waktu
            </span>
            <div class="mc-val" id="heroClock">--:--<small>WIB</small></div>
            <div class="mc-sub" id="heroDuration">—</div>
          </div>

          <div class="mini-card" id="cardJarak">
            <span class="mc-label">
              <i data-lucide="navigation"></i>
              Jarak
            </span>
            <div class="mc-val" id="heroJarak">—</div>
            <div class="mc-sub">ke tugas</div>
          </div>

          <div class="mini-card" id="cardGps">
            <span class="mc-label">
              <i data-lucide="map-pin"></i>
              Lokasi
            </span>
            <div class="mc-sub" id="heroLokasi">Mendeteksi...</div>
            <div class="mc-sub" id="heroAkurasi">—</div>
          </div>

        </div>
      </div>

      <!-- Tombol check-in/out besar -->
      <div class="pres-actions-row" id="presActions"></div>
    `;

    if (window.lucide) lucide.createIcons();
    this.startHeroClock();
  },

  /* ---------- Jam & durasi live ---------- */
  startHeroClock() {
    if (this._heroClockInterval) clearInterval(this._heroClockInterval);

    const tick = () => {
      const clock = document.getElementById('heroClock');
      const dur = document.getElementById('heroDuration');

      if (clock) {
        const d = new Date();
        const hh = String(d.getHours()).padStart(2, '0');
        const mm = String(d.getMinutes()).padStart(2, '0');
        clock.innerHTML = `${hh}:${mm}<small>WIB</small>`;
      }

      if (dur) {
        if (this.state.jamMasuk && !this.state.jamKeluar) {
          const diff = new Date() - new Date(this.state.jamMasuk);
          const j = Math.floor(diff / 3600000);
          const m = Math.floor((diff % 3600000) / 60000);
          const s = Math.floor((diff % 60000) / 1000);
          dur.textContent = `${String(j).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
        } else if (this.state.jamMasuk && this.state.jamKeluar) {
          dur.textContent = `Total: ${this.hitungDurasi()}`;
        } else {
          dur.textContent = 'Belum check-in';
        }
      }
    };

    tick();
    this._heroClockInterval = setInterval(tick, 1000);
  },

  getStatusText() {
    if (this.state.sudahCheckOut) return 'Presensi selesai';
    if (this.state.sudahCheckIn) return 'Sedang bekerja — jangan lupa check-out';
    return 'Belum check-in hari ini';
  },

  /* ============================================================
     MAPS — Leaflet + Lingkaran Radius
     ============================================================ */
  initMap() {
    const el = document.getElementById('presMap');
    if (!el || !window.L) return;

    if (this.map) {
      this.map.remove();
      this.map = null;
      this.userMarker = null;
      this.tugasMarker = null;
      this.accuracyCircle = null;
      this.radiusCircle = null;
      this.connectingLine = null;
    }

    const center = this.titikTugas || { lat: -8.45, lng: 114.20 };
    const radius = CONFIG.PRESENSI_RADIUS_DEFAULT || 200;

    this.map = L.map(el, {
      center: [center.lat, center.lng],
      zoom: 14,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: true,
      dragging: true,
      tap: true
    });

    // Tile OpenStreetMap (tanpa API key)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      crossOrigin: true
    }).addTo(this.map);

    // Zoom control di kanan bawah
    L.control.zoom({ position: 'topright' }).addTo(this.map);

    // Lingkaran radius presensi
    if (this.titikTugas) {
      this.radiusCircle = L.circle(
        [this.titikTugas.lat, this.titikTugas.lng],
        {
          radius: radius,
          color: '#16A34A',
          weight: 2,
          opacity: 0.7,
          fillColor: '#16A34A',
          fillOpacity: 0.18
        }
      ).addTo(this.map);

      // Marker tugas (kuning) di tengah lingkaran
      const tugasIcon = L.divIcon({
        className: '',
        html: `<div class="marker-tugas">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
          </svg>
        </div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 30]
      });

      this.tugasMarker = L.marker(
        [this.titikTugas.lat, this.titikTugas.lng],
        { icon: tugasIcon }
      ).addTo(this.map);
    }

    setTimeout(() => this.map && this.map.invalidateSize(), 200);
  },

  /* ---------- Update marker user ---------- */
  updateUserMarker() {
    if (!this.map || this.state.lat === null || this.state.lng === null) return;

    const pos = [this.state.lat, this.state.lng];
    const radius = CONFIG.PRESENSI_RADIUS_DEFAULT || 200;
    const luarRadius = this.state.jarakKeTitik !== null && this.state.jarakKeTitik > radius;

    // Marker user (biru berdenyut)
    const userIcon = L.divIcon({
      className: '',
      html: '<div class="marker-user"></div>',
      iconSize: [22, 22],
      iconAnchor: [11, 11]
    });

    if (this.userMarker) {
      this.userMarker.setLatLng(pos);
    } else {
      this.userMarker = L.marker(pos, {
        icon: userIcon,
        zIndexOffset: 1000
      }).addTo(this.map);
    }

    // Update warna lingkaran radius
    if (this.radiusCircle) {
      const color = luarRadius ? '#FBB917' : '#16A34A';
      this.radiusCircle.setStyle({
        color: color,
        fillColor: color,
        opacity: 0.7,
        fillOpacity: 0.18
      });
    }

    // Garis penghubung user ↔ titik tugas
    if (this.titikTugas) {
      const linePos = [pos, [this.titikTugas.lat, this.titikTugas.lng]];
      if (this.connectingLine) {
        this.connectingLine.setLatLngs(linePos);
      } else {
        this.connectingLine = L.polyline(linePos, {
          color: '#FBB917',
          weight: 2,
          dashArray: '6, 8',
          opacity: 0.85
        }).addTo(this.map);
      }
    }

    // Fit bounds: user + tugas
    if (this.userMarker && this.tugasMarker) {
      const group = L.featureGroup([this.userMarker, this.tugasMarker]);
      this.map.fitBounds(group.getBounds().pad(0.35));
    } else if (this.userMarker) {
      this.map.setView(pos, 16);
    }
  },

  /* ============================================================
     BIND KAMERA
     ============================================================ */
  bindKamera() {
    const camSelfie = document.getElementById('camSelfie');
    const camLokasi = document.getElementById('camLokasi');

    if (camSelfie) {
      camSelfie.addEventListener('click', (e) => {
        if (e.target.closest('.cb-overlay')) return;
        if (this.state.fotoMasuk) return;
        this.ambilFoto('fotoMasuk');
      });
    }
    if (camLokasi) {
      camLokasi.addEventListener('click', (e) => {
        if (e.target.closest('.cb-overlay')) return;
        if (this.state.fotoLokasi) return;
        this.ambilFoto('fotoLokasi');
      });
    }
  },

  async ambilFoto(targetKey) {
    await Camera.open(targetKey, async (blob, meta) => {
      this.state[targetKey] = blob;
      this.state[targetKey + 'Meta'] = meta;
      this.renderFotoPreview(targetKey);
      toast(
        `Foto ${targetKey === 'fotoMasuk' ? 'selfie' : 'lokasi'} berhasil diambil.`,
        'success'
      );
    });
  },

  renderFotoPreview(targetKey) {
    const boxId = targetKey === 'fotoMasuk' ? 'camSelfie' : 'camLokasi';
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
      <div class="cb-overlay">
        <b>${targetKey === 'fotoMasuk' ? 'Selfie' : 'Lokasi'}</b>
        <button type="button" class="cb-del" data-hapus="${targetKey}" aria-label="Hapus">
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
    const boxId = targetKey === 'fotoMasuk' ? 'camSelfie' : 'camLokasi';
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
      <div class="cb-ic"><i data-lucide="${targetKey === 'fotoMasuk' ? 'camera' : 'image'}"></i></div>
      <div class="cb-txt">
        <b>${targetKey === 'fotoMasuk' ? 'Foto Selfie' : 'Foto Lokasi'}</b>
        <small>Ketuk untuk ambil</small>
      </div>`;
    if (window.lucide) lucide.createIcons();
  },

  /* ============================================================
     ACTION BUTTONS — 2 tombol besar
     ============================================================ */
  updateActions() {
    const el = document.getElementById('presActions');
    if (!el) return;

    const sudahIn = this.state.sudahCheckIn;
    const sudahOut = this.state.sudahCheckOut;

    const jamIn = this.state.jamMasuk ? timeShort(this.state.jamMasuk) + ' WIB' : '—';
    const jamOut = this.state.jamKeluar ? timeShort(this.state.jamKeluar) + ' WIB' : '—';

    el.innerHTML = `
      <button class="act-btn checkin ${sudahIn ? 'done' : ''}"
              id="btnCheckIn"
              ${sudahIn ? 'disabled' : ''}>
        <span class="ab-ic">
          <i data-lucide="${sudahIn ? 'check' : 'log-in'}"></i>
        </span>
        <span class="ab-txt">
          <b>${sudahIn ? 'CHECK-IN SELESAI' : 'CHECK-IN'}</b>
          <span>${jamIn}</span>
        </span>
      </button>

      <button class="act-btn checkout ${sudahOut ? 'done' : ''}"
              id="btnCheckOut"
              ${!sudahIn || sudahOut ? 'disabled' : ''}>
        <span class="ab-ic">
          <i data-lucide="${sudahOut ? 'check' : 'log-out'}"></i>
        </span>
        <span class="ab-txt">
          <b>${sudahOut ? 'CHECK-OUT SELESAI' : 'CHECK-OUT'}</b>
          <span>${jamOut}</span>
        </span>
      </button>
    `;

    document.getElementById('btnCheckIn')?.addEventListener('click', () => this.handleCheckIn());
    document.getElementById('btnCheckOut')?.addEventListener('click', () => this.handleCheckOut());

    if (window.lucide) lucide.createIcons();
  },

  hitungDurasi() {
    if (!this.state.jamMasuk || !this.state.jamKeluar) return '—';
    const diff = new Date(this.state.jamKeluar) - new Date(this.state.jamMasuk);
    const jam = Math.floor(diff / 3600000);
    const menit = Math.floor((diff % 3600000) / 60000);
    return `${jam} jam ${menit} menit`;
  },

  /* ============================================================
     GPS
     ============================================================ */
  startGPS() {
    const el = document.getElementById('cardGps');
    if (!el) return;

    el.className = 'mini-card loading';
    el.innerHTML = `
      <span class="mc-label"><i data-lucide="map-pin"></i>Lokasi</span>
      <div class="mc-sub">Mendeteksi...</div>`;
    if (window.lucide) lucide.createIcons();

    if (!navigator.geolocation) {
      el.className = 'mini-card error';
      el.innerHTML = `
        <span class="mc-label"><i data-lucide="map-pin"></i>Lokasi</span>
        <div class="mc-sub">GPS tidak didukung</div>`;
      if (window.lucide) lucide.createIcons();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      pos => this.onGPSSuccess(pos),
      err => this.onGPSError(err),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  },

  onGPSSuccess(pos) {
    const { latitude, longitude, accuracy } = pos.coords;
    this.state.lat = latitude;
    this.state.lng = longitude;
    this.state.accuracy = Math.round(accuracy);

    let jarak = null;
    if (this.titikTugas) {
      jarak = hitungJarak(latitude, longitude, this.titikTugas.lat, this.titikTugas.lng);
    }
    this.state.jarakKeTitik = jarak;

    const radius = CONFIG.PRESENSI_RADIUS_DEFAULT;
    const luarRadius = jarak !== null && jarak > radius;

    // ---- Badge mengambang ----
    const badge = document.getElementById('mapBadge');
    if (badge) {
      badge.className = 'map-badge ' + (luarRadius ? 'warn' : 'ok');
      badge.innerHTML = `
        <i data-lucide="${luarRadius ? 'alert-triangle' : 'check-circle'}"></i>
        <span>${luarRadius ? 'Di Luar Radius Presensi' : 'Dalam Radius Presensi'}</span>
      `;
    }

    // ---- Kartu Jarak ----
    const jarakBig = document.getElementById('heroJarak');
    const jarakCard = document.getElementById('cardJarak');
    if (jarakBig && jarak !== null) {
      jarakBig.textContent = jarak >= 1000
        ? (jarak / 1000).toFixed(2) + ' km'
        : jarak + ' m';
    }
    if (jarakCard) {
      jarakCard.className = 'mini-card ' + (luarRadius ? 'warn' : 'ok');
    }

    // ---- Kartu Lokasi ----
    const lokasiEl = document.getElementById('heroLokasi');
    const akurasiEl = document.getElementById('heroAkurasi');
    const gpsCard = document.getElementById('cardGps');
    if (lokasiEl) lokasiEl.innerHTML = `<code>${latitude.toFixed(5)}, ${longitude.toFixed(5)}</code>`;
    if (akurasiEl) akurasiEl.textContent = `Akurasi ±${this.state.accuracy} m`;
    if (gpsCard) {
      gpsCard.className = 'mini-card ' + (luarRadius ? 'warn' : 'ok');
    }

    if (window.lucide) lucide.createIcons();
    this.updateUserMarker();
  },

  onGPSError(err) {
    const el = document.getElementById('cardGps');
    if (!el) return;

    el.className = 'mini-card error';
    el.innerHTML = `
      <span class="mc-label"><i data-lucide="map-pin"></i>Lokasi</span>
      <div class="mc-sub">GPS ditolak</div>`;
    if (window.lucide) lucide.createIcons();
  },

  /* ============================================================
     CHECK-IN
     ============================================================ */
  async handleCheckIn() {
    if (this.state.lat === null) {
      toast('Lokasi belum terdeteksi. Tunggu sebentar atau izinkan akses GPS.', 'warn');
      return;
    }
    if (!this.state.fotoMasuk) {
      toast('Foto selfie wajib diambil.', 'warn');
      return;
    }
    if (!this.state.fotoLokasi) {
      toast('Foto lokasi wajib diambil.', 'warn');
      return;
    }

    toast('Memproses presensi...', 'info');

    try {
      const pegawai = Auth.getPegawaiAktif();
      const now = new Date();
      const namaDepan = pegawai?.nama?.split(' ')[0] || 'Pegawai';

      const watermarkTxt =
        `${namaDepan}\n${dateLong(now)}\n${timeFull(now)} WIB\n` +
        `Lat: ${this.state.lat.toFixed(5)}, Lng: ${this.state.lng.toFixed(5)}`;

      const fotoMasukWM = await watermarkFoto(this.state.fotoMasuk, watermarkTxt);
      const fotoLokasiWM = await watermarkFoto(this.state.fotoLokasi, watermarkTxt);

      const fotoMasukUrl = await this.blobToDataURL(fotoMasukWM);
      const fotoLokasiUrl = await this.blobToDataURL(fotoLokasiWM);

      const hasil = await API.submitPresensi({
        pegawaiId: pegawai?.id,
        pegawaiNama: pegawai?.nama,
        pegawaiFotoPas: pegawai?.foto_pas,
        role: pegawai?.role,
        krosda: pegawai?.krosda,
        tanggal: isoDate(now),
        jamMasuk: now.toISOString(),
        lat: this.state.lat,
        lng: this.state.lng,
        jarak: this.state.jarakKeTitik,
        fotoMasuk: fotoMasukUrl,
        fotoLokasi: fotoLokasiUrl
      });

      this.state.sudahCheckIn = true;
      this.state.jamMasuk = now.toISOString();
      if (hasil?.id) this.state.presensiId = hasil.id;
      this.saveStatusHariIni();

      // Reset foto
      this.state.fotoMasuk = null;
      this.state.fotoLokasi = null;
      this.state.fotoMasukMeta = null;
      this.state.fotoLokasiMeta = null;

      // Reset UI foto
      const camSelfie = document.getElementById('camSelfie');
      const camLokasi = document.getElementById('camLokasi');
      if (camSelfie) {
        camSelfie.classList.remove('has-photo');
        camSelfie.innerHTML = `
          <div class="cb-ic"><i data-lucide="camera"></i></div>
          <div class="cb-txt"><b>Foto Selfie</b><small>Ketuk untuk ambil</small></div>`;
      }
      if (camLokasi) {
        camLokasi.classList.remove('has-photo');
        camLokasi.innerHTML = `
          <div class="cb-ic"><i data-lucide="image"></i></div>
          <div class="cb-txt"><b>Foto Lokasi</b><small>Ketuk untuk ambil</small></div>`;
      }

      // Re-render hero + map
      this.renderHero(pegawai);
      setTimeout(() => {
        this.initMap();
        this.updateUserMarker();
      }, 100);

      this.updateActions();
      this.renderRiwayat(pegawai);
      this.renderRingkasan(pegawai);

      if (window.lucide) lucide.createIcons();

      const luarRadius = this.state.jarakKeTitik > CONFIG.PRESENSI_RADIUS_DEFAULT;
      if (luarRadius) {
        toast(`Check-in tercatat — <b>di luar radius</b>, menunggu verifikasi Korlap.`, 'warn');
      } else {
        toast(`Check-in berhasil pukul ${timeShort(now)} WIB. Selamat bekerja!`, 'success');
      }

    } catch (e) {
      console.error(e);
      toast('Gagal submit presensi: ' + e.message, 'error');
    }
  },

  /* ============================================================
     CHECK-OUT
     ============================================================ */
  async handleCheckOut() {
    const now = new Date();

    try {
      if (this.state.presensiId) {
        await API.request(`presensi?id=eq.${this.state.presensiId}`, 'PATCH', {
          jamKeluar: now.toISOString()
        }).catch(() => {});
      }

      this.state.sudahCheckOut = true;
      this.state.jamKeluar = now.toISOString();
      this.saveStatusHariIni();

      const pegawai = Auth.getPegawaiAktif();
      this.renderHero(pegawai);
      setTimeout(() => {
        this.initMap();
        this.updateUserMarker();
      }, 100);

      this.updateActions();
      this.renderRiwayat(pegawai);
      this.renderRingkasan(pegawai);

      toast(`Check-out berhasil. Total: ${this.hitungDurasi()}. Sampai besok!`, 'success');
    } catch (e) {
      toast('Gagal check-out: ' + e.message, 'error');
    }
  },

  /* ============================================================
     RIWAYAT
     ============================================================ */
  async renderRiwayat(pegawai) {
    const el = document.getElementById('presHistory');
    if (!el) return;

    const list = await API.getPresensi(pegawai?.id, 15);

    if (!list.length) {
      el.innerHTML = '<div class="empty"><i data-lucide="inbox"></i>Belum ada riwayat presensi</div>';
      if (window.lucide) lucide.createIcons();
      return;
    }

    el.innerHTML = list.map(p => {
      const d = new Date(p.tanggal + 'T00:00:00');
      const hari = d.getDate();
      const bulan = d.toLocaleDateString('id-ID', { month: 'short' });
      return `
        <div class="ph-item">
          <div class="ph-date">
            <b>${hari}</b>
            <small>${bulan}</small>
          </div>
          <div class="ph-info">
            <b>${timeShort(p.jamMasuk)} – ${p.jamKeluar ? timeShort(p.jamKeluar) : '—'}</b>
            <span>Jarak ${p.jarak} m · ${p.status === 'verified' ? '✓ Terverifikasi' : '⏳ Menunggu verifikasi'}</span>
          </div>
          <span class="badge ${p.status === 'verified' ? 'b-ok' : 'b-wait'}">
            <span class="dot"></span>${p.status === 'verified' ? 'OK' : 'Pending'}
          </span>
        </div>`;
    }).join('');

    if (window.lucide) lucide.createIcons();
  },

  /* ============================================================
     RINGKASAN BULAN
     ============================================================ */
  async renderRingkasan(pegawai) {
    const el = document.getElementById('presRingkasan');
    if (!el) return;

    const list = await API.getPresensi(pegawai?.id, 100);
    const bulanIni = list.filter(p => p.tanggal.startsWith(isoMonth(new Date())));

    const hadir = bulanIni.filter(p => p.status === 'verified').length;
    const pending = bulanIni.filter(p => p.status === 'pending').length;
    const totalJam = bulanIni.reduce((sum, p) => {
      if (!p.jamMasuk || !p.jamKeluar) return sum + 8;
      return sum + (new Date(p.jamKeluar) - new Date(p.jamMasuk)) / 3600000;
    }, 0);

    el.innerHTML = `
      <div class="ring-item">
        <div class="ri-ic ic-blue"><i data-lucide="check-circle"></i></div>
        <div><b>${hadir}</b><span>Hadir</span></div>
      </div>
      <div class="ring-item">
        <div class="ri-ic ic-amber"><i data-lucide="clock"></i></div>
        <div><b>${pending}</b><span>Pending</span></div>
      </div>
      <div class="ring-item">
        <div class="ri-ic ic-green"><i data-lucide="timer"></i></div>
        <div><b>${Math.round(totalJam)}j</b><span>Jam Kerja</span></div>
      </div>
      <div class="ring-item">
        <div class="ri-ic ic-ink"><i data-lucide="trending-up"></i></div>
        <div><b>${bulanIni.length ? Math.round((hadir / bulanIni.length) * 100) : 0}%</b><span>Kehadiran</span></div>
      </div>`;
    if (window.lucide) lucide.createIcons();
  },

  /* ============================================================
     PERSISTENCE
     ============================================================ */
  loadStatusHariIni() {
    const key = 'tpop_presensi_' + isoDate(new Date());
    try {
      const saved = JSON.parse(localStorage.getItem(key));
      if (saved) {
        this.state.sudahCheckIn = saved.sudahCheckIn || false;
        this.state.sudahCheckOut = saved.sudahCheckOut || false;
        this.state.jamMasuk = saved.jamMasuk || null;
        this.state.jamKeluar = saved.jamKeluar || null;
        this.state.presensiId = saved.presensiId || null;
      }
    } catch {}
  },

  saveStatusHariIni() {
    const key = 'tpop_presensi_' + isoDate(new Date());
    localStorage.setItem(key, JSON.stringify({
      sudahCheckIn: this.state.sudahCheckIn,
      sudahCheckOut: this.state.sudahCheckOut,
      jamMasuk: this.state.jamMasuk,
      jamKeluar: this.state.jamKeluar,
      presensiId: this.state.presensiId
    }));
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

window.Presensi = Presensi;