import React, { createContext, useContext, useState } from 'react';
import { vi } from '../i18n/vi';
import { zh } from '../i18n/zh';

export type Lang = 'vi' | 'zh';
type Translations = typeof vi;

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

const dictionaries: Record<Lang, Translations> = { vi, zh };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    return (localStorage.getItem('lang') as Lang) || 'vi';
  });

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem('lang', newLang);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let val: any = dictionaries[lang];
    for (const k of keys) {
      if (val === undefined || val === null) return key;
      val = val[k];
    }
    return typeof val === 'string' ? val : key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
