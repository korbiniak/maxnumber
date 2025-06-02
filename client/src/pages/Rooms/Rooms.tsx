// Rooms.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket, { connectSocket } from "../../socket";
import type { Room } from "shared";
import styles from "./Rooms.module.css";

export default function Rooms() {
  const [roomName, setRoomName] = useState("");
  const [rooms, setRooms] = useState<Room[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    connectSocket();

    socket.on("room-list", (rooms : Room[]) => {
        setRooms(rooms);
        console.log(" pokoje : ", rooms);
    });

    
    socket.on("error", (msg : string) => {
      alert("Błąd: " + msg);
    });

    return () => {
      socket.off("room-list");
      socket.off("room-joined");
      socket.off("update-state");
      socket.off("error");
    };
  }, [navigate]);

  const handleCreateRoom = () => {
    if (roomName.trim()) {
      socket.emit("create-room", roomName.trim());
      console.log(" tworzymy pokoj o nazwie ", roomName.trim());
      setRoomName("");
    }
  };

  const handleJoinRoom = (roomId: string) => {
    socket.emit("join-room", roomId);
    console.log(" dolaczamy do pokoju o id ", roomId);
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <h2>Create Room</h2>
        <input
          type="text"
          placeholder="Room name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
        <button onClick={handleCreateRoom}>Create Room</button>
      </div>

      <div className={styles.middle}>
        <h2>Available rooms</h2>
        {rooms.length === 0 && <p>No available rooms</p>}
        {rooms.map((room) => (
          <button
            key={room.name}
            className={styles.roomButton}
            onClick={() => handleJoinRoom(room.name)}
            disabled={room.playersNum >= 2}
          >
            {room.name}
          </button>
        ))}
      </div>
    </div>
  );
}
