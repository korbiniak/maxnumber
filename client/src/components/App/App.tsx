import React, { useEffect, useState } from "react";
import styles from "./App.module.css";
import Header from "../Header/Header";
import MainView from "../MainView/MainView";
import Footer from "../Footer/Footer";

function App() {
  return (
    <div className = {styles.app}>

      <div className = {styles.app_header}>
        <Header/>
      </div>

      <div className = {styles.app_MainView}>
        <MainView/>
      </div>

      <div className = {styles.app_footer}>
        <Footer/>
      </div>

    </div>
  );
}

export default App;
