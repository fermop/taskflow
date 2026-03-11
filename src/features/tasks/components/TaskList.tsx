"use client";

import { useState } from "react";
import { tasksService, Task } from "../services/tasks.service";
import { ValidationError } from "@/lib/validators";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { TaskDropdownMenu } from "./TaskDropdownMenu";
import ModalConfirmDelete from "@/components/ui/ModalConfirmDelete";
import ModalUpdateTaskInfo from "./ModalUpdateTaskInfo";

interface TaskListProps {
  projectId: string;
  tareas: Task[];
  isLoading: boolean;
  hasMore: boolean;
  isFetchingMore: boolean;
  onLoadMore: () => void;
  onTasksChange: (tasks: Task[]) => void;
}

export function TaskList({ 
  projectId, 
  tareas, 
  isLoading, 
  hasMore, 
  isFetchingMore, 
  onLoadMore, 
  onTasksChange 
}: TaskListProps) {
  const [tareaAEditar, setTareaAEditar] = useState<Task | null>(null);
  const [tareaAEliminarId, setTareaAEliminarId] = useState<string | null>(null);

  const toggleCompletada = async (tareaId: string, estadoActual: boolean) => {
    // Optimistic UI toggle and sort
    const updatedTasks = tareas.map(t => t.id === tareaId ? { ...t, isCompleted: !estadoActual } : t);
    updatedTasks.sort((a, b) => (a.isCompleted === b.isCompleted) ? 0 : a.isCompleted ? 1 : -1);
    onTasksChange(updatedTasks);

    try {
      await tasksService.toggleCompletion(tareaId, estadoActual);
    } catch (error) {
      // Revert optimism
      const revertedTasks = tareas.map(t => t.id === tareaId ? { ...t, isCompleted: estadoActual } : t);
      revertedTasks.sort((a, b) => (a.isCompleted === b.isCompleted) ? 0 : a.isCompleted ? 1 : -1);
      onTasksChange(revertedTasks);
      
      const message = error instanceof ValidationError ? error.message : "No se pudo actualizar la tarea";
      toast.error(message);
    }
  };

  const eliminarTarea = async (id: string) => {
    // Optimistic deletion
    const oldTasks = [...tareas];
    onTasksChange(tareas.filter(t => t.id !== id));
    setTareaAEliminarId(null);

    try {
      await tasksService.deleteTask(id);
      toast.success("Tarea eliminada");
    } catch (error) {
      // Revert optimism
      onTasksChange(oldTasks);
      const message = error instanceof ValidationError ? error.message : "No se pudo eliminar";
      toast.error(message);
    }
  };

  const guardarEdicionTarea = async (newTitle: string, newFile: File | null, removeImage: boolean) => {
    if (!tareaAEditar) return;
    
    // Optimistic UI for string title changes
    const oldTasks = [...tareas];
    const updatedTasks = tareas.map(t => t.id === tareaAEditar.id ? { ...t, title: newTitle } : t);
    // (If changing image we just wait for the reload on next page refresh to see the thumbnail, 
    // or we could mock a local object URL, but simpler to just show title instantly)
    onTasksChange(updatedTasks);

    try {
      await tasksService.updateTask(tareaAEditar.id, newTitle, projectId, newFile, removeImage);
      toast.success("Tarea actualizada correctamente");
      setTareaAEditar(null);
    } catch (error) {
      onTasksChange(oldTasks);
      const message = error instanceof ValidationError ? error.message : "Error al actualizar la tarea";
      toast.error(message);
    }
  };

  if (isLoading) return <div className="mt-8 text-sm text-stone-400 animate-pulse flex items-center"><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Cargando tareas...</div>;
  if (tareas.length === 0) return <div className="mt-8 p-10 border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-2xl text-center text-stone-400 dark:text-stone-500">No hay tareas registradas. Escribe una arriba para comenzar.</div>;

  return (
    <div className="mt-8 space-y-3">
      {tareas.map((tarea) => (
        <div key={tarea.id} className={`p-4 rounded-xl flex flex-col gap-3 transition-all duration-200 ${tarea.isCompleted ? "bg-stone-50 dark:bg-stone-900/30 ring-1 ring-stone-100 dark:ring-stone-800/30 opacity-60" : "bg-white dark:bg-stone-900/60 ring-1 ring-stone-200/80 dark:ring-stone-800/60 hover:ring-stone-300 dark:hover:ring-stone-700 shadow-sm"}`}>       
          <div className="flex justify-between items-start">
            <span className={`w-fit text-xs font-mono ${tarea.isCompleted ? "text-stone-400 line-through" : "text-stone-500 dark:text-stone-400"} px-2 py-1 rounded-md bg-stone-100/80 dark:bg-stone-800/50`}>
              {new Date(tarea.createdAt).toLocaleDateString()}
            </span>

            <TaskDropdownMenu 
              tareaId={tarea.id}
              onDeleteClick={setTareaAEliminarId}
              onEditClick={(id) => {
                const task = tareas.find(t => t.id === id);
                if (task) setTareaAEditar(task);
              }}
            />
          </div>

          <div className="flex items-center gap-3">
            <Checkbox
              checked={tarea.isCompleted}
              onCheckedChange={() => toggleCompletada(tarea.id, tarea.isCompleted)}
              className="cursor-pointer"
            />
            <span className={`font-medium ${tarea.isCompleted ? "text-stone-400 line-through" : "text-stone-800 dark:text-stone-200"}`}>
              {tarea.title}
            </span>
          </div>
            
          <div className="flex items-center gap-4">
            {tarea.imageUrl && (
              <Dialog>
                <DialogTrigger asChild>
                  <img src={tarea.imageUrl} alt="Miniatura adjunta" className={`h-9 w-16 object-cover rounded-lg ring-1 ring-stone-200 dark:ring-stone-700 transition-all duration-200 cursor-pointer hover:opacity-80 hover:scale-[1.02] active:scale-95 ${tarea.isCompleted ? "opacity-50" : "opacity-100"}`} />
                </DialogTrigger>
                <DialogContent className="max-w-4xl border-none bg-transparent p-0 shadow-none flex justify-center">
                  <DialogTitle className="sr-only">Vista ampliada</DialogTitle>
                  <DialogDescription className="sr-only">Imagen adjunta a la tarea: {tarea.title}</DialogDescription>
                  <img src={tarea.imageUrl} alt="Imagen expandida" className="w-auto h-auto max-h-[85vh] max-w-full object-contain rounded-xl shadow-2xl" />
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      ))}

      {hasMore && (
        <div className="flex justify-center mt-6">
          <Button
            variant="outline"
            onClick={onLoadMore}
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

      <ModalUpdateTaskInfo
        task={tareaAEditar}
        isOpen={tareaAEditar !== null}
        onClose={() => setTareaAEditar(null)}
        onConfirm={guardarEdicionTarea}
      />

      <ModalConfirmDelete 
        isOpen={tareaAEliminarId !== null}
        onClose={() => setTareaAEliminarId(null)}
        onConfirm={() => tareaAEliminarId && eliminarTarea(tareaAEliminarId)}
      />
    </div>
  );
}