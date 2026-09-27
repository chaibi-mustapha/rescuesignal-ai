/**
 * RescueSignal AI - Rescuer Station & Triage Receiver Controller
 */

class RescuerReceiver {
  constructor(feedContainerId = "receiver-feed") {
    this.feed = document.getElementById(feedContainerId);
    this.ws = null;
    this.receivedCount = 0;
    this.isMicListening = false;
    this.init();
  }

  init() {
    this.connectWebSocket();
    this.setupVisualizer();
    this.setupMicListener();
  }

  setupVisualizer() {
    const canvas = document.getElementById("receiver-waveform");
    if (canvas && window.soundEngine) {
      window.soundEngine.attachVisualizer(canvas);
    }
  }

  setupMicListener() {
    const btn = document.getElementById("btn-rx-mic-listen");
    const detBadge = document.getElementById("rx-freq-detection");
    const canvas = document.getElementById("receiver-waveform");
    if (!btn || !window.soundEngine) return;

    btn.addEventListener("click", async () => {
      if (this.isMicListening) {
        window.soundEngine.stopMicListening();
        this.isMicListening = false;
        btn.innerHTML = `<span>🎙️ Enable Live Acoustic Listening (Mic)</span>`;
        btn.classList.remove("active-listening");
        if (detBadge) {
          detBadge.innerText = "Microphone Standby";
          detBadge.style.color = "var(--text-dim)";
          detBadge.style.borderColor = "var(--border-color)";
        }
      } else {
        btn.innerHTML = `<span>⏳ Activating microphone...</span>`;
        const ok = await window.soundEngine.startMicListening(
          canvas,
          (data) => {
            if (detBadge) {
              detBadge.innerHTML = `🚨 WAVE DETECTED: <strong>${data.freq} Hz (${data.type})</strong>`;
              detBadge.style.color = "#10b981";
              detBadge.style.borderColor = "#10b981";
              detBadge.classList.add("pulse-highlight");
              setTimeout(() => {
                detBadge.classList.remove("pulse-highlight");
              }, 600);
            }
          },
          (err) => {
            console.warn("Mic listen err:", err);
            btn.innerHTML = `<span>❌ Microphone access denied</span>`;
            setTimeout(() => {
              btn.innerHTML = `<span>🎙️ Enable Live Acoustic Listening (Mic)</span>`;
            }, 2000);
          }
        );

        if (ok) {
          this.isMicListening = true;
          btn.innerHTML = `<span>🛑 Stop Microphone Listening</span>`;
          btn.classList.add("active-listening");
          if (detBadge) {
            detBadge.innerText = "Active Listening (FFT 1200 / 2200 Hz)";
            detBadge.style.color = "var(--color-cyan)";
            detBadge.style.borderColor = "var(--color-cyan)";
          }
        }
      }
    });
  }

