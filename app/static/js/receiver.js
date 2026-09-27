/**
 * RescueSignal AI - 911/112 AI Crisis Dispatcher & Dynamic Multi-Call Triage Receiver
 * Handles multiple simultaneous victim distress calls and dynamically re-orders them
 * by vital medical and tactical urgency (FIFO is overridden to prioritize lives).
 */

const PREDEFINED_VICTIM_CALLS = [
  {
    id: "CALL-01-CRITICAL",
    callerName: "Sector 4 — Collapsed Sub-level 1 (Rubble)",
    scenarioTitle: "Trapped in Concrete Rubble & Dust",
    rawTranscript: "Help! Can anyone hear me?! We're trapped under concrete rubble in sector 4! One person has a broken leg, and Sarah is unconscious! Please send medical help, we can barely breathe!",
    situationType: "BUILDING_COLLAPSE",
    peopleCount: 3,
    injuredCount: 1,
    unconsciousCount: 1,
    medicalUrgency: "CRITICAL",
    hazards: ["CONCRETE_RUBBLE", "ASPHYXIA_RISK", "BLEEDING"],
    compactPacket: "RS1|COL|P3|I1|U1|M1|H-RUB-ASP|LOC#A402|CRC#8F2A",
    priorityScore: 100,
    priorityCode: "P1 - CRITICAL",
    priorityClass: "critical",
    badgeClass: "p1",
    audioUrl: "/static/audio/victim_1_rubble.mp3",
    protocolChecklist: [
      "ICU Resuscitation Unit Dispatched (SMUR #04)",
      "Heavy Extrication & Hydraulic Jaws En Route",
      "Atmospheric Oxygen & Dust Airway Sensors Ready"
    ],
    status: "DISPATCH PENDING",
    unitsAssigned: "SMUR ICU #04 + Fire Dept Extrication #12",
    signalQuality: 92,
    timestamp: Date.now() - 45000
  },
  {
    id: "CALL-02-TACTICAL",
    callerName: "Sector 9 — Downtown Office (Covert Closet)",
    scenarioTitle: "Active Armed Threat / Hostage Risk",
    rawTranscript: "Armed intruder on the third floor. Hostage threat, suspect is armed. Two people hiding inside the locked supply closet. Send tactical police immediately. Do not make any noise.",
    situationType: "KIDNAPPING_THREAT",
    peopleCount: 2,
    injuredCount: 0,
    unconsciousCount: 0,
    medicalUrgency: "CRITICAL",
    hazards: ["ARMED_SUSPECT", "HOSTAGE_RISK", "COVERT_SITUATION"],
    compactPacket: "RS1|SEC|P2|I0|U0|M1|H-ARM-HST|LOC#B109|CRC#4E1B",
    priorityScore: 92,
    priorityCode: "P1 - TACTICAL",
    priorityClass: "tactical",
    badgeClass: "p1-tac",
    audioUrl: "/static/audio/victim_2_whisper_threat.mp3",
    protocolChecklist: [
      "Tactical Police SWAT / Special Intervention Alerted",
      "Covert P2P Mesh Triangulation & Silent Tracking",
      "Silent Tactical Unit En Route (Zero Siren / Zero Lights)"
    ],
    status: "DISPATCH PENDING",
    unitsAssigned: "Tactical Police SWAT Unit #9 + Silent Drone Recon",
    signalQuality: 98,
    timestamp: Date.now() - 15000
  },
  {
    id: "CALL-03-URGENT",
    callerName: "Sector 2 — Residential Tower Elevator Shaft",
    scenarioTitle: "Stalled Elevator Mechanical Trap",
    rawTranscript: "Elevator stalled between floor four and five after the tremors. We are four people trapped. One person has mild asthma panic, but everyone is conscious and stable. Power is completely out.",
    situationType: "CONFINED_SPACE",
    peopleCount: 4,
    injuredCount: 1,
    unconsciousCount: 0,
    medicalUrgency: "URGENT",
    hazards: ["POWER_OUTAGE", "ELEVATOR_SHAFT", "MILD_ASTHMA"],
    compactPacket: "RS1|ELV|P4|I1|U0|M2|H-POW-SHF|LOC#C881|CRC#317C",
    priorityScore: 60,
    priorityCode: "P2 - URGENT",
    priorityClass: "urgent",
    badgeClass: "p2",
    audioUrl: "/static/audio/victim_3_elevator.mp3",
    protocolChecklist: [
      "Firefighter Cable & Shaft Extrication Unit Alerted",
      "Secondary Paramedic Assessment (Asthma / Respiratory)",
      "Backup Power Generator & Winch Team Dispatched"
    ],
    status: "DISPATCH PENDING",
    unitsAssigned: "Rescue Tech Unit #07 + Paramedic Ambulance",
    signalQuality: 86,
    timestamp: Date.now() - 120000
  }
];

