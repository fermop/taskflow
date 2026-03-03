import { TaskForm } from "@/components/features/TaskForm";
import { TaskList } from "@/components/features/TaskList";

export default async function ProyectoDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-zinc-800">
          Detalle del Proyecto
        </h1>
        <span className="px-3 py-1 bg-zinc-100 text-zinc-500 rounded-full text-sm font-medium">
          ID: {id}
        </span>
      </div>

      <div className="p-6 bg-white border border-zinc-200 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-2">Administrar Tareas</h2>
        <p className="text-zinc-600 mb-6">
          Registra y gestiona las actividades correspondientes a esta sección.
        </p>
        
        {/* El formulario para insertar (INSERT) */}
        <TaskForm projectId={id} />

        {/* La lista interactiva para leer (SELECT) */}
        <TaskList projectId={id} />
      </div>
    </div>
  );
}