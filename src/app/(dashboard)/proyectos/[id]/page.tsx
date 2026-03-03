import { TaskForm } from "@/components/features/TaskForm";
import { TaskList } from "@/components/features/TaskList";
import { ProjectHeader } from "@/components/features/ProjectHeader";

export default async function ProyectoDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <ProjectHeader projectId={id} />

      <div className="p-6 bg-white border border-zinc-200 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-2">Administrar Tareas</h2>
        <p className="text-zinc-600 mb-6">
          Registra y gestiona las actividades correspondientes a esta sección.
        </p>
        
        <TaskForm projectId={id} />
        <TaskList projectId={id} />
      </div>
    </div>
  );
}