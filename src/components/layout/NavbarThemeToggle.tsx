"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export function NavbarThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 text-stone-500 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800/60"
      aria-label="Cambiar tema"
    >
      <Sun className="w-4 h-4 hidden dark:block" />
      <Moon className="w-4 h-4 block dark:hidden" />
    </button>
  );
}
