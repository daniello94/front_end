import React from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import styles from "./CountrySelect.module.scss";
import { useTranslation } from 'react-i18next';

const animatedComponents = makeAnimated();

const countryOptions = [
    { value: 'pl', label: 'Polska', icon: '/media/img/menu/Poland.jpg', dialCode: '+48' },
    { value: 'nl', label: 'Holandia', icon: '/media/img/menu/Nederlanden.jpg', dialCode: '+32' },
    { value: 'de', label: 'Niemcy', icon: '/media/img/menu/Germany.jpg', dialCode: '+49' },
    { value: 'en', label: 'Anglia', icon: '/media/img/menu/England.jpg', dialCode: '+44' },
    { value: 'fr', label: 'Francja', icon: '/media/img/menu/France.jpg', dialCode: '+44' },
    { value: 'uk', label: 'Ukraina', icon: '/media/img/menu/th.jpg', dialCode: '+44' },
    { value: 'ar', label: 'Arbia', icon: '/media/img/menu/ar.jpg', dialCode: '+44' },
    { value: 'ro', label: 'Rumunia', icon: '/media/img/menu/pobrane.jpg', dialCode: '+44' },

];
const formatOptionLabel = ({ label, icon, dialCode }) => (
    <div className={styles.selectFormation}>
        <img src={icon} className={styles.imgStylesCountrySelect} alt={`${label} flag`} />
        <span className={styles.spanStyle}>{label}({dialCode})</span>
    </div>
);

const CountrySelect = ({ onSelect }) => {
    const {t}=useTranslation("account")
    return (
        <Select
        className={styles.selectStyle}
            components={animatedComponents}
            options={countryOptions}
            onChange={(option) => onSelect(option.value)}
            formatOptionLabel={formatOptionLabel}
            placeholder={t('form.country')}
            isClearable
        />
    );
};

export default CountrySelect;
