import React, { useState, useEffect } from "react";
import { RiCloseLargeLine } from "react-icons/ri";
import { useLanguage } from '../langueSwitch/LanguageContext';
import { TiThMenu } from "react-icons/ti";
import styles from "./menu.module.scss";
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Menu = (props) => {
    const [isClose, setClose] = useState("active");
    const [isActive, setActive] = useState("close");
    const { language } = useLanguage();
    const { t } = useTranslation("menu");

    const flags = {
        'pl': '/media/img/menu/Poland.jpg',
        'en': '/media/img/menu/England.jpg',
        'nl': '/media/img/menu/Nederlanden.jpg',
        'fr': '/media/img/menu/France.jpg',
        'de': '/media/img/menu/Germany.jpg',
        'uk': '/media/img/menu/th.jpg',
        'ro': '/media/img/menu/pobrane.jpg',
        'ar': '/media/img/menu/ar.jpg',
    };

    const activeLangue = flags[language];

    const updateMenuState = () => {
        if (window.matchMedia("(max-width: 768px)").matches) {
            setActive(isActive === "active" ? "close" : "active");
            setClose(isClose === "active" ? "close" : "active")
        } else {
            setActive("close");
            setClose("active")
        }
    }

    return (
        <nav className={styles.mainNav}>
            <div className={styles[isClose]}>
                <TiThMenu className={styles.iconOpenMenu} onClick={updateMenuState} />
            </div>
            <div className={styles[isActive]}>
                <div className={styles.contentOpenMenu}>
                    <RiCloseLargeLine className={styles.iconCloseMenu} onClick={updateMenuState} />
                    <ul className={styles.ulList}>
                        <li><Link className={styles.myItem} to="/" onClick={() => updateMenuState()}>{t('home')} </Link></li>
                        <li><Link className={styles.myItem} to="/about" onClick={() => updateMenuState()}>{t('about')}</Link></li>
                        <li><Link className={styles.myItem} to="/offer" onClick={() => updateMenuState()}>{t('offer')}</Link></li>
                        <li><Link className={styles.myItem} to="/newAccount" onClick={() => updateMenuState()}>{t('account')}</Link></li>
                        <li><Link className={styles.myItem} to="/login" onClick={() => updateMenuState()}>{t('login')}</Link></li>
                        <li><img className={styles.activeFlag} src={activeLangue} alt="Current Language Flag" onClick={() => {
                            props.active(true)
                            updateMenuState()
                        }} /></li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}
export default Menu