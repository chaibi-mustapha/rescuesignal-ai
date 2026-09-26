# 🚨 RescueSignal AI

> **"When communication fails, your voice becomes a signal."**
> Projet développé pour le **AssemblyAI - Voice Agent Hackathon** sur [lablab.ai](https://lablab.ai/ai-hackathons/assemblyai-voice-agent-hackathon).

---

## 📌 Présentation du Projet

Lors d'une catastrophe naturelle ou industrielle (séisme, effondrement d'immeuble, inondation, incendie, avalanche, panne généralisée des télécommunications), les victimes disposent souvent d'un smartphone mais se retrouvent sans réseau mobile et sans connexion Internet.

**RescueSignal AI** résout ce défi vital grâce à un agent vocal intelligent :
1. **Écoute & Transcription Vocale** : La victime parle simplement dans son téléphone pour décrire la situation (« *Nous sommes 3 personnes sous les décombres, une personne inconsciente, besoin d'aide médicale urgente* »).
2. **Agent d'Urgence IA (AssemblyAI Universal-1 & LeMUR)** : Analyse sémantique en temps réel, extraction des entités critiques (nombre de victimes, blessés, urgence médicale, dangers immédiats).
3. **Compression Sémantique & Paquet d'Urgence** : Génération d'un *Emergency Data Packet* ultracompact de 35 à 60 octets avec contrôle d'intégrité CRC16 (ex. `RS1|BLD|P3|I1|U1|M1|HNIL|LOC#E4A7`).
4. **Transmission Multi-Modale Hors-Réseau** :
   - 🔊 **Signal Acoustique FSK & Morse** : Modulation par déplacement de fréquence sonore (1200 Hz / 2200 Hz) traversant les débris ou l'air audible par un autre smartphone ou microphone de secours.
   - 💡 **Signal Optique (Flash / Stroboscope)** : Clignotement de l'écran ou de la LED selon la séquence encodée (détectable par drones ou équipes visuelles).
   - 📳 **Impulsions Haptiques** : Vibrations du terminal.
   - 📶 **Maillage Local P2P** : Diffusion par balise Bluetooth Low Energy (BLE) et Wi-Fi Direct simulés.
5. **Poste de Triage Secours & Décodeur** : Réception instantanée, décodage automatique, classification de priorité médicale (P1 Rouge Critique, P2 Orange Urgent, P3 Jaune Modéré) et checklist d'intervention des secours.

---

## 🏆 Alignement avec le Hackathon AssemblyAI

- **Infrastructure Voice AI** : Exploitation de l'API de pointe AssemblyAI pour la reconnaissance vocale et le traitement d'agent vocal d'urgence (LeMUR).
- **Agentic Workflow** : Pipeline complet allant de la captation vocale à la prise de décision autonome sur le choix des canaux de diffusion et le calcul de priorité.
- **Résilience Extrême** : Fonctionne avec le Cloud AssemblyAI en conditions nominales, et intègre un moteur d'extraction local de secours en cas d'isolement total hors-réseau.

---

## 📂 Architecture du Code

```text
Projet/
├── .env                  # Configuration & Clé API AssemblyAI
├── .env.example          # Exemple de configuration
├── requirements.txt      # Dépendances Python
├── run.py                # Lanceur du serveur avec bannière et liens
├── app/
│   ├── config.py         # Chargement des variables d'environnement
│   ├── main.py           # Application FastAPI (REST & WebSockets)
│   ├── models/
│   │   └── emergency.py  # Modèles de données Pydantic (Extraction, Paquet, Traces)
│   ├── services/
│   │   ├── assemblyai_service.py # Intégration AssemblyAI & Agent d'analyse
│   │   ├── packet_engine.py      # Compression sémantique, CRC16, Morse & FSK
│   │   └── mesh_simulator.py     # Gestionnaire WebSocket du réseau local
│   └── static/
│       ├── css/style.css         # Design tactique sombre, verre & néon d'urgence
│       ├── js/sound_engine.js    # Synthétiseur Web Audio API pur (zéro fichier externe)
│       ├── js/transmitter.js     # Contrôleur émetteur victime (micro, scénarios, émissions)
│       ├── js/receiver.js        # Contrôleur récepteur secours (oscilloscope, décodage, triage)
│       ├── index.html            # Démonstrateur interactif deux téléphones côte-à-côte
│       ├── victim.html           # Vue mobile dédiée pour la victime
│       └── rescuer.html          # Vue station de secours et triage
```

---

## 🚀 Installation & Démarrage Rapide

### 1. Prérequis
- Python 3.10+ (Python 3.13 supporté)

### 2. Clé API AssemblyAI (Optionnel mais recommandé)
Ouvrez le fichier `Projet/.env` et collez votre clé AssemblyAI :
```env
ASSEMBLYAI_API_KEY=votre_cle_api_assemblyai_ici
```
*(Si aucune clé n'est renseignée, le moteur local de repli résilient prend le relais automatiquement)*.

### 3. Lancer l'Application
Dans le dossier `Projet` :
```bash
python run.py
```

### 4. Accès aux Interfaces
- **Démonstrateur Double Écran (Idéal Hackathon / Vidéo Démo)** :
  👉 [http://localhost:8000/](http://localhost:8000/)
- **Interface Mobile Victime (Terminal A)** :
  👉 [http://localhost:8000/victim](http://localhost:8000/victim)
- **Poste de Triage Secours (Terminal B)** :
  👉 [http://localhost:8000/rescuer](http://localhost:8000/rescuer)

---

## 🧪 Scénario de Démonstration Typique

1. Rendez-vous sur `http://localhost:8000/`.
2. Sur le téléphone de gauche (**Émetteur Victime**) :
   - Cliquez sur **Appuyez pour Parler** et parlez dans votre micro, OU cliquez sur l'un des boutons scénarios (ex : *« 🏢 Effondrement Immeuble »*).
   - Observez l'analyse instantanée de l'Agent Vocal (3 personnes, 1 inconscient, urgence critique) et le paquet compressé généré (ex. `RS1|BLD|P3|I1|U1|M1|HNIL|LOC#E4A7`).
   - Cliquez sur **🔊 Émettre Signal Acoustique** pour entendre la modulation sonore FSK générée par le Web Audio API.
   - Cliquez sur **📶 Diffuser sur Réseau P2P Local**.
3. Observez instantanément sur le téléphone de droite (**Poste Secours**) :
   - Le carillon d'urgence retentit.
   - Le paquet est décodé et validé par son checksum CRC16.
   - La fiche de triage **P1 - CRITIQUE** s'affiche avec le protocole d'intervention médicale adapté.

---

## 🛡️ Spécification du Paquet d'Urgence (RS1)

```text
Format : RS1|<SITUATION>|P<PERSONNES>|I<BLESSES>|U<INCONSCIENTS>|M<URGENCE>|H<DANGER>|<LIEU>|#<CRC16>
Exemple: RS1|BLD|P3|I1|U1|M1|HGAS|LOC_B2|#A4F1
```
- **Taille moyenne** : 42 octets (contre ~120 octets de texte brut).
- **Contrôle d'intégrité** : CRC16 à 4 caractères hexadécimaux évitant toute corruption de transmission dans un environnement bruité.
