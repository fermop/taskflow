"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";
import { Info } from "lucide-react";
import { settingsService } from "../services/settings.service";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function ChangePasswordForm() {
  const user = auth.currentUser;
  const isGoogleUser = user?.providerData[0]?.providerId === "google.com";

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  if (isGoogleUser) {
    return (
      <div className="rounded-2xl ring-1 ring-stone-200/80 dark:ring-stone-800/60 bg-white dark:bg-stone-900/60 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-stone-800 dark:text-stone-100 mb-4">
          Contraseña
        </h2>
        <div className="flex items-start gap-3 rounded-xl bg-stone-50 dark:bg-stone-800/50 p-4">
          <Info className="w-5 h-5 text-stone-400 mt-0.5 shrink-0" />
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Tu cuenta está vinculada a <strong className="text-stone-700 dark:text-stone-300">Google</strong>. La contraseña es
            administrada directamente por Google y no se puede cambiar desde
            aquí.
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error("La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    try {
      await settingsService.changePassword(currentPassword, newPassword);
      toast.success("Contraseña actualizada correctamente.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: unknown) {
      console.error("Error al cambiar contraseña:", error);

      if ((error as any).code === "auth/wrong-password" || (error as any).code === "auth/invalid-credential") {
        toast.error("La contraseña actual es incorrecta.");
      } else {
        toast.error("Hubo un error al cambiar la contraseña.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl ring-1 ring-stone-200/80 dark:ring-stone-800/60 bg-white dark:bg-stone-900/60 p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-stone-800 dark:text-stone-100 mb-4">
        Cambiar contraseña
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="currentPassword">Contraseña actual</Label>
          <Input
            id="currentPassword"
            type="password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="newPassword">Nueva contraseña</Label>
          <Input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
          <Input
            id="confirmPassword"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full cursor-pointer bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-stone-900 shadow-sm">
          {loading ? "Actualizando..." : "Cambiar contraseña"}
        </Button>
      </form>
    </div>
  );
}
