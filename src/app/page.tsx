"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Escuchamos el estado de autenticación al cargar la página
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 p-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold text-zinc-900 mb-6">
          Bienvenido a TaskFlow
        </h1>
        <p className="text-lg text-zinc-600 mb-8">
          El gestor de tareas definitivo. Organiza tus proyectos de manera eficiente, 
          segura y en tiempo real.
        </p>
        
        {/* Contenedor de altura fija para evitar saltos en la pantalla mientras carga */}
        <div className="flex justify-center gap-4 min-h-[50px] items-center">
          {loading ? (
            <div className="text-zinc-500 animate-pulse">Verificando sesión...</div>
          ) : user ? (
            // Si HAY un usuario logueado, mostramos el botón directo al Dashboard
            <Link 
              href="/proyectos" 
              className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
            >
              Ir a mis proyectos
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ) : (
            // Si NO hay usuario, mostramos las opciones de acceso
            <>
              <Link 
                href="/login" 
                className="px-6 py-3 bg-zinc-900 text-white font-medium rounded-lg hover:bg-zinc-800 transition-colors shadow-sm"
              >
                Iniciar Sesión
              </Link>
              <Link 
                href="/register" 
                className="px-6 py-3 bg-white text-zinc-900 font-medium rounded-lg border border-zinc-200 hover:bg-zinc-50 transition-colors"
              >
                Crear Cuenta
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}