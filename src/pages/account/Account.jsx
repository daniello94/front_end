import React, { useState } from "react";
import CountrySelect from "../../components/CountrySelect/CountrySelect";
import Container from "../../components/container/Container";
import MyButton from "../../components/button/MyButton";
import { checkEmail, newAccount } from "../../../api";
import MyInput from "../../components/input/MyInput";
import { useTranslation } from 'react-i18next';
import styles from "./Account.module.scss";
import { Link } from 'react-router-dom';

const Account = () => {
    const { t } = useTranslation("account")
    const [statusRegistration, setStatusRegistration] = useState("");
    const [statusCheckEmail, setStatusCheckEmail] = useState("");
    const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
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

    const handleCheckboxChange = (e) => {
        setIsCheckboxChecked(e.target.checked);
    };

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
                newErrors[name] = !value.trim()
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
            country: !formData.country.trim(),
            phoneNumber: !/^\d+$/.test(formData.phoneNumber),
            password: !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(formData.password),
            reqPassword: formData.password !== formData.reqPassword
        };
        setErrors(newErrors);
        return !Object.values(newErrors).some(Boolean);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateAll()) {
            console.error('Validation failed');
            return;
        }

        const emailIsValid = await checkEmailAvailability(formData.email);
        if (emailIsValid) {
            setErrors(prevErrors => ({ ...prevErrors, email: true }));
            setStatusCheckEmail(t('error.emailStatus'));
            console.error('Email is already in use');
            return;
        }

        if (!isCheckboxChecked) {
            console.error('You must accept the terms and conditions.');
            setStatusRegistration(<span className={styles.spanContentForm}>{t('error.checkbox')}</span>);
            return;
        }

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
                reqPassword: '',
            });
            setErrors({
                userName: false,
                userLastName: false,
                email: false,
                phoneNumber: false,
                password: false,
                reqPassword: false,
            });
            setStatusRegistration(t('error.success'));
            console.log('Account created successfully!', response);
        } catch (error) {
            console.error('Error creating user:', error);
        }
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


    const handleSelectDialCode = (dialCode) => {
        setFormData(prevFormData => {
            const updatedFormData = { ...prevFormData, country: dialCode };
            validateInput('country', updatedFormData.country, dialCode);
            return updatedFormData;
        })
    };

    return (
        <Container containerPages={true}>
            <form className={styles.myFormRegister} onSubmit={handleSubmit}>
                <h1>{t('h1')}</h1>
                <span className={styles.createdAccount}>{statusRegistration}</span>

                <label className={styles.labelForm}>{t('form.label.name')}</label>
                <MyInput name="userName" placeholder={t('form.name')} type="text" value={formData.userName} error={errors.userName} onChange={handleChange} />
                {errors.userName && (
                    <span className={styles.spanContentForm}>{t("error.name")}</span>
                )}
                <label className={styles.labelForm}>{t('form.label.lastName')}</label>
                <MyInput name="userLastName" placeholder={t('form.lastName')} type="text" value={formData.userLastName} error={errors.userLastName} onChange={handleChange} />
                {errors.userLastName && (
                    <span className={styles.spanContentForm}>{t("error.lastName")} </span>
                )}
                <label className={styles.labelForm}>{t('form.label.email')}</label>
                <MyInput name="email" placeholder={t('form.email')} type="email" value={formData.email} error={errors.email} onChange={handleChange} />
                {errors.email && (
                    <span className={styles.spanContentForm}>{t("error.email")} {statusCheckEmail}</span>
                )}
                <label className={styles.labelForm}>{t('form.label.country')}</label>
                <CountrySelect hasError={errors.country} onSelect={handleSelectDialCode} value={formData.country} />
                {errors.country && (
                    <span className={styles.spanContentForm}> {t("error.country")}</span>
                )}
                <label className={styles.labelForm}>{t('form.label.phoneNumber')}</label>
                <MyInput name="phoneNumber" placeholder={t('form.phoneNumber')} type="tel" value={formData.phoneNumber} error={errors.phoneNumber} onChange={handleChange} />
                {errors.phoneNumber && (
                    <span className={styles.spanContentForm}> {t("error.phoneNumber")} </span>
                )}
                <label className={styles.labelForm}>{t('form.label.password')}</label>
                <MyInput name="password" placeholder={t('form.password')} type="password" value={formData.password} error={errors.password} onChange={handleChange} />
                {errors.password && (
                    <span className={styles.spanContentForm}>{t("error.password")}
                        {formData.password.length < 6 && <span className={styles.spanContentForm}>{t("error.passwordLength")}</span>}
                        {!/\d/.test(formData.password) && <span className={styles.spanContentForm}> {t("error.passwordDigit")}</span>}
                        {!/[A-Z]/.test(formData.password) && <span className={styles.spanContentForm}>{t("error.passwordCapitalLetter")}</span>}
                        {!/[@$!%*?&]/.test(formData.password) && <span className={styles.spanContentForm}> {t("error.passwordCapitalLetterSpecial")} </span>}
                    </span>
                )}
                <label className={styles.labelForm}>{t('form.label.repPassword')}</label>
                <MyInput name="reqPassword" placeholder={t('form.reqPassword')} type="password" value={formData.reqPassword} error={errors.reqPassword} onChange={handleChange} />
                {errors.reqPassword && (
                    <span className={styles.spanContentForm}> {t('error.reqPassword')}</span>
                )}
                <label className={styles.acceptRules}>
                    <input type="checkbox" checked={isCheckboxChecked}
                        onChange={handleCheckboxChange} />
                    <span>{t('form.accept')} <Link to="/rules"> {t('form.rules')}</Link> {t('form.privateRules')}</span>
                </label>

                <MyButton btnSubmit={true} type="submit" onClick={handleSubmit}>{t('btn')}</MyButton>
            </form>
        </Container>
    );
};

export default Account;
