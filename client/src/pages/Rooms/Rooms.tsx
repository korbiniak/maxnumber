// Rooms.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket, { connectSocket } from "../../socket";
import type { Room } from "shared";
import styles from "./Rooms.module.css";
import buttonStyle from "../../styles/button1.module.css";

export default function Rooms() {
  const [roomName, setRoomName] = useState("");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [createdRoomName, setCreatedRoomName] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    connectSocket();
    socket.emit("get-room-list");

    socket.on("room-list", (rooms : Room[]) => {
        setRooms(rooms);
        setCreatedRoomName(_ => null);
        for (let room = 0; room < rooms.length; room++){
          if (rooms[room].player1 == socket.id) {
            if (rooms[room].playersNum == 1) {
              setCreatedRoomName(rooms[room].name);
            }
            break;
          } 
        }


        console.log(" pokoje : ", rooms);
    });

    
    socket.on("error", (msg : string) => {
      alert("Błąd: " + msg);
    });

    return () => {
      socket.off("room-list");
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

  const handleDeleteRoom = (roomName : string | null) => {
    if (!roomName) return;
    socket.emit("delete-room", roomName);
  };

  return (
    <div className={`${styles.container} ${buttonStyle}`}>
      <div className={styles.left}>
        <h2>Create Room</h2>
        <input
          type="text"
          placeholder="Room name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          maxLength={30}
        />
        <button onClick={handleCreateRoom}>Create Room</button>
      </div>

      <div className={styles.middle}>
        <h2>Available rooms</h2>
        {rooms.length === 0 && <p>No available rooms</p>}
        {rooms.map((room) => (
          <div className={styles.roomDiv}>
          <button
            key={room.name}
            className={styles.roomButton}
            onClick={() => handleJoinRoom(room.name)}
            disabled={room.playersNum >= 2}
          >
            {room.name}
          </button>

          {room.playersNum >= 2 && <button className={styles.watchButton} onClick={() => {socket.emit("start-watch", room.name);}}>&#128065;</button>}
          </div>
        ))}
      </div>


      <div className={styles.right}>
        <button disabled={!createdRoomName} onClick={() => handleDeleteRoom(createdRoomName)}> Usuń Pokój </button>
      </div>
    </div>
  );
}
