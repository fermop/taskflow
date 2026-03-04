"use client";

import { Home, FolderKanban, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { toast } from "sonner";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "./ThemeToggle"; // <-- 1. Importar el componente

const menuItems = [
  { title: "Inicio", url: "/", icon: Home },
  { title: "Mis Proyectos", url: "/proyectos", icon: FolderKanban },
];

export function AppSidebar() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Has cerrado sesión correctamente");
      router.push("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      toast.error("Hubo un problema al cerrar sesión");
    }
  };

  return (
    // Conservamos tu propiedad collapsible="icon" que funciona perfecto
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Gestor de Tareas</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <SidebarMenu>
          {/* 2. Insertamos el Toggle de Tema aquí */}
          <ThemeToggle />
          
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer">
              <LogOut size={18} />
              <span>Cerrar Sesión</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}