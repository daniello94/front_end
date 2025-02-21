import React, { useState, useEffect } from "react";
import Container from "../../components/container/Container";
import styles from "./employs.module.scss";
import MyButton from "../../components/button/MyButton";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdBlock } from "react-icons/md";
import { GrUnlock } from "react-icons/gr";
import { LuSquareUserRound } from "react-icons/lu";
import AddEmployee from "./AddEmployee";
import { listEmployeeCompany } from "../../../api";
import { useUser } from "../../contexts/UserContext";

const Employs = () => {
    const [isBlocked, setIsBlocked] = useState(false)
    const [addEmployee, setAddEmployee] = useState(false);
    const [listEmployee, setListEmployee] = useState([])
    const { user } = useUser();

    const fetchEmployees = async () => {
        try {
            const res = await listEmployeeCompany(user.idCompany);

            if (res.data && Array.isArray(res.data.employees)) {
                setListEmployee(res.data.employees);
            } else {
                console.error("Niepoprawny format danych:", res.data);
                setListEmployee([]);
            }
        } catch (error) {
            console.error("Błąd pobierania listy pracowników:", error);
        }
    }
    useEffect(() => {
        fetchEmployees();
    }, [user?.idCompany]);

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
                        {listEmployee.length > 0 ? (
                            listEmployee.map((employee) => (
                                <tr key={employee._id} className={styles.row}>
                                    <td>{employee.userName} {employee.userLastName}</td>
                                    <td>Pracownik</td>
                                    <td>Aktywny</td>
                                    <td>jskssjbdh asbhabda</td>
                                    <td>{employee.email}</td>
                                    <td>{employee.phone || "Brak numeru"}</td>
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
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className={styles.noData}>Brak danych do wyświetlenia</td>
                            </tr>
                        )}
                    </tbody>

                </table>
                <MyButton btnTable={true} onClick={() => setAddEmployee(true)}><LuSquareUserRound className={styles.iconBtn} /> Dodaj</MyButton>
            </div>
            {addEmployee && (
                <AddEmployee setAddEmployee={setAddEmployee} refreshEmployees={fetchEmployees}/>
            )}
        </Container>
    )
}
export default Employs;