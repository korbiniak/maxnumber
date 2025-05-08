import styles from "./App.module.css";
import "../styles/main.css";
import Header from "../components/Header/Header";
import GameView from "../pages/GameView/GameView";
import Footer from "../components/Footer/Footer";
import {Routes, Route, useNavigate} from "react-router-dom";
import Rooms from "../pages/Rooms/Rooms";
import About from "../pages/About/About";
import { useEffect } from "react";
import socket from "../socket";

function App() {

  const navigate = useNavigate();

  useEffect(()=>{
    socket.on("room-joined", (name : string) => {
      navigate("/");
      console.log(" zaczynamy gre w pokoju ", name);
    });
  }, [])


  return (
    <div className = {styles.app}>

      <div className = {styles.app_header}>
        <Header/>
      </div>


      <div className={styles.app_mainView}>

        <Routes>
          <Route path="/" element={<GameView/> } />
          <Route path="/rooms" element={<Rooms/> } />
          <Route path="/about" element={<About/> } />
        </Routes>

      </div>



      <div className = {styles.app_footer}>
        <Footer/>
      </div>

    </div>
  );
}

export default App;