  connectWebSocket() {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws/mesh`;
    
    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log("Connected to RescueSignal Local Mesh");
        const statusEl = document.getElementById("rx-mesh-status");
        if (statusEl) {
          statusEl.innerText = "LOCAL CHANNEL ACTIVE (LISTENING)";
          statusEl.style.color = "var(--color-cyan)";
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "EMERGENCY_BROADCAST") {
            this.handleIncomingBroadcast(data);
          } else if (data.type === "HISTORY") {
            data.packets.forEach(pkt => this.handleIncomingBroadcast(pkt, false));
          }
        } catch (e) {
          console.warn("Error parsing WS message:", e);
        }
      };

      this.ws.onclose = () => {
        console.log("WebSocket disconnected, reconnecting in 3s...");
        setTimeout(() => this.connectWebSocket(), 3000);
      };
    } catch (e) {
      console.error("WS setup failed:", e);
    }
  }

  handleIncomingBroadcast(broadcastData, playSound = true) {
    this.receivedCount++;
    const packet = broadcastData.packet;
    const payload = packet.payload;
    const channel = broadcastData.channel || "Acoustic / P2P";
    const snr = broadcastData.signal_quality || 88;

    // Play audible chime if new critical emergency
    if (playSound && window.soundEngine) {
      window.soundEngine.playEmergencyAlert();
    }

    // Determine Triage Category
    const isCritical = payload.medical_urgency === "CRITICAL" || payload.unconscious_count > 0;
    const priorityCode = isCritical ? "P1 - CRITICAL" : (payload.injured_count > 0 ? "P2 - URGENT" : "P3 - MODERATE");
    const priorityClass = isCritical ? "critical" : "urgent";
    const badgeClass = isCritical ? "p1" : "p2";

    // Format human time
    const timeStr = new Date(packet.timestamp * 1000).toLocaleTimeString();

    // Create Card
    const card = document.createElement("div");
    card.className = `triage-card ${priorityClass} new-arrival`;
    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
        <span class="triage-badge ${badgeClass}">${priorityCode}</span>
        <span style="font-size:0.75rem; color:var(--text-dim); font-family:monospace;">${timeStr} • Signal: ${snr}%</span>
      </div>

      <div style="font-size:0.95rem; font-weight:700; color:#fff; margin-bottom:4px;">
        🚨 ${payload.situation_type.replace("_", " ")}
      </div>

      <div style="font-size:0.8rem; color:var(--text-muted); margin-bottom:8px;">
        ${payload.summary || "Alert received via acoustic wave / local mesh"}
      </div>

      <div class="victim-stats-grid">
        <div class="stat-box">
          <div class="val">${payload.people_count}</div>
          <div class="lbl">People</div>
        </div>
        <div class="stat-box">
          <div class="val" style="color:#f59e0b;">${payload.injured_count}</div>
          <div class="lbl">Injured</div>
        </div>
        <div class="stat-box">
          <div class="val" style="color:#ef4444;">${payload.unconscious_count}</div>
          <div class="lbl">Unconscious</div>
        </div>
      </div>

      <div style="font-size:0.75rem; color:var(--text-dim); margin-top:6px; font-family:monospace; background:rgba(0,0,0,0.3); padding:4px 8px; border-radius:4px; word-break:break-all;">
        PACKET: <span style="color:#38bdf8;">${packet.compact_string}</span>
      </div>

      <div class="checklist-group">
        <div style="font-size:0.7rem; font-weight:700; color:var(--color-cyan); text-transform:uppercase; margin-bottom:4px;">Emergency Response Protocol:</div>
        ${payload.situation_type.includes("KIDNAP") || payload.situation_type.includes("THREAT") ? `
          <label class="check-item"><input type="checkbox" checked> 🚨 Tactical Police & Hostage Rescue Dispatch Alerted</label>
          <label class="check-item"><input type="checkbox" checked> 📡 Covert P2P Triangulation & Silent Tracking</label>
          <label class="check-item"><input type="checkbox" checked> 🔇 Silent Tactical Unit En Route (Zero Siren/Light)</label>
        ` : `
          <label class="check-item"><input type="checkbox" checked> ICU Resuscitation Unit Dispatched</label>
          <label class="check-item"><input type="checkbox" ${payload.situation_type.includes("BUILDING") ? "checked" : ""}> Heavy Extrication & Lifting Gear En Route</label>
          <label class="check-item"><input type="checkbox" ${payload.hazards.includes("GAS_LEAK") ? "checked" : ""}> Hazmat & Oxygen Atmospheric Sensors Ready</label>
        `}
      </div>

      <button class="btn-secondary" style="width:100%; margin-top:10px; justify-content:center; background:rgba(6, 182, 212, 0.15); border-color:var(--color-cyan); color:#67e8f9;" onclick="this.innerText='✅ Signal Acknowledged & Response Dispatched'">
        Acknowledge & Confirm Reception
      </button>
    `;

    if (this.feed) {
      // Clear placeholder if any
      const placeholder = this.feed.querySelector(".rx-placeholder");
      if (placeholder) placeholder.remove();

      this.feed.insertBefore(card, this.feed.firstChild);
    }
  }
}

// Attach to window
window.RescuerReceiver = RescuerReceiver;
