import styles from "./Header.module.css";
import { Link } from "react-router-dom";
import buttonStyle from "../../styles/button1.module.css";
import { useState } from "react";
import socket from "../../socket";
import { useTranslation } from 'react-i18next';

function Header (){
    const { i18n, t } = useTranslation();
    const [langIcon, setLangIcon] = useState("🇵🇱");

    return (
        <div className = {styles.header}>
            <div className={styles.left}>
                Max Number
            </div>
            <div className={styles.main}>
                <Link className = {styles.tab} to="/"> {t('header.home')} </Link>
                <Link className = {styles.tab} to="about"> {t('header.aboutUs')} </Link>
                <Link to="/rooms" className={styles.tab}>{t('header.rooms')}</Link>
            </div>
            <div className={styles.right}>
                <button className={`${styles.lang} ${buttonStyle}`}>
                    {langIcon}
                    <div className={styles.langOptions}>
                        <div onClick={() => {setLangIcon("🇵🇱"); socket.emit("set-lang", "pl"); i18n.changeLanguage('pl')}}>🇵🇱</div>
                        <div onClick={() => {setLangIcon("🇬🇧"); socket.emit("set-lang", "en"); i18n.changeLanguage('en')}}>🇬🇧</div>
                    </div>
                </button>
            </div>
            
        </div>
    )
}

export default Header;