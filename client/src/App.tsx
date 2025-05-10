import { io, Socket} from "socket.io-client";
import './App.css'
import { useEffect, useRef } from "react";


function App() {
  console.log("test");
  const socketRef = useRef<Socket | null>(null);

  useEffect(()=>{
    
    //There exist already an connection!
    if (socketRef.current) return;

    //Connect with socket
    const socket = io("http://localhost:3001");
    socketRef.current = socket;

    socket.on("update-state", (data)=>{
      console.log(data);
    });


  }, []);




  return (
    <>
      <div>
        oh
       </div>
    </>
  )
}

export default App
