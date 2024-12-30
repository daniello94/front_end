import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LanguageSwitcher from './components/langueSwitch/LanguageSwitcher';
import { LanguageProvider } from "./components/langueSwitch/LanguageContext";
import Account from './pages/account/Account';
import Menu from './components/menu/Menu';
import Contact from './pages/Contact';
import About from './pages/About';
import Home from './pages/Home';
import "./styles/main.scss";
import './i18n';

const App = () => {
  const [isActiveSwitch, setActiveSwitch] = useState(false);
  return (
    <Router>
      <LanguageProvider>
        <div>
          <Menu active={setActiveSwitch} />
          {isActiveSwitch && (
            <LanguageSwitcher active={setActiveSwitch} />
          )}

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/newAccount" element={<Account />} />
          </Routes>
        </div>
      </LanguageProvider>
    </Router>
  );
};

export default App;