/**
 * RescueSignal AI - Resilient Web Audio Synthesizer
 * Generates acoustic FSK modem bursts, SOS Morse signals, and emergency alarms
 * completely client-side with zero external media files.
 */

class RescueSoundEngine {
  constructor() {
    this.audioCtx = null;
    this.analyser = null;
    this.isPlaying = false;
    this.stopRequested = false;
    this.canvasMap = new Map();
  }

  init() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 256;
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  stopAll() {
    this.stopRequested = true;
    this.isPlaying = false;
    if (this.currentGain && this.audioCtx) {
      try {
        this.currentGain.gain.cancelScheduledValues(this.audioCtx.currentTime);
        this.currentGain.gain.setValueAtTime(0, this.audioCtx.currentTime);
      } catch (e) {}
    }
    if (this.currentOscillator) {
      try {
        this.currentOscillator.stop();
        this.currentOscillator.disconnect();
      } catch (e) {}
      this.currentOscillator = null;
    }
    this.currentGain = null;
  }

  /** Play single calibrated tone */
  playTone(frequency = 800, durationMs = 120, type = 'sine') {
    if (this.stopRequested) return Promise.resolve();
    this.init();
    return new Promise((resolve) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      this.currentOscillator = osc;
      this.currentGain = gain;

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);

      // Smooth attack and release to prevent speaker clicks
      const now = this.audioCtx.currentTime;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.3, now + 0.01);
      gain.gain.setValueAtTime(0.3, now + (durationMs / 1000) - 0.01);
      gain.gain.linearRampToValueAtTime(0, now + (durationMs / 1000));

