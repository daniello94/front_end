import React from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import styles from "./CountrySelect.module.scss";
import { useTranslation } from 'react-i18next';

const CountrySelect = ({ onSelect, hasError, value }) => {
    const animatedComponents = makeAnimated();
    const { t: tAccount } = useTranslation('account');
    const { t: tCountry } = useTranslation('country');
    const countryOptions = [
        { value: 'be', label: tCountry("be"), icon: '/media/img/menu/Belgium.jpg', dialCode: '+32' },
        { value: 'pl', label: tCountry("pl"), icon: '/media/img/menu/Poland.jpg', dialCode: '+48' },
        { value: 'nl', label: tCountry("nl"), icon: '/media/img/menu/Nederlanden.jpg', dialCode: '+31' },
        { value: 'de', label: tCountry("de"), icon: '/media/img/menu/Germany.jpg', dialCode: '+49' },
        { value: 'en', label: tCountry("en"), icon: '/media/img/menu/England.jpg', dialCode: '+44' },
        { value: 'fr', label: tCountry("fr"), icon: '/media/img/menu/France.jpg', dialCode: '+33' },
        { value: 'uk', label: tCountry("uk"), icon: '/media/img/menu/th.jpg', dialCode: '+380' },
        { value: 'ar', label: tCountry("ar"), icon: '/media/img/menu/ar.jpg', dialCode: '+966' },
        { value: 'ro', label: tCountry("ro"), icon: '/media/img/menu/pobrane.jpg', dialCode: '+40' }, 
    ];

    const formatOptionLabel = ({ label, icon, dialCode }) => (
        <div className={styles.selectFormation}>
            <img src={icon} className={styles.imgStylesCountrySelect} alt={`${label} flag`} />
            <span className={styles.spanStyle}>{label}({dialCode})</span>
        </div>
    );


    return (
        <Select
            className={hasError ? styles.selectErrorStyle : styles.selectStyle}
            components={animatedComponents}
            options={countryOptions}
            onChange={(option) => onSelect(option ? option.value : "")}
            formatOptionLabel={formatOptionLabel}
            placeholder={tAccount('form.country')}
            isClearable
            value={countryOptions.find(option => option.value === value) || null}
        />
    );
};

export default CountrySelect;
