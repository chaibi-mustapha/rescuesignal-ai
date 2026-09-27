# 📌 RescueSignal AI — État du Projet & Kit de Soumission Lablab.ai

> **Dernière mise à jour** : 27 septembre 2026  
> **Concours** : AssemblyAI Voice Agent Hackathon sur [lablab.ai](https://lablab.ai/ai-hackathons/assemblyai-voice-agent-hackathon)  
> **Statut global** : 🟢 **100% TERMINÉ, VALIDÉ, COMMITTÉ & SYNCHRONISÉ SUR GITHUB**  
> **Dépôt GitHub** : [https://github.com/chaibi-mustapha/rescuesignal-ai](https://github.com/chaibi-mustapha/rescuesignal-ai) (Commit `7931c0e`)  
> **Application Live HTTPS** : [https://rescuesignal-ai.onrender.com](https://rescuesignal-ai.onrender.com)  

---

## 🆕 Récapitulatif des Dernières Améliorations Apportées

1. **Arrêt immédiat des signaux optiques et acoustiques** :
   - Les émissions optiques (stroboscope Morse) et acoustiques (modem FSK) s'interrompent instantanément dès qu'on change d'onglet (onglets internes Mode Vocal / Mode Furtif ou changement d'onglet dans le navigateur via `visibilitychange`/`blur`).
   - Clic interactif d'interruption : les boutons affichent `🛑 Stop Optical Strobe` et `🛑 Stop Acoustic Signal (X%)` avec une animation pulsante rouge pour couper le signal immédiatement au clic.
   - Moteur Web Audio mis à niveau avec coupure immédiate des oscillateurs (`stopAll()`) et temporisation annulable par pas de 20ms.

2. **Mise en avant du rôle central d'AssemblyAI** :
   - Titre principal Hero : `<span class="hero-highlight">AssemblyAI-Powered</span> Dual Voice & Stealth Emergency Agent`.
   - Explication explicite du rôle du modèle Universal-1 (`SpeechModel.best`) et de l'agent de triage LeMUR.

3. **Intégration du paradigme Enlèvements, Poursuites & Menaces (Silence = Survie)** :
   - Prise en charge des situations critiques où les victimes ne peuvent pas parler à voix haute et n'ont pas de temps à perdre.
   - **Mode Vocal** : reconnaissance des voix chuchotées de faible amplitude via AssemblyAI et `word_boost` sécuritaire (`"kidnap"`, `"pursuit"`, `"hostage"`, `"stalker"`, etc.).
   - **Mode Furtif 1-Tap** : sélection immédiate de la menace `🚨 Kidnap/Threat` et émission discrète du paquet RS1 (`SEC`) sans faire aucun bruit.
   - **Station Rescuer adaptée** : protocole de réponse automatique avec alerte tactique police/GIGN/SWAT, triangulation P2P discrète et approche sans sirène.

4. **Interface enrichie** :
   - Cartes visuelles de présentation Dual-Mode dans la section Hero.
   - Nouveau scénario prédéfini 1-clic : `🚨 Kidnap / Pursuit`.
   - Bandeaux d'avertissement tactiques et onglets clarifiés `(Disaster)` / `(Kidnap/Pursuit)`.

---

## 📋 Textes de Soumission Mis à Jour pour Lablab.ai

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

## 🔄 Guide Rapide de Reprise

Quand vous souhaiterez reprendre le travail :
1. **Lancer le serveur en local** :
   ```bash
   cd "Projet"
   python run.py
   ```
   Ouvrir [http://localhost:8000/](http://localhost:8000/).
2. **Générer la vidéo V3 avec voix de victime en détresse & triage centrale** :
   ```bash
   cd "Video et Naration Automation pour chaque concours"
   python generate_rescuesignal_video.py
   ```
3. **Soumettre sur Lablab.ai** :
   - Tous les textes de la section 3 sont prêts à être copiés-collés dans le formulaire de soumission.



