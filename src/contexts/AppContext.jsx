import React, { createContext, useContext, useState, useEffect } from 'react';

const DarkModeContext = createContext();
const LanguageContext = createContext();
const OnlineContext = createContext();

export const useTheme = () => useContext(DarkModeContext);
export const useLang = () => useContext(LanguageContext);
export const useOnline = () => useContext(OnlineContext);

export function AppProviders({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('en');
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
      <LanguageContext.Provider value={{ language, setLanguage }}>
        <OnlineContext.Provider value={{ isOnline }}>
          {children}
        </OnlineContext.Provider>
      </LanguageContext.Provider>
    </DarkModeContext.Provider>
  );
}
