import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingProyecto() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Esqueleto del título */}
      <Skeleton className="h-10 w-1/3 mb-8" />
      
      {/* Esqueleto de los controles */}
      <div className="flex gap-4 mb-8">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Esqueleto de la lista de tareas */}
      <div className="space-y-4">
        <Skeleton className="h-20 w-full rounded-xl" />
        <Skeleton className="h-20 w-full rounded-xl" />
        <Skeleton className="h-20 w-full rounded-xl" />
      </div>
    </div>
  );
}