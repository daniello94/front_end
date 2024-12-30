import React, { useState } from "react";
import Container from "../../components/container/Container";
import MyInput from "../../components/input/MyInput";
import { checkEmail, newAccount } from "../../../api";
import CountrySelect from "../../components/CountrySelect/CountrySelect";
import styles from "./Account.module.scss";
import MyButton from "../../components/button/MyButton";
import { useTranslation } from 'react-i18next';
const Account = () => {
    const { t } = useTranslation("account")
    const [statusRegistration, setStatusRegistration] = useState("");
    const [statusCheckEmail, setStatusCheckEmail] = useState("");
    const [formData, setFormData] = useState({
        userName: '',
        userLastName: '',
        email: '',
        country: "",
        phoneNumber: '',
        password: '',
        reqPassword: ''
    });

    const [errors, setErrors] = useState({
        userName: false,
        userLastName: false,
        email: false,
        country: false,
        phoneNumber: false,
        password: false,
        reqPassword: false
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        validateInput(name, value);
    };
    const validateInput = (name, value) => {
        const newErrors = { ...errors };
        switch (name) {
            case 'userName':
            case 'userLastName':
                newErrors[name] = !value.trim();
                break;
            case 'email':
                newErrors[name] = !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value);
                break;
            case 'country':
                newErrors[name] = !value.trim();
                break;
            case 'phoneNumber':
                newErrors[name] = !/^\d+$/.test(value);
                break;
            case 'password':
                const passwordErrors = {
                    length: value.length < 6,
                    digit: !/\d/.test(value),
                    upper: !/[A-Z]/.test(value),
                    special: !/[@$!%*?&]/.test(value)
                };
                newErrors.password = Object.values(passwordErrors).some(isError => isError);
                break;
            case 'reqPassword':
                newErrors.reqPassword = formData.password !== value;
                break;
        }
        setErrors(newErrors);
    };

    const validateAll = () => {
        const newErrors = {
            userName: !formData.userName.trim(),
            userLastName: !formData.userLastName.trim(),
            email: !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email),
            country: !formData.userLastName.trim(),
            phoneNumber: !/^\d+$/.test(formData.phoneNumber),
            password: !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(formData.password),
            reqPassword: formData.password !== formData.reqPassword
        };
        setErrors(newErrors);
        return !Object.values(newErrors).some(Boolean);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email) {
            setStatusCheckEmail("")
        } else {
            const emailIsValid = await checkEmailAvailability(formData.email);
            if (emailIsValid) {
                setStatusCheckEmail(t('error.emailStatus'))
                console.error('Email is already in use');
                return;
            }
        }

        if (!validateAll()) {
            console.error('Validation failed');
            return;
        };

        try {
            const response = await newAccount(
                formData.userName,
                formData.userLastName,
                formData.country,
                formData.phoneNumber,
                formData.password,
                formData.email
            );
            setFormData({
                userName: '',
                userLastName: '',
                email: '',
                country: '',
                phoneNumber: '',
                password: '',
                reqPassword: ''
            });
            setErrors({
                userName: false,
                userLastName: false,
                email: false,
                phoneNumber: false,
                password: false,
                reqPassword: false
            });
            setStatusRegistration(t('error.success'))
            console.log('Account created successfully!', response);
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    const checkEmailAvailability = async (email) => {
        try {
            const response = await checkEmail(email);
            const isAvailable = response.data.exists;
            setErrors(prevErrors => ({ ...prevErrors, email: isAvailable }));
            console.log(isAvailable, 'test');

            return isAvailable;
        } catch (error) {
            console.error('Error checking email:', error);
            setErrors(prevErrors => ({ ...prevErrors, email: true }));
            return false;
        }
    };
    const handleSelectDialCode = (dialCode) => {
        setFormData({ ...formData, country: dialCode });
    };

    return (
        <Container containerPages={true}>
            <form className={styles.myFormRegister} onSubmit={handleSubmit}>
                <h1>{t('h1')}</h1>
                <span className={styles.createdAccount}>{statusRegistration}</span>
                {(errors.userName || errors.userLastName || errors.email || errors.phoneNumber || errors.password || errors.reqPassword) && (
                    <span className={styles.infoErrorContent}>

                        <p>{t("error.data")}
                            {errors.userName && (
                                <span>{t("error.name")}</span>
                            )}
                            {errors.userLastName && (
                                <span>{t("error.lastName")} </span>
                            )}
                            {errors.email && (
                                <span>{t("error.email")} {statusCheckEmail}</span>
                            )}
                            {errors.country && (
                                <span> {t("error.country")}</span>
                            )}
                            {errors.phoneNumber && (
                                <span> {t("error.phoneNumber")} </span>
                            )}
                            {errors.password && (
                                <span>{t("error.password")}
                                    {formData.password.length < 6 && <span>{t("error.passwordLength")}</span>}
                                    {!/\d/.test(formData.password) && <span> {t("error.passwordDigit")}</span>}
                                    {!/[A-Z]/.test(formData.password) && <span>{t("error.passwordCapitalLetter")}</span>}
                                    {!/[@$!%*?&]/.test(formData.password) && <span> {t("error.passwordCapitalLetterSpecial")} </span>}
                                </span>
                            )}
                            {errors.reqPassword && (
                                <span> {t('error.reqPassword')}</span>
                            )}
                        </p>

                    </span>
                )}
                <MyInput name="userName" placeholder={t('form.name')} type="text" value={formData.userName} error={errors.userName} onChange={handleChange} />
                <MyInput name="userLastName" placeholder={t('form.lastName')} type="text" value={formData.userLastName} error={errors.userLastName} onChange={handleChange} />
                <MyInput name="email" placeholder={t('form.email')} type="email" value={formData.email} error={errors.email} onChange={handleChange} />
                <CountrySelect onSelect={handleSelectDialCode} />
                <MyInput name="phoneNumber" placeholder={t('form.phoneNumber')} type="tel" value={formData.phoneNumber} error={errors.phoneNumber} onChange={handleChange} />
                <MyInput name="password" placeholder={t('form.password')} type="password" value={formData.password} error={errors.password} onChange={handleChange} />
                <MyInput name="reqPassword" placeholder={t('form.reqPassword')} type="password" value={formData.reqPassword} error={errors.reqPassword} onChange={handleChange} />
                <MyButton btnSubmit={true} type="submit" onClick={handleSubmit}>{t('btn')}</MyButton>
            </form>
        </Container>
    );
};

export default Account;
