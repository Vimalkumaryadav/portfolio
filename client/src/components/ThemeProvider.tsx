import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  gradient: 'on' | 'off';
  setGradient: (mode: 'on' | 'off') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('portfolio-theme');
    return saved === 'dark' ? 'dark' : 'light';
  });
  const [gradient, setGradient] = useState<'on' | 'off'>(() => {
    const saved = localStorage.getItem('portfolio-gradient');
    return saved === 'on' ? 'on' : 'off';
  });

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-gradient', gradient);
    localStorage.setItem('portfolio-gradient', gradient);
  }, [gradient]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, gradient, setGradient }}>
      {children}
    </ThemeContext.Provider>
  );
};
