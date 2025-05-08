import  React  from "react";
import styles from "./Header.module.css";

function Header (){
    return (
        <div className = {styles.header}>
            <h1 className = {styles.tab}>Strona glowna</h1>
            <h1 className = {styles.tab}>O nas</h1>
            <h1 className = {styles.tab}>Ustawienia</h1>
        </div>
    )
}

export default Header;