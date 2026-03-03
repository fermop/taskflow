"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function ProjectHeader({ projectId }: { projectId: string }) {
  const [projectName, setProjectName] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectName = async () => {
      try {
        // Hacemos una lectura sencilla (SELECT) de un solo documento
        const docRef = doc(db, "projects", projectId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setProjectName(docSnap.data().name);
        } else {
          setProjectName("Proyecto no encontrado");
        }
      } catch (error) {
        console.error("Error al obtener el proyecto:", error);
        setProjectName("Error de conexión");
      }
    };

    fetchProjectName();
  }, [projectId]);

  return (
    <div className="mb-8 space-y-4">
      {/* Componente Breadcrumb de Shadcn */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              {/* asChild permite que Shadcn use el Link nativo de Next.js */}
              <Link href="/proyectos" className="text-zinc-500 hover:text-zinc-900">
                Mis Proyectos
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          
          <BreadcrumbSeparator />
          
          <BreadcrumbItem>
            {projectName ? (
              <BreadcrumbPage className="font-medium text-zinc-900">
                {projectName}
              </BreadcrumbPage>
            ) : (
              // Mostramos un pequeño skeleton mientras carga el nombre de la BD
              <Skeleton className="h-4 w-24" />
            )}
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Título original que teníamos en la página */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-zinc-800">
          {projectName ? 'Detalles de proyecto' : <Skeleton className="h-9 w-64" />}
        </h1>
        <span className="px-3 py-1 bg-zinc-100 text-zinc-500 rounded-full text-sm font-medium">
          ID: {projectId}
        </span>
      </div>
    </div>
  );
}