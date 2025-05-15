import styles from "./App.module.css";
import "../styles/main.css";
import Header from "../components/Header/Header";
import MainView from "../pages/GameView/GameView";
import Footer from "../components/Footer/Footer";

function App() {
  return (
    <div className = {styles.app}>

      <div className = {styles.app_header}>
        <Header/>
      </div>

      <div className = {styles.app_GameView}>
        <MainView/>
      </div>

      <div className = {styles.app_footer}>
        <Footer/>
      </div>

    </div>
  );
}

export default App;
