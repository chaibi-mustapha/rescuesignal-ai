"""
RescueSignal AI - Generate 3 Realistic Victim Audio Calls
Generates realistic human distress voices for the 3 Crisis Dispatcher scenarios:
1. P1 Critical: Rubble collapse with unconscious casualty (distressed female voice)
2. P1 Tactical: Kidnapping / Armed intruder threat (whispered urgent voice)
3. P2 Urgent: Stalled elevator aftershock (stable trapped group)
"""

import asyncio
from pathlib import Path
import edge_tts

AUDIO_DIR = Path(__file__).resolve().parent / "app" / "static" / "audio"
AUDIO_DIR.mkdir(parents=True, exist_ok=True)

VICTIM_AUDIOS = [
    {
        "filename": "victim_1_rubble.mp3",
        "voice": "en-US-AvaNeural",
        "rate": "+4%",
        "pitch": "+6Hz",
        "text": "Help! Can anyone hear me?! We're trapped under concrete rubble in sector 4! One person has a broken leg, and Sarah is unconscious! Please send medical help, we can barely breathe!"
    },
    {
        "filename": "victim_2_whisper_threat.mp3",
        "voice": "en-US-SteffanNeural",
        "rate": "-2%",
        "pitch": "-4Hz",
        "text": "Armed intruder on the third floor. Hostage threat, suspect is armed. Two people hiding inside the locked supply closet. Send tactical police immediately. Do not make any noise."
    },
    {
        "filename": "victim_3_elevator.mp3",
        "voice": "en-US-AndrewNeural",
        "rate": "+2%",
        "pitch": "+0Hz",
        "text": "Elevator stalled between floor four and five after the tremors. We are four people trapped. One person has mild asthma panic, but everyone is conscious and stable. Power is completely out."
    }
]

async def main():
    print(f"Generating victim audios into {AUDIO_DIR}...")
    for item in VICTIM_AUDIOS:
        out_file = AUDIO_DIR / item["filename"]
        print(f"Generating {item['filename']} with voice {item['voice']}...")
        comm = edge_tts.Communicate(
            text=item["text"],
            voice=item["voice"],
            rate=item["rate"],
            pitch=item["pitch"]
        )
        await comm.save(str(out_file))
        print(f"Saved: {out_file} ({out_file.stat().st_size} bytes)")
    print("All 3 victim audios generated successfully!")

if __name__ == "__main__":
    asyncio.run(main())
