import React, { useState } from "react";
import { RiCloseLargeLine } from "react-icons/ri";
import { useLanguage } from '../langueSwitch/LanguageContext';
import { TiThMenu } from "react-icons/ti";
import styles from "./menu.module.scss";
import { Link } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import MyButton from "../button/MyButton";
import { useUser } from "../../contexts/UserContext";
import { logoutUser } from "../../../api";
import { BiChevronUp, BiChevronDown, BiChevronRight, BiPieChartAlt2, BiCalendarEvent, } from "react-icons/bi";
import { LuSun, LuSquareUserRound, LuUsers } from "react-icons/lu";
import { IoSettingsOutline, IoMoonOutline } from "react-icons/io5";
import { RiLogoutBoxLine } from "react-icons/ri";
import { MdOutlineHomeWork } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";
import { CiDatabase } from "react-icons/ci";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { FaRegUser } from "react-icons/fa";

const Menu = (props) => {
    const [activeItem, setActiveItem] = useState(null);
    const [isClose, setClose] = useState("active");
    const [isActive, setActive] = useState("close");
    const { language } = useLanguage();
    const { t } = useTranslation("menu");
    const { setUser, user } = useUser()

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

    const handleItemClick = (index) => {
        setActiveItem(index)
    };

    const updateMenuState = () => {
        if (window.matchMedia("(max-width: 768px)").matches) {
            setActive(isActive === "active" ? "close" : "active");
            setClose(isClose === "active" ? "close" : "active")
        } else {
            setActive("close");
            setClose("active")
        }
    }

    const handleLogout = async () => {
        try {
            const response = await logoutUser();
            setUser(null);
        } catch (error) {
            console.error('Błąd podczas wylogowywania:', error.response?.data?.message || error.message);
        }
    };

    const getRoleName = (role) => {
        const roleNames = {
            BigBoss: "Właściciel",
            Boss: "Zarządca",
            TeamManager: "Menager",
            Employee: "Pracownik"
        };

        return roleNames[role] || "Nieznana rola"; // Domyślna wartość, jeśli rola nie pasuje
    };
    return (
        <>
            {user === null && (
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
                                {user === null && (
                                    <li><Link className={styles.myItem} to="/newAccount" onClick={() => updateMenuState()}>{t('account')}</Link></li>
                                )}
                                {user === null && (
                                    <li><MyButton className={styles.myItem} onClick={() => {
                                        updateMenuState();
                                        props.setActiveLogin(true);
                                    }}>{t('login')}</MyButton></li>
                                )}
                                <li><img className={styles.activeFlag} src={activeLangue} alt="Current Language Flag" onClick={() => {
                                    props.active(true)
                                    updateMenuState()
                                }} /></li>
                            </ul>
                        </div>
                    </div>
                </nav>
            )}
            {user !== null && (
                <div className={styles.menuContentLogin}>
                    <div className={styles.UserConnect}>
                        <FaRegUser className={styles.iconStylesUserLogin} />
                        <div className={styles.hiddenText}>
                            <p className={styles.textDataUser}>{user?.userName} {user?.lastName}</p>
                            <p className={styles.textRoleUser}>{user?.role && getRoleName(user.role)}</p>
                        </div>
                    </div>
                    <nav className={styles.stylesMenuLogin}>
                        <ul>
                            {[
                                { icon: <LuSquareUserRound className={styles.iconStylesUserLogin} />, text: "Mój Profil", action: () => props.setSelectedItem("profileUser") },
                                { icon: <MdOutlineHomeWork className={styles.iconStylesUserLogin} />, text: "Moja Firma" ,action: () => props.setSelectedItem("company") },
                                { icon: <BiPieChartAlt2 className={styles.iconStylesUserLogin} />, text: "Projekty",action: () => props.setSelectedItem("project") },
                                { icon: <LuUsers className={styles.iconStylesUserLogin} />, text: "Pracownicy",action: () => props.setSelectedItem("employs") },
                                { icon: <LuSun className={styles.iconStylesUserLogin} />, text: "Wiadomości",action: () => props.setSelectedItem("message") },
                                { icon: <CiDatabase className={styles.iconStylesUserLogin} />, text: "Sklep",action: () => props.setSelectedItem("shop") },
                                { icon: <BiCalendarEvent className={styles.iconStylesUserLogin} />, text: "Harmonogram",action: () => props.setSelectedItem("schedule") },
                                { icon: <RiLogoutBoxLine className={styles.iconStylesUserLogin} />, text: "Wyloguj", action: () => { updateMenuState(); handleLogout(); props.setSelectedItem("none") } }
                            ].map((item, index) => (
                                <li
                                    key={index}
                                    className={activeItem === index ? styles.active : ""}
                                    onClick={() => {
                                        handleItemClick(index);
                                        if (item.action) item.action();
                                    }}
                                >
                                    {item.icon} <p className={styles.hiddenText}>{item.text}</p>
                                </li>
                            ))}
                        </ul>

                    </nav>
                </div>
            )}
        </>

    )
}
export default Menu