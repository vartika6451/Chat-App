"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext(null);

const EMOTIONS = [
  "romantic", "funny", "angry", "sad", "excited",
  "calm", "motivational", "celebration", "friendly",
  "professional", "horror", "fantasy"
];

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");
  const [themeMode, setThemeModeState] = useState("auto"); // "auto" | "manual" | "disabled"
  const [activeEmotion, setActiveEmotion] = useState("friendly");
  const [lockedTheme, setLockedThemeState] = useState("friendly");

  // Load initial settings from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("blink_theme");
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const initialTheme = savedTheme || systemTheme;
    setTheme(initialTheme);

    const savedMode = localStorage.getItem("blink_theme_mode") || "auto";
    setThemeModeState(savedMode);

    const savedLocked = localStorage.getItem("blink_locked_theme") || "friendly";
    setLockedThemeState(savedLocked);
  }, []);

  // Update DOM classes whenever theme variables change
  useEffect(() => {
    const root = document.documentElement;

    // 1. Remove all old theme emotion classes
    EMOTIONS.forEach((emo) => {
      root.classList.remove(`theme-${emo}`);
    });

    // 2. Determine target theme class to apply
    let targetEmotion = "none";
    if (themeMode === "manual") {
      targetEmotion = lockedTheme;
    } else if (themeMode === "auto") {
      targetEmotion = activeEmotion;
    }

    if (targetEmotion !== "none" && EMOTIONS.includes(targetEmotion)) {
      root.classList.add(`theme-${targetEmotion}`);
    }

    // 3. Sync dark class
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme, themeMode, activeEmotion, lockedTheme]);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("blink_theme", nextTheme);
  };

  const setThemeMode = (mode) => {
    if (["auto", "manual", "disabled"].includes(mode)) {
      setThemeModeState(mode);
      localStorage.setItem("blink_theme_mode", mode);
    }
  };

  const lockTheme = (themeName) => {
    if (EMOTIONS.includes(themeName)) {
      setLockedThemeState(themeName);
      localStorage.setItem("blink_locked_theme", themeName);
      setThemeMode("manual");
    }
  };

  const updateEmotion = (emotion, confidence = 1.0) => {
    const CONFIDENCE_THRESHOLD = 0.60;
    if (EMOTIONS.includes(emotion) && confidence >= CONFIDENCE_THRESHOLD) {
      setActiveEmotion(emotion);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark: theme === "dark",
        toggleTheme,
        setTheme,
        themeMode,
        setThemeMode,
        activeEmotion,
        setActiveEmotion,
        lockedTheme,
        lockTheme,
        updateEmotion
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

