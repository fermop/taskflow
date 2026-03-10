import { TaskForm } from "@/features/tasks/components/TaskForm";
import { TaskList } from "@/features/tasks/components/TaskList";
import { ProjectHeader } from "@/features/projects/components/ProjectHeader";

export default async function ProyectoDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <ProjectHeader projectId={id} />

      <div className="p-6 bg-amber-50 dark:bg-amber-950/10 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-2 text-zinc-800 dark:text-zinc-50">Administrar Tareas</h2>
        <p className="text-zinc-600 dark:text-zinc-50 mb-6">
          Registra y gestiona las actividades correspondientes a esta sección.
        </p>

        <TaskForm projectId={id} />
        <TaskList projectId={id} />
      </div>
    </div>
  );
}