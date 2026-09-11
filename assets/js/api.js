/* =================================================================
   api.js — Wrapper API
   Mode 'dummy' → pakai DATA lokal
   Mode 'live'  → pakai Supabase REST
   ================================================================= */

const API = {
  get mode() {
    return window.CONFIG?.MODE || 'dummy';
  },

  /* ---------- Request generic ke Supabase ---------- */
  async request(endpoint, method = 'GET', body = null, opts = {}) {
    const url = `${window.CONFIG.SUPABASE_URL}/rest/v1/${endpoint}`;
    const headers = {
      'apikey': window.CONFIG.SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${window.CONFIG.SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': method === 'POST' ? 'return=representation' : ''
    };
    const options = { method, headers, ...opts };
    if (body) options.body = JSON.stringify(body);

    const res = await fetch(url, options);
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`API ${method} ${endpoint} gagal: ${err}`);
    }
    return res.json();
  },

  /* ---------- Delay simulasi (untuk demo) ---------- */
  async _delay(ms = 200) {
    return new Promise(r => setTimeout(r, ms));
  },

  /* ============ PEGAWAI ============ */
  async getPegawai(id) {
    if (this.mode === 'dummy') {
      await this._delay();
      return window.DATA.PEGAWAI.find(p => p.id === id);
    }
    return this.request(`pegawai?id=eq.${id}`);
  },

  async getAllPegawai() {
    if (this.mode === 'dummy') {
      await this._delay();
      return window.DATA.PEGAWAI;
    }
    return this.request('pegawai');
  },

  async getPegawaiByRole(role) {
    if (this.mode === 'dummy') {
      await this._delay();
      return window.DATA.PEGAWAI.filter(p => p.role === role);
    }
    return this.request(`pegawai?role=eq.${role}`);
  },

  /* ============ PRESENSI ============ */
  async getPresensi(pegawaiId = null, limit = 100) {
    if (this.mode === 'dummy') {
      await this._delay();
      let list = window.DATA.PRESENSI;
      if (pegawaiId) list = list.filter(p => p.pegawaiId === pegawaiId);
      return list.slice(0, limit);
    }
    const q = pegawaiId ? `pegawai_id=eq.${pegawaiId}&` : '';
    return this.request(`presensi?${q}order=tanggal.desc&limit=${limit}`);
  },

  async getPresensiPendingVerifikasi() {
    if (this.mode === 'dummy') {
      await this._delay();
      return window.DATA.PRESENSI.filter(p => p.status === 'pending');
    }
    return this.request('presensi?status=eq.pending');
  },

  async submitPresensi(data) {
    if (this.mode === 'dummy') {
      await this._delay(400);
      const rec = {
        id: 'PRS-' + isoDate(new Date()) + '-' + data.pegawaiId,
        ...data,
        status: data.jarak > 200 ? 'pending' : 'verified'
      };
      window.DATA.PRESENSI.unshift(rec);
      return rec;
    }
    return this.request('presensi', 'POST', data);
  },

  async verifyPresensi(id, status, catatan = '') {
    if (this.mode === 'dummy') {
      await this._delay(300);
      const item = window.DATA.PRESENSI.find(p => p.id === id);
      if (item) {
        item.status = status;
        item.catatan = catatan;
        item.verifiedAt = new Date().toISOString();
      }
      return item;
    }
    return this.request(`presensi?id=eq.${id}`, 'PATCH', {
      status, catatan, verified_at: new Date().toISOString()
    });
  },

  /* ============ OPERASI PINTU ============ */
  async getOperasiPintu(pegawaiId = null, limit = 100) {
    if (this.mode === 'dummy') {
      await this._delay();
      let list = window.DATA.OPERASI;
      if (pegawaiId) list = list.filter(o => o.pegawaiId === pegawaiId);
      return list.slice(0, limit);
    }
    const q = pegawaiId ? `pegawai_id=eq.${pegawaiId}&` : '';
    return this.request(`operasi_pintu?${q}order=waktu.desc&limit=${limit}`);
  },

  async submitOperasi(data) {
    if (this.mode === 'dummy') {
      await this._delay(400);
      const rec = {
        id: 'OPR-' + isoDate(new Date()) + '-' + String(window.DATA.OPERASI.length + 1).padStart(3, '0'),
        ...data,
        waktu: new Date().toISOString()
      };
      window.DATA.OPERASI.unshift(rec);
      return rec;
    }
    return this.request('operasi_pintu', 'POST', data);
  },

  /* ============ PEMELIHARAAN ============ */
  async getPemeliharaan(pegawaiId = null, limit = 100) {
    if (this.mode === 'dummy') {
      await this._delay();
      let list = window.DATA.PEMELIHARAAN;
      if (pegawaiId) list = list.filter(p => p.pegawaiId === pegawaiId);
      return list.slice(0, limit);
    }
    const q = pegawaiId ? `pegawai_id=eq.${pegawaiId}&` : '';
    return this.request(`pemeliharaan?${q}order=tanggal.desc&limit=${limit}`);
  },

  async submitPemeliharaan(data) {
    if (this.mode === 'dummy') {
      await this._delay(400);
      const rec = {
        id: 'PML-' + isoDate(new Date()) + '-' + String(window.DATA.PEMELIHARAAN.length + 1).padStart(3, '0'),
        ...data,
        tanggal: isoDate(new Date())
      };
      window.DATA.PEMELIHARAAN.unshift(rec);
      return rec;
    }
    return this.request('pemeliharaan', 'POST', data);
  },

  /* ============ LAPORAN ============ */
  async getLaporan(pegawaiId = null, filterStatus = null) {
    if (this.mode === 'dummy') {
      await this._delay();
      let list = window.DATA.LAPORAN;
      if (pegawaiId) list = list.filter(l => l.pegawaiId === pegawaiId);
      if (filterStatus) list = list.filter(l => l.status === filterStatus);
      return list;
    }
    let q = [];
    if (pegawaiId) q.push(`pegawai_id=eq.${pegawaiId}`);
    if (filterStatus) q.push(`status=eq.${filterStatus}`);
    return this.request(`laporan?${q.join('&')}`);
  },

  async submitLaporan(data) {
    if (this.mode === 'dummy') {
      await this._delay(400);
      const rec = {
        id: `LPB-${new Date().getFullYear()}-${String(window.DATA.LAPORAN.length + 1).padStart(4, '0')}`,
        ...data,
        tanggal: isoDate(new Date()),
        status: 'Menunggu'
      };
      window.DATA.LAPORAN.unshift(rec);
      return rec;
    }
    return this.request('laporan', 'POST', data);
  },

  /* ============ HIPPA ============ */
  async getHippa() {
    if (this.mode === 'dummy') {
      await this._delay();
      return window.DATA.HIPPA;
    }
    return this.request('hippa');
  },

  async getJadwalGiling() {
    if (this.mode === 'dummy') {
      await this._delay();
      return window.DATA.JADWAL_GILING;
    }
    return this.request('jadwal_giling?order=mulai.desc');
  },

  /* ============ STATS ============ */
  async getStatsDashboard(role) {
    if (this.mode === 'dummy') {
      await this._delay();
      return window.DATA.STATS_DASHBOARD[role] || {};
    }
    // Live: hitung dari berbagai tabel
    return {};
  },

  /* ============ RAPORT ============ */
  async getIndikatorRaport(role) {
    if (this.mode === 'dummy') {
      await this._delay();
      return window.DATA.INDIKATOR_RAPORT[role] || [];
    }
    return this.request(`indikator_raport?role=eq.${role}`);
  }
};

window.API = API;