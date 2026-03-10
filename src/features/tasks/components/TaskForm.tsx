"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";
import { tasksService } from "../services/tasks.service";
import { toast } from "sonner";
import { Paperclip, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function TaskForm({ projectId }: { projectId: string }) {
  const [tituloTarea, setTituloTarea] = useState("");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [estaGuardando, setEstaGuardando] = useState(false);

  const crearTarea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tituloTarea.trim() || !auth.currentUser) return;

    setEstaGuardando(true);

    try {
      await tasksService.createTask(
        projectId,
        tituloTarea,
        auth.currentUser.uid,
        archivo
      );

      setTituloTarea("");
      setArchivo(null);
      toast.success("Tarea guardada correctamente");
    } catch (error) {
      console.error("Error al crear la tarea:", error);
      toast.error("Hubo un problema al guardar la tarea");
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