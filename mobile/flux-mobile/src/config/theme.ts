import { MD3LightTheme, MD3DarkTheme } from "react-native-paper";

const brandColors = {
  primary: "#6366F1",     // Indigo‑500
  secondary: "#8B5CF6",   // Violet‑500
  accent: "#F59E0B",      // Amber‑500
  success: "#10B981",     // Emerald‑500
  danger: "#EF4444",      // Red‑500
  warning: "#F59E0B",     // Amber‑500
  info: "#3B82F6",        // Blue‑500
};

export const LightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: brandColors.primary,
    secondary: brandColors.secondary,
    error: brandColors.danger,
    background: "#F8FAFC",
    surface: "#FFFFFF",
    surfaceVariant: "#F1F5F9",
    onBackground: "#0F172A",
    onSurface: "#1E293B",
    onSurfaceVariant: "#64748B",
    outline: "#CBD5E1",
    elevation: {
      ...MD3LightTheme.colors.elevation,
      level0: "#FFFFFF",
      level1: "#F8FAFC",
      level2: "#F1F5F9",
    },
  },
  custom: brandColors,
};

export const DarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: brandColors.primary,
    secondary: brandColors.secondary,
    error: brandColors.danger,
    background: "#0F172A",
    surface: "#1E293B",
    surfaceVariant: "#334155",
    onBackground: "#F8FAFC",
    onSurface: "#E2E8F0",
    onSurfaceVariant: "#94A3B8",
    outline: "#475569",
    elevation: {
      ...MD3DarkTheme.colors.elevation,
      level0: "#0F172A",
      level1: "#1E293B",
      level2: "#334155",
    },
  },
  custom: brandColors,
};

export type AppTheme = typeof LightTheme;
