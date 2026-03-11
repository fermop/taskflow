"use client";

import { use, useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { toast } from "sonner";
import { tasksService, Task } from "@/features/tasks/services/tasks.service";
import { TaskForm } from "@/features/tasks/components/TaskForm";
import { TaskList } from "@/features/tasks/components/TaskList";
import { ProjectHeader } from "@/features/projects/components/ProjectHeader";

export default function ProyectoDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: projectId } = use(params);

  const [user, setUser] = useState<User | null>(null);
  const [tareas, setTareas] = useState<Task[]>([]);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  // Listen for authentication changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Initial task load
  useEffect(() => {
    if (!user) return;

    const loadInitialTasks = async () => {
      setIsLoading(true);
      try {
        const { data, lastVisible, hasMore } = await tasksService.getTasksPage(projectId, user.uid);
        setTareas(data);
        setLastDoc(lastVisible);
        setHasMore(hasMore);
      } catch (error) {
        toast.error("Error al cargar las tareas");
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialTasks();
  }, [projectId, user]);

  const loadMoreTasks = async () => {
    if (!user || !hasMore || isFetchingMore) return;

    setIsFetchingMore(true);
    try {
      const { data, lastVisible, hasMore: newHasMore } = await tasksService.getTasksPage(projectId, user.uid, lastDoc);

      // Merge unique tasks and sort them (incomplete first, then complete)
      setTareas(prev => {
        const merged = [...prev, ...data];
        const unique = Array.from(new Map(merged.map(item => [item.id, item])).values());
        return unique.sort((a, b) => (a.isCompleted === b.isCompleted) ? 0 : a.isCompleted ? 1 : -1);
      });

      setLastDoc(lastVisible);
      setHasMore(newHasMore);
    } catch (error) {
      toast.error("Error al cargar más tareas");
    } finally {
      setIsFetchingMore(false);
    }
  };

  const handleTaskCreated = (newTask: Task) => {
    setTareas(prev => [newTask, ...prev].sort((a, b) => (a.isCompleted === b.isCompleted) ? 0 : a.isCompleted ? 1 : -1));
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <ProjectHeader projectId={projectId} />

      <div className="p-6 bg-amber-50 dark:bg-amber-950/10 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-2 text-zinc-800 dark:text-zinc-50">Administrar Tareas</h2>
        <p className="text-zinc-600 dark:text-zinc-50 mb-6">
          Registra y gestiona las actividades correspondientes a esta sección.
        </p>

        <TaskForm projectId={projectId} onTaskCreated={handleTaskCreated} />

        <TaskList
          projectId={projectId}
          tareas={tareas}
          isLoading={isLoading}
          hasMore={hasMore}
          isFetchingMore={isFetchingMore}
          onLoadMore={loadMoreTasks}
          onTasksChange={setTareas}
        />
      </div>
    </div>
  );
}