"use client";

import { useEffect, useState } from "react";
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
import { projectsService } from "../services/projects.service";
import { ModalUpdateProjectName } from "./ModalUpdateProjectName";

export function ProjectHeader({ projectId }: { projectId: string }) {
  const [projectName, setProjectName] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const project = await projectsService.getProjectById(projectId);
        if (project) {
          setProjectName(project.name);
        }
      } catch (error) {
        console.error("Error al cargar el encabezado del proyecto:", error);
      }
    };

    fetchProject();
  }, [projectId]);

  useEffect(() => {
    if (projectName) {
      document.title = `${projectName} | TaskFlow`;
    } else {
      document.title = "Cargando proyecto... | TaskFlow";
    }

    return () => {
      document.title = "TaskFlow";
    };
  }, [projectName]);

  return (
    <div className="mb-8 space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/proyectos" className="text-stone-400 hover:text-amber-600 dark:text-stone-500 dark:hover:text-amber-400 transition-colors">
                Mis Proyectos
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            {projectName ? (
              <BreadcrumbPage className="font-medium text-stone-800 dark:text-stone-200">
                {projectName}
              </BreadcrumbPage>
            ) : (
              <Skeleton className="h-4 w-24" />
            )}
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-50 tracking-tight">
            {projectName ? projectName : <Skeleton className="h-9 w-64" />}
          </h1>
          {projectName && (
            <ModalUpdateProjectName
              projectId={projectId}
              currentName={projectName}
              onSuccess={setProjectName}
            />
          )}
        </div>
      </div>
    </div>
  );
}