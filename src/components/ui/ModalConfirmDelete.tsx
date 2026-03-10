import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';

interface ModalConfirmDeleteProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ModalConfirmDelete({ isOpen, onClose, onConfirm }: ModalConfirmDeleteProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-stone-900 ring-1 ring-stone-200/80 dark:ring-stone-800/60 border-none">
        <DialogTitle className="text-lg font-semibold text-stone-800 dark:text-stone-100">
          Confirmar eliminación
        </DialogTitle>
        <DialogDescription className="text-stone-500 dark:text-stone-400">
          ¿Estás seguro de que quieres eliminar esta tarea? Esta acción no se puede deshacer.
        </DialogDescription>
        
        <DialogFooter className="flex justify-end gap-2 mt-4">
          <Button variant="outline" className="cursor-pointer" onClick={onClose}>
            Cancelar
          </Button>

          <Button 
            variant="destructive" 
            className="cursor-pointer" 
            onClick={onConfirm}
          >
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}