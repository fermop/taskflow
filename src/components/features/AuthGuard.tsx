"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Loader2 } from "lucide-react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [cargando, setCargando] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // Si no hay usuario, lo pateamos al login
        router.push("/login");
      } else {
        // Si sí hay usuario, le permitimos ver la pantalla
        setCargando(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Mientras Firebase verifica la sesión, mostramos una pantalla en blanco o un loader
  if (cargando) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-500">
        <Loader2 className="w-10 h-10 text-zinc-900 dark:text-zinc-50 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}