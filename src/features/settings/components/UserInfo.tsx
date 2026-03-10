"use client";

import { auth } from "@/lib/firebase";
import { Mail, User, ShieldCheck } from "lucide-react";

export function UserInfo() {
  const user = auth.currentUser;

  if (!user) return null;

  const displayName = user.displayName || "Usuario";
  const email = user.email || "Sin correo";
  const providerId = user.providerData[0]?.providerId;
  const isGoogleUser = providerId === "google.com";

  return (
    <div className="rounded-2xl ring-1 ring-stone-200/80 dark:ring-stone-800/60 bg-white dark:bg-stone-900/60 p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-stone-800 dark:text-stone-100 mb-4">
        Información de la cuenta
      </h2>

      <div className="space-y-4">
        {/* Nombre */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <User className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="text-sm text-stone-400 dark:text-stone-500">Nombre</p>
            <p className="text-stone-800 dark:text-stone-200 font-medium">
              {displayName}
            </p>
          </div>
        </div>

        {/* Correo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <Mail className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="text-sm text-stone-400 dark:text-stone-500">
              Correo electrónico
            </p>
            <p className="text-stone-800 dark:text-stone-200 font-medium">
              {email}
            </p>
          </div>
        </div>

        {/* Proveedor */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <p className="text-sm text-stone-400 dark:text-stone-500">
              Método de inicio de sesión
            </p>
            <p className="text-stone-800 dark:text-stone-200 font-medium">
              {isGoogleUser ? "Google" : "Email / Contraseña"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
