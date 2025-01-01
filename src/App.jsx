import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LanguageSwitcher from './components/langueSwitch/LanguageSwitcher';
import { LanguageProvider } from "./components/langueSwitch/LanguageContext";
import EmailVerification from './pages/emailVerification/EmailVerification';
import Account from './pages/account/Account';
import Menu from './components/menu/Menu';
import Login from './pages/login/Login';
import Contact from './pages/Contact';
import About from './pages/About';
import Home from './pages/Home';
import "./styles/main.scss";
import './i18n';
import { useUser } from "../src/contexts/UserContext";
import { checkSession } from '../api';

const App = () => {
  const { setUser } = useUser();
  const [isActiveSwitch, setActiveSwitch] = useState(false);
  const [activeLogin, setActiveLogin] = useState(false)

  useEffect(() => {
    const initializeSession = async () => {
        try {
            console.log('Wysyłam żądanie z opcjami:');
            const response = await checkSession();
            setUser(response.data.user);
            console.log('Sesja aktywna:', response.data.user);
        } catch (error) {
            console.error('Błąd sesji:', error.response?.data?.message || error.message);
            setUser(null);
        }
    };

    initializeSession();
}, [setUser]);

  useEffect(() => {
    const refreshSession = async () => {
        try {
            const response = await refreshToken();
            if (response.status === 200) {
                console.log('Sesja została odświeżona.');
            }
        } catch (error) {
            console.error('Błąd podczas odświeżania sesji:', error.response?.data?.message || error.message);
        }
    };

    const interval = setInterval(refreshSession, 15 * 60 * 1000); 
    return () => clearInterval(interval);
}, []);

  return (
    <Router>
      <LanguageProvider>
        <div>
          <Menu active={setActiveSwitch} setActiveLogin={setActiveLogin} />
          {isActiveSwitch && (
            <LanguageSwitcher active={setActiveSwitch} />
          )}
          {activeLogin && (
            <Login setActiveLogin={setActiveLogin} />
          )}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/newAccount" element={<Account />} />
            <Route path="/verify" element={<EmailVerification />} />
          </Routes>
        </div>
      </LanguageProvider>
    </Router>
  );
};

export default App;