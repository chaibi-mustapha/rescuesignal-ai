import os
import shutil
import tempfile
import logging
from pathlib import Path
from fastapi import FastAPI, UploadFile, File, Form, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.responses import HTMLResponse, FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

from .config import PROJECT_NAME, PROJECT_TAGLINE, VERSION, DEBUG, BASE_DIR
from .models.emergency import (
    EmergencyExtraction,
    EmergencyPacket,
    TranscribeRequest,
    ManualEmergencyRequest,
    MeshBroadcastMessage
)
from .services.assemblyai_service import AssemblyAIVoiceAgent
from .services.packet_engine import (
    compress_emergency,
    decompress_emergency,
    text_to_morse
)
from .services.mesh_simulator import mesh_broker

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("RescueSignalAI")

app = FastAPI(
    title=PROJECT_NAME,
    description="Emergency voice-to-signal resilient communication platform built with AssemblyAI.",
    version=VERSION
)

# Static files mount
static_dir = BASE_DIR / "app" / "static"
app.mount("/static", StaticFiles(directory=str(static_dir)), name="static")

@app.get("/", response_class=HTMLResponse)
async def serve_index():
    index_path = static_dir / "index.html"
    return FileResponse(index_path)

@app.get("/victim", response_class=HTMLResponse)
async def serve_victim_view():
    victim_path = static_dir / "victim.html"
    return FileResponse(victim_path)

@app.get("/rescuer", response_class=HTMLResponse)
async def serve_rescuer_view():
    rescuer_path = static_dir / "rescuer.html"
    return FileResponse(rescuer_path)

@app.get("/api/status")
async def get_system_status():
    """Returns connectivity and cloud status"""
    return {
        "project": PROJECT_NAME,
        "tagline": PROJECT_TAGLINE,
        "version": VERSION,
        "assemblyai_connected": AssemblyAIVoiceAgent.is_cloud_ready(),
        "mesh_nodes_online": len(mesh_broker.active_connections),
        "offline_resilience_mode": "ACTIVE (Heuristic Fail-safe Engine Ready)"
    }

@app.post("/api/voice/process-audio")
async def process_voice_audio(file: UploadFile = File(...)):
    """
    Receives voice audio from device microphone, transcribes via AssemblyAI,
    extracts emergency parameters, and generates the compact Emergency Data Packet.
    """
    try:
        suffix = Path(file.filename or "audio.webm").suffix or ".webm"
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            shutil.copyfileobj(file.file, tmp)
            tmp_path = tmp.name

        try:
            packet = AssemblyAIVoiceAgent.process_voice_call(audio_file_path=tmp_path)
            morse = text_to_morse(packet.compact_string)
            
            # Auto broadcast to mesh
            await mesh_broker.broadcast_packet(packet, channel="acoustic", sender_id="Victim-Mic")
            
            return {
                "success": True,
                "packet": packet.model_dump(),
                "morse_sequence": morse
            }
        finally:
            if os.path.exists(tmp_path):
                os.remove(tmp_path)
    except Exception as e:
        logger.exception("Error processing voice audio")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/voice/process-text")
async def process_voice_text(request: TranscribeRequest):
    """
    Processes transcribed speech or manual prompt through the Voice Agent pipeline.
    """
    try:
        text = request.text or "SOS trois personnes sous les décombres une blessée aide médicale requise"
        packet = AssemblyAIVoiceAgent.process_voice_call(manual_text=text)
        morse = text_to_morse(packet.compact_string)
        
        # Broadcast to mesh
        await mesh_broker.broadcast_packet(packet, channel="acoustic", sender_id="Victim-Text")

        return {
            "success": True,
            "packet": packet.model_dump(),
            "morse_sequence": morse
        }
    except Exception as e:
        logger.exception("Error processing voice text")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/packet/manual")
async def create_manual_packet(request: ManualEmergencyRequest):
    """
    Creates an emergency packet without speech (Silent Non-Verbal Mode).
    """
    try:
        extraction = EmergencyExtraction(
            situation_type=request.situation_type,
            people_count=request.people_count,
            injured_count=request.injured_count,
            unconscious_count=request.unconscious_count,
            medical_urgency=request.medical_urgency,
            hazards=request.hazards,
            location_details=request.location_details or "Silent Alert",
            summary=f"Silent SOS: {request.situation_type}, {request.people_count} pers, {request.medical_urgency}",
            confidence=1.0,
            raw_transcript="[SILENT EMERGENCY MODE ACTIVATED]"
        )
        packet = compress_emergency(extraction)
        morse = text_to_morse(packet.compact_string)
        
        await mesh_broker.broadcast_packet(packet, channel="silent_visual", sender_id="Victim-Silent")
        
        return {
            "success": True,
            "packet": packet.model_dump(),
            "morse_sequence": morse
        }
    except Exception as e:
        logger.exception("Error creating manual packet")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/packet/decode")
async def decode_packet(raw_string: str = Form(...)):
    """
    Decodes an incoming raw compact string and verifies CRC16 checksum.
    """
    is_valid, extraction, message = decompress_emergency(raw_string)
    if not is_valid:
        return {
            "valid": False,
            "message": message,
            "extraction": None
        }
    
    return {
        "valid": True,
        "message": message,
        "extraction": extraction.model_dump()
    }

@app.post("/api/packet/broadcast")
async def broadcast_mesh(payload: MeshBroadcastMessage):
    """
    Manually triggers packet broadcast to all connected rescuer terminals.
    """
    await mesh_broker.broadcast_packet(payload.packet, channel=payload.channel, sender_id=payload.sender_id)
    return {"success": True, "message": "Broadcast sent to local mesh"}

@app.websocket("/ws/mesh")
async def mesh_websocket_endpoint(websocket: WebSocket):
    """
    Real-time local mesh WebSocket connection for Victims and Rescuers.
    """
    await mesh_broker.connect(websocket)
    try:
        while True:
            data = await websocket.receive_json()
            # If client sends a direct broadcast or ping
            if data.get("type") == "PING":
                await websocket.send_json({"type": "PONG"})
    except WebSocketDisconnect:
        mesh_broker.disconnect(websocket)
    except Exception as e:
        logger.warning(f"WebSocket error: {e}")
        mesh_broker.disconnect(websocket)
