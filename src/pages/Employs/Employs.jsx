import React, { useState, useEffect } from "react";
import Container from "../../components/container/Container";
import styles from "./employs.module.scss";
import MyButton from "../../components/button/MyButton";
import { RiDeleteBin6Line, RiEditLine } from "react-icons/ri";
import { MdBlock } from "react-icons/md";
import { GrUnlock } from "react-icons/gr";
import { LuSquareUserRound } from "react-icons/lu";
import { FaChevronDown } from "react-icons/fa";
import AddEmployee from "./AddEmployee";
import { listEmployeeCompany, userToggleStatus, deleteUsers, changeRole, viewsUsersSort } from "../../../api";
import { useUser } from "../../contexts/UserContext";

const Employs = () => {
    const { user } = useUser();
    const [listEmployee, setListEmployee] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [statusRole, setStatusRole] = useState(null);
    const [viewsSelectRole, setViewsSelectRole] = useState(false);
    const [statusDelete, setStatusDelete] = useState(null);
    const [addEmployee, setAddEmployee] = useState(false);

    const fetchEmployees = async () => {
        try {
            const res = await listEmployeeCompany(user.idCompany);
            if (res.data && Array.isArray(res.data.employees)) {
                setListEmployee(res.data.employees);
                setFilteredEmployees(res.data.employees);
            } else {
                console.error("Niepoprawny format danych:", res.data);
                setListEmployee([]);
                setFilteredEmployees([]);
            }
        } catch (error) {
            console.error("Błąd pobierania listy pracowników:", error);
        }
    };

    const fetchUsersByRole = async (role) => {
        if (role === "all") {
            setFilteredEmployees(listEmployee);
            return;
        }
    
        try {
            const res = await viewsUsersSort(role, user.idCompany);
            if (res.data && Array.isArray(res.data.users)) {
                setFilteredEmployees(res.data.users);
            } else {
                console.error("Niepoprawny format danych:", res.data);
                setFilteredEmployees([]);
            }
        } catch (error) {
            console.error("Błąd pobierania użytkowników według roli:", error);
            setFilteredEmployees([]);
        }
    };
    const handleRoleChange = async (e, userId, currentRole) => {
        const newRole = e.target.value;

        if (newRole === currentRole.toLowerCase()) {
            console.warn("Nowa rola jest taka sama jak obecna. Zmiana nie jest potrzebna.");
            return;
        }

        try {
            setStatusRole(userId);

            await changeRole(newRole, userId);
            await fetchEmployees();

            setStatusRole(null);
        } catch (error) {
            console.error("Błąd podczas zmiany roli użytkownika:", error);
            alert("Nie udało się zmienić roli. Spróbuj ponownie.");
        }
    };
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
            console.error("Błąd podczas usuwania użytkownika", error);
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
                            <th
                                className={styles.thRole}
                                onMouseEnter={() => setViewsSelectRole(true)}
                                onMouseLeave={() => setViewsSelectRole(false)}
                            >
                                Rola <FaChevronDown className={styles.iconDown} />
                                {viewsSelectRole && (
                                    <ul className={styles.roleDropdown}>
                                        <li onClick={() => fetchUsersByRole("all")}>Wszystkie role</li>
                                        <li onClick={() => fetchUsersByRole("employee")}>Pracownik</li>
                                        <li onClick={() => fetchUsersByRole("boss")}>Zarządca</li>
                                        <li onClick={() => fetchUsersByRole("team_manager")}>Manager</li>
                                    </ul>
                                )}
                            </th>
                            <th>Status</th>
                            <th>Adres</th>
                            <th>Email</th>
                            <th>Numer Kontaktowy</th>
                            <th>Akcja</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEmployees.length > 0 ? (
                            filteredEmployees.map((employee) => (
                                <tr key={employee._id} className={styles.row}>
                                    <td>{employee.userName} {employee.userLastName}</td>
                                    <td>
                                        {statusRole !== employee._id ? (
                                            <p onClick={() => setStatusRole(employee._id)} className={styles.editRole}>
                                                {employee.__t === "Employee" ? "Pracownik" :
                                                    employee.__t === "Boss" ? "Zarządca" :
                                                        employee.__t === "TeamManager" ? "Manager" :
                                                            "Nieznana rola"}
                                            </p>
                                        ) : (
                                            <select
                                                className={styles.selectNewRole}
                                                value={employee.__t.toLowerCase()}
                                                onChange={(e) => handleRoleChange(e, employee._id, employee.__t)}
                                            >
                                                <option value="employee">Pracownik</option>
                                                <option value="boss">Zarządca</option>
                                                <option value="team_manager">Manager</option>
                                            </select>
                                        )}
                                    </td>
                                    <td>{employee.statusUser ? "Zablokowany" : "Aktywny"}</td>
                                    <td>Adres pracownika</td>
                                    <td>{employee.email}</td>
                                    <td>{employee.phone || "Brak numeru"}</td>
                                    <td className={styles.actionTd}>
                                        {statusDelete !== employee._id ? (
                                            <>
                                                <MyButton btnTable={true} onClick={() => setStatusRole(employee._id)} >
                                                    <RiEditLine className={styles.iconBtn} /> Edytuj
                                                </MyButton>
                                                <MyButton btnTable={true} onClick={() => setStatusDelete(employee._id)}>
                                                    <RiDeleteBin6Line className={styles.iconBtn} /> Usuń
                                                </MyButton>
                                                <MyButton btnTable={true} onClick={() => toggleUserStatus(employee._id)}>
                                                    {employee.statusUser ? (
                                                        <><GrUnlock className={styles.iconBtn} />  Odblokuj</>
                                                    ) : (
                                                        <><MdBlock className={styles.iconBtn} /> Zablokuj</>
                                                    )}
                                                </MyButton>
                                            </>
                                        ) : (
                                            <div className={styles.questionDelete}>
                                                <span> Jesteś pewien, że chcesz usunąć tego użytkownika? </span>
                                                <div className={styles.buttonStylesQuestionDelete}>
                                                    <MyButton btnTable={true} onClick={() => userDelete(employee._id)}>Tak</MyButton>
                                                    <MyButton btnTable={true} onClick={() => setStatusDelete(null)}>Nie</MyButton>
                                                </div>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className={styles.row}>Brak danych do wyświetlenia.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <MyButton btnTable={true} onClick={() => setAddEmployee(true)}>
                    <LuSquareUserRound className={styles.iconBtn} /> Dodaj
                </MyButton>
            </div>
            {addEmployee && <AddEmployee setAddEmployee={setAddEmployee} refreshEmployees={fetchEmployees} />}
        </Container>
    );
};

export default Employs;
