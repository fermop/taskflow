import Link from "next/link";

export default function HomePage() {
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
        <div className="flex justify-center gap-4">
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
        </div>
      </div>
    </div>
  );
}