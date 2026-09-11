/* =================================================================
   portal.js — Router SPA, render layout, navigasi (FINAL)
   - Role switcher untuk demo (desktop)
   - Chip role read-only untuk production & mobile
   ================================================================= */

const Portal = {
  PAGES: {
    dashboard: { kicker: 'Beranda', title: 'Dashboard', icon: 'layout-dashboard' },
    presensi:  { kicker: 'E-Kehadiran', title: 'Presensi Lapangan', icon: 'fingerprint' },
    operasi:   { kicker: 'Operasi Pintu Air', title: 'Log Operasi', icon: 'droplets' },
    pemeliharaan: { kicker: 'Pemeliharaan', title: 'Pemeliharaan Saluran', icon: 'shovel' },
    laporan:   { kicker: 'Manajemen Kinerja', title: 'Laporan', icon: 'file-text' },
    hippa:     { kicker: 'Koordinasi Petani', title: 'HIPPA / GHIPPA', icon: 'users' },
    raport:    { kicker: 'Penilaian Kinerja', title: 'Raport', icon: 'award' },
    profil:    { kicker: 'Data Pegawai', title: 'Profil', icon: 'user-round' },
    verifikasi:{ kicker: 'Verifikasi Korlap', title: 'Antrian Verifikasi', icon: 'clipboard-check' }
  },

  MENU_BY_ROLE: {
    korlap: ['dashboard', 'verifikasi', 'laporan', 'hippa', 'raport', 'profil'],
    ppa: ['dashboard', 'presensi', 'operasi', 'laporan', 'raport', 'profil'],
    pekarya: ['dashboard', 'presensi', 'pemeliharaan', 'laporan', 'raport', 'profil']
  },

  state: {
    page: 'dashboard',
    role: 'korlap',
    session: null,
    isProduction: false
  },

  async init() {
    if (!Auth.guard()) return;

    this.state.session = Auth.getSession();
    this.state.role = this.state.session.role;
    this.state.isProduction = (window.CONFIG?.MODE === 'production');

    this.renderSidebar();
    this.renderTopbar();
    this.renderBottomNav();

    this.go('dashboard');
    this.initClock();
    this.initNotif();
    this.initEvents();

    if (window.lucide) lucide.createIcons();
  },

  /* ---------- Render sidebar ---------- */
  renderSidebar() {
    const menu = this.MENU_BY_ROLE[this.state.role] || [];
    const pegawai = Auth.getPegawaiAktif();

    const navHTML = menu.map(key => {
      const p = this.PAGES[key];
      return `
        <button class="nav-btn" data-page="${key}">
          <i data-lucide="${p.icon}"></i>${p.title}
          <span class="cnt" data-cnt="${key}" hidden></span>
        </button>`;
    }).join('');

    const aside = document.createElement('aside');
    aside.innerHTML = `
      <div class="brand">
        <svg viewBox="0 0 44 44" width="40" height="40" aria-hidden="true">
          <rect width="44" height="44" rx="13" fill="#1E3A8A"/>
          <path d="M22 8.5c3.6 4.3 6 7.6 6 10.6a6 6 0 1 1-12 0c0-3 2.4-6.3 6-10.6z" fill="#FBB917"/>
          <path d="M10 33.5c2.2-2.6 4.4-2.6 6.6 0s4.4 2.6 6.6 0 4.4-2.6 6.6 0 4.4 2.6 6.6 0" stroke="#FBB917" stroke-width="2.4" fill="none" stroke-linecap="round"/>
        </svg>
        <div class="brand-t">
          <b>TP-OP Brantas</b>
          <small>Kementerian PUPR</small>
        </div>
      </div>
      <p class="nav-label">Menu Utama</p>
      <nav>${navHTML}</nav>
      <div class="side-foot">
        <button class="side-user" data-go="profil">
          <img src="${pegawai?.foto || 'https://i.pravatar.cc/80'}" alt="Foto pegawai">
          <div>
            <b>${pegawai?.nama || 'Pengguna Demo'}</b>
            <small>${roleLabel(this.state.role)}</small>
          </div>
        </button>
        <button class="side-out" id="btnLogout">
          <i data-lucide="log-out"></i>Keluar
        </button>
      </div>`;

    document.body.prepend(aside);
  },

  /* ---------- Render topbar ---------- */
  renderTopbar() {
    const pegawai = Auth.getPegawaiAktif();
    const isProd = this.state.isProduction;
    const roleIcon = {
      korlap: 'clipboard-check',
      ppa: 'droplets',
      pekarya: 'shovel'
    }[this.state.role] || 'user';

    // Blok kanan topbar: role switcher (demo) ATAU chip role (production)
    const roleBlock = isProd
      ? `<span class="role-chip-static ${this.state.role}">
           <i data-lucide="${roleIcon}"></i>
           <span>${roleLabel(this.state.role)}</span>
         </span>`
      : `<div class="role-switch" title="Ganti peran (demo)">
           <span class="rs-label"><i data-lucide="user-cog"></i>Peran:</span>
           <select id="roleSwitch">
             <option value="korlap" ${this.state.role === 'korlap' ? 'selected' : ''}>Korlap</option>
             <option value="ppa" ${this.state.role === 'ppa' ? 'selected' : ''}>PPA</option>
             <option value="pekarya" ${this.state.role === 'pekarya' ? 'selected' : ''}>Pekarya</option>
           </select>
         </div>`;

    const header = document.createElement('header');
    header.className = 'topbar';
    header.innerHTML = `
      <div class="tb-in">
        <div class="tb-brand-m">
          <svg viewBox="0 0 44 44" width="34" height="34" aria-hidden="true">
            <rect width="44" height="44" rx="12" fill="#1E3A8A"/>
            <path d="M22 8.5c3.6 4.3 6 7.6 6 10.6a6 6 0 1 1-12 0c0-3 2.4-6.3 6-10.6z" fill="#FBB917"/>
            <path d="M10 33.5c2.2-2.6 4.4-2.6 6.6 0s4.4 2.6 6.6 0 4.4-2.6 6.6 0 4.4 2.6 6.6 0" stroke="#FBB917" stroke-width="2.4" fill="none" stroke-linecap="round"/>
          </svg>
          <div><b>TP-OP Brantas</b><small>Portal Kinerja</small></div>
        </div>
        <div class="tb-title">
          <span class="kicker" id="tbKicker">Beranda</span>
          <h2 id="tbTitle">Dashboard</h2>
        </div>
        <div class="tb-right">
          <span class="tb-time" id="tbTime">—</span>

          ${roleBlock}

          <div class="notif-wrap">
            <button class="icon-btn" id="btnBell" aria-label="Notifikasi">
              <i data-lucide="bell"></i>
              <span class="n-badge" id="nBadge">3</span>
            </button>
            <div class="notif-panel" id="notifPanel">
              <div class="np-head">
                <b>Notifikasi</b>
                <button class="np-read" id="btnRead">Tandai dibaca</button>
              </div>
              <div class="np-item">
                <span class="np-ic ok"><i data-lucide="file-text"></i></span>
                <div><p>Laporan <b>LPB-2026-0102</b> menunggu verifikasi</p><small>10 menit lalu</small></div>
              </div>
              <div class="np-item">
                <span class="np-ic warn"><i data-lucide="fingerprint"></i></span>
                <div><p>Presensi <b>di luar radius</b> perlu diverifikasi Korlap</p><small>25 menit lalu</small></div>
              </div>
              <div class="np-item">
                <span class="np-ic ink"><i data-lucide="droplets"></i></span>
                <div><p>Jadwal giling HIPPA Sumber Rejeki mulai besok</p><small>Kemarin</small></div>
              </div>
            </div>
          </div>

          <button class="me-chip" data-go="profil">
            <img src="${pegawai?.foto || 'https://i.pravatar.cc/80'}" alt="">
            <span>${pegawai?.nama?.split(' ')[0] || 'Demo'}</span>
            <i data-lucide="chevron-down"></i>
          </button>
        </div>
      </div>`;

    const mainDiv = document.querySelector('.main');
    mainDiv.insertBefore(header, mainDiv.firstChild);
  },

  /* ---------- Render bottom nav ---------- */
  renderBottomNav() {
    const menu = this.MENU_BY_ROLE[this.state.role] || [];
    const top5 = menu.slice(0, 5);

    const nav = document.createElement('nav');
    nav.id = 'bnav';
    nav.setAttribute('aria-label', 'Navigasi utama');
    nav.innerHTML = top5.map(key => {
      const p = this.PAGES[key];
      return `
        <button class="bnav-item" data-page="${key}">
          <span class="bnav-ic"><i data-lucide="${p.icon}"></i></span>${p.title.split(' ')[0]}
        </button>`;
    }).join('');

    document.body.appendChild(nav);
  },

  /* ---------- Navigasi ---------- */
  go(page) {
    if (!this.PAGES[page]) return;
    this.state.page = page;

    document.querySelectorAll('.nav-btn, .bnav-item').forEach(b => {
      b.classList.toggle('on', b.dataset.page === page);
    });

    const p = this.PAGES[page];
    const tk = document.getElementById('tbKicker');
    const tt = document.getElementById('tbTitle');
    if (tk) tk.textContent = p.kicker;
    if (tt) tt.textContent = p.title;

    document.querySelectorAll('.page').forEach(s => {
      s.classList.toggle('active', s.dataset.page === page);
    });

    if (window.Dashboard && page === 'dashboard') Dashboard.render();
    if (window.Presensi && page === 'presensi') Presensi.render();
    if (window.Operasi && page === 'operasi') Operasi.render();
    if (window.Pemeliharaan && page === 'pemeliharaan') Pemeliharaan.render();
    if (window.Laporan && page === 'laporan') Laporan.render();
    if (window.Hippa && page === 'hippa') Hippa.render();
    if (window.Raport && page === 'raport') Raport.render();
    if (window.Profil && page === 'profil') Profil.render();
    if (window.Verifikasi && page === 'verifikasi') Verifikasi.render();

    this.closeNotif();
    window.scrollTo(0, 0);
    if (window.lucide) lucide.createIcons();
  },

  initClock() {
    const el = document.getElementById('tbTime');
    if (!el) return;
    const tick = () => {
      const d = new Date();
      el.textContent =
        d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' }) +
        ' · ' +
        d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    };
    tick();
    setInterval(tick, 30000);
  },

  initNotif() {
    const btn = document.getElementById('btnBell');
    const panel = document.getElementById('notifPanel');
    if (!btn || !panel) return;
    btn.addEventListener('click', e => {
      e.stopPropagation();
      panel.classList.toggle('open');
    });
    document.addEventListener('click', e => {
      if (!e.target.closest('.notif-wrap')) panel.classList.remove('open');
    });
    document.getElementById('btnRead')?.addEventListener('click', e => {
      e.stopPropagation();
      panel.querySelectorAll('.np-item').forEach(n => n.classList.add('read'));
      document.getElementById('nBadge').style.display = 'none';
      e.target.disabled = true;
      if (typeof toast === 'function') toast('Semua notifikasi ditandai dibaca.', 'info');
    });
  },

  closeNotif() {
    document.getElementById('notifPanel')?.classList.remove('open');
  },

  initEvents() {
    document.addEventListener('click', e => {
      const navBtn = e.target.closest('.nav-btn, .bnav-item');
      if (navBtn) { this.go(navBtn.dataset.page); return; }

      const goBtn = e.target.closest('[data-go]');
      if (goBtn) { this.go(goBtn.dataset.go); return; }

      if (e.target.closest('#btnLogout')) {
        Auth.logout();
        return;
      }
    });

    document.getElementById('roleSwitch')?.addEventListener('change', e => {
      const newRole = e.target.value;
      Auth.switchRole(newRole);
      if (typeof toast === 'function') {
        toast(`Beralih ke peran: ${roleLabel(newRole)}`, 'info');
      }
      setTimeout(() => location.reload(), 500);
    });

    let lastY = window.scrollY;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      const bnav = document.getElementById('bnav');
      if (!bnav) return;
      if (y > lastY + 4 && y > 90) bnav.classList.add('hide');
      else if (y < lastY - 4) bnav.classList.remove('hide');
      lastY = y;
    }, { passive: true });
  }
};

window.Portal = Portal;