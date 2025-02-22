import React, { useState, useEffect } from "react";
import Container from "../../components/container/Container";
import styles from "./employs.module.scss";
import MyButton from "../../components/button/MyButton";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdBlock } from "react-icons/md";
import { GrUnlock } from "react-icons/gr";
import { LuSquareUserRound } from "react-icons/lu";
import AddEmployee from "./AddEmployee";
import { listEmployeeCompany, userToggleStatus, deleteUsers } from "../../../api";
import { useUser } from "../../contexts/UserContext";

const Employs = () => {
    const [statusDelete, setStatusDelete] = useState("")
    const [addEmployee, setAddEmployee] = useState(false);
    const [listEmployee, setListEmployee] = useState([])
    const { user } = useUser();
    console.log(listEmployee);


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
    const toggleUserStatus = async (userId) => {
        try {
            await userToggleStatus(userId);
            await fetchEmployees();
        } catch (error) {
            console.error("Błąd podczas zmiany statusu użytkownika", error);
        }
    };

    const userDelete = async (userId) => {
        try {
            await deleteUsers(userId);
            await fetchEmployees();
        } catch (error) {
            console.error("Błąd podczas usuwania użytowniak", error);
        }
    };

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
                                    <td>
                                        <p>
                                            {employee.__t === "Employee" ? "Pracownik" :
                                                employee.__t === "Boss" ? "Zarządca" :
                                                    employee.__t === "TeamManager" ? "Manager" :
                                                        "Nieznana rola"}
                                        </p>

                                    </td>
                                    <td>{!employee.statusUser ? (
                                        <>
                                            Aktywny
                                        </>
                                    ) : (
                                        <>
                                            Zablokowany</>
                                    )}</td>
                                    <td>jskssjbdh asbhabda</td>
                                    <td>{employee.email}</td>
                                    <td>{employee.phone || "Brak numeru"}</td>
                                    <td className={styles.actionTd}>
                                        {statusDelete !== employee._id ? (
                                            <>
                                                <MyButton btnTable={true} onClick={() => setStatusDelete(employee._id)}><RiDeleteBin6Line className={styles.iconBtn} /> Usuń</MyButton>
                                                <MyButton btnTable={true} onClick={() => toggleUserStatus(employee._id)}>
                                                    {employee.statusUser ? (
                                                        <>
                                                            <GrUnlock className={styles.iconBtn} />  Odblokuj
                                                        </>
                                                    ) : (
                                                        <>
                                                            <MdBlock className={styles.iconBtn} /> Zablokuj
                                                        </>
                                                    )}
                                                </MyButton></>

                                        ) : (
                                            <div className={styles.questionDelete}>
                                                <span> Jesteś pewien że chcesz usunąć tego użytkownika </span>
                                                <div className={styles.buttonStylesQuestionDelete}>
                                                    <MyButton btnTable={true} onClick={() => userDelete(employee._id)}>Tak</MyButton>
                                                    <MyButton btnTable={true} onClick={() => setStatusDelete(true)}>Nie</MyButton>
                                                </div>

                                            </div>
                                        )}

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
                <AddEmployee setAddEmployee={setAddEmployee} refreshEmployees={fetchEmployees} />
            )}
        </Container>
    )
}
export default Employs;