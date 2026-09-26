from typing import List, Optional
from pydantic import BaseModel, Field
import time

class EmergencyExtraction(BaseModel):
    situation_type: str = Field(default="EMERGENCY", description="Catastrophe or hazard type")
    people_count: int = Field(default=1, description="Total persons involved")
    injured_count: int = Field(default=0, description="Injured persons")
    unconscious_count: int = Field(default=0, description="Unconscious persons")
    medical_urgency: str = Field(default="URGENT", description="CRITICAL, URGENT, MODERATE, STABLE")
    hazards: List[str] = Field(default_factory=list, description="Immediate environmental threats")
    location_details: str = Field(default="Unknown", description="Extracted location/context")
    summary: str = Field(default="", description="Human-readable emergency summary")
    confidence: float = Field(default=0.95, description="Extraction confidence score (0-1)")
    raw_transcript: str = Field(default="", description="Original speech text")
    language: str = Field(default="fr", description="Language of the speech")

class EmergencyPacket(BaseModel):
    packet_id: str
    timestamp: int = Field(default_factory=lambda: int(time.time()))
    compact_string: str
    payload: EmergencyExtraction
    checksum: str
    byte_size: int
    recommended_channels: List[str] = Field(default_factory=lambda: ["acoustic", "visual", "p2p_mesh"])

class TranscribeRequest(BaseModel):
    text: Optional[str] = None
    language: Optional[str] = "fr"

class ManualEmergencyRequest(BaseModel):
    situation_type: str
    people_count: int
    injured_count: int
    unconscious_count: int
    medical_urgency: str
    hazards: List[str] = []
    location_details: str = ""

class MeshBroadcastMessage(BaseModel):
    sender_id: str
    packet: EmergencyPacket
    channel: str = "acoustic"
    device_name: str = "Terminal-Rescue"
