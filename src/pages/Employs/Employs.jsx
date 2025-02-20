import React, { useState } from "react";
import Container from "../../components/container/Container";
import styles from "./employs.module.scss";
import MyButton from "../../components/button/MyButton";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdBlock } from "react-icons/md";
import { GrUnlock } from "react-icons/gr";
import {LuSquareUserRound} from "react-icons/lu";
const Employs = () => {
    const [isBlocked, setIsBlocked] = useState(false)
    return (
        <Container containerPage={true}>
            <div className={styles.contentHeader}>
                <h2>Pracownicy</h2>
            </div>
            <div className={styles.contentTable}>
                <table className={styles.table}>
                    <thead>
                        <tr className={styles.headerTable}>
                            <th>Imię i Nazwisko</th>
                            <th>Rola</th>
                            <th>Status</th>
                            <th>Adres</th>
                            <th>Email</th>
                            <th>Numer Kontaktowy</th>
                            <th>Akcja</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className={styles.row}>
                            <td>Jan Kowalski</td>
                            <td>Pracownik</td>
                            <td>Aktywny</td>
                            <td>jskssjbdh asbhabda</td>
                            <td>sas@op.pl</td>
                            <td>1265246342643652</td>
                            <td className={styles.actionTd}>
                                <MyButton btnTable={true}> <CiEdit className={styles.iconBtn} /> Edytuj</MyButton>
                                <MyButton btnTable={true}><RiDeleteBin6Line className={styles.iconBtn} /> Usuń</MyButton>
                                <MyButton btnTable={true} onClick={() => setIsBlocked(!isBlocked)}>
                                    {isBlocked ? (
                                        <>
                                            <GrUnlock className={styles.iconBtn} />  Odblokuj
                                        </>
                                    ) : (
                                        <>
                                            <MdBlock className={styles.iconBtn} /> Zablokuj
                                        </>
                                    )}
                                </MyButton>

                            </td>
                        </tr>
                    </tbody>
                </table>
                <MyButton btnTable={true}><LuSquareUserRound className={styles.iconBtn}/> Dodaj</MyButton>
            </div>

        </Container>
    )
}
export default Employs;