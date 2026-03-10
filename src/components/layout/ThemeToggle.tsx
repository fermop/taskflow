"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="cursor-pointer text-stone-600 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-400"
      >
        <Sun className="w-4 h-4 hidden dark:block" />
        <Moon className="w-4 h-4 block dark:hidden" />
        <span>{theme === "dark" ? "Modo claro" : "Modo oscuro"}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}