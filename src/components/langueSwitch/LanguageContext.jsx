import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem('i18nextLng') || 'en');

  useEffect(() => {
    const handleLanguageChange = () => {
      setLanguage(localStorage.getItem('i18nextLng') || 'en');
    };

    window.addEventListener('languagechange', handleLanguageChange);
    return () => {
      window.removeEventListener('languagechange', handleLanguageChange);
    };
  }, []);

  const changeLanguage = (lng) => {
    localStorage.setItem('i18nextLng', lng);
    window.dispatchEvent(new Event('languagechange'));
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
