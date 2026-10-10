// Web Audio API Procedural Sound Engine for onTrack
// Generates cozy, lightweight ambient train sounds and UI effects client-side

class CozySoundService {
  constructor() {
    this.ctx = null;
    this.ambientNodes = {};
    this.volume = 0.5;
    this.isMuted = false;
    this.activeAmbient = null; // 'train' | 'rain' | 'fire' | null
    this.isInitialized = false;
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
        this.isInitialized = true;
      }
    } catch (e) {
      console.warn('AudioContext unavailable:', e);
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  // Play a UI click sound
  playClick() {
    if (this.isMuted) return;
    this.init();
    this.resume();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  // Play a station bell chime
  playStationBell() {
    if (this.isMuted) return;
    this.init();
    this.resume();
    if (!this.ctx) return;

    const freqs = [587.33, 880, 1174.66]; // D5, A5, D6
    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      const start = this.ctx.currentTime + idx * 0.15;
      gain.gain.setValueAtTime(0.2, start);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 1.8);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(start);
      osc.stop(start + 2.0);
    });
  }

  // Play a stamp award celebratory fanfare
  playStampFanfare() {
    if (this.isMuted) return;
    this.init();
    this.resume();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.12);

      const startTime = this.ctx.currentTime + i * 0.12;
      const duration = i === notes.length - 1 ? 1.2 : 0.4;
      gain.gain.setValueAtTime(0.25, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  }

  // Start train ambient track loop (chug-chug)
  startAmbient(type = 'train') {
    if (!type) {
      this.stopAmbient();
      return;
    }
    this.init();
    this.resume();
    if (!this.ctx) return;

    if (this.activeAmbient === type) return;
    this.stopAmbient();
    this.activeAmbient = type;

    if (type === 'train') {
      this._startTrainLoop();
    } else if (type === 'rain') {
      this._startRainLoop();
    } else if (type === 'fire') {
      this._startFireLoop();
    }
  }

  stopAmbient() {
    if (this.trainInterval) {
      clearInterval(this.trainInterval);
      this.trainInterval = null;
    }
    if (this.ambientNodes.rain) {
      try { this.ambientNodes.rain.stop(); } catch(e){}
      this.ambientNodes.rain = null;
    }
    if (this.ambientNodes.fire) {
      try { this.ambientNodes.fire.stop(); } catch(e){}
      this.ambientNodes.fire = null;
    }
    this.activeAmbient = null;
  }

  _startTrainLoop() {
    if (!this.ctx) return;
    // Rhythmic filtered noise pulses simulating click-clack train tracks
    const playChug = () => {
      if (!this.ctx || this.isMuted || this.activeAmbient !== 'train') return;
      const now = this.ctx.currentTime;
      [0, 0.15, 0.45, 0.60].forEach((offset) => {
        const bufferSize = this.ctx.sampleRate * 0.08;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * 0.5;
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(280, now + offset);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.08, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.07);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        noise.start(now + offset);
        noise.stop(now + offset + 0.08);
      });
    };

    playChug();
    this.trainInterval = setInterval(playChug, 1100);
  }

  _startRainLoop() {
    if (!this.ctx) return;
    // Filtered pink noise for soft rain
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      data[i] = (b0 + b1 + b2) * 0.08;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.09, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start();
    this.ambientNodes.rain = noise;
  }

  _startFireLoop() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() > 0.99 ? (Math.random() * 2 - 1) * 0.6 : 0) + (Math.random() * 0.02);
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start();
    this.ambientNodes.fire = noise;
  }
}

export const soundService = new CozySoundService();
