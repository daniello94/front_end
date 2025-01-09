import React, { useState } from "react";
import { updateUser, newCompany, removeFirstLogin } from "../../../api";
import MyButton from "../../components/button/MyButton";
import { useUser } from "../../contexts/UserContext";
import Container from "../container/Container";
import styles from "./FirstLogin.module.scss";
import MyInput from "../input/MyInput";

const BigBoss = () => {
    const { user,setUser  } = useUser();
    const [viewsForm, setViewsForm] = useState("langue");
    const [preferLangueValue, setPreferLangueValue] = useState("en");
    const [formData, setFormData] = useState({
        nameCompany: "",
        country: "",
        identificationNumber: "",
        city: "",
        street: "",
        number: "",
        numberBox: "",
        zipCode: "",
        email: "",
        bigBossEmail: user.email,
    });

    const [errors, setErrors] = useState({
        nameCompany: false,
        country: false,
        identificationNumber: false,
        city: false,
        street: false,
        number: false,
        numberBox: false,
        zipCode: false,
        email: false,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        validateInput(name, value);
    };
    const validateInput = (name, value) => {
        const newErrors = { ...errors };

        switch (name) {
            case "nameCompany":
            case "country":
            case "city":
            case "street":
            case "zipCode":
            case "identificationNumber":
                newErrors[name] = !value.trim();
                break;

            case "number":
                newErrors[name] = isNaN(parseInt(value, 10));
                break;

            case "email":
                newErrors[name] = !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value);
                break;

            case "numberBox":
                newErrors[name] = false;
                break;

            default:
                break;
        }
        setErrors(newErrors);
    };

    const updateLangue = async (e) => {
        e.preventDefault();
        const updatedData = {
            preferredLanguage: preferLangueValue,
        };
        try {
            const response = await updateUser(user.id, updatedData);
            console.log("Preferencje językowe zaktualizowane:", response.data);
            setViewsForm("dataCompany");
        } catch (error) {
            console.error("Błąd podczas aktualizacji preferencji językowych:", error);
        }
    };

    const createCompany = async (e) => {
        e.preventDefault();

        const hasError = Object.values(errors).some((err) => err === true);

        if (hasError) {
            console.warn("Formularz zawiera błędy lub puste pola!");
            return;
        }

        try {
            const response = await newCompany({
                ...formData,
                number: parseInt(formData.number, 10),
            });
            console.log("Firma utworzona:", response.data);
            setViewsForm("finishViews");
        } catch (error) {
            console.error("Błąd podczas tworzenia firmy:", error.response?.data || error);
        }
    };

    const activateUser = async () => {
        try {
            const response = await removeFirstLogin(user.id)
            setUser({ ...user, firstLogin: false });
        } catch (error) {
            console.error("Bład podczas aktywacji konta", error)
        }
    }

    return (
        <Container>
            <h3>Witaj {user.userName} {";)"} </h3>
            <p>Aby w pełni korzystać z możliwości serwisu, musisz dokończyć konfigurację konta.</p>

            {viewsForm === "langue" && (
                <form className={styles.formPreferLangue} onSubmit={updateLangue}>
                    <label>
                        Preferowany język powiadomień:
                        <select
                            value={preferLangueValue}
                            onChange={(e) => setPreferLangueValue(e.target.value)}
                        >
                            <option value="pl">Polski</option>
                            <option value="en">Angielski</option>
                            <option value="de">Niemiecki</option>
                            <option value="fr">Francuski</option>
                            <option value="uk">Ukraiński</option>
                            <option value="ro">Rumuński</option>
                            <option value="ar">Arabski</option>
                        </select>
                    </label>
                    <MyButton btnForm={true} type="submit">
                        Dalej
                    </MyButton>
                </form>
            )}

            {viewsForm !== "langue" && viewsForm !== "finishViews" && (
                <form className={styles.formPreferLangueTwo}>
                    {viewsForm === "dataCompany" && (
                        <div className={styles.conceptDiv}>
                            <label>
                                Nazwa Firmy
                                <MyInput
                                    placeholder="Podaj nazwę swojej firmy"
                                    name="nameCompany"
                                    value={formData.nameCompany}
                                    onChange={handleChange}
                                />
                                {errors.nameCompany && (
                                    <span className={styles.errorMsg}>To pole jest wymagane</span>
                                )}
                            </label>

                            <label>
                                Kraj Rejestracji
                                <MyInput
                                    placeholder="Podaj kraj rejestracji Firmy"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                />
                                {errors.country && (
                                    <span className={styles.errorMsg}>To pole jest wymagane</span>
                                )}
                            </label>

                            <label>
                                Numer Identyfikacyjny
                                <MyInput
                                    placeholder="Podaj numer identyfikacyjny firmy"
                                    name="identificationNumber"
                                    value={formData.identificationNumber}
                                    onChange={handleChange}
                                />
                                {errors.identificationNumber && (
                                    <span className={styles.errorMsg}>To pole jest wymagane</span>
                                )}
                            </label>

                            <label>
                                Email firmowy
                                <MyInput
                                    placeholder="Podaj email firmowy"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                {errors.email && (
                                    <span className={styles.errorMsg}>Wprowadź poprawny adres email</span>
                                )}
                            </label>

                            <MyButton btnForm={true} onClick={() => setViewsForm("addressCompany")}>
                                Dalej
                            </MyButton>
                        </div>
                    )}

                    {viewsForm === "addressCompany" && (
                        <div className={styles.conceptDiv}>
                            <label>
                                Miasto
                                <MyInput
                                    placeholder="Podaj miasto"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                />
                                {errors.city && (
                                    <span className={styles.errorMsg}>To pole jest wymagane</span>
                                )}
                            </label>

                            <label>
                                Ulica
                                <MyInput
                                    placeholder="Podaj ulicę"
                                    name="street"
                                    value={formData.street}
                                    onChange={handleChange}
                                />
                                {errors.street && (
                                    <span className={styles.errorMsg}>To pole jest wymagane</span>
                                )}
                            </label>

                            <label>
                                Numer
                                <MyInput
                                    placeholder="Podaj numer budynku"
                                    name="number"
                                    value={formData.number}
                                    onChange={handleChange}
                                />
                                {errors.number && (
                                    <span className={styles.errorMsg}>To pole jest wymagane</span>
                                )}
                            </label>

                            <label>
                                Kod pocztowy
                                <MyInput
                                    placeholder="Podaj kod pocztowy"
                                    name="zipCode"
                                    value={formData.zipCode}
                                    onChange={handleChange}
                                />
                                {errors.zipCode && (
                                    <span className={styles.errorMsg}>To pole jest wymagane</span>
                                )}
                            </label>

                            <MyButton btnForm={true} onClick={createCompany}>
                                Zapisz
                            </MyButton>
                        </div>
                    )}
                </form>
            )}

            {viewsForm === "finishViews" && (
                <>
                    <p>Wszystko zostało zaktualizowane pomyślnie. Możesz zacząć korzystać z serwisu!</p>
                    <MyButton onClick={activateUser} type="submit" btnForm={true}>Zakończ</MyButton>
                </>
            )}
        </Container>
    );
};

export default BigBoss;
