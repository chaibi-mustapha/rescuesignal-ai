import zlib
import re
import uuid
import time
from typing import Tuple, Dict, Any, List
from ..models.emergency import EmergencyExtraction, EmergencyPacket

TYPE_MAP_ENCODE = {
    "BUILDING_COLLAPSE": "BLD",
    "FIRE": "FIR",
    "FLOOD": "FLD",
    "AVALANCHE": "AVA",
    "CONFINED_SPACE": "TRP",
    "TRAFFIC_ACCIDENT": "ACC",
    "MEDICAL": "MED",
    "KIDNAPPING_THREAT": "SEC",
    "OTHER": "SOS",
    "EMERGENCY": "SOS"
}

TYPE_MAP_DECODE = {v: k for k, v in TYPE_MAP_ENCODE.items()}

URGENCY_MAP_ENCODE = {
    "CRITICAL": "1",
    "URGENT": "2",
    "MODERATE": "3",
    "STABLE": "4"
}

URGENCY_MAP_DECODE = {
    "1": "CRITICAL",
    "2": "URGENT",
    "3": "MODERATE",
    "4": "STABLE"
}

HAZARD_MAP_ENCODE = {
    "GAS_LEAK": "GAS",
    "SMOKE": "SMK",
    "WATER_RISING": "H2O",
    "FIRE": "FIR",
    "STRUCTURAL_COLLAPSE": "COL",
    "ELECTRICAL": "VOL",
    "NONE": "NIL"
}

HAZARD_MAP_DECODE = {v: k for k, v in HAZARD_MAP_ENCODE.items()}

# International Morse code dictionary
MORSE_CODE_DICT = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 
    'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 
    'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 
    'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 
    'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--', 
    'Z': '--..', '1': '.----', '2': '..---', '3': '...--', '4': '....-', 
    '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.', 
    '0': '-----', '|': '/', ':': '---...', '-': '-....-', '_': '..--.-',
    '#': '.-.-.'
}

def calculate_checksum(data: str) -> str:
    """Calculate 4-hex-digit CRC16 checksum for transmission validation"""
    crc = zlib.crc32(data.encode('utf-8')) & 0xFFFF
    return f"{crc:04X}"

def compress_emergency(extraction: EmergencyExtraction) -> EmergencyPacket:
    """
    Transforms rich semantic AI extraction into an ultra-compact, resilient
    Emergency Data Packet (typically 35-50 bytes).
    """
    situation = TYPE_MAP_ENCODE.get(extraction.situation_type.upper(), "SOS")
    p = extraction.people_count
    i = extraction.injured_count
    u = extraction.unconscious_count
    m = URGENCY_MAP_ENCODE.get(extraction.medical_urgency.upper(), "2")
    
    # Encode primary hazard if any
    hazards_code = "NIL"
    if extraction.hazards:
        h_first = extraction.hazards[0].upper()
        hazards_code = HAZARD_MAP_ENCODE.get(h_first, h_first[:3])
    
    # Location token (compacted or sanitized)
    loc_clean = re.sub(r'[^a-zA-Z0-9]', '', extraction.location_details)[:8].upper()
    if not loc_clean:
        loc_clean = "LOC"

    # Core payload without checksum
    core_string = f"RS1|{situation}|P{p}|I{i}|U{u}|M{m}|H{hazards_code}|{loc_clean}"
    
    # Calculate checksum
    chk = calculate_checksum(core_string)
    final_compact_string = f"{core_string}|#{chk}"
    
    packet_id = f"PKT-{int(time.time())}-{uuid.uuid4().hex[:6].upper()}"

    # Determine recommended channels based on urgency & environment
    recommended = ["acoustic", "visual", "p2p_mesh"]
    if extraction.medical_urgency == "CRITICAL" or u > 0:
        recommended = ["acoustic", "visual", "p2p_mesh", "vibration"]

    return EmergencyPacket(
        packet_id=packet_id,
        timestamp=int(time.time()),
        compact_string=final_compact_string,
        payload=extraction,
        checksum=chk,
        byte_size=len(final_compact_string.encode('utf-8')),
        recommended_channels=recommended
    )

def decompress_emergency(compact_string: str) -> Tuple[bool, EmergencyExtraction, str]:
    """
    Decompresses and validates a received Emergency Data Packet string.
    Returns (is_valid, EmergencyExtraction, status_message).
    """
    compact_string = compact_string.strip()
    parts = compact_string.split("|")
    if len(parts) < 8 or not compact_string.startswith("RS1|"):
        return False, EmergencyExtraction(), "Invalid packet header or structure"
    
    # Checksum verification
    received_chk = parts[-1].replace("#", "")
    core_string = "|".join(parts[:-1])
    expected_chk = calculate_checksum(core_string)
    
    if received_chk.upper() != expected_chk.upper():
        return False, EmergencyExtraction(), f"CRC Checksum Mismatch (Expected {expected_chk}, got {received_chk})"

    try:
        situation_code = parts[1]
        situation = TYPE_MAP_DECODE.get(situation_code, "EMERGENCY")
        
        people = int(parts[2][1:]) if len(parts[2]) > 1 and parts[2].startswith("P") else 1
        injured = int(parts[3][1:]) if len(parts[3]) > 1 and parts[3].startswith("I") else 0
        unconscious = int(parts[4][1:]) if len(parts[4]) > 1 and parts[4].startswith("U") else 0
        
        urgency_code = parts[5][1:] if len(parts[5]) > 1 and parts[5].startswith("M") else "2"
        urgency = URGENCY_MAP_DECODE.get(urgency_code, "URGENT")
        
        hazard_code = parts[6][1:] if len(parts[6]) > 1 and parts[6].startswith("H") else "NIL"
        hazard = HAZARD_MAP_DECODE.get(hazard_code, hazard_code)
        hazards = [hazard] if hazard != "NONE" and hazard != "NIL" else []
        
        location = parts[7]
        
        summary = (
            f"URGENCE: {situation} | {people} personne(s) | {injured} blessé(s) | "
            f"{unconscious} inconscient(s) | Urgence: {urgency} | Localisation: {location}"
        )

        extraction = EmergencyExtraction(
            situation_type=situation,
            people_count=people,
            injured_count=injured,
            unconscious_count=unconscious,
            medical_urgency=urgency,
            hazards=hazards,
            location_details=location,
            summary=summary,
            confidence=0.98,
            raw_transcript=f"[Decoded Emergency Packet: {compact_string}]"
        )
        return True, extraction, "Valid packet decoded successfully"
    except Exception as e:
        return False, EmergencyExtraction(), f"Decoding error: {str(e)}"

def text_to_morse(text: str) -> str:
    """Converts a packet string into Morse timing tokens (. for dot, - for dash, / for space)"""
    morse_words = []
    for char in text.upper():
        if char in MORSE_CODE_DICT:
            morse_words.append(MORSE_CODE_DICT[char])
        elif char == ' ':
            morse_words.append('/')
    return ' '.join(morse_words)
