import {socket} from "./socket";
import './App.css'
import { useEffect} from "react";


function App() {
  console.log("test");

  useEffect(()=>{
    


    socket.on("update-state", (data)=>{
      console.log("UU:", data);
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
