import asyncio
import logging
from typing import Set, Dict, Any, List
from fastapi import WebSocket
from ..models.emergency import EmergencyPacket

logger = logging.getLogger(__name__)

class LocalMeshBroadcaster:
    """
    Simulates local device-to-device radio propagation
    (Bluetooth Low Energy beacons, Wi-Fi Direct P2P, and Acoustic reception).
    Maintains active connections between Victims and Rescue Stations.
    """

    def __init__(self):
        self.active_connections: Set[WebSocket] = set()
        self.recent_packets: List[Dict[str, Any]] = []
        self.max_history = 30

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.add(websocket)
        logger.info(f"Node connected to Local Mesh. Total active: {len(self.active_connections)}")
        
        # Send recent history to newly joined rescue station
        if self.recent_packets:
            await websocket.send_json({
                "type": "HISTORY",
                "packets": self.recent_packets[-10:]
            })

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            logger.info(f"Node disconnected from Local Mesh. Total active: {len(self.active_connections)}")

    async def broadcast_packet(self, packet: EmergencyPacket, channel: str = "acoustic", sender_id: str = "Device-A"):
        """Broadcast an emergency packet across the local mesh network"""
        message = {
            "type": "EMERGENCY_BROADCAST",
            "channel": channel,
            "sender_id": sender_id,
            "packet": packet.model_dump(),
            "signal_quality": 92, # simulated SNR %
            "timestamp": packet.timestamp
        }
        
        self.recent_packets.append(message)
        if len(self.recent_packets) > self.max_history:
            self.recent_packets.pop(0)

        # Distribute to all connected nodes
        dead_connections = set()
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception as e:
                logger.warning(f"Error sending to node: {e}")
                dead_connections.add(connection)
        
        for dead in dead_connections:
            self.disconnect(dead)

# Global singleton mesh broker
mesh_broker = LocalMeshBroadcaster()
