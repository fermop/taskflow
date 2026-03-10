"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { toast } from "sonner";
import { projectsService, Project } from "../services/projects.service";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function ProjectsView() {
  const [user, setUser] = useState<User | null>(null);
  const [nombreProyecto, setNombreProyecto] = useState("");
  const [proyectos, setProyectos] = useState<Project[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        cargarProyectos(currentUser.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const cargarProyectos = async (userId: string) => {
    try {
      const proyectosObtenidos = await projectsService.getProjectsByUserId(userId);
      setProyectos(proyectosObtenidos);
    } catch (error) {
      console.error("Error al cargar proyectos:", error);
    }
  };

  const crearProyecto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreProyecto.trim() || !user) return;

    try {
      await projectsService.createProject(nombreProyecto, user.uid);
      setNombreProyecto("");
      cargarProyectos(user.uid);
      toast.success(`Proyecto "${nombreProyecto}" creado correctamente`);
    } catch (error) {
      console.error("Error al crear proyecto:", error);
      toast.error("Error al crear proyecto");
    }
  };

  if (!user) return <div className="p-8 text-center text-stone-500">Por favor, inicia sesión primero.</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-stone-800 dark:text-stone-50 tracking-tight">Mis Proyectos</h1>

      <form onSubmit={crearProyecto} className="mb-8 flex flex-col sm:flex-row gap-3">
        <Input
          type="text"
          value={nombreProyecto}
          onChange={(e) => setNombreProyecto(e.target.value)}
          placeholder="Ej. Tareas de la Universidad..."
          className="flex-1"
        />
        <Button
          type="submit"
          disabled={!nombreProyecto.trim()}
          className="cursor-pointer bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-stone-900 shadow-sm disabled:opacity-50"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Crear Proyecto
        </Button>
      </form>

      {proyectos.length === 0 ? (
        <div className="p-12 border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-2xl text-center text-stone-400 dark:text-stone-500">
          No hay proyectos aún. Escribe un nombre arriba para crear el primero.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {proyectos.map((proyecto) => (
            <Link
              href={`/proyectos/${proyecto.id}`}
              key={proyecto.id}
              className="group block p-6 bg-white dark:bg-stone-900/60 ring-1 ring-stone-200/80 dark:ring-stone-800/60 rounded-2xl hover:ring-amber-300 dark:hover:ring-amber-600/40 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-stone-900/5 dark:hover:shadow-black/20"
            >
              <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                {proyecto.name}
              </h3>
              <p className="text-sm text-stone-400 dark:text-stone-500 mt-2 font-mono">
                {new Date(proyecto.createdAt).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}