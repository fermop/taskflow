"use client";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function LoginPage() {
  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      // Esto abrirá un popup. En el emulador, simulará el login sin pedir contraseña real.
      const result = await signInWithPopup(auth, provider);
      console.log("Usuario logueado:", result.user);
      alert(`¡Bienvenido ${result.user.displayName || result.user.email}!`);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50">
      <div className="p-8 bg-white rounded-xl shadow-sm border border-zinc-200 text-center">
        <h1 className="text-2xl font-bold mb-6 text-zinc-800">Acceso al Sistema</h1>
        <button
          onClick={handleLogin}
          className="px-6 py-2 bg-zinc-900 text-white rounded-md hover:bg-zinc-800 transition-colors"
        >
          Ingresar con Google
        </button>
      </div>
    </div>
  );
}