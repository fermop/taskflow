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
      if (!open) setNewName(currentName);
    }}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-stone-400 hover:text-amber-600 dark:text-stone-500 dark:hover:text-amber-400 cursor-pointer">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white dark:bg-stone-900 ring-1 ring-stone-200/80 dark:ring-stone-800/60 border-none">
        <DialogTitle className="text-lg font-semibold text-stone-800 dark:text-stone-100">
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
              autoFocus
            />
          </div>
        </div>
        <DialogFooter className="flex justify-end gap-2 mt-4">
          <Button type="button" variant="outline" className="cursor-pointer" onClick={() => setIsOpen(false)} disabled={isUpdating}>
            Cancelar
          </Button>
          <Button type="button" className="cursor-pointer bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-stone-900" onClick={handleUpdateName} disabled={isUpdating || !newName.trim() || newName.trim() === currentName}>
            {isUpdating ? "Guardando..." : "Guardar cambios"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
