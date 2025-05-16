import  React  from "react";
import styles from "./Header.module.css";
import { Link } from "react-router-dom";

function Header (){
    return (
        <div className = {styles.header}>
            <div className={styles.left}>
                Max Number
            </div>
            <div className={styles.main}>
                <Link className = {styles.tab} to="/">Home</Link>
                <Link className = {styles.tab} to="about">About us</Link>
                <Link to="/rooms" className={styles.tab}>Rooms</Link>
            </div>
            
        </div>
    )
}

export default Header;