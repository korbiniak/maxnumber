import { useState } from "react";
import style from "./Rooms.module.css";
import buttonStyle from "../../styles/button1.module.css";


export default function Rooms(){

    const [publicRooms, setPublicRooms] = useState(["2dw1dw3g7", "qdw6wdwad9", "efedwwd22dw", "wddw2dw", "dor125jvmaksrs2dsdw"]);


    return <div className={` ${style.container} ${buttonStyle}`}>
        <div className={`${style.left}`}>
            <button>Create Public Room</button>
            <button>Create Private Room</button>
        </div>
        
        <div className={style.middle}>
            <h1>Public Rooms</h1>
            {publicRooms.map((room) => <button className={style.roomButton}>Join: {room}</button>)}
        </div>
    </div>
}