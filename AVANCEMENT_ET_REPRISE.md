# 📌 RescueSignal AI — État Final & Kit de Soumission Lablab.ai

> **Date de finalisation** : 26 septembre 2026 (23:00)  
> **Concours** : AssemblyAI Voice Agent Hackathon sur [lablab.ai](https://lablab.ai/ai-hackathons/assemblyai-voice-agent-hackathon)  
> **Statut global** : 🟢 **100% TERMINÉ, VALIDÉ, DÉPLOYÉ & PRÊT À SOUMETTRE**  
> **Dépôt GitHub Public** : [https://github.com/chaibi-mustapha/rescuesignal-ai](https://github.com/chaibi-mustapha/rescuesignal-ai)  
> **Application Live HTTPS** : [https://rescuesignal-ai.onrender.com](https://rescuesignal-ai.onrender.com)  

---

## 🎬 1. Fichiers Multimédia Prêts pour la Soumission

| Élément | Emplacement Local | Détails & Caractéristiques |
| :--- | :--- | :--- |
| **Vidéo Master Live (Recommandée)** | [`video/rescuesignal_ai_live_demo_hd.mp4`](../video/rescuesignal_ai_live_demo_hd.mp4) | **1080p 60 FPS**, 2m 46s, curseur OS naturel animé, démonstration en direct, son studio |
| **Vidéo Master Cinématique** | [`video/rescuesignal_ai_demo_hd.mp4`](../video/rescuesignal_ai_demo_hd.mp4) | **1080p 60 FPS**, 2m 49s, pan & zoom cinématiques sur captures haute définition |
| **Galerie Captures HD (1080p)** | [`video/ScreenShots/`](../video/ScreenShots/) | 7 captures Full HD prêtes pour le téléversement (sans `_` dans les noms) |
| **Pistes Vocales Narrateur** | [`video/Vocal/`](../video/Vocal/) | 8 fichiers vocaux synchronisés scène par scène |

---

## 📋 2. Textes Prêts à Copier-Coller pour le Formulaire Lablab.ai

### A. Titre du Projet
```text
RescueSignal AI — Offline Voice Agent for Disaster Response
```

### B. Tagline (Pitch en 1 phrase)
```text
When communication fails, your voice becomes a signal: an offline-first emergency voice agent powered by AssemblyAI, RS1 semantic compression, and acoustic FSK transmission for disaster blackouts.
```

### C. Description du Projet (Problem & Solution)
```text
During catastrophic natural and industrial disasters (earthquakes, building collapses, floods, and total telecom infrastructure blackouts), trapped victims often have their smartphones but zero cellular connectivity or Internet access. In high-stress situations, victims buried under debris or inhaling toxic smoke cannot physically type on shattered touchscreens.

RescueSignal AI bridges this life-critical gap using an intelligent voice agent pipeline:
1. Speech-to-Text & Emergency Understanding: The victim speaks out loud in natural language. Powered by AssemblyAI's state-of-the-art Speech-to-Text (Universal-1 / SpeechModel.best), multi-language auto-detection, and specialized medical word_boost, speech is transcribed in milliseconds.
2. Semantic Entity Extraction: The autonomous agent extracts critical entities: victim count, fractures, unconscious individuals, and immediate environmental hazards (gas leaks, fire, rising water).
3. RS1 Semantic Compression: Generates an ultracompact 44-byte Emergency Data Packet protected by a 4-character hexadecimal CRC16 integrity checksum (e.g., RS1|BLD|P3|I1|U1|M1|HNIL|LOC#E4A7), reducing payload size by over 70%.
4. Resilient Multi-Modal Transmission: Broadcasts data across physical offline channels using acoustic Frequency-Shift Keying (FSK 1200/2200 Hz) via pure Web Audio API through the phone's speaker to penetrate rubble, accompanied by high-intensity optical Morse strobes and local P2P mesh relays.
5. Stealth Silent Mode: 1-click tactile emergency grid for victims who cannot speak or need to remain completely silent.
6. Rescue Station Triage: Instant reception, FFT frequency spectrum monitoring, CRC16 verification, P1/P2/P3 medical prioritization, and customized emergency response protocols.
```

### D. How We Built It With AssemblyAI (Focalisation AssemblyAI)
```text
Without AssemblyAI, RescueSignal AI literally cannot function. When a victim is trapped under concrete slabs, their voice is their sole remaining survival tool.

We deeply integrated AssemblyAI into our core architecture:
- Universal-1 Engine (SpeechModel.best): High-fidelity phonetic recognition capable of cutting through background rumblings, acoustic reverberations, and trembling breaths.
- Emergency Medical word_boost: Customized vocabulary boosting for critical trauma terminology ("rubble", "collapse", "unconscious", "hemorrhage", "fracture", "asphyxia", "gas leak").
- Zero-Configuration Multi-Language Auto-Detection: Automatically detects the victim's language on the fly (English, French, Spanish, Japanese, etc.), essential for international disaster zones.
- 3-Tier Graceful Degradation: Full cloud intelligence when disaster micro-gateways (satellite/drone relays) are reachable, coupled with an instant on-device local NLP fallback engine if network connectivity drops to 0%.
```

### E. What's Next for RescueSignal AI
```text
- Native hardware DSP integration for direct SDR (Software Defined Radio) and LoRa packet modulation.
- Integration of AssemblyAI's upcoming on-device NPU models for zero-cloud local execution.
- Integration with emergency first responder CAD (Computer-Aided Dispatch) systems and international SAR satellite constellations.
```

---

## 🚀 3. Procédure Pas-à-Pas pour Demain Matin (En 5 Minutes)

1. **Uploader la vidéo sur YouTube** :
   - Fichier : [`video/rescuesignal_ai_live_demo_hd.mp4`](../video/rescuesignal_ai_live_demo_hd.mp4)
   - Titre : `RescueSignal AI — AssemblyAI Voice Agent Hackathon Demo`
   - Visibilité : `Public` ou `Non répertorié (Unlisted)`.
   - Copier le lien YouTube généré.

2. **Se connecter sur Lablab.ai** :
   - Aller sur la page du hackathon : [lablab.ai/ai-hackathons/assemblyai-voice-agent-hackathon](https://lablab.ai/ai-hackathons/assemblyai-voice-agent-hackathon).
   - Cliquer sur votre projet / **Submit Project**.

3. **Remplir les champs du formulaire** :
   - **Project Name** : `RescueSignal AI`
   - **Tagline** : Coller le texte de la section *2.B* ci-dessus.
   - **Description / Story** : Coller le texte de la section *2.C*.
   - **How it's built / AssemblyAI** : Coller le texte de la section *2.D*.
   - **GitHub Repository** : `https://github.com/chaibi-mustapha/rescuesignal-ai`
   - **Live Demo URL** : `https://rescuesignal-ai.onrender.com`
   - **Video URL** : Coller votre lien YouTube.
   - **Screenshots** : Glisser-déposer les 7 images depuis le dossier [`video/ScreenShots/`](../video/ScreenShots/).

4. **Cliquer sur "Submit"** : Votre projet est officiellement soumis pour les prix du jury ! 🏆
