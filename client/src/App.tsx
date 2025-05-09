import React, { useEffect, useState } from "react";
import {socket} from "./socket";
import './App.css'

function App() {
    const [status, setStatus] = useState("Łączenie z serwerem...");

    useEffect(() => {
        setStatus("Oczekiwanie na drugiego gracza…");

        socket.on("update-state", () => {
            setStatus("Gra się rozpoczyna!");
        });
    }, []);

    return (
        <div style={{ textAlign: "center", marginTop: "100px", fontSize: "24px" }}>
            <h1>{status}</h1>
        </div>
    );
}

export default App;
