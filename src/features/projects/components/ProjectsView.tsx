"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { toast } from "sonner";
import { projectsService } from "../services/projects.service";
import { ValidationError } from "@/lib/validators";
import { Project } from "../types/project";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { ProjectDropdownMenu } from "./ProjectDropdownMenu";

export function ProjectsView() {
  const [user, setUser] = useState<User | null>(null);
  const [nombreProyecto, setNombreProyecto] = useState("");
  
  const [proyectos, setProyectos] = useState<Project[]>([]);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Initial fetch
  useEffect(() => {
    if (!user) return;
    
    const loadInitialProjects = async () => {
      setIsLoading(true);
      try {
        const { data, lastVisible, hasMore } = await projectsService.getProjectsPage(user.uid);
        setProyectos(data);
        setLastDoc(lastVisible);
        setHasMore(hasMore);
      } catch (error) {
        toast.error("Error al cargar los proyectos");
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialProjects();
  }, [user]);

  const fetchMoreProjects = async () => {
    if (!user || !hasMore || isFetchingMore) return;
    
    setIsFetchingMore(true);
    try {
      const { data, lastVisible, hasMore: newHasMore } = await projectsService.getProjectsPage(user.uid, lastDoc);
      setProyectos(prev => [...prev, ...data]);
      setLastDoc(lastVisible);
      setHasMore(newHasMore);
    } catch (error) {
      toast.error("Error al cargar más proyectos");
    } finally {
      setIsFetchingMore(false);
    }
  };

  const crearProyecto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreProyecto.trim() || !user) return;

    const nombreOptimista = nombreProyecto.trim();

    try {
      const newProjectId = await projectsService.createProject(nombreOptimista, user.uid);
      
      // Optimistic Update
      const newProject: Project = {
        id: newProjectId,
        name: nombreOptimista,
        userId: user.uid,
        createdAt: new Date().toISOString(),
      };
      
      setProyectos(prev => [newProject, ...prev]);
      toast.success(`Proyecto "${nombreOptimista}" creado correctamente`);
      setNombreProyecto("");
    } catch (error) {
      const message = error instanceof ValidationError ? error.message : "Error al crear proyecto";
      toast.error(message);
    }
  };

  const handleProjectDeleted = (id: string) => {
    setProyectos(prev => prev.filter(p => p.id !== id));
  };

  const handleProjectUpdated = (id: string, newName: string) => {
    setProyectos(prev => prev.map(p => p.id === id ? { ...p, name: newName } : p));
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

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-stone-400" />
        </div>
      ) : proyectos.length === 0 ? (
        <div className="p-12 border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-2xl text-center text-stone-400 dark:text-stone-500">
          No hay proyectos aún. Escribe un nombre arriba para crear el primero.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {proyectos.map((proyecto) => (
              <div
                key={proyecto.id}
                className="relative group p-6 bg-white dark:bg-stone-900/60 ring-1 ring-stone-200/80 dark:ring-stone-800/60 rounded-2xl hover:ring-amber-300 dark:hover:ring-amber-600/40 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-stone-900/5 dark:hover:shadow-black/20"
              >
                <Link
                  href={`/proyectos/${proyecto.id}`}
                  className="block"
                >
                  <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors pr-8">
                    {proyecto.name}
                  </h3>
                  <p className="text-sm text-stone-400 dark:text-stone-500 mt-2 font-mono">
                    {new Date(proyecto.createdAt).toLocaleDateString()}
                  </p>
                </Link>
                <div className="absolute top-4 right-4">
                  <ProjectDropdownMenu
                    projectId={proyecto.id}
                    projectName={proyecto.name}
                    onDeleted={handleProjectDeleted}
                    onUpdated={handleProjectUpdated}
                  />
                </div>
              </div>
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-6">
              <Button
                variant="outline"
                onClick={fetchMoreProjects}
                disabled={isFetchingMore}
                className="cursor-pointer border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/50"
              >
                {isFetchingMore ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Cargando...
                  </>
                ) : (
                  "Cargar más"
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}