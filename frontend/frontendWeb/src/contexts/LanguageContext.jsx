import { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageContext = createContext();

export const useLanguageSettings = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguageSettings must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();
  
  // Display language (interface) - can be en, fr, ar, tzm
  const [displayLanguage, setDisplayLanguage] = useState('en');
  
  // Learning language (target) - can only be en or fr
  const [learningLanguage, setLearningLanguage] = useState('en');

  // Available display languages (interface languages)
  const displayLanguages = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇲🇦' },
    { code: 'tzm', name: 'Tamazight', nativeName: 'ⵜⴰⵎⴰⵣⵉⵖⵜ', flag: '🏔️' }
  ];

  // Available learning languages (target languages for exercises)
  const learningLanguages = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' }
  ];

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedDisplayLanguage = localStorage.getItem('displayLanguage') || 'en';
    const savedLearningLanguage = localStorage.getItem('learningLanguage') || 'en';

    setDisplayLanguage(savedDisplayLanguage);
    setLearningLanguage(savedLearningLanguage);

    // Apply display language to i18n
    i18n.changeLanguage(savedDisplayLanguage);

    // Update document direction for RTL languages
    document.documentElement.dir = savedDisplayLanguage === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = savedDisplayLanguage;
  }, [i18n]);

  const changeDisplayLanguage = (langCode) => {
    setDisplayLanguage(langCode);
    localStorage.setItem('displayLanguage', langCode);
    
    // Apply to i18n
    i18n.changeLanguage(langCode);
    
    // Update document direction for RTL languages
    document.documentElement.dir = langCode === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = langCode;
  };

  const changeLearningLanguage = (langCode) => {
    // Only allow English or French for learning
    if (langCode === 'en' || langCode === 'fr') {
      setLearningLanguage(langCode);
      localStorage.setItem('learningLanguage', langCode);
    }
  };

  const getCurrentDisplayLanguage = () => {
    return displayLanguages.find(lang => lang.code === displayLanguage) || displayLanguages[0];
  };

  const getCurrentLearningLanguage = () => {
    return learningLanguages.find(lang => lang.code === learningLanguage) || learningLanguages[0];
  };

  const value = {
    // Current settings
    displayLanguage,
    learningLanguage,
    
    // Available options
    displayLanguages,
    learningLanguages,
    
    // Actions
    changeDisplayLanguage,
    changeLearningLanguage,
    
    // Utilities
    getCurrentDisplayLanguage,
    getCurrentLearningLanguage,
    
    // Computed properties
    isRTL: displayLanguage === 'ar'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
