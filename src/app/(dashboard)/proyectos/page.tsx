"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";

export default function ProyectosPage() {
  const [user, setUser] = useState<User | null>(null);
  const [nombreProyecto, setNombreProyecto] = useState("");
  const [proyectos, setProyectos] = useState<any[]>([]);

  // 1. Escuchar si hay un usuario logueado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        cargarProyectos(currentUser.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. Función para leer datos de Firestore (SELECT)
  const cargarProyectos = async (userId: string) => {
    try {
      const q = query(collection(db, "projects"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      
      const proyectosObtenidos = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setProyectos(proyectosObtenidos);
    } catch (error) {
      console.error("Error al cargar proyectos:", error);
    }
  };

  // 3. Función para guardar datos en Firestore (INSERT)
  const crearProyecto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreProyecto.trim() || !user) return;

    try {
      // addDoc crea un documento con un ID autogenerado
      await addDoc(collection(db, "projects"), {
        name: nombreProyecto,
        userId: user.uid,
        createdAt: new Date().toISOString(),
      });
      
      setNombreProyecto(""); // Limpiar el input
      cargarProyectos(user.uid); // Recargar la lista
    } catch (error) {
      console.error("Error al crear proyecto:", error);
    }
  };

  if (!user) return <div className="p-8 text-center">Por favor, inicia sesión primero.</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-zinc-800">Mis Proyectos</h1>

      {/* Formulario de creación */}
      <form onSubmit={crearProyecto} className="mb-8 flex gap-4">
        <input
          type="text"
          value={nombreProyecto}
          onChange={(e) => setNombreProyecto(e.target.value)}
          placeholder="Ej. Tareas de la Universidad..."
          className="flex-1 px-4 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500"
        />
        <button 
          type="submit"
          className="px-6 py-2 bg-zinc-900 text-white rounded-md hover:bg-zinc-800 transition-colors"
        >
          Crear Proyecto
        </button>
      </form>

      {/* Lista de proyectos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Dentro del map de proyectos, cambia el div por un Link: */}
        {proyectos.map((proyecto) => (
          <Link 
            href={`/proyectos/${proyecto.id}`} 
            key={proyecto.id} 
            className="block p-6 bg-white border border-zinc-200 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <h3 className="text-xl font-semibold text-zinc-800">{proyecto.name}</h3>
            <p className="text-sm text-zinc-500 mt-2">
              Creado: {new Date(proyecto.createdAt).toLocaleDateString()}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}