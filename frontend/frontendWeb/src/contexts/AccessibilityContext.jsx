import { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext();

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

export const AccessibilityProvider = ({ children }) => {
  const [dyslexiaFont, setDyslexiaFont] = useState(false);
  const [readingSpeed, setReadingSpeed] = useState('normal');
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState('normal');

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedDyslexiaFont = localStorage.getItem('dyslexiaFont') === 'true';
    const savedReadingSpeed = localStorage.getItem('readingSpeed') || 'normal';
    const savedHighContrast = localStorage.getItem('highContrast') === 'true';
    const savedFontSize = localStorage.getItem('fontSize') || 'normal';
    
    setDyslexiaFont(savedDyslexiaFont);
    setReadingSpeed(savedReadingSpeed);
    setHighContrast(savedHighContrast);
    setFontSize(savedFontSize);
    
    // Apply settings immediately
    applyAccessibilitySettings(savedDyslexiaFont, savedHighContrast, savedReadingSpeed, savedFontSize);
  }, []);

  const applyAccessibilitySettings = (dyslexia, contrast, speed, size) => {
    const root = document.documentElement;
    const body = document.body;
    
    // Apply dyslexia font
    if (dyslexia) {
      body.classList.add('dyslexia-font');
    } else {
      body.classList.remove('dyslexia-font');
    }
    
    // Apply high contrast
    if (contrast) {
      body.classList.add('high-contrast');
    } else {
      body.classList.remove('high-contrast');
    }
    
    // Apply reading speed
    body.classList.remove('reading-speed-slow', 'reading-speed-normal', 'reading-speed-fast');
    body.classList.add(`reading-speed-${speed}`);
    
    // Apply font size
    const fontSizeMap = {
      small: '14px',
      normal: '16px',
      large: '18px',
      xlarge: '20px'
    };
    root.style.fontSize = fontSizeMap[size] || fontSizeMap.normal;
  };

  const toggleDyslexiaFont = () => {
    const newValue = !dyslexiaFont;
    setDyslexiaFont(newValue);
    localStorage.setItem('dyslexiaFont', newValue.toString());
    applyAccessibilitySettings(newValue, highContrast, readingSpeed, fontSize);
  };

  const changeReadingSpeed = (speed) => {
    setReadingSpeed(speed);
    localStorage.setItem('readingSpeed', speed);
    applyAccessibilitySettings(dyslexiaFont, highContrast, speed, fontSize);
  };

  const toggleHighContrast = () => {
    const newValue = !highContrast;
    setHighContrast(newValue);
    localStorage.setItem('highContrast', newValue.toString());
    applyAccessibilitySettings(dyslexiaFont, newValue, readingSpeed, fontSize);
  };

  const changeFontSize = (size) => {
    setFontSize(size);
    localStorage.setItem('fontSize', size);
    applyAccessibilitySettings(dyslexiaFont, highContrast, readingSpeed, size);
  };

  const resetToDefaults = () => {
    setDyslexiaFont(false);
    setReadingSpeed('normal');
    setHighContrast(false);
    setFontSize('normal');
    
    localStorage.removeItem('dyslexiaFont');
    localStorage.removeItem('readingSpeed');
    localStorage.removeItem('highContrast');
    localStorage.removeItem('fontSize');
    
    applyAccessibilitySettings(false, false, 'normal', 'normal');
  };

  const value = {
    // Settings
    dyslexiaFont,
    readingSpeed,
    highContrast,
    fontSize,
    
    // Actions
    toggleDyslexiaFont,
    changeReadingSpeed,
    toggleHighContrast,
    changeFontSize,
    resetToDefaults,
    
    // Utility
    applyAccessibilitySettings
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export default AccessibilityContext;
