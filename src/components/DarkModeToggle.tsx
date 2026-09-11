import React, { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";

export type ThemeMode = "light" | "dark" | "system";

export default function DarkModeToggle() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme") as ThemeMode;
      return saved || "system";
    }
    return "system";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      let isDark = false;
      if (theme === "dark") {
        isDark = true;
      } else if (theme === "system") {
        isDark = mediaQuery.matches;
      }

      if (isDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    };

    applyTheme();
    localStorage.setItem("theme", theme);

    const listener = () => {
      if (theme === "system") {
        applyTheme();
      }
    };

    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, [theme]);

  return (
    <div
      id="theme-picker-group"
      className="flex items-center p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800"
    >
      <button
        id="theme-light-btn"
        onClick={() => setTheme("light")}
        className={`p-1.5 rounded-lg transition-all focus:outline-none ${
          theme === "light"
            ? "bg-white text-black shadow-sm"
            : "text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white"
        }`}
        title="Light Mode"
        aria-label="Set light theme"
      >
        <Sun className="w-4 h-4" />
      </button>
      <button
        id="theme-dark-btn"
        onClick={() => setTheme("dark")}
        className={`p-1.5 rounded-lg transition-all focus:outline-none ${
          theme === "dark"
            ? "bg-black text-white shadow-xs"
            : "text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white"
        }`}
        title="Dark Mode"
        aria-label="Set dark theme"
      >
        <Moon className="w-4 h-4" />
      </button>
      <button
        id="theme-system-btn"
        onClick={() => setTheme("system")}
        className={`p-1.5 rounded-lg transition-all focus:outline-none ${
          theme === "system"
            ? "bg-white dark:bg-zinc-800 text-black dark:text-white shadow-xs"
            : "text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white"
        }`}
        title="System Preference"
        aria-label="Set system theme"
      >
        <Monitor className="w-4 h-4" />
      </button>
    </div>
  );
}
