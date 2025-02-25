import React, { useState, useEffect } from "react";
import styles from "./editUser.module.scss";
import Container from "../../components/container/Container";
import MyButton from "../../components/button/MyButton";
import MyInput from "../../components/input/MyInput";
import { FiSave } from "react-icons/fi";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { MdOutlineDelete } from "react-icons/md";
import { updateUser, userInfo, checkEmail, changeRole, updatePhoneNumber } from "../../../api";

const EditUser = ({ setViewsEditUser, idEditUser, refreshEmployees = null }) => {
    const [infoUser, setUserInfo] = useState(null);
    const [placeholderEmail, setPlaceholderEmail] = useState("")
    const [formData, setFormData] = useState({
        userName: '',
        userLastName: '',
        email: '',
        price: '',
        role: '',
        address: {
            city: '',
            number: '',
            numberBox: '',
            placePost: '',
            street: '',
            zipCode: ''
        },
        phoneNumber: {
            number: '',
            country: ''
        }

    });

    console.log(formData);


    const clearAddress = (e) => {
        e.preventDefault();
        setFormData((prevData) => ({
            ...prevData,
            address: {
                city: '',
                number: '',
                numberBox: '',
                placePost: '',
                street: '',
                zipCode: ''
            }
        }));
    };

    const [errors, setErrors] = useState({
        userName: false,
        userLastName: false,
        email: false,
        price: false,
        role: false
    });

    useEffect(() => {
        if (idEditUser) {
            fetchUserInfo(idEditUser);
        }
    }, [idEditUser]);

    const fetchUserInfo = async (id) => {
        try {
            const response = await userInfo(id);
            console.log("Dane użytkownika:", response.data);
            setUserInfo(response.data);
        } catch (error) {
            console.error("Błąd pobierania użytkownika:", error);
        }
    };

    useEffect(() => {
        if (infoUser) {
            setFormData({
                userName: infoUser?.user?.userName || '',
                userLastName: infoUser?.user?.userLastName || '',
                email: infoUser?.user?.email || '',
                price: infoUser?.user?.price || '',
                role: infoUser?.user?.__t ? infoUser.user.__t : '',
                address: {
                    city: infoUser?.user?.address?.city || '',
                    number: infoUser?.user?.address?.number || '',
                    numberBox: infoUser?.user?.address?.numberBox || '',
                    placePost: infoUser?.user?.address?.placePost || '',
                    street: infoUser?.user?.address?.street || '',
                    zipCode: infoUser?.user?.address?.zipCode || '',
                },
                phoneNumber: {
                    country: infoUser?.user?.phoneNumber?.country || '',
                    number: infoUser?.user?.phoneNumber?.number || ''
                }
            });
        }
    }, [infoUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => {
            if (name.startsWith("address.")) {
                const addressField = name.split(".")[1];
                return {
                    ...prev,
                    address: {
                        ...prev.address,
                        [addressField]: value,
                    },
                };
            } else if (name.startsWith("phoneNumber.")) {
                const phoneField = name.split(".")[1];
                return {
                    ...prev,
                    phoneNumber: {
                        ...prev.phoneNumber,
                        [phoneField]: value,
                    },
                };
            } else {
                return {
                    ...prev,
                    [name]: value,
                };
            }
        });

        validateInput(name, value);
    };

    const validateInput = (name, value) => {
        const newErrors = { ...errors };

        switch (name) {
            case "userName":
            case "userLastName":
            case "price":
                newErrors[name] = !value.trim() ? "To pole jest wymagane" : false;
                break;

            case "email":
                if (infoUser && value === infoUser.user.email) {
                    newErrors.email = false;
                    setPlaceholderEmail("");
                } else {
                    checkEmailAvailability(value).then(emailExists => {
                        newErrors.email = emailExists ? "Email jest już zajęty" : false;
                        setPlaceholderEmail(emailExists ? "Email jest już zajęty" : "");
                        setErrors(newErrors);
                    });
                }
                break;

            case "role":
                newErrors.role = value === "" ? "To pole jest wymagane" : false;
                break;

            default:
                if (name.startsWith("address.")) {
                    const field = name.split(".")[1];
                    newErrors.address = { ...errors.address };
                    const updatedAddress = formData.address ? { ...formData.address, [field]: value } : {
                        city: '', number: '', zipCode: '', placePost: '', street: '', numberBox: ''
                    };

                    const { city, number, zipCode, placePost } = updatedAddress;
                    const isAnyFieldFilled = city || number || zipCode || placePost;

                    if (isAnyFieldFilled) {
                        newErrors.address.city = !city ? "To pole jest wymagane" : false;
                        newErrors.address.number = !number ? "To pole jest wymagane" : false;
                        newErrors.address.zipCode = !zipCode ? "To pole jest wymagane" : false;
                        newErrors.address.placePost = !placePost ? "To pole jest wymagane" : false;
                    } else {
                        newErrors.address = { city: false, number: false, zipCode: false, placePost: false, street: false, numberBox: false };
                    }
                }
                break;
        }

        setErrors(newErrors);
    };

    const checkEmailAvailability = async (email) => {
        try {
            const response = await checkEmail(email);
            return response.data.exists;
        } catch (error) {
            console.error('Error checking email:', error);
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const hasErrors = Object.values(errors).some(error => {
            if (typeof error === "object") {
                return Object.values(error).some(err => err);
            }
            return error;
        });

        if (hasErrors) {
            console.error("Błąd w formularzu. Sprawdź pola.");
            return;
        }

        try {
            if (infoUser && formData.role !== infoUser.user.__t) {
                console.log(`Zmiana roli użytkownika ${idEditUser} na: ${formData.role}`);
                await changeRole(formData.role, idEditUser);
            }
            if (formData.phoneNumber) {
                if (
                    !infoUser?.user?.phoneNumber ||
                    formData.phoneNumber.country !== infoUser.user.phoneNumber?.country ||
                    formData.phoneNumber.number !== infoUser.user.phoneNumber?.number
                ) {
                    console.log(`Zmiana numeru telefonu użytkownika ${idEditUser} na ${formData.phoneNumber.number}`);

                    await updatePhoneNumber(idEditUser,
                        formData.phoneNumber.country,
                        formData.phoneNumber.number
                    );
                }
            }
            const updatedData = { ...formData };

            if (infoUser && formData.role === infoUser.user.__t) {
                delete updatedData.role;
            }
            delete updatedData.phoneNumber;

            console.log("Dane wysyłane do API:", updatedData);
            await updateUser(idEditUser, updatedData);
            console.log("Zaktualizowano użytkownika:", updatedData);

            setViewsEditUser(false);

            if (typeof refreshEmployees === "function") {
                refreshEmployees();
            }
        } catch (error) {
            console.error("Błąd podczas aktualizacji użytkownika:", error);
        }
    };

    return (
        <Container viewsWindowsTwo={true}>
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
                        <span className={styles.emailCheck}>{placeholderEmail}</span>
                    </label>
                    <label> Kod kraju
                        <select
                            name="phoneNumber.country"
                            value={formData.phoneNumber.country}
                            onChange={handleChange}
                        >
                            <option value="">Wybierz</option>
                            <option value="pl">Polska</option>
                            <option value="en">Anglia</option>
                            <option value="de">Niemcy</option>
                            <option value="fr">Francja</option>
                            <option value="uk">Ukraina</option>
                            <option value="ro">Rumunia</option>
                            <option value="nl">Holandia</option>
                            <option value="be">Belgia</option>
                            <option value="ar">Arabia Saudyjska</option>
                        </select>
                    </label>

                    <label> Numer Telefonu
                        <MyInput
                            error={errors.phoneNumber}
                            optionTwo={true}
                            placeholder="123456789"
                            name="phoneNumber.number"
                            value={formData.phoneNumber.number}
                            onChange={handleChange}
                            type="text"
                        />
                    </label>
                    <label> Stawka/h
                        <MyInput
                            optionTwo={true}
                            placeholder="100"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            error={errors.price}
                            type="text"
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
                            <option value="Boss">Zarządca</option>
                            <option value="team_manager">Menager</option>
                            <option value="Employee">Pracownik</option>
                        </select>
                    </label>
                </div>
                <div className={styles.addressContent}>
                    <label> Miasto
                        <MyInput
                            error={errors.address?.city}
                            optionTwo={true}
                            placeholder="Warszawa"
                            name="address.city"
                            value={formData.address.city}
                            onChange={handleChange}
                            type="text"
                        />
                    </label>
                    <div className={styles.dataAddressContent}>
                        <label> Ulica
                            <MyInput
                                optionTwo={true}
                                placeholder="Słoneczna"
                                error={errors.street}
                                name="address.street"
                                value={formData.address.street}
                                type="text"
                                onChange={handleChange}
                            />
                        </label>
                        <label> Numer
                            <MyInput
                                error={errors.address?.number}
                                optionTwo={true}
                                placeholder="12"
                                name="address.number"
                                value={formData.address.number}
                                onChange={handleChange}
                                type="text"
                            />
                        </label>
                        <label> Numer Skrzynki
                            <MyInput
                                optionTwo={true}
                                placeholder="12a"
                                error={errors.numberBox}
                                name="address.numberBox"
                                value={formData.address.numberBox}
                                type="text"
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                    <div className={styles.dataZipCodeContent}>
                        <label> Kod pocztowy
                            <MyInput
                                error={errors.address?.zipCode}
                                optionTwo={true}
                                placeholder="00-000"
                                name="address.zipCode"
                                value={formData.address.zipCode}
                                onChange={handleChange}
                                type="text"
                            />
                        </label>
                        <label> Poczta
                            <MyInput
                                optionTwo={true}
                                placeholder="Warszawa"
                                error={errors.address?.placePost}
                                name="address.placePost"
                                value={formData.address.placePost}
                                type="text"
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                    <MyButton btnTable={true} onClick={clearAddress}> <MdOutlineDelete className={styles.iconForm} /> Wyczysć addres</MyButton>
                </div>
                <div className={styles.buttonStylesForm}>
                    <MyButton btnTable={true} onClick={() => setViewsEditUser(false)}>
                        <IoMdCloseCircleOutline className={styles.iconForm} /> Anuluj
                    </MyButton>
                    <MyButton btnTable={true} type="submit">
                        <FiSave className={styles.iconForm} /> Zapisz
                    </MyButton>
                </div>
            </form>
        </Container>
    );
};
export default EditUser;
