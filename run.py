import sys
import uvicorn
from app.config import HOST, PORT, DEBUG, PROJECT_NAME, PROJECT_TAGLINE, ASSEMBLYAI_API_KEY
from app.services.assemblyai_service import AssemblyAIVoiceAgent

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

def main():
    print("=" * 70)
    print(f"  [RESCUE] {PROJECT_NAME.upper()}")
    print(f"  {PROJECT_TAGLINE}")
    print("  AssemblyAI Voice Agent Hackathon (lablab.ai)")
    print("=" * 70)
    
    if AssemblyAIVoiceAgent.is_cloud_ready():
        print("  [+] AssemblyAI Cloud Integration: ACTIVE (SDK Ready)")
    else:
        print("  [!] AssemblyAI Key not provided in .env: Resilient Local Fallback Engine is ACTIVE")
        print("      (To use AssemblyAI cloud, add ASSEMBLYAI_API_KEY to Projet/.env)")
        
    print(f"  [*] Server running on: http://localhost:{PORT}")
    print(f"  [*] Dual Phone Simulator: http://localhost:{PORT}/")
    print(f"  [*] Victim Mobile View:  http://localhost:{PORT}/victim")
    print(f"  [*] Rescuer Station:     http://localhost:{PORT}/rescuer")
    print("=" * 70)
    
    uvicorn.run("app.main:app", host=HOST, port=PORT, reload=DEBUG)

if __name__ == "__main__":
    main()
