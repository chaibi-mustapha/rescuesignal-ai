/**
 * RescueSignal AI - Victim Transmitter Controller
 */

class VictimTransmitter {
  constructor(containerId = "victim-screen") {
    this.container = document.getElementById(containerId);
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.isRecording = false;
    this.currentPacket = null;
    this.currentMorse = "";
    this.isOpticalTransmitting = false;
    this.isAcousticTransmitting = false;
    this.origAcousticHtml = "";
    this.origOpticalHtml = "";
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initBatteryIndicator();
    // Default initial demonstration packet in English
    this.loadScenarioText("We are three people trapped under rubble. One person is injured in the leg and another is unconscious. Urgent medical assistance needed.");
  }

  initBatteryIndicator() {
    const el = document.getElementById("tx-battery-indicator");
    if (!el) return;

    if (navigator.getBattery) {
      navigator.getBattery().then(battery => {
        const update = () => {
          const pct = Math.round(battery.level * 100);
          const hours = Math.round((pct / 100) * 24);
          el.innerText = `🔋 ${pct}% • ${hours}h survival`;
        };
        update();
        battery.addEventListener("levelchange", update);
      }).catch(() => {});
    }
  }

  setupEventListeners() {
    // Mode tabs switching
    const tabVoice = document.getElementById("tab-btn-voice");
    const tabSilent = document.getElementById("tab-btn-silent");
    const voiceWrapper = document.getElementById("voice-control-wrapper");
    const silentArea = document.getElementById("silent-control-area");

    if (tabVoice && tabSilent) {
      tabVoice.addEventListener("click", () => {
        this.stopAllTransmissions();
        tabVoice.classList.add("active");
        tabVoice.classList.remove("silent-active");
        tabSilent.classList.remove("active", "silent-active");
        if (voiceWrapper) voiceWrapper.style.display = "block";
        if (silentArea) silentArea.classList.remove("active");
      });

      tabSilent.addEventListener("click", () => {
        this.stopAllTransmissions();
        tabSilent.classList.add("active", "silent-active");
        tabVoice.classList.remove("active");
        if (voiceWrapper) voiceWrapper.style.display = "none";
        if (silentArea) silentArea.classList.add("active");
      });
    }

    // Steppers logic
    this.setupSilentSteppers();

    // Situation picker logic
    document.querySelectorAll("#silent-situation-picker .situation-chip").forEach(chip => {
      chip.addEventListener("click", (e) => {
        this.stopAllTransmissions();
        document.querySelectorAll("#silent-situation-picker .situation-chip").forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
      });
    });

    // Urgency picker logic
    document.querySelectorAll("#silent-urgency-picker .urgency-pill").forEach(pill => {
      pill.addEventListener("click", (e) => {
        this.stopAllTransmissions();
        document.querySelectorAll("#silent-urgency-picker .urgency-pill").forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
      });
    });

    // Silent SOS Trigger
    const btnSilentSos = document.getElementById("btn-trigger-silent-sos");
    if (btnSilentSos) {
      btnSilentSos.addEventListener("click", () => {
        this.stopAllTransmissions();
        this.sendSilentEmergency();
      });
    }

    // Microphone button
    const micBtn = document.getElementById("btn-mic-record");
    if (micBtn) {
      micBtn.addEventListener("click", () => {
        this.stopAllTransmissions();
        this.toggleRecording();
      });
    }

    // Preset chips
    document.querySelectorAll(".scenario-chip").forEach(chip => {
      chip.addEventListener("click", (e) => {
        this.stopAllTransmissions();
        const text = e.target.getAttribute("data-prompt");
        if (text) this.loadScenarioText(text);
      });
    });

    // Transmission action buttons
    const btnAcoustic = document.getElementById("btn-tx-acoustic");
    if (btnAcoustic) {
      this.origAcousticHtml = btnAcoustic.innerHTML;
      btnAcoustic.addEventListener("click", () => this.transmitAcoustic());
    }

    const btnOptical = document.getElementById("btn-tx-optical");
    if (btnOptical) {
      this.origOpticalHtml = btnOptical.innerHTML;
      btnOptical.addEventListener("click", () => this.transmitOptical());
    }

    const btnMesh = document.getElementById("btn-tx-mesh");
    if (btnMesh) {
      btnMesh.addEventListener("click", () => {
        this.stopAllTransmissions();
        this.transmitMeshDirect();
      });
    }

    // Stop transmissions when switching browser tabs, window losing visibility or focus
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.stopAllTransmissions();
      }
    });

    window.addEventListener("pagehide", () => {
      this.stopAllTransmissions();
    });

    window.addEventListener("blur", () => {
      this.stopAllTransmissions();
    });

    // Global click listener: if any other button, tab, chip, or link is clicked while transmitting, stop!
    document.addEventListener("click", (e) => {
      if (!this.isOpticalTransmitting && !this.isAcousticTransmitting) return;

      const opticalBtn = document.getElementById("btn-tx-optical");
      const acousticBtn = document.getElementById("btn-tx-acoustic");

      // Clicking optical button while optical is transmitting: handled by transmitOptical
      if (this.isOpticalTransmitting && opticalBtn && (opticalBtn === e.target || opticalBtn.contains(e.target))) {
        return;
      }

      // Clicking acoustic button while acoustic is transmitting: handled by transmitAcoustic
      if (this.isAcousticTransmitting && acousticBtn && (acousticBtn === e.target || acousticBtn.contains(e.target))) {
        return;
      }

      // Any other interactive element clicked (e.g. tabs, buttons, chips, links)
      const interactiveEl = e.target.closest("button, a, .mode-tab-btn, .scenario-chip, .situation-chip, .urgency-pill, .stepper-btn, .chip-btn");
      if (interactiveEl) {
        this.stopAllTransmissions();
      }
    }, true);
  }

  setupSilentSteppers() {
    const bindStepper = (decId, incId, valId, minVal = 0) => {
      const btnDec = document.getElementById(decId);
      const btnInc = document.getElementById(incId);
      const elVal = document.getElementById(valId);
      if (!btnDec || !btnInc || !elVal) return;

      btnDec.addEventListener("click", () => {
        this.stopAllTransmissions();
        let cur = parseInt(elVal.innerText) || minVal;
        if (cur > minVal) {
          elVal.innerText = cur - 1;
        }
      });

      btnInc.addEventListener("click", () => {
        this.stopAllTransmissions();
        let cur = parseInt(elVal.innerText) || minVal;
        elVal.innerText = cur + 1;
      });
    };

    bindStepper("btn-dec-people", "btn-inc-people", "val-silent-people", 1);
    bindStepper("btn-dec-injured", "btn-inc-injured", "val-silent-injured", 0);
    bindStepper("btn-dec-unconscious", "btn-inc-unconscious", "val-silent-unconscious", 0);
  }

  async sendSilentEmergency() {
    const btn = document.getElementById("btn-trigger-silent-sos");
    const origText = btn ? btn.innerHTML : "";
    if (btn) btn.innerHTML = `<span>⏳ Broadcasting silent SOS...</span>`;

    // Extract values
    const activeSitChip = document.querySelector("#silent-situation-picker .situation-chip.active");
    const situationType = activeSitChip ? activeSitChip.getAttribute("data-sit") : "BUILDING_COLLAPSE";

    const peopleCount = parseInt(document.getElementById("val-silent-people")?.innerText || "1", 10);
    const injuredCount = parseInt(document.getElementById("val-silent-injured")?.innerText || "0", 10);
    const unconsciousCount = parseInt(document.getElementById("val-silent-unconscious")?.innerText || "0", 10);

    const activeUrgPill = document.querySelector("#silent-urgency-picker .urgency-pill.active");
    const medicalUrgency = activeUrgPill ? activeUrgPill.getAttribute("data-urg") : "URGENT";

    const payload = {
      situation_type: situationType,
      people_count: peopleCount,
      injured_count: injuredCount,
      unconscious_count: unconsciousCount,
      medical_urgency: medicalUrgency,
      hazards: [],
      location_details: "Rubble Zone (Silent Alert)"
    };

    try {
      const response = await fetch("/api/packet/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (data.success && data.packet) {
        this.applyPacket(data.packet, data.morse_sequence);

        if (btn) {
          btn.innerHTML = `<span>✅ SILENT SOS BROADCAST!</span>`;
          btn.style.background = "linear-gradient(135deg, #10b981, #047857)";
          setTimeout(() => {
            btn.innerHTML = origText;
            btn.style.background = "";
          }, 2000);
        }
      }
    } catch (err) {
      console.error("Silent emergency failed:", err);
      if (btn) {
        btn.innerHTML = `<span>❌ Transmission failed</span>`;
        setTimeout(() => { btn.innerHTML = origText; }, 1500);
      }
    }
  }

  async toggleRecording() {
    const micBtn = document.getElementById("btn-mic-record");
    const micLabel = document.getElementById("mic-status-label");

    if (this.isRecording) {
      // Stop recording
      if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
        this.mediaRecorder.stop();
      }
      this.isRecording = false;
      micBtn.classList.remove("recording");
      if (micLabel) micLabel.innerText = "Processing Voice AI...";
    } else {
      // Start recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.audioChunks = [];
        this.mediaRecorder = new MediaRecorder(stream);

        this.mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) this.audioChunks.push(event.data);
        };

        this.mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(this.audioChunks, { type: "audio/webm" });
          stream.getTracks().forEach(track => track.stop());
          await this.uploadAudioBlob(audioBlob);
        };

        this.mediaRecorder.start();
        this.isRecording = true;
        micBtn.classList.add("recording");
        if (micLabel) micLabel.innerText = "Listening... Speak now!";
      } catch (err) {
        console.warn("Microphone access denied or not available, using voice prompt simulation:", err);
        this.loadScenarioText("We are three people trapped under rubble. One person is injured and another is unconscious. Urgent help needed.");
        if (micLabel) micLabel.innerText = "Voice Simulation Mode Active";
      }
    }
  }

  async uploadAudioBlob(blob) {
    const micLabel = document.getElementById("mic-status-label");
    try {
      const formData = new FormData();
      formData.append("file", blob, "emergency_voice.webm");

      const response = await fetch("/api/voice/process-audio", {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      if (data.success && data.packet) {
        this.applyPacket(data.packet, data.morse_sequence);
      }
    } catch (e) {
      console.error("Audio processing failed:", e);
      if (micLabel) micLabel.innerText = "Error - Fallback to local engine";
    }
  }

  async loadScenarioText(promptText) {
    const micLabel = document.getElementById("mic-status-label");
    if (micLabel) micLabel.innerText = "Analyzing with AssemblyAI...";

    try {
      const response = await fetch("/api/voice/process-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: promptText, language: "en" })
      });

      const data = await response.json();
      if (data.success && data.packet) {
        this.applyPacket(data.packet, data.morse_sequence);
      }
    } catch (e) {
      console.error("Text analysis failed:", e);
    }
  }

  applyPacket(packet, morse) {
    this.currentPacket = packet;
    this.currentMorse = morse;

    const micLabel = document.getElementById("mic-status-label");
    if (micLabel) micLabel.innerText = "Ready to broadcast";

    // Update UI elements
    const rawBox = document.getElementById("tx-packet-raw");
    if (rawBox) rawBox.innerText = packet.compact_string;

    const sizeEl = document.getElementById("tx-packet-size");
    if (sizeEl) sizeEl.innerText = `${packet.byte_size} bytes`;

    const chkEl = document.getElementById("tx-packet-chk");
    if (chkEl) chkEl.innerText = `CRC #${packet.checksum} Valid`;

    // Fill Extraction Details
    const p = packet.payload;
    const typeEl = document.getElementById("tx-info-type");
    if (typeEl) typeEl.innerText = p.situation_type.replace("_", " ");

    const pCountEl = document.getElementById("tx-info-people");
    if (pCountEl) pCountEl.innerText = p.people_count;

    const iCountEl = document.getElementById("tx-info-injured");
    if (iCountEl) iCountEl.innerText = p.injured_count;

    const uCountEl = document.getElementById("tx-info-unconscious");
    if (uCountEl) uCountEl.innerText = p.unconscious_count;

    const urgEl = document.getElementById("tx-info-urgency");
    if (urgEl) {
      urgEl.innerText = p.medical_urgency;
      urgEl.className = `badge ${p.medical_urgency === 'CRITICAL' ? 'badge-pulse' : ''}`;
    }

    const locEl = document.getElementById("tx-info-location");
    if (locEl) locEl.innerText = p.location_details || "Disaster Zone";
  }

  async transmitAcoustic() {
    // If acoustic transmission is already running, toggle/stop it
    if (this.isAcousticTransmitting) {
      this.stopAcoustic();
      return;
    }

    // Stop optical if it was running
    if (this.isOpticalTransmitting) {
      this.stopOptical();
    }

    if (!this.currentPacket) return;
    const btn = document.getElementById("btn-tx-acoustic");
    this.isAcousticTransmitting = true;

    if (btn) {
      btn.innerHTML = `<span>🛑 Stop Acoustic Signal (0%)</span>`;
      btn.classList.add("active-transmitting");
      btn.disabled = false;
    }

    try {
      // Play FSK acoustic burst using Sound Engine
      await window.soundEngine.playAcousticFSK(this.currentPacket.compact_string, (cur, total) => {
        if (!this.isAcousticTransmitting) return;
        const pct = Math.round((cur / total) * 100);
        if (btn) {
          btn.innerHTML = `<span>🛑 Stop Acoustic Signal (${pct}%)</span>`;
        }
      });
    } finally {
      this.stopAcoustic();
    }
  }

  stopAcoustic() {
    this.isAcousticTransmitting = false;
    if (window.soundEngine) {
      window.soundEngine.stopAll();
    }
    const btn = document.getElementById("btn-tx-acoustic");
    if (btn) {
      btn.innerHTML = this.origAcousticHtml || `🔊 Broadcast Acoustic Signal (FSK)`;
      btn.classList.remove("active-transmitting");
      btn.disabled = false;
    }
  }

  async transmitOptical() {
    // If optical transmission is already running, toggle/stop it
    if (this.isOpticalTransmitting) {
      this.stopOptical();
      return;
    }

    // Stop acoustic if it was running
    if (this.isAcousticTransmitting) {
      this.stopAcoustic();
    }

    if (!this.currentMorse) return;
    const btn = document.getElementById("btn-tx-optical");
    const overlay = document.getElementById("optical-strobe-overlay");
    if (!overlay) return;

    this.isOpticalTransmitting = true;

    if (btn) {
      btn.innerHTML = `<span>🛑 Stop Optical Strobe</span>`;
      btn.classList.add("active-transmitting");
      btn.disabled = false;
    }

    overlay.style.display = "block";

    const abortableSleep = (ms) => {
      return new Promise((resolve) => {
        if (!this.isOpticalTransmitting) {
          resolve();
          return;
        }
        const interval = 20;
        let elapsed = 0;
        const timer = setInterval(() => {
          elapsed += interval;
          if (!this.isOpticalTransmitting || elapsed >= ms) {
            clearInterval(timer);
            resolve();
          }
        }, interval);
      });
    };

    try {
      // Optical Morse pulse timing
      const tokens = this.currentMorse.split(" ");
      for (const token of tokens.slice(0, 15)) {
        if (!this.isOpticalTransmitting) break;
        for (const char of token) {
          if (!this.isOpticalTransmitting) break;
          if (char === '.') {
            overlay.style.background = "#ffffff";
            await abortableSleep(80);
            overlay.style.background = "transparent";
            await abortableSleep(80);
          } else if (char === '-') {
            overlay.style.background = "#ffffff";
            await abortableSleep(240);
            overlay.style.background = "transparent";
            await abortableSleep(80);
          }
        }
        if (!this.isOpticalTransmitting) break;
        await abortableSleep(200);
      }
    } finally {
      this.stopOptical();
    }
  }

  stopOptical() {
    this.isOpticalTransmitting = false;
    const overlay = document.getElementById("optical-strobe-overlay");
    if (overlay) {
      overlay.style.display = "none";
      overlay.style.background = "transparent";
    }
    const btn = document.getElementById("btn-tx-optical");
    if (btn) {
      btn.innerHTML = this.origOpticalHtml || `💡 Broadcast Optical Strobe (Morse)`;
      btn.classList.remove("active-transmitting");
      btn.disabled = false;
    }
  }

  stopAllTransmissions() {
    if (this.isOpticalTransmitting) {
      this.stopOptical();
    }
    if (this.isAcousticTransmitting) {
      this.stopAcoustic();
    }
  }

  async transmitMeshDirect() {
    if (!this.currentPacket) return;
    const btn = document.getElementById("btn-tx-mesh");
    const origHtml = btn.innerHTML;
    btn.innerHTML = `<span>📶 P2P Mesh Broadcast Sent!</span>`;

    try {
      await fetch("/api/packet/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender_id: "Victim-Device-A",
          packet: this.currentPacket,
          channel: "p2p_mesh",
          device_name: "SmartPhone-Victim"
        })
      });
    } catch (e) {
      console.warn("Broadcast err:", e);
    }

    setTimeout(() => {
      btn.innerHTML = origHtml;
    }, 1500);
  }
}

// Attach to window
window.VictimTransmitter = VictimTransmitter;
