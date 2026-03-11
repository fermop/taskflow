"use client";

import { useState } from "react";
import { EllipsisVertical, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { auth } from "@/lib/firebase";
import { projectsService } from "../services/projects.service";
import { ValidationError } from "@/lib/validators";
import { toast } from "sonner";
import { ModalUpdateProjectName } from "./ModalUpdateProjectName";
import ModalConfirmDelete from "@/components/ui/ModalConfirmDelete";

interface ProjectDropdownMenuProps {
  projectId: string;
  projectName: string;
  onDeleted?: (id: string) => void;
  onUpdated?: (id: string, newName: string) => void;
}

export function ProjectDropdownMenu({ projectId, projectName, onDeleted, onUpdated }: ProjectDropdownMenuProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    setIsDeleting(true);
    try {
      await projectsService.deleteProject(projectId, userId);
      toast.success("Proyecto eliminado correctamente");
      setShowDeleteModal(false);
      onDeleted?.(projectId);
    } catch (error) {
      const message = error instanceof ValidationError ? error.message : "Error al eliminar el proyecto";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer h-7 w-7 text-stone-400 hover:text-stone-600 dark:text-stone-500 dark:hover:text-stone-300"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            <EllipsisVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="bg-white dark:bg-stone-900 ring-1 ring-stone-200/80 dark:ring-stone-800/60 border-none shadow-lg"
          align="end"
        >
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="cursor-pointer text-stone-700 dark:text-stone-300"
              onSelect={() => setShowEditModal(true)}
            >
              <Pencil className="h-4 w-4" />
              Editar nombre
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-stone-100 dark:bg-stone-800" />

            <DropdownMenuItem
              className="cursor-pointer text-red-600 dark:text-red-400 focus:text-red-700 focus:bg-red-50 dark:focus:bg-red-950/30"
              onSelect={() => setShowDeleteModal(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar proyecto
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <ModalUpdateProjectName
        projectId={projectId}
        currentName={projectName}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={(newName) => {
          setShowEditModal(false);
          onUpdated?.(projectId, newName);
        }}
      />

      <ModalConfirmDelete
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        itemName="proyecto"
      />
    </>
  );
}
