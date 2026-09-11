/* =================================================================
   camera.js — Live Camera Fullscreen Fixed
   Struktur: video absolute + header/footer overlay
   ================================================================= */

const Camera = {
  stream: null,
  video: null,
  canvas: null,
  detectionInterval: null,
  faceStableStart: null,
  STABLE_DURATION: 2000,
  CAPTURE_ENABLED: false,
  currentTarget: null,
  modelLoaded: false,
  onCapture: null,
  isAutoCapture: true,
  _escHandler: null,

  MODEL_URL: 'https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@master/weights',

  async init() {
    if (this.modelLoaded) return;
    if (typeof faceapi === 'undefined') return;
    try {
      await faceapi.nets.tinyFaceDetector.loadFromUri(this.MODEL_URL);
      this.modelLoaded = true;
      console.log('✅ face-api.js model loaded');
    } catch (e) {
      console.warn('Gagal load model face-api:', e.message);
    }
  },

  /* ---------- Buka modal camera ---------- */
  async open(target, onCapture) {
    this.currentTarget = target;
    this.onCapture = onCapture;
    this.faceStableStart = null;
    this.CAPTURE_ENABLED = false;
    this.isAutoCapture = (target === 'fotoMasuk');

    await this.init();

    const isSelfie = target === 'fotoMasuk';
    const useFaceDetect = isSelfie && this.modelLoaded;

    openModal(`
      <div class="cam-modal">

        <!-- Video fullscreen -->
        <div class="cm-body">
          <div class="cm-video-wrap">
            <video id="cmVideo" autoplay muted playsinline class="${isSelfie ? '' : 'no-mirror'}"></video>
            <canvas id="cmCanvas" class="cm-canvas"></canvas>

            ${useFaceDetect ? `
              <div class="cm-face-guide" id="cmFaceGuide">
                <div class="cm-guide-frame">
                  <div class="cm-guide-grid"></div>
                  <div class="cm-corner tl"></div>
                  <div class="cm-corner tr"></div>
                  <div class="cm-corner bl"></div>
                  <div class="cm-corner br"></div>
                  <div class="cm-scan-line"></div>
                  <div class="cm-guide-label">
                    <i data-lucide="scan-face"></i>
                    <span id="cmGuideText">Posisikan wajah di kotak</span>
                    <span class="cm-counter" id="cmFaceCount">0</span>
                  </div>
                </div>
              </div>
            ` : ''}

            <div class="cm-status" id="cmStatus">
              <i data-lucide="loader"></i>
              <span>Menyalakan kamera...</span>
            </div>
          </div>
        </div>

        <!-- Header overlay -->
        <div class="cm-head">
          <div>
            <span class="kicker">${isSelfie ? 'Kamera Depan' : 'Kamera Belakang'}</span>
            <h3>${isSelfie ? 'Ambil Foto Selfie' : 'Ambil Foto Lokasi'}</h3>
          </div>
          <button class="icon-btn" id="cmCloseBtn" aria-label="Tutup">
            <i data-lucide="x"></i>
          </button>
        </div>

        <!-- Footer: shutter -->
        <div class="cm-foot">
          <button class="cm-shutter" id="cmShutter" ${useFaceDetect ? 'disabled' : ''} aria-label="Ambil foto"></button>
        </div>

      </div>
    `);

    // Tambah class fullscreen ke modal
    document.getElementById('modal').classList.add('cam-fullscreen');

    this.video = document.getElementById('cmVideo');
    this.canvas = document.getElementById('cmCanvas');

    document.getElementById('cmShutter')?.addEventListener('click', () => this.capture());
    document.getElementById('cmCloseBtn')?.addEventListener('click', () => this.close());

    this._escHandler = (e) => { if (e.key === 'Escape') this.close(); };
    document.addEventListener('keydown', this._escHandler);

    await this.startCamera(isSelfie);

    if (window.lucide) lucide.createIcons();
  },

  async startCamera(isSelfie) {
    try {
      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: isSelfie ? 'user' : 'environment'
        },
        audio: false
      };

      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Browser tidak mendukung akses kamera. Gunakan HTTPS atau localhost.');
      }

      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.video.srcObject = this.stream;

      await new Promise((resolve, reject) => {
        this.video.onloadedmetadata = resolve;
        this.video.onerror = reject;
        setTimeout(resolve, 3000);
      });

      const status = document.getElementById('cmStatus');
      if (status) status.style.display = 'none';

      if (!isSelfie) {
        this.CAPTURE_ENABLED = true;
        this.updateShutter();
      }

      if (isSelfie && this.modelLoaded) {
        this.startFaceDetection();
      } else if (isSelfie) {
        this.CAPTURE_ENABLED = true;
        this.updateShutter();
      }

    } catch (err) {
      console.error('Camera error:', err);
      const status = document.getElementById('cmStatus');
      if (status) {
        status.className = 'cm-status error';
        status.innerHTML = `
          <i data-lucide="x"></i>
          <span>Gagal mengakses kamera</span>
          <small style="opacity:.7;font-size:12px;margin-top:6px">${err.message}</small>
        `;
      }
      if (window.lucide) lucide.createIcons();
    }
  },

  startFaceDetection() {
    const guide = document.getElementById('cmFaceGuide');
    const guideText = document.getElementById('cmGuideText');
    const faceCount = document.getElementById('cmFaceCount');

    this.detectionInterval = setInterval(async () => {
      if (!this.video || this.video.readyState !== 4) return;

      try {
        const detections = await faceapi.detectAllFaces(
          this.video,
          new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 })
        );

        const count = detections.length;
        if (faceCount) faceCount.textContent = count;

        if (guide) guide.classList.remove('ok', 'warn', 'error');

        if (count === 0) {
          if (guide) guide.classList.add('warn');
          if (guideText) guideText.textContent = 'Wajah tidak terdeteksi';
          this.faceStableStart = null;
          this.CAPTURE_ENABLED = false;
        } else if (count === 1) {
          const box = detections[0].box;
          const vw = this.video.videoWidth;
          const vh = this.video.videoHeight;
          const guideW = vw * 0.56;
          const guideH = vh * 0.70;
          const guideX = (vw - guideW) / 2;
          const guideY = (vh - guideH) / 2;

          const inBox =
            box.x >= guideX - 30 &&
            box.y >= guideY - 30 &&
            box.x + box.width <= guideX + guideW + 30 &&
            box.y + box.height <= guideY + guideH + 30;

          if (inBox) {
            if (guide) guide.classList.add('ok');
            if (!this.faceStableStart) {
              this.faceStableStart = Date.now();
              if (guideText) guideText.textContent = 'Wajah OK — tahan posisi';
            }
            const stableFor = Date.now() - this.faceStableStart;
            const remaining = Math.ceil((this.STABLE_DURATION - stableFor) / 1000);
            if (remaining > 0 && guideText) {
              guideText.textContent = `Tahan... ${remaining}s`;
            }
            if (stableFor >= this.STABLE_DURATION && this.isAutoCapture) {
              if (guideText) guideText.textContent = '📸 Capture!';
              this.capture();
            }
            this.CAPTURE_ENABLED = true;
          } else {
            if (guide) guide.classList.add('warn');
            if (guideText) guideText.textContent = 'Posisikan wajah di tengah kotak';
            this.faceStableStart = null;
            this.CAPTURE_ENABLED = false;
          }
        } else {
          if (guide) guide.classList.add('error');
          if (guideText) guideText.textContent = 'Lebih dari 1 wajah terdeteksi';
          this.faceStableStart = null;
          this.CAPTURE_ENABLED = false;
        }

        this.updateShutter();
      } catch (e) {}
    }, 300);
  },

  updateShutter() {
    const shutter = document.getElementById('cmShutter');
    if (!shutter) return;
    shutter.disabled = !this.CAPTURE_ENABLED;
    shutter.classList.toggle('auto-ready', this.CAPTURE_ENABLED && this.isAutoCapture && this.faceStableStart !== null);
  },

  async capture() {
    if (!this.video || !this.canvas) return;

    if (this.detectionInterval) {
      clearInterval(this.detectionInterval);
      this.detectionInterval = null;
    }

    const vw = this.video.videoWidth || 1280;
    const vh = this.video.videoHeight || 720;
    this.canvas.width = vw;
    this.canvas.height = vh;

    const ctx = this.canvas.getContext('2d');

    if (this.currentTarget === 'fotoMasuk') {
      ctx.translate(vw, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(this.video, 0, 0, vw, vh);

    // Flash effect
    const flash = document.createElement('div');
    flash.style.cssText = `
      position:fixed;inset:0;background:#fff;z-index:9999;
      opacity:0;pointer-events:none;transition:opacity .15s;
    `;
    document.body.appendChild(flash);
    requestAnimationFrame(() => {
      flash.style.opacity = '0.7';
      setTimeout(() => {
        flash.style.opacity = '0';
        setTimeout(() => flash.remove(), 200);
      }, 100);
    });

    this.canvas.toBlob(async (blob) => {
      if (!blob) {
        toast('Gagal capture foto', 'error');
        return;
      }

      const result = await kompresiKeTarget(blob, {
        targetKB: 100,
        maxDim: 1280,
        preferWebP: true
      });

      if (typeof this.onCapture === 'function') {
        this.onCapture(result.blob, {
          format: result.format,
          sizeKB: result.sizeKB,
          quality: result.quality
        });
      }

      this.close();
    }, 'image/webp', 0.9);
  },

  close() {
    if (this.detectionInterval) {
      clearInterval(this.detectionInterval);
      this.detectionInterval = null;
    }

    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
      this.stream = null;
    }

    if (this.video) {
      this.video.srcObject = null;
      this.video = null;
    }

    this.canvas = null;
    this.faceStableStart = null;
    this.CAPTURE_ENABLED = false;

    if (this._escHandler) {
      document.removeEventListener('keydown', this._escHandler);
      this._escHandler = null;
    }

    document.getElementById('modal')?.classList.remove('cam-fullscreen');
    closeModal();
  }
};

window.Camera = Camera;