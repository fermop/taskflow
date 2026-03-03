"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
// Importamos doc y updateDoc para hacer el UPDATE
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

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
    if (!confirm("¿Estás seguro de eliminar esta tarea?")) return;
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
          className={`p-4 border rounded-lg flex justify-between items-center transition-all ${
            tarea.isCompleted ? "bg-zinc-50 border-transparent opacity-60" : "bg-white border-zinc-200 hover:border-zinc-300 shadow-sm"
          }`}
        >
          <div className="flex items-center gap-3">
            {/* El checkbox que dispara el UPDATE */}
            <input 
              type="checkbox" 
              checked={tarea.isCompleted}
              onChange={() => toggleCompletada(tarea.id, tarea.isCompleted)}
              className="w-5 h-5 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <button 
              onClick={() => eliminarTarea(tarea.id)}
              className="text-zinc-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
            >
              <Trash2 size={18} />
            </button>
            <span className={`font-medium ${tarea.isCompleted ? "text-zinc-500 line-through" : "text-zinc-800"}`}>
              {tarea.title}
            </span>

            {tarea.imageUrl && (
              <img
                src={tarea.imageUrl} 
                alt="Imagen adjunta" 
                className={`mt-3 h-18 w-32 object-cover rounded-md border border-zinc-200 transition-opacity ${tarea.isCompleted ? "opacity-50" : "opacity-100"}`} 
              />
            )}
          </div>
          <span className="text-xs text-zinc-400 bg-zinc-100 px-2 py-1 rounded-md">
            {new Date(tarea.createdAt).toLocaleDateString()}
          </span>
        </div>
      ))}
    </div>
  );
}