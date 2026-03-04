"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
// Importamos doc y updateDoc para hacer el UPDATE
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

interface Task {
  id: string;
  title: string;
  isCompleted: boolean;
  createdAt: string;
  imageUrl?: string;
}

export function TaskList({ projectId }: { projectId: string }) {
  const [tareas, setTareas] = useState<Task[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "tasks"),
      where("projectId", "==", projectId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tareasObtenidas = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Task[];

      // Opcional: Ordenar para que las completadas se vayan al final
      const tareasOrdenadas = tareasObtenidas.sort((a, b) => 
        (a.isCompleted === b.isCompleted) ? 0 : a.isCompleted ? 1 : -1
      );

      setTareas(tareasOrdenadas);
      setCargando(false);
    });

    return () => unsubscribe();
  }, [projectId]);

  // Función para actualizar (UPDATE) el documento en Firestore
  const toggleCompletada = async (tareaId: string, estadoActual: boolean) => {
    try {
      // 1. Apuntamos al documento exacto usando su ID
      const tareaRef = doc(db, "tasks", tareaId);
      
      // 2. Actualizamos solo el campo isCompleted invirtiendo su valor
      await updateDoc(tareaRef, {
        isCompleted: !estadoActual
      });
      
    } catch (error) {
      console.error("Error al actualizar:", error);
      toast.error("No se pudo actualizar la tarea");
    }
  };

  const eliminarTarea = async (id: string) => {
    try {
      await deleteDoc(doc(db, "tasks", id));
      toast.success("Tarea eliminada");
    } catch (error) {
      toast.error("No se pudo eliminar");
    }
  };

  if (cargando) return <div className="mt-8 text-sm text-zinc-500 animate-pulse">Cargando tareas...</div>;

  if (tareas.length === 0) {
    return (
      <div className="mt-8 p-8 border-2 border-dashed border-zinc-200 rounded-xl text-center text-zinc-500">
        No hay tareas registradas. Escribe una arriba para comenzar.
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-3">
      {tareas.map((tarea) => (
        <div 
          key={tarea.id} 
          className={`p-4 border rounded-lg flex flex-col gap-4 transition-all ${
            tarea.isCompleted ? "bg-zinc-50 dark:bg-zinc-900 border-transparent opacity-60" : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 shadow-sm"
          }`}
        >       
          <span className={`w-fit h-fit text-xs ${tarea.isCompleted ? "text-zinc-500 line-through bg-zinc-100 dark:bg-zinc-950" : "text-zinc-800 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-900"} px-2 py-1 rounded-md`}>
            {new Date(tarea.createdAt).toLocaleDateString()}
          </span>

          <div className="flex items-center gap-3">
            {/* El checkbox que dispara el UPDATE */}
            <input 
              type="checkbox" 
              checked={tarea.isCompleted}
              onChange={() => toggleCompletada(tarea.id, tarea.isCompleted)}
              className="w-5 h-5 rounded border-zinc-300 dark:border-zinc-600 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <Dialog>
              <DialogTrigger asChild>
                <button className="text-zinc-400 hover:text-red-500 p-1 transition-colors cursor-pointer">
                  <Trash2 size={18} />
                </button>
              </DialogTrigger>
              
              <DialogContent className="sm:max-w-md bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700">
                <DialogTitle className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  Confirmar eliminación
                </DialogTitle>
                <DialogDescription className="text-zinc-500 dark:text-zinc-400">
                  ¿Estás seguro de que quieres eliminar esta tarea? Esta acción no se puede deshacer.
                </DialogDescription>
                
                <DialogFooter className="flex justify-end gap-2 mt-4">
                  <DialogClose asChild>
                    {/* variant="outline" da un estilo secundario automático */}
                    <Button variant="outline" className="cursor-pointer">
                      Cancelar
                    </Button>
                  </DialogClose>

                  <DialogClose asChild>
                    <Button 
                      variant="destructive" 
                      className="cursor-pointer" 
                      onClick={() => eliminarTarea(tarea.id)}
                    >
                      Eliminar
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
              
            <span className={`font-medium ${tarea.isCompleted ? "text-zinc-500 line-through" : "text-zinc-800 dark:text-zinc-300"}`}>
              {tarea.title}
            </span>

          </div>
            
          <div className="flex items-center gap-4">
            {tarea.imageUrl && (
              <Dialog>
                {/* El Trigger es la miniatura a la que le damos clic */}
                <DialogTrigger asChild>
                  <img 
                    src={tarea.imageUrl} 
                    alt="Miniatura adjunta" 
                    className={`h-9 w-16 object-cover rounded-md border border-zinc-200 transition-all duration-300 cursor-pointer hover:opacity-80 hover:scale-[1.02] active:scale-95 ${tarea.isCompleted ? "opacity-50" : "opacity-100"}`} 
                  />
                </DialogTrigger>
                
                <DialogContent className="max-w-4xl border-none bg-transparent p-0 shadow-none flex justify-center">
                  <DialogTitle className="sr-only">Vista ampliada</DialogTitle>
                  <DialogDescription className="sr-only">Imagen adjunta a la tarea: {tarea.title}</DialogDescription>

                  <img
                    src={tarea.imageUrl}
                    alt="Imagen expandida"
                    className="w-auto h-auto max-h-[85vh] max-w-full object-contain rounded-lg shadow-2xl"
                  />
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}