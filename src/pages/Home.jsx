import React from 'react';
import { useTranslation } from 'react-i18next';
const Home = () => {
    const {t}=useTranslation("menu")
    return (
        <div className='container'>
            <h1>{t('item')}</h1>
            <p>{t('home.content')}</p>
            <p>test</p>
        </div>
    );
};

export default Home;
