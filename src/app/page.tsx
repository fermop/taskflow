"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { Navbar } from "@/components/layout/Navbar";

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-900 p-4">
        <div className="text-center max-w-2xl">
          <h1 className="text-5xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
            Bienvenido a TaskFlow
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
            El gestor de tareas definitivo. Organiza tus proyectos de manera eficiente, 
            segura y en tiempo real.
          </p>
          
          {/* Contenedor de altura fija para evitar saltos en la pantalla mientras carga */}
          <div className="flex justify-center gap-4 min-h-[50px] items-center">
            {loading ? (
              <Skeleton className="h-12 w-75 rounded-xl" />
            ) : user ? (
              <Link 
                href="/proyectos" 
                className="px-8 py-3 bg-blue-600 dark:bg-blue-800 text-white font-medium rounded-lg hover:bg-blue-700 dark:hover:bg-blue-900 transition-colors shadow-sm flex items-center gap-2"
              >
                Ir a mis proyectos
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="px-6 py-3 bg-zinc-900 dark:bg-zinc-800 text-white font-medium rounded-lg hover:bg-zinc-800 transition-colors shadow-sm"
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
    </>
  );
}