"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";
import { tasksService, Task } from "../services/tasks.service";
import { ValidationError } from "@/lib/validators";
import { toast } from "sonner";
import { Paperclip, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TaskFormProps {
  projectId: string;
  onTaskCreated: (newTask: Task) => void;
}

export function TaskForm({ projectId, onTaskCreated }: TaskFormProps) {
  const [tituloTarea, setTituloTarea] = useState("");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [estaGuardando, setEstaGuardando] = useState(false);

  const crearTarea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tituloTarea.trim() || !auth.currentUser) return;

    setEstaGuardando(true);
    const tituloOptimista = tituloTarea.trim();

    try {
      const newTaskId = await tasksService.createTask(
        projectId,
        tituloOptimista,
        auth.currentUser.uid,
        archivo
      );

      // We don't have the exactly generated imageUrl from Firebase Storage instantly 
      // without extra latency/logic, so we omit it in the optimistic UI until the next fetch.
      // But we CAN put the task in the list immediately!
      const newTask: Task = {
        id: newTaskId,
        title: tituloOptimista,
        projectId,
        userId: auth.currentUser.uid,
        isCompleted: false,
        createdAt: new Date().toISOString(),
      };

      onTaskCreated(newTask);

      setTituloTarea("");
      setArchivo(null);
      toast.success("Tarea guardada correctamente");
    } catch (error) {
      const message = error instanceof ValidationError ? error.message : "Hubo un problema al guardar la tarea";
      toast.error(message);
    } finally {
      setEstaGuardando(false);
    }
  };

  return (
    <form onSubmit={crearTarea} className="flex flex-col gap-4 mt-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          type="text"
          value={tituloTarea}
          onChange={(e) => setTituloTarea(e.target.value)}
          placeholder="¿Qué necesitas hacer?"
          disabled={estaGuardando}
          className="flex-1"
        />
        <Button
          type="submit"
          disabled={estaGuardando || !tituloTarea.trim()}
          className="cursor-pointer bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-stone-900 shadow-sm min-w-[140px] disabled:opacity-50"
        >
          {estaGuardando ? "Guardando..." : "Agregar Tarea"}
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <label className="flex items-center gap-2 cursor-pointer text-sm text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200 transition-colors">
          <Paperclip size={16} />
          <span>{archivo ? archivo.name : "Adjuntar imagen (opcional)"}</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setArchivo(e.target.files ? e.target.files[0] : null)}
            disabled={estaGuardando}
          />
        </label>
        {archivo && (
          <button
            type="button"
            onClick={() => setArchivo(null)}
            className="text-xs text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 flex items-center gap-1 cursor-pointer transition-colors"
            disabled={estaGuardando}
          >
            <X size={12} />
            Quitar
          </button>
        )}
      </div>
    </form>
  );
}