      osc.connect(gain);
      gain.connect(this.analyser);
      this.analyser.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + (durationMs / 1000));

      const timer = setTimeout(() => {
        if (this.currentOscillator === osc) this.currentOscillator = null;
        if (this.currentGain === gain) this.currentGain = null;
        resolve();
      }, durationMs);

      if (this.stopRequested) {
        clearTimeout(timer);
        try {
          osc.stop();
          osc.disconnect();
        } catch (e) {}
        this.currentOscillator = null;
        this.currentGain = null;
        resolve();
      }
    });
  }

  /** Plays acoustic Morse sequence */
  async playMorse(morseString, unitTimeMs = 90, onProgress = null) {
    this.init();
    this.isPlaying = true;
    this.stopRequested = false;

    const dotDuration = unitTimeMs;
    const dashDuration = unitTimeMs * 3;
    const toneFreq = 880; // Clear piercing acoustic frequency

    for (let i = 0; i < morseString.length; i++) {
      if (this.stopRequested) break;
      const char = morseString[i];

      if (onProgress) onProgress(i, morseString.length, char);

      if (char === '.') {
        await this.playTone(toneFreq, dotDuration);
        await this.sleep(dotDuration); // intra-char gap
      } else if (char === '-') {
        await this.playTone(toneFreq, dashDuration);
        await this.sleep(dotDuration); // intra-char gap
      } else if (char === ' ') {
        await this.sleep(dotDuration * 3); // char gap
      } else if (char === '/') {
        await this.sleep(dotDuration * 7); // word gap
      }
    }

    this.isPlaying = false;
    if (onProgress) onProgress(morseString.length, morseString.length, 'DONE');
  }

  /** Plays Audio FSK (Frequency Shift Keying) acoustic data burst */
  async playAcousticFSK(dataString, onProgress = null) {
    this.init();
    this.isPlaying = true;
    this.stopRequested = false;

    // Convert string to 8-bit binary stream
    let bitStream = "10101010"; // Preamble
    for (let i = 0; i < dataString.length; i++) {
      const byte = dataString.charCodeAt(i).toString(2).padStart(8, '0');
      bitStream += "0" + byte + "11"; // Start bit, 8 data bits, 2 stop bits (UART format)
    }

    const bitDurationMs = 25; // 40 baud acoustic transmission
    const markFreq = 1200;  // Binary 1
    const spaceFreq = 2200; // Binary 0

    for (let i = 0; i < bitStream.length; i++) {
      if (this.stopRequested) break;
      const bit = bitStream[i];
      const freq = bit === '1' ? markFreq : spaceFreq;
      
      if (onProgress && i % 5 === 0) {
        onProgress(i, bitStream.length, bit);
      }

      await this.playTone(freq, bitDurationMs, 'sine');
    }

    this.isPlaying = false;
    if (onProgress && !this.stopRequested) onProgress(bitStream.length, bitStream.length, 'DONE');
  }

  /** Plays rescue alert chime when a critical packet is received */
  async playEmergencyAlert() {
    this.init();
    await this.playTone(960, 160, 'triangle');
    await this.sleep(40);
    await this.playTone(1280, 260, 'triangle');
  }

  sleep(ms) {
    return new Promise(res => {
      if (this.stopRequested) {
        res();
        return;
      }
      const interval = 20;
      let elapsed = 0;
      const timer = setInterval(() => {
        elapsed += interval;
        if (this.stopRequested || elapsed >= ms) {
          clearInterval(timer);
          res();
        }
      }, interval);
    });
  }

  /** Attach live visualizer to a Canvas element */
  attachVisualizer(canvasElement) {
    this.init();
    const ctx = canvasElement.getContext('2d');
    const analyser = this.micAnalyser || this.analyser;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      if (!this.canvasMap.has(canvasElement)) {
        this.canvasMap.set(canvasElement, true);
      }
      requestAnimationFrame(render);
      const activeAnalyser = this.micAnalyser || this.analyser;
      activeAnalyser.getByteTimeDomainData(dataArray);

      ctx.fillStyle = 'rgba(10, 14, 23, 0.35)';
      ctx.fillRect(0, 0, canvasElement.width, canvasElement.height);

      ctx.lineWidth = 2;
      ctx.strokeStyle = this.isMicListening ? '#10b981' : '#06b6d4';
      ctx.beginPath();

      const sliceWidth = canvasElement.width * 1.0 / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * (canvasElement.height / 2);

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        x += sliceWidth;
      }

      ctx.lineTo(canvasElement.width, canvasElement.height / 2);
      ctx.stroke();
    };

    render();
  }

  /**
   * Starts real-time microphone acoustic listening (Rescue Terminal FFT Analyzer)
   * Captures ambient sound and detects FSK tones (1200 Hz / 2200 Hz) & Morse (880 Hz).
   */
  async startMicListening(canvasElement, onFreqDetected, onError) {
    this.init();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        }
      });

      this.micStream = stream;
      this.micSource = this.audioCtx.createMediaStreamSource(stream);
      this.micAnalyser = this.audioCtx.createAnalyser();
      this.micAnalyser.fftSize = 2048;
      this.micAnalyser.smoothingTimeConstant = 0.5;

      // Do NOT connect to destination (prevents feedback acoustic loop)
      this.micSource.connect(this.micAnalyser);
      this.isMicListening = true;

      const sampleRate = this.audioCtx.sampleRate;
      const binWidth = sampleRate / this.micAnalyser.fftSize;
      const freqBuffer = new Uint8Array(this.micAnalyser.frequencyBinCount);

      // Target frequency bins
      const bin1200 = Math.round(1200 / binWidth);
      const bin2200 = Math.round(2200 / binWidth);
      const bin880 = Math.round(880 / binWidth);

      let lastDetectionTime = 0;

      const detectLoop = () => {
        if (!this.isMicListening) return;
        requestAnimationFrame(detectLoop);

        this.micAnalyser.getByteFrequencyData(freqBuffer);

        const val1200 = freqBuffer[bin1200] || 0;
        const val2200 = freqBuffer[bin2200] || 0;
        const val880 = freqBuffer[bin880] || 0;

        // Baseline noise average
        const baseline = (freqBuffer[bin1200 - 5] + freqBuffer[bin1200 + 5] + freqBuffer[bin2200 - 5] + freqBuffer[bin2200 + 5]) / 4;

        const now = Date.now();
        if (now - lastDetectionTime > 150) {
          if (val1200 > 115 && val1200 > baseline + 30) {
            lastDetectionTime = now;
            if (onFreqDetected) onFreqDetected({ freq: 1200, power: val1200, type: 'FSK_MARK' });
          } else if (val2200 > 115 && val2200 > baseline + 30) {
            lastDetectionTime = now;
            if (onFreqDetected) onFreqDetected({ freq: 2200, power: val2200, type: 'FSK_SPACE' });
          } else if (val880 > 120 && val880 > baseline + 30) {
            lastDetectionTime = now;
            if (onFreqDetected) onFreqDetected({ freq: 880, power: val880, type: 'MORSE' });
          }
        }
      };

      detectLoop();
      return true;
    } catch (err) {
      this.isMicListening = false;
      if (onError) onError(err);
      return false;
    }
  }

  stopMicListening() {
    this.isMicListening = false;
    if (this.micStream) {
      this.micStream.getTracks().forEach(t => t.stop());
      this.micStream = null;
    }
    if (this.micSource) {
      try { this.micSource.disconnect(); } catch (e) {}
      this.micSource = null;
    }
    this.micAnalyser = null;
  }
}

// Global instance
window.soundEngine = new RescueSoundEngine();

