import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../langueSwitch/LanguageContext';
import Container from '../container/Container';

const LanguageSwitcher = (props) => {
  const { i18n } = useTranslation();
  const { changeLanguage } = useLanguage();

  const flags = {
    'pl': '/media/img/menu/Poland.jpg',
    'en': '/media/img/menu/England.jpg',
    'nl': '/media/img/menu/Nederlanden.jpg',
    'fr': '/media/img/menu/France.jpg',
    'de': '/media/img/menu/Germany.jpg',
    'uk': '/media/img/menu/th.jpg',
    'ro': '/media/img/menu/pobrane.jpg',
    'ar': '/media/img/menu/ar.jpg',
  };

  const handleChangeLanguage = (lng) => {
    props.active(false);
    changeLanguage(lng);
    i18n.changeLanguage(lng);
  };

  return (
    <Container containerLangue={true}>
      {Object.entries(flags).map(([lang, flagUrl]) => (
        <button key={lang} onClick={() => handleChangeLanguage(lang)} style={{marginBottom:'5px', border: 'none', cursor: 'pointer', backgroundColor: 'transparent', backgroundImage: `url(${flagUrl})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', width: '80px', height: '40px' }}>
          <span style={{ display: 'none' }}>{lang}</span>
        </button>
      ))
      }
    </Container >
  );
};

export default LanguageSwitcher;
