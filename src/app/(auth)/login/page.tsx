"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 1. Manejo del Login con Correo y Contraseña
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Has iniciado sesión correctamente");
      router.push("/proyectos"); // <-- Redirección exitosa
    } catch (error: any) {
      console.error(error);
      toast.error("Correo o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };

  // 2. Manejo del Login con Google
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success("Has iniciado sesión con Google");
      router.push("/proyectos"); // <-- Redirección exitosa
    } catch (error) {
      console.error(error);
      toast.error("Error al iniciar sesión con Google");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-zinc-50">
      <div className="w-full max-w-md p-8 bg-white border border-zinc-200 rounded-2xl shadow-sm">
        <h1 className="text-2xl font-bold text-zinc-800 mb-6 text-center">Iniciar sesión</h1>

        {/* Formulario de Email / Password */}
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Correo electrónico</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-500 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Contraseña</label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-zinc-900 text-white rounded-lg font-semibold hover:bg-zinc-800 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Iniciando..." : "Ingresar"}
          </button>
        </form>

        {/* Divisor Visual */}
        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-zinc-200"></div>
          <span className="px-3 text-sm text-zinc-500">O continuar con</span>
          <div className="flex-grow border-t border-zinc-200"></div>
        </div>

        {/* Botón de Google */}
        <button
          onClick={handleGoogleLogin}
          className="w-full py-2 bg-white text-zinc-700 border border-zinc-300 rounded-lg font-semibold hover:bg-zinc-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Google
        </button>

        {/* Enlace al registro */}
        <p className="mt-6 text-center text-sm text-zinc-600">
          ¿No tienes cuenta? <Link href="/register" className="text-zinc-900 font-semibold hover:underline">Regístrate</Link>
        </p>
      </div>
    </div>
  );
}