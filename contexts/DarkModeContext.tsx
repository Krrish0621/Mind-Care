"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface DarkModeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const DarkModeContext = createContext<DarkModeContextType | null>(null);

export const useDarkMode = (): DarkModeContextType => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error("useDarkMode must be used within a DarkModeProvider");
  }
  return context;
};

interface DarkModeProviderProps {
  children: React.ReactNode;
}

export const DarkModeProvider: React.FC<DarkModeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  // This useEffect will only run in the browser, not on the server.
  useEffect(() => {
    setMounted(true); // Now we know we are on the client.

    const savedTheme = localStorage.getItem("darkMode");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = savedTheme ? savedTheme === "true" : prefersDark;

    setIsDarkMode(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme);
  }, []); // The empty array ensures this runs only once on the client

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem("darkMode", String(next));
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  };

  // On the server, we provide a default (non-crashing) value.
  // Once mounted on the client, this will update with the real value.
  const value = mounted ? { isDarkMode, toggleDarkMode } : { isDarkMode: false, toggleDarkMode: () => {} };

  return (
    <DarkModeContext.Provider value={value}>
      {children}
    </DarkModeContext.Provider>
  );
};