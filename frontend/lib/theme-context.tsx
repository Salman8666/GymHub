'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'athletic-minimal' | 'elite-performance' | 'obsidian-cyber';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  userRole: 'member' | 'trainer' | 'admin';
  setUserRole: (role: 'member' | 'trainer' | 'admin') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function applyThemeToDocument(theme: ThemeMode) {
  const root = document.documentElement;
  root.classList.remove('theme-athletic', 'theme-elite', 'theme-obsidian', 'dark');

  if (theme === 'athletic-minimal') {
    root.classList.add('theme-athletic');
  } else if (theme === 'elite-performance') {
    root.classList.add('theme-elite', 'dark');
  } else if (theme === 'obsidian-cyber') {
    root.classList.add('theme-obsidian', 'dark');
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>('athletic-minimal');
  const [userRole, setUserRole] = useState<'member' | 'trainer' | 'admin'>('member');

  useEffect(() => {
    const savedTheme = localStorage.getItem('gymhub-theme') as ThemeMode;
    if (savedTheme && ['athletic-minimal', 'elite-performance', 'obsidian-cyber'].includes(savedTheme)) {
      setThemeState(savedTheme);
      applyThemeToDocument(savedTheme);
    } else {
      applyThemeToDocument('athletic-minimal');
    }
  }, []);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem('gymhub-theme', newTheme);
    applyThemeToDocument(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, userRole, setUserRole }}>
      <div className={`app-container theme-${theme}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
