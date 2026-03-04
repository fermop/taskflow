"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [montado, setMontado] = useState(false);

  // Esperamos a que el componente se monte en el cliente para saber el tema actual
  useEffect(() => {
    setMontado(true);
  }, []);

  if (!montado) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton>
          {/* Un pequeño esqueleto mientras detecta el tema */}
          <div className="w-4 h-4 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
          <span>Cargando tema...</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors cursor-pointer"
      >
        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        <span>{theme === "dark" ? "Modo Claro" : "Modo Oscuro"}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}