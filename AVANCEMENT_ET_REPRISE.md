# 📌 RescueSignal AI — État du Projet & Kit de Soumission Lablab.ai

> **Dernière mise à jour** : 27 septembre 2026  
> **Concours** : AssemblyAI Voice Agent Hackathon sur [lablab.ai](https://lablab.ai/ai-hackathons/assemblyai-voice-agent-hackathon)  
> **Statut global** : 🟢 **100% TERMINÉ, VALIDÉ, COMMITTÉ & SYNCHRONISÉ SUR GITHUB**  
> **Dépôt GitHub** : [https://github.com/chaibi-mustapha/rescuesignal-ai](https://github.com/chaibi-mustapha/rescuesignal-ai) (Commit `8a89359`)  
> **Application Live HTTPS** : [https://rescuesignal-ai.onrender.com](https://rescuesignal-ai.onrender.com)  

---

## 🆕 Récapitulatif des Dernières Améliorations Apportées

1. **Centrale d'Appel de Crise 911 / 112 & Triage Dynamique Multi-Victimes** :
   - Mise en place d'un véritable **AI Crisis Dispatcher** sur le Terminal B (Station Rescuer).
   - Dépassement salutaire de la file d'attente chronologique classique (*First In, First Out*) : réordonnancement instantané et dynamique par criticité vitale absolue.
   - Bannière d'alerte animée `⚡ DYNAMIC TRIAGE OVERRIDE` dès qu'un appel d'urgence vitale critique (P1) est détecté pour le propulser en tête de file (#1 HIGHEST PRIORITY).
   - Bouton de simulation 1-clic `⚡ Simulate 3 Incoming Victim Calls` injectant les 3 appels de manière asynchrone pour prouver le retri automatique.

2. **3 Appels / Cas Victimes Complets avec Audios Réalistes** :
   - **Appel 1 (🔴 P1 - CRITICAL — Décombres & Inconscient)** :
     - *Audio généré* : [`/static/audio/victim_1_rubble.mp3`](file:///d:/0%200%20Concours%20Encours%20et%20List%20des%20Projets/Concours%20En%20Cours/Lablab%20-%20AssemblyAI%20%20Voice%20Agent%20Hackathon/Projet/app/static/audio/victim_1_rubble.mp3) (Voix de femme essoufflée sous les gravats : *"Help! Can anyone hear me?! Trapped under concrete rubble... Sarah is unconscious!"*).
     - *Protocole secours* : SMUR Réanimation ICU #04 + Désincarcération lourde et pinces hydrauliques.
   - **Appel 2 (🚨 P1 - TACTICAL — Prise d'otage & Menace Armée)** :
     - *Audio généré* : [`/static/audio/victim_2_whisper_threat.mp3`](file:///d:/0%200%20Concours%20Encours%20et%20List%20des%20Projets/Concours%20En%20Cours/Lablab%20-%20AssemblyAI%20%20Voice%20Agent%20Hackathon/Projet/app/static/audio/victim_2_whisper_threat.mp3) (Voix chuchotée à bas volume : *"Armed intruder on 3rd floor. Hostage threat, suspect armed. 2 people hiding... Send tactical police, do not make noise."*).
     - *Protocole secours* : Unité tactique SWAT / GIGN + Triangulation silencieuse P2P + Approche zéro sirène.
   - **Appel 3 (🛗 P2 - URGENT — Ascenseur Bloqué)** :
     - *Audio généré* : [`/static/audio/victim_3_elevator.mp3`](file:///d:/0%200%20Concours%20Encours%20et%20List%20des%20Projets/Concours%20En%20Cours/Lablab%20-%20AssemblyAI%20%20Voice%20Agent%20Hackathon/Projet/app/static/audio/victim_3_elevator.mp3) (Voix calme mais préoccupée : *"Elevator stalled between floor 4 and 5 after tremors. 4 people trapped, conscious and stable."*).
     - *Protocole secours* : Équipe treuil et sauvetage en puits + Bilan asthme / panique.

3. **Lecteur Audio Intégré & Dispatch Interactif 1-Clic** :
   - Chaque carte d'intervention dispose d'un lecteur interactif `▶ 🎙️ Listen to Victim Call` permettant à l'opérateur 911 d'écouter la voix réelle de la victime.
   - Bouton de déploiement `🚨 Confirm & Dispatch Emergency Units` qui bascule en `🚑 Response Units En Route (ETA: 4 min)` et valide automatiquement la checklist d'intervention.

4. **Arrêt immédiat des signaux optiques et acoustiques** :
   - Les émissions optiques (stroboscope Morse) et acoustiques (modem FSK) s'interrompent instantanément dès qu'on change d'onglet ou qu'on clique sur `🛑 Stop`.


### A. Titre du Projet
```text
RescueSignal AI — AssemblyAI Dual Voice & Stealth Emergency Agent
```

### B. Tagline (Pitch en 1 phrase)
```text
When communication fails, your voice becomes a signal — and when silence is survival, your touch saves lives: an offline-first emergency agent powered by AssemblyAI, RS1 semantic compression, and resilient multi-channel transmission.
```

### C. Description du Projet (Problem & Solution)
```text
Whether buried under earthquake rubble or facing a kidnapping, stalker pursuit, or hostage situation where speaking aloud would be fatal, victims often have their smartphones but zero cellular connectivity or Internet access. 

RescueSignal AI bridges this life-critical gap with a Dual-Mode Emergency Architecture:
1. Voice Distress Mode (Disasters): The victim speaks naturally or whispers into their device. Powered by AssemblyAI Universal-1 (SpeechModel.best), multi-language auto-detection, and specialized medical/tactical word_boost, speech is transcribed in milliseconds.
2. Silent Stealth Mode (Kidnappings & Pursuits): For high-threat scenarios where making noise means detection, a single silent tap captures the threat (Kidnap, Pursuit, Intruder) and triggers a covert SOS beacon in 1 second.
3. Autonomous Semantic Triage: Extracts critical entities: disaster/threat classification, victim count, injuries, unconscious individuals, and immediate hazards.
4. RS1 Semantic Compression: Generates an ultracompact 44-byte Emergency Data Packet protected by a CRC16 integrity checksum (e.g., RS1|SEC|P1|I0|U0|M1|HNIL|LOC#E4A7), reducing payload size by over 70%.
5. Resilient Multi-Modal Offline Transmission: Broadcasts data across physical offline channels: acoustic Frequency-Shift Keying (FSK 1200/2200 Hz) through the speaker to penetrate rubble, high-intensity optical Morse strobes, and covert local P2P mesh relays.
6. Rescue Station Triage & Decoder: Instant reception, FFT frequency spectrum monitoring, CRC16 verification, P1/P2/P3 medical prioritization, and adaptive response protocols (tactical police dispatch for kidnappings, heavy extrication for collapses).
```

### D. How We Built It With AssemblyAI
```text
Without AssemblyAI, RescueSignal AI literally cannot function. In disaster collapses, a victim's voice is their sole remaining survival tool. In kidnappings or pursuits, whispered distress cries are the only lifeline without alerting captors.

We deeply integrated AssemblyAI into our core architecture:
- Universal-1 Engine (SpeechModel.best): High-fidelity phonetic recognition capable of cutting through rubble reverberations, choking dust, and low-decibel whispered distress cries.
- Medical & Tactical word_boost: Customized vocabulary boosting for critical disaster and security terminology ("rubble", "collapse", "unconscious", "kidnap", "pursuit", "hostage", "stalker", "hemorrhage", "asphyxia", "gas leak").
- Zero-Configuration Multi-Language Auto-Detection: Automatically detects the victim's language on the fly (English, French, Spanish, Japanese, etc.), essential for international disasters and tourists.
- 3-Tier Graceful Degradation: Full cloud intelligence when disaster micro-gateways (satellite/drone relays) are reachable, coupled with an instant on-device local NLP fallback engine if network connectivity drops to 0%.
```

---

## 🎬 Fichiers Médias Disponibles

| Élément | Emplacement Local |
| :--- | :--- |
| **Vidéo Master Live (Recommandée)** | [`video/rescuesignal_ai_live_demo_hd.mp4`](../video/rescuesignal_ai_live_demo_hd.mp4) (1080p 60 FPS, 2m 46s) |
| **Vidéo Master Cinématique** | [`video/rescuesignal_ai_demo_hd.mp4`](../video/rescuesignal_ai_demo_hd.mp4) (1080p 60 FPS, 2m 49s) |
| **Galerie Captures HD** | [`video/ScreenShots/`](../video/ScreenShots/) (7 captures Full HD prêtes) |

---

## 🎬 Prochaine Étape : Vidéo V3 & Centrale de Secours Triage Multi-Victimes (911/112 Crisis Dispatcher)

### 💡 Objectifs et Spécifications Validés

#### 1. Rôle de Centrale d'Appel de Crise & Triage Dynamique Multi-Victimes
- **Le constat** : En catastrophe majeure, les secours reçoivent des dizaines d'appels simultanés. Le modèle chronologique (*First In, First Out*) est mortel.
- **La solution démontrée dans RescueSignal AI** : Notre console **Rescuer Station** agit comme une **centrale de régulation d'urgence intelligente (AI Crisis Dispatcher)** :
  - Même si 10 victimes émettent en même temps (sous les décombres ou en détresse urbaine), le décodeur et l'agent sémantique AssemblyAI analysent l'urgence et **réorganisent la liste en temps réel par gravité vitale absolue** :
    - `🔴 P1 - CRITICAL` (Priorité absolue : Inconscient, asphyxie, hémorragie, enlèvement/menace immédiate).
    - `🟠 P2 - URGENT` (Priorité secondaire : Fractures, personnes bloquées stables).
    - `🟡 P3 - MODERATE` (Dégâts matériels, indemnes).
  - Le régulateur voit immédiatement **qui secourir en premier** avec la checklist d'intervention pré-remplie (SMUR réanimation, désincarcération lourde, unité tactique police).

#### 2. Voix Réelle de Victime en Détresse (Cris, Halètements & Panique)
- **Extrait vocal dramatique** : Une personne piégée sous les décombres appelant à l'aide d'une voix brisée et essoufflée :
  > *"Help! Can anyone hear me?! We're trapped under concrete rubble... one person's leg is broken, and Sarah is unconscious! Please send medical help, we can barely breathe!"*
- **Action en Direct dans l'App (Scène 2)** :
  - Clic sur le microphone, retentissement du cri de détresse de la victime.
  - AssemblyAI Universal-1 transcrit en temps réel malgré les sanglots, les bruits de gravats et la distorsion.
  - Apparition immédiate de l'alerte en tête de file dans la console de secours (`P1 - CRITICAL`).
- **Synchronisation avec la Narration** :
  - Le narrateur met en valeur la prouesse d'AssemblyAI : reconnaissance phonétique robuste et `word_boost` d'urgence.

#### 3. Spécifications Techniques Vidéo
- Format Full HD 1080p, 60 FPS constants accélérés GPU, widescreen plein écran.
- Durée totale calibrée entre 2m 40s et 2m 45s (strictement inférieure à 3 minutes).

---

## 🎬 État des Vidéos HD & Synchronisation du Clignateur Stroboscopique

### 1. Améliorations Récentes Validées
- **Suppression intégrale des secondes blanches au début** : Rognage frame-accurate au pixel et millième de seconde via filtre FFmpeg (`trim=start=...[vtrim]; [vtrim]setpts=PTS-STARTPTS`). Les vidéos démarrent instantanément sur le thème sombre de RescueSignal AI à $0.0\,\text{s}$.
- **Défilement caméra automatique (Scène 4)** : La caméra effectue un scroll fluide vers le bas (`window.__smoothScrollWindow(440, 700)`) pour révéler au premier plan les canaux d'émission : bouton acoustique FSK et clignateur optique Morse.
- **Remontée fluide (Scène 5)** : L'affichage remonte (`window.__smoothScrollWindow(0, 600)`) pour accéder sans encombre aux commandes tactiles du Mode Furtif.

### 2. 📝 Remarque Utilisateur Enregistrée pour la Reprise : Flashs Stroboscopiques Multiples (3 à 4 Flashs)
- **Constat & Demande** : Dans la version précédente de la vidéo anglaise, un seul flash était visible. Lors du clic sur le clignateur (Stroboscope optique Morse), il doit y avoir **3 à 4 flashs stroboscopiques successifs, puissants et bien distincts** sur l'écran.
- **Modifications appliquées et validées dans le code** :
  1. [`app/static/js/transmitter.js`](file:///d:/0%200%20Concours%20Encours%20et%20List%20des%20Projets/Concours%20En%20Cours/Lablab%20-%20AssemblyAI%20%20Voice%20Agent%20Hackathon/Projet/app/static/js/transmitter.js) :
     - Éclat overlay augmenté à `rgba(255, 255, 255, 0.90)` plein écran (`z-index: 999999`).
     - Cadence des flashs calibrée à 170ms ON / 140ms OFF par salve de **4 flashs nets et distincts** (durée ~1.24s).
     - Luminosité du bouton rehaussée (`brightness(2.4)`) et badge enrichi `... --- ... [4× STROBE]`.
  2. Scripts d'automatisation vidéo ([`generate_rescuesignal_video.py`](file:///d:/0%200%20Concours%20Encours%20et%20List%20des%20Projets/Concours%20En%20Cours/Lablab%20-%20AssemblyAI%20%20Voice%20Agent%20Hackathon/Video%20et%20Naration%20Automation%20pour%20chaque%20concours/generate_rescuesignal_video.py) et [`generate_rescuesignal_video_fr.py`](file:///d:/0%200%20Concours%20Encours%20et%20List%20des%20Projets/Concours%20En%20Cours/Lablab%20-%20AssemblyAI%20%20Voice%20Agent%20Hackathon/Video%20et%20Naration%20Automation%20pour%20chaque%20concours/generate_rescuesignal_video_fr.py)) :
     - Fenêtre d'activation étendue (1.84s en anglais, 2.2s en français) pour laisser la salve de 3 à 4 flashs complets s'afficher sans coupure prématurée.
     - Scroll automatique vers le bas (`window.__smoothScrollWindow(440, 700)`) pour avoir le bouton et l'overlay en plein champ.

---

## 🎬 État des Vidéos Master HD (Validées & Finalisées le 29 septembre 2026)

| Vidéo | Fichier | Résolution / FPS | Durée | Poids | Statut |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **English Master HD** | [`video/rescuesignal_ai_live_demo_hd.mp4`](../video/rescuesignal_ai_live_demo_hd.mp4) | 1920×1080 (60 FPS) | **2m 56s** (176.37s) | 29.48 MB | 🟢 Prêt pour soumission |
| **French Master HD** | [`video/rescuesignal_ai_live_demo_hd_fr.mp4`](../video/rescuesignal_ai_live_demo_hd_fr.mp4) | 1920×1080 (60 FPS) | **2m 50s** (169.87s) | 25.25 MB | 🟢 Prêt pour soumission |

### Points Validés dans les Nouvelles Versions :
1. **4 flashs stroboscopiques optiques nets et distincts** lors du déclenchement du clignateur Morse (170ms ON / 140ms OFF, overlay à 90%, badge amber vif).
2. **Défilement automatique caméra** vers les canaux physiques (acoustique & optique) puis remontée fluide vers les boutons du Mode Furtif.
3. **Zéro seconde blanche au début** (démarrage direct à $0.0\,\text{s}$ sur l'interface sombre).
4. **Durée totale strictement calibrée < 3 minutes**.





