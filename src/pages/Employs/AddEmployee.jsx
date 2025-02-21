import React, { useState } from "react";
import Container from "../../components/container/Container";
import styles from "./addEmployee.module.scss";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { FiSave } from "react-icons/fi";
import MyButton from "../../components/button/MyButton";
import MyInput from "../../components/input/MyInput";
import { addEmployee } from "../../../api";
import { useUser } from "../../contexts/UserContext";

const AddEmployee = ({ setAddEmployee, refreshEmployees }) => {
    const { user } = useUser();
    const [formData, setFormData] = useState({
        userName: '',
        userLastName: '',
        email: '',
        price: '',
        role: '',
        bigBossEmail: user.email
    });

    const [errors, setErrors] = useState({
        userName: false,
        userLastName: false,
        email: false,
        price: false,
        role: false,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        validateInput(name, value);
    };

    const validateInput = (name, value) => {
        const newErrors = { ...errors };
        switch (name) {
            case "userName":
            case "userLastName":
            case "price":
                newErrors[name] = !value.trim();
                break;
            case "email":
                newErrors[name] = !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value);
                break;
            case "role":
                newErrors[name] = value === "";
                break;
        }
        setErrors(newErrors);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {
            userName: !formData.userName.trim(),
            userLastName: !formData.userLastName.trim(),
            email: !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email),
            price: !formData.price.trim(),
            role: formData.role === "",
        };

        setErrors(newErrors);

        if (Object.values(newErrors).some(error => error)) {
            return;
        }

        try {
            await addEmployee(formData);
            alert("Pracownik dodany pomyślnie!");
            setAddEmployee(false);
            refreshEmployees()
        } catch (error) {
            console.error("Błąd dodawania pracownika:", error);
            alert("Wystąpił błąd podczas dodawania pracownika.");
        }
    };

    return (
        <Container viewsWindows={true}>
            <IoMdCloseCircleOutline className={styles.iconClose} onClick={() => setAddEmployee(false)} />
            <form className={styles.formAddEmployee} onSubmit={handleSubmit}>
                <div>
                    <label> Imię
                        <MyInput
                            error={errors.userName}
                            optionTwo={true}
                            placeholder="Jan"
                            name="userName"
                            value={formData.userName}
                            onChange={handleChange}
                            type="text"
                        />
                    </label>
                    <label> Nazwisko
                        <MyInput
                            optionTwo={true}
                            placeholder="Kowalski"
                            error={errors.userLastName}
                            name="userLastName"
                            value={formData.userLastName}
                            type="text"
                            onChange={handleChange}
                        />
                    </label>
                    <label> Rola
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className={errors.role ? styles.error : ""}
                        >
                            <option value="">Wybierz</option>
                            <option value="boss">Zarządca</option>
                            <option value="team_manager">Menager</option>
                            <option value="employee">Pracownik</option>
                        </select>
                    </label>
                </div>
                <div>
                    <label> Email
                        <MyInput
                            optionTwo={true}
                            placeholder="jan@op.pl"
                            error={errors.email}
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            type="email"
                        />
                    </label>
                    <label> Stawka
                        <MyInput
                            optionTwo={true}
                            placeholder="100/H"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            error={errors.price}
                            type="text"
                        />
                    </label>
                </div>
                <div className={styles.buttonStylesForm}>
                    <MyButton btnTable={true} onClick={() => setAddEmployee(false)}>
                        <IoMdCloseCircleOutline /> Anuluj
                    </MyButton>
                    <MyButton btnTable={true} type="submit">
                        <FiSave /> Zapisz
                    </MyButton>
                </div>
            </form>
        </Container>
    );
};

export default AddEmployee;