class RescuerReceiver {
  constructor(feedContainerId = "receiver-feed") {
    this.feed = document.getElementById(feedContainerId);
    this.ws = null;
    this.activeCalls = [];
    this.isMicListening = false;
    this.currentlyPlayingAudio = null;
    this.currentlyPlayingBtn = null;
    this.simTimeouts = [];
    this.init();
  }

  init() {
    this.injectDispatcherControls();
    this.connectWebSocket();
    this.setupVisualizer();
    this.setupMicListener();
    // Pre-populate with initial demonstration: 1 call initially (or wait for simulation)
    this.renderQueue();
  }

  injectDispatcherControls() {
    if (!this.feed) return;
    const parent = this.feed.parentElement;
    if (!parent || parent.querySelector(".crisis-dispatcher-bar")) return;

    const bar = document.createElement("div");
    bar.className = "crisis-dispatcher-bar";
    bar.innerHTML = `
      <div class="crisis-dispatcher-header">
        <div class="crisis-dispatcher-title">
          <span>🚨 911 / 112 AI Crisis Dispatcher</span>
        </div>
        <span style="font-size:0.68rem; color:var(--color-cyan); font-weight:700;">DYNAMIC VITAL TRIAGE</span>
      </div>

      <div class="crisis-stats-row">
        <span class="crisis-stat-pill active-count" id="stat-active-calls">Active Calls: 0</span>
        <span class="crisis-stat-pill p1-count" id="stat-p1-calls">🔴 P1 Critical: 0</span>
        <span class="crisis-stat-pill p2-count" id="stat-p2-calls">🟠 P2 Urgent: 0</span>
      </div>

      <div class="crisis-sim-btn-group">
        <button type="button" class="btn-crisis-sim" id="btn-sim-multi-calls" title="Simulates 3 incoming calls arriving asynchronously to show real-time dynamic re-ranking">
          ⚡ Simulate 3 Incoming Victim Calls (Demonstrate Dynamic Triage)
        </button>
        <button type="button" class="btn-crisis-sub" id="btn-inject-call-1" title="Inject Rubble P1 Call">
          📞 Rubble (P1)
        </button>
        <button type="button" class="btn-crisis-sub" id="btn-inject-call-2" title="Inject Armed Threat P1 Tac">
          🚨 Armed Threat (P1)
        </button>
        <button type="button" class="btn-crisis-sub" id="btn-inject-call-3" title="Inject Elevator P2 Call">
          🛗 Elevator (P2)
        </button>
        <button type="button" class="btn-crisis-reset" id="btn-reset-calls" title="Clear all calls">
          🔄 Reset
        </button>
      </div>
      <div id="dynamic-reorder-banner-slot"></div>
    `;

    parent.insertBefore(bar, this.feed);

    // Event listeners
    bar.querySelector("#btn-sim-multi-calls").addEventListener("click", () => {
      this.simulateMultiVictimInflow();
    });
    bar.querySelector("#btn-inject-call-1").addEventListener("click", () => {
      this.injectCallByIndex(0);
    });
    bar.querySelector("#btn-inject-call-2").addEventListener("click", () => {
      this.injectCallByIndex(1);
    });
    bar.querySelector("#btn-inject-call-3").addEventListener("click", () => {
      this.injectCallByIndex(2);
    });
    bar.querySelector("#btn-reset-calls").addEventListener("click", () => {
      this.clearAllCalls();
    });
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
        setTimeout(() => this.connectWebSocket(), 3000);
      };
    } catch (e) {
      console.error("WS setup failed:", e);
    }
  }

  calculatePriorityScore(payload) {
    let score = 10;
    if (payload.unconscious_count > 0) score += 90;
    if (payload.medical_urgency === "CRITICAL") score += 60;
    if (payload.situation_type && (payload.situation_type.includes("KIDNAP") || payload.situation_type.includes("THREAT"))) score += 80;
    if (payload.injured_count > 0) score += 30;
    if (payload.medical_urgency === "URGENT") score += 25;
    return score;
  }

  handleIncomingBroadcast(broadcastData, playSound = true) {
    const packet = broadcastData.packet;
    const payload = packet.payload;
    const channel = broadcastData.channel || "Acoustic / P2P";
    const snr = broadcastData.signal_quality || 88;

    if (playSound && window.soundEngine) {
      window.soundEngine.playEmergencyAlert();
    }

    const isCritical = payload.medical_urgency === "CRITICAL" || payload.unconscious_count > 0;
    const isThreat = payload.situation_type && (payload.situation_type.includes("KIDNAP") || payload.situation_type.includes("THREAT"));
    
    let priorityCode = "P3 - MODERATE";
    let priorityClass = "moderate";
    let badgeClass = "p3";

    if (isCritical) {
      if (isThreat) {
        priorityCode = "P1 - TACTICAL";
        priorityClass = "tactical";
        badgeClass = "p1-tac";
      } else {
        priorityCode = "P1 - CRITICAL";
        priorityClass = "critical";
        badgeClass = "p1";
      }
    } else if (payload.injured_count > 0 || payload.medical_urgency === "URGENT") {
      priorityCode = "P2 - URGENT";
      priorityClass = "urgent";
      badgeClass = "p2";
    }

    const newCall = {
      id: "CALL-LIVE-" + Date.now().toString(36),
      callerName: payload.location_details || "Live Victim Signal (Mesh Relay)",
      scenarioTitle: payload.situation_type.replace("_", " "),
      rawTranscript: payload.raw_transcript || payload.summary || "Emergency signal received via local channel",
      situationType: payload.situation_type,
      peopleCount: payload.people_count,
      injuredCount: payload.injured_count,
      unconsciousCount: payload.unconscious_count,
      medicalUrgency: payload.medical_urgency,
      hazards: payload.hazards || [],
      compactPacket: packet.compact_string,
      priorityScore: this.calculatePriorityScore(payload),
      priorityCode: priorityCode,
      priorityClass: priorityClass,
      badgeClass: badgeClass,
      audioUrl: null,
      protocolChecklist: isThreat ? [
        "Tactical Police SWAT / Hostage Rescue Alerted",
        "Covert P2P Mesh Triangulation & Silent Tracking",
        "Silent Tactical Unit En Route (Zero Siren/Light)"
      ] : [
        "ICU Resuscitation Unit Dispatched",
        "Heavy Extrication & Hydraulic Gear En Route",
        "Atmospheric Oxygen & Dust Airway Sensors Ready"
      ],
      status: "DISPATCH PENDING",
      unitsAssigned: isThreat ? "Tactical Police SWAT #9" : "SMUR ICU #04 + Extrication #12",
      signalQuality: snr,
      timestamp: Date.now()
    };

    this.addCallToQueue(newCall, true);
  }

  addCallToQueue(call, notifyReorder = false) {
    // Check if queue had items and this new item jumps ahead of existing items
    const wasNotEmpty = this.activeCalls.length > 0;
    const previousTopScore = wasNotEmpty ? this.activeCalls[0].priorityScore : 0;

    // Filter duplicate if same ID
    this.activeCalls = this.activeCalls.filter(c => c.id !== call.id);
    this.activeCalls.push(call);

    // Re-sort dynamically by priorityScore descending, then by timestamp descending
    this.activeCalls.sort((a, b) => {
      if (b.priorityScore !== a.priorityScore) {
        return b.priorityScore - a.priorityScore;
      }
      return b.timestamp - a.timestamp;
    });

    const isNowTop = this.activeCalls[0].id === call.id;

    if (notifyReorder && wasNotEmpty && isNowTop && call.priorityScore > previousTopScore) {
      this.displayReorderBanner(`⚡ DYNAMIC TRIAGE OVERRIDE: <strong>${call.callerName}</strong> (${call.priorityCode}) re-ranked to <strong>#1 Priority</strong>! Non-critical calls lowered in queue.`);
    }

    this.renderQueue();
  }

  displayReorderBanner(htmlMessage) {
    const slot = document.getElementById("dynamic-reorder-banner-slot");
    if (!slot) return;

    slot.innerHTML = `
      <div class="triage-reorder-banner">
        <span>⚡</span>
        <div>${htmlMessage}</div>
      </div>
    `;

    setTimeout(() => {
      if (slot) slot.innerHTML = "";
    }, 6500);
  }

  simulateMultiVictimInflow() {
    this.clearAllTimeouts();
    this.activeCalls = [];
    this.renderQueue();

    // Call 3 (Elevator, P2 Urgent) arrives FIRST at t = 0s
    const call3 = JSON.parse(JSON.stringify(PREDEFINED_VICTIM_CALLS[2]));
    call3.timestamp = Date.now();
    this.addCallToQueue(call3, false);
    if (window.soundEngine) window.soundEngine.playEmergencyAlert();

    // Call 1 (Rubble & Unconscious, P1 Critical) arrives at t = 1800ms
    const t1 = setTimeout(() => {
      const call1 = JSON.parse(JSON.stringify(PREDEFINED_VICTIM_CALLS[0]));
      call1.timestamp = Date.now();
      this.addCallToQueue(call1, true); // will trigger dynamic re-ranking to #1!
      if (window.soundEngine) window.soundEngine.playEmergencyAlert();
    }, 1800);
    this.simTimeouts.push(t1);

    // Call 2 (Armed Threat, P1 Tactical) arrives at t = 3600ms
    const t2 = setTimeout(() => {
      const call2 = JSON.parse(JSON.stringify(PREDEFINED_VICTIM_CALLS[1]));
      call2.timestamp = Date.now();
      this.addCallToQueue(call2, false);
      if (window.soundEngine) window.soundEngine.playEmergencyAlert();
    }, 3600);
    this.simTimeouts.push(t2);
  }

  injectCallByIndex(index) {
    if (index < 0 || index >= PREDEFINED_VICTIM_CALLS.length) return;
    const template = PREDEFINED_VICTIM_CALLS[index];
    const call = JSON.parse(JSON.stringify(template));
    call.id = call.id + "-" + Math.floor(Math.random() * 1000);
    call.timestamp = Date.now();
    this.addCallToQueue(call, true);
    if (window.soundEngine) window.soundEngine.playEmergencyAlert();
  }

  clearAllCalls() {
    this.clearAllTimeouts();
    this.stopAnyPlayingAudio();
    this.activeCalls = [];
    const slot = document.getElementById("dynamic-reorder-banner-slot");
    if (slot) slot.innerHTML = "";
    this.renderQueue();
  }

  clearAllTimeouts() {
    this.simTimeouts.forEach(t => clearTimeout(t));
    this.simTimeouts = [];
  }

  stopAnyPlayingAudio() {
    if (this.currentlyPlayingAudio) {
      this.currentlyPlayingAudio.pause();
      this.currentlyPlayingAudio = null;
    }
    if (this.currentlyPlayingBtn) {
      this.currentlyPlayingBtn.classList.remove("is-playing");
      this.currentlyPlayingBtn.innerHTML = `<span>▶ 🎙️ Listen to Victim Call</span>`;
      this.currentlyPlayingBtn = null;
    }
  }

  playVictimAudio(audioUrl, btnElement) {
    if (this.currentlyPlayingAudio && this.currentlyPlayingBtn === btnElement) {
      this.stopAnyPlayingAudio();
      return;
    }

    this.stopAnyPlayingAudio();

    const audio = new Audio(audioUrl);
    this.currentlyPlayingAudio = audio;
    this.currentlyPlayingBtn = btnElement;

    btnElement.classList.add("is-playing");
    btnElement.innerHTML = `<span>⏸️ Pause Victim Audio</span>`;

    audio.play().catch(err => {
      console.warn("Audio play prevented:", err);
      this.stopAnyPlayingAudio();
    });

    audio.onended = () => {
      this.stopAnyPlayingAudio();
    };
  }

  dispatchCall(callId, btnElement) {
    const call = this.activeCalls.find(c => c.id === callId);
    if (!call) return;

    call.status = "DISPATCHED";
    btnElement.classList.add("dispatched");
    btnElement.innerHTML = `<span>🚑 Response Units En Route (ETA: 4 min)</span>`;
    btnElement.disabled = true;

    // Check all protocol checkboxes in this card
    const card = btnElement.closest(".triage-card");
    if (card) {
      card.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = true);
    }
  }

  updateStats() {
    const statActive = document.getElementById("stat-active-calls");
    const statP1 = document.getElementById("stat-p1-calls");
    const statP2 = document.getElementById("stat-p2-calls");

    const total = this.activeCalls.length;
    const p1Count = this.activeCalls.filter(c => c.priorityCode.startsWith("P1")).length;
    const p2Count = this.activeCalls.filter(c => c.priorityCode.startsWith("P2")).length;

    if (statActive) statActive.innerText = `Active Calls: ${total}`;
    if (statP1) statP1.innerText = `🔴 P1 Critical: ${p1Count}`;
    if (statP2) statP2.innerText = `🟠 P2 Urgent: ${p2Count}`;
  }

  renderQueue() {
    this.updateStats();

    if (!this.feed) return;

    if (this.activeCalls.length === 0) {
      this.feed.innerHTML = `
        <div class="rx-placeholder" style="text-align:center; padding:2rem 1rem; color:var(--text-dim); font-size:0.85rem;">
          Rescue station ready. No active emergency calls in queue.<br>
          <span style="font-size:0.75rem; color:#64748b;">(Click <strong>"⚡ Simulate 3 Incoming Victim Calls"</strong> above or broadcast from Phone A)</span>
        </div>
      `;
      return;
    }

    this.feed.innerHTML = "";

    this.activeCalls.forEach((call, index) => {
      const rankNum = index + 1;
      const rankClass = rankNum === 1 ? "rank-1" : (rankNum === 2 ? "rank-2" : "rank-3");
      const rankLabel = rankNum === 1 ? "#1 HIGHEST PRIORITY" : (rankNum === 2 ? "#2 PRIORITY" : `#3 PRIORITY`);
      const timeStr = new Date(call.timestamp).toLocaleTimeString();

      const card = document.createElement("div");
      card.className = `triage-card ${call.priorityClass} new-arrival`;
      card.setAttribute("data-call-id", call.id);

      let audioPlayerHtml = "";
      if (call.audioUrl) {
        audioPlayerHtml = `
          <div class="victim-audio-bar">
            <button type="button" class="btn-listen-victim" data-audio="${call.audioUrl}">
              <span>▶ 🎙️ Listen to Victim Call</span>
            </button>
            <span class="victim-audio-label">"${call.rawTranscript}"</span>
          </div>
        `;
      }

      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <div style="display:flex; align-items:center; gap:6px;">
            <span class="priority-rank-tag ${rankClass}">${rankLabel}</span>
            <span class="triage-badge ${call.badgeClass}">${call.priorityCode}</span>
          </div>
          <span style="font-size:0.72rem; color:var(--text-dim); font-family:monospace;">${timeStr} • Signal: ${call.signalQuality}%</span>
        </div>

        <div style="font-size:0.92rem; font-weight:700; color:#fff; margin-bottom:2px;">
          📍 ${call.callerName}
        </div>
        <div style="font-size:0.78rem; font-weight:600; color:var(--color-cyan); margin-bottom:6px;">
          Incident: ${call.scenarioTitle}
        </div>

        ${audioPlayerHtml}

        <div class="victim-stats-grid">
          <div class="stat-box">
            <div class="val">${call.peopleCount}</div>
            <div class="lbl">People</div>
          </div>
          <div class="stat-box">
            <div class="val" style="color:#f59e0b;">${call.injuredCount}</div>
            <div class="lbl">Injured</div>
          </div>
          <div class="stat-box">
            <div class="val" style="color:#ef4444;">${call.unconsciousCount}</div>
            <div class="lbl">Unconscious</div>
          </div>
        </div>

        <div style="font-size:0.72rem; color:var(--text-dim); margin-top:6px; font-family:monospace; background:rgba(0,0,0,0.3); padding:4px 8px; border-radius:4px; word-break:break-all;">
          RS1 PACKET: <span style="color:#38bdf8;">${call.compactPacket}</span>
        </div>

        <div class="checklist-group" style="margin-top:8px;">
          <div style="font-size:0.68rem; font-weight:700; color:var(--color-cyan); text-transform:uppercase; margin-bottom:4px;">
            Assigned: ${call.unitsAssigned}
          </div>
          ${call.protocolChecklist.map(item => `
            <label class="check-item"><input type="checkbox" ${call.status === "DISPATCHED" ? "checked" : ""}> ${item}</label>
          `).join("")}
        </div>

        <button type="button" class="btn-dispatch-units ${call.status === "DISPATCHED" ? "dispatched" : ""}" data-dispatch-id="${call.id}" ${call.status === "DISPATCHED" ? "disabled" : ""}>
          ${call.status === "DISPATCHED" ? "🚑 Response Units En Route (ETA: 4 min)" : "🚨 Confirm & Dispatch Emergency Units"}
        </button>
      `;

      // Wire audio button inside card
      const audioBtn = card.querySelector(".btn-listen-victim");
      if (audioBtn) {
        audioBtn.addEventListener("click", () => {
          this.playVictimAudio(call.audioUrl, audioBtn);
        });
      }

      // Wire dispatch button inside card
      const dispatchBtn = card.querySelector(".btn-dispatch-units");
      if (dispatchBtn) {
        dispatchBtn.addEventListener("click", () => {
          this.dispatchCall(call.id, dispatchBtn);
        });
      }

      this.feed.appendChild(card);
    });
  }
}

// Attach to window
window.RescuerReceiver = RescuerReceiver;
