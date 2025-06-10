import { useEffect, useState } from "react";
import style from "./Rooms.module.css";
import buttonStyle from "../../styles/button1.module.css";
import socket from "../../socket";
import type { Room } from "shared";

export default function Rooms(){

    const [rooms, setRooms] = useState< Room[]> ([]);

     useEffect(() => {
        socket.on("room-list", (data) => {
            console.log("🔁 room-list z backendu:", data);
            setRooms(data);
        });

        return () => {
            socket.off("room-list");
        };
    }, []);

    return <div className={` ${style.container} ${buttonStyle}`}>
        <div className={`${style.left}`}>
            <button>Create Room</button>
        </div>
        
        <div className={style.middle}>
            <h1>Available Rooms</h1>
            {rooms.map((room) => <button className={style.roomButton}>Join: {room.id}</button>)}
        </div>
    </div>
}
