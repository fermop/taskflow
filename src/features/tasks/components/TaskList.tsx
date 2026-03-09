"use client";

import { useEffect, useState } from "react";
import { tasksService, Task } from "../services/tasks.service";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { TaskDropdownMenu } from "./TaskDropdownMenu";
import ModalConfirmDelete from "@/components/ui/ModalConfirmDelete";
import ModalUpdateTaskInfo from "./ModalUpdateTaskInfo";

export function TaskList({ projectId }: { projectId: string }) {
  const [tareas, setTareas] = useState<Task[]>([]);
  const [cargando, setCargando] = useState(true);
  
  // En lugar de un string, guardamos toda la Tarea que se va a editar
  const [tareaAEditar, setTareaAEditar] = useState<Task | null>(null);
  const [tareaAEliminarId, setTareaAEliminarId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = tasksService.subscribeToTasks(projectId, (tareasActualizadas) => {
      setTareas(tareasActualizadas);
      setCargando(false);
    });
    return () => unsubscribe();
  }, [projectId]);

  const toggleCompletada = async (tareaId: string, estadoActual: boolean) => {
    try {
      await tasksService.toggleCompletion(tareaId, estadoActual);
    } catch (error) {
      toast.error("No se pudo actualizar la tarea");
    }
  };

  const eliminarTarea = async (id: string) => {
    try {
      await tasksService.deleteTask(id);
      toast.success("Tarea eliminada");
      setTareaAEliminarId(null);
    } catch (error) {
      toast.error("No se pudo eliminar");
    }
  };

  const guardarEdicionTarea = async (newTitle: string, newFile: File | null) => {
    if (!tareaAEditar) return;
    try {
      await tasksService.updateTask(tareaAEditar.id, newTitle, projectId, newFile);
      toast.success("Tarea actualizada correctamente");
      setTareaAEditar(null);
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar la tarea");
    }
  };

  if (cargando) return <div className="mt-8 text-sm text-zinc-500 animate-pulse">Cargando tareas...</div>;
  if (tareas.length === 0) return <div className="mt-8 p-8 border-2 border-dashed border-zinc-200 rounded-xl text-center text-zinc-500">No hay tareas registradas. Escribe una arriba para comenzar.</div>;

  return (
    <div className="mt-8 space-y-3">
      {tareas.map((tarea) => (
        <div key={tarea.id} className={`p-4 border rounded-lg flex flex-col gap-4 transition-all ${tarea.isCompleted ? "bg-zinc-50 dark:bg-zinc-900 border-transparent opacity-60" : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 shadow-sm"}`}>       
          <div className="flex justify-between">
            <span className={`w-fit h-fit text-xs ${tarea.isCompleted ? "text-zinc-500 line-through bg-zinc-100 dark:bg-zinc-950" : "text-zinc-800 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-900"} px-2 py-1 rounded-md`}>
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
            <span className={`font-medium ${tarea.isCompleted ? "text-zinc-500 line-through" : "text-zinc-800 dark:text-zinc-300"}`}>
              {tarea.title}
            </span>
          </div>
            
          <div className="flex items-center gap-4">
            {tarea.imageUrl && (
              <Dialog>
                <DialogTrigger asChild>
                  <img src={tarea.imageUrl} alt="Miniatura adjunta" className={`h-9 w-16 object-cover rounded-md border border-zinc-200 transition-all duration-300 cursor-pointer hover:opacity-80 hover:scale-[1.02] active:scale-95 ${tarea.isCompleted ? "opacity-50" : "opacity-100"}`} />
                </DialogTrigger>
                <DialogContent className="max-w-4xl border-none bg-transparent p-0 shadow-none flex justify-center">
                  <DialogTitle className="sr-only">Vista ampliada</DialogTitle>
                  <DialogDescription className="sr-only">Imagen adjunta a la tarea: {tarea.title}</DialogDescription>
                  <img src={tarea.imageUrl} alt="Imagen expandida" className="w-auto h-auto max-h-[85vh] max-w-full object-contain rounded-lg shadow-2xl" />
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      ))}

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