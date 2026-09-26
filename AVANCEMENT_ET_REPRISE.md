# 📌 RescueSignal AI — État d'Avancement & Guide de Reprise

> **Dernière mise à jour** : 26 septembre 2026 (18:20)  
> **Concours** : AssemblyAI Voice Agent Hackathon sur [lablab.ai](https://lablab.ai/ai-hackathons/assemblyai-voice-agent-hackathon)  
> **Statut global** : Prototype complet, 100% testé et connecté en direct au Cloud AssemblyAI. Prêt pour publication en ligne et démo.

---

## 1. 🎯 Rappel du Concept & Valeur Ajoutée

**RescueSignal AI** résout le problème critique de la communication d'urgence en zone de catastrophe (séisme, décombres, inondation, coupure totale des télécommunications) :
1. **Écoute & Transcription Vocale** avec **AssemblyAI Speech-to-Text** (`SpeechModel.best`, détection auto de langue + `word_boost` d'urgence).
2. **Extraction Sémantique & Triage** : identification instantanée du type de sinistre, nombre de victimes, blessés, urgence vitale, menaces immédiates (fuite de gaz, incendie, montée des eaux).
3. **Compression Sémantique RS1** : création d'un paquet ultra-compact de 35 à 42 octets infalsifiable avec contrôle d'intégrité **CRC16** (ex: `RS1|BLD|P3|I1|U1|M1|#E4A7`).
4. **Diffusion Multi-Modale Hors-Réseau** :
   - 🔊 Modulation acoustique FSK (1200/2200 Hz) et Morse via Web Audio API pur.
   - 🎙️ Écoute spectrale FFT par le micro du récepteur.
   - 💡 Signalisation optique (flash stroboscopique d'écran).
   - 📶 Maillage local simulé (P2P / BLE / Wi-Fi Direct via WebSockets).
5. **Mode Tactile Silencieux & Non-Verbal** : balisage en 1 clic pour les victimes incapables de parler ou devant rester silencieuses.
6. **Poste de Triage Secours** : réception, décodage, validation checksum CRC16, classification P1/P2/P3 et protocole d'intervention.

---

## 2. 📂 Composants Validés & État Technique

| Composant | Fichier source | État |
| :--- | :--- | :--- |
| **Clé API AssemblyAI** | [`.env`](.env) | ✅ Active, vérifiée sur AssemblyAI Cloud (50$ crédits) |
| **Sécurité des Clés & Git** | [`.gitignore`](.gitignore) | ✅ Actif (empêche toute fuite de `.env` sur GitHub) |
| **Transcription Cloud AssemblyAI** | [`app/services/assemblyai_service.py`](app/services/assemblyai_service.py) | ✅ Validé (`TranscriptStatus.completed` + `word_boost`) |
| **Filet de Sécurité Hors-Ligne** | [`app/services/assemblyai_service.py`](app/services/assemblyai_service.py) | ✅ Opérationnel (relais instantané si panne internet) |
| **Moteur Paquets, CRC16 & Encodages** | [`app/services/packet_engine.py`](app/services/packet_engine.py) | ✅ Validé (compression `RS1` ~39 octets) |
| **Serveur & API FastAPI + WebSockets** | [`app/main.py`](app/main.py) | ✅ Opérationnel (REST + WebSockets maillage) |
| **Synthétiseur Web Audio Pur (FSK/Morse)**| [`app/static/js/sound_engine.js`](app/static/js/sound_engine.js) | ✅ Validé (zéro dépendance externe) |
| **Détecteur FFT Microphone Secours** | [`app/static/js/sound_engine.js`](app/static/js/sound_engine.js) | ✅ Validé |
| **Démonstrateur 2 Écrans Côte-à-Côte** | [`app/static/index.html`](app/static/index.html) | ✅ Validé en direct |
| **Vues Mobiles Indépendantes** | [`victim.html`](app/static/victim.html) / [`rescuer.html`](app/static/rescuer.html) | ✅ Prêtes pour test multi-appareils |
| **Configuration Déploiement Cloud** | [`Procfile`](Procfile) / [`requirements.txt`](requirements.txt) | ✅ Prêt pour Render / Railway / Hugging Face |

---

## 3. 🌐 Déploiement en Ligne (Pour Tester en Réel)

Le projet est configuré pour être mis en ligne gratuitement en quelques clics :

### Option A : Déploiement sur Render (Recommandé - Gratuit)
1. Créer un compte sur [render.com](https://render.com/).
2. Créer un **New Web Service** connecté à votre dépôt GitHub.
3. Paramètres :
   - **Environment** : `Python`
   - **Build Command** : `pip install -r requirements.txt`
   - **Start Command** : `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Dans **Environment Variables**, ajouter :
   - `ASSEMBLYAI_API_KEY` = *votre clé API*
5. Cliquez sur **Deploy** : vous obtenez une URL publique en HTTPS (nécessaire pour autoriser le micro sur smartphones !).

### Option B : Déploiement sur Railway ou Hugging Face Spaces
- Les fichiers [`Procfile`](Procfile) et [`requirements.txt`](requirements.txt) sont déjà prêts.
- Même procédure : connectez le dépôt et ajoutez la variable `ASSEMBLYAI_API_KEY`.

---

## 4. 🚀 Procédure de Reprise Rapide (Local)

1. Ouvrir le terminal dans le dossier `Projet` :
   ```bash
   cd "d:\0 0 Concours Encours et List des Projets\Concours En Cours\Lablab - AssemblyAI  Voice Agent Hackathon\Projet"
   ```

2. Lancer le serveur :
   ```bash
   python run.py
   ```

3. Ouvrir dans le navigateur :
   - Démonstrateur interactif : **[http://localhost:8000/](http://localhost:8000/)**
   - Terminal Victime : **[http://localhost:8000/victim](http://localhost:8000/victim)**
   - Terminal Secours : **[http://localhost:8000/rescuer](http://localhost:8000/rescuer)**

---

## 5. 📋 Prochaines Étapes pour la Soumission Lablab.ai

1. **Publier en ligne (Render/Railway)** pour tester avec 2 vrais smartphones distants (un émetteur, un récepteur).
2. **Enregistrer la vidéo de 2 minutes** (pitch du problème + démo live).
3. **Soumettre le projet** sur [lablab.ai](https://lablab.ai/ai-hackathons/assemblyai-voice-agent-hackathon).
