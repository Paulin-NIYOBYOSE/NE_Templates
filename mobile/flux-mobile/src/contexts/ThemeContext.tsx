import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useColorScheme } from "react-native";
import { LightTheme, DarkTheme, AppTheme } from "../config/theme";
import { saveThemePreference, getThemePreference } from "../utils/storage";

type ThemeMode = "light" | "dark";

interface ThemeState {
  theme: AppTheme;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeState>({} as ThemeState);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>(systemScheme === "dark" ? "dark" : "light");

  useEffect(() => {
    (async () => {
      const stored = await getThemePreference();
      if (stored) setMode(stored);
    })();
  }, []);

  const toggleTheme = useCallback(() => {
    setMode((prev) => {
      const next: ThemeMode = prev === "light" ? "dark" : "light";
      saveThemePreference(next);
      return next;
    });
  }, []);

  const theme = mode === "dark" ? DarkTheme : LightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDark: mode === "dark", toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useAppTheme must be used within ThemeProvider");
  return ctx;
};
