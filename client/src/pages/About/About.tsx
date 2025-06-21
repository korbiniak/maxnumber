import style from "./About.module.css";
import { useTranslation } from "react-i18next";



export default function About(){

    const { t } = useTranslation();

    return <div className={style.container}>


        <div className={style.aboutGame}>

     
            <h1>{t('about.titles.game')}</h1>
            
            <p style={{ whiteSpace: 'pre-line' }}>{t('about.content.game')}</p>


        </div>
    

        <div className={style.about}>
            <h1>{t('about.titles.framal')}</h1>
            <p> {t('about.content.framal')}</p>


        </div>


        <div className={style.about}>
            <h1>{t('about.titles.mpdoge')}</h1>
            <p> {t('about.content.mpdoge')}</p>


        </div>

        <div className={style.about}>
            <h1>{t('about.titles.tapik')}</h1>
            <p> {t('about.content.tapik')}</p>

        </div>

     

    </div>
}