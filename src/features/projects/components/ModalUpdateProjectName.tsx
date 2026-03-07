"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil } from "lucide-react";
import { projectsService } from "../services/projects.service";
import { toast } from "sonner";

interface ModalUpdateProjectNameProps {
  projectId: string;
  currentName: string;
  onSuccess: (newName: string) => void;
}

export function ModalUpdateProjectName({ projectId, currentName, onSuccess }: ModalUpdateProjectNameProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newName, setNewName] = useState(currentName);
  const [isUpdating, setIsUpdating] = useState(false);

  // Sincronizar el estado inicial cuando cambia el currentName desde fuera
  useEffect(() => {
    setNewName(currentName);
  }, [currentName]);

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || newName.trim() === currentName) return;

    setIsUpdating(true);
    try {
      await projectsService.updateProjectName(projectId, newName.trim());
      onSuccess(newName.trim());
      setIsOpen(false);
      toast.success("Nombre del proyecto actualizado correctamente");
    } catch (error) {
      console.error("Error al actualizar el nombre:", error);
      toast.error("Error al actualizar el nombre");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) setNewName(currentName); // Restaurar el nombre si se cancela y se vuelve a abrir
    }}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 cursor-pointer">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700">
        <DialogTitle className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Editar nombre del proyecto
        </DialogTitle>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="project-name">Nombre del proyecto</Label>
            <Input
              id="project-name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              disabled={isUpdating}
              placeholder="Nombre del proyecto"
              className="bg-white dark:bg-zinc-800"
              autoFocus
            />
          </div>
        </div>
        <DialogFooter className="flex justify-end gap-2 mt-4">
          <Button type="button" variant="outline" className="cursor-pointer" onClick={() => setIsOpen(false)} disabled={isUpdating}>
            Cancelar
          </Button>
          <Button type="button" className="cursor-pointer" onClick={handleUpdateName} disabled={isUpdating || !newName.trim() || newName.trim() === currentName}>
            {isUpdating ? "Guardando..." : "Guardar cambios"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
