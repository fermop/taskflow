import { EllipsisVertical, Trash2, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface TaskDropdownMenuProps {
  tareaId: string;
  onDeleteClick: (id: string) => void;
  onEditClick: (id: string) => void;
}

export function TaskDropdownMenu({ tareaId, onDeleteClick, onEditClick }: TaskDropdownMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="cursor-pointer h-7 w-7 text-stone-400 hover:text-stone-600 dark:text-stone-500 dark:hover:text-stone-300">
          <EllipsisVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white dark:bg-stone-900 ring-1 ring-stone-200/80 dark:ring-stone-800/60 border-none shadow-lg" align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer text-stone-700 dark:text-stone-300" onSelect={() => onEditClick(tareaId)}>
            <Pencil className="h-4 w-4" />
            Editar tarea
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-stone-100 dark:bg-stone-800" />
          
          <DropdownMenuItem 
            className="cursor-pointer text-red-600 dark:text-red-400 focus:text-red-700 focus:bg-red-50 dark:focus:bg-red-950/30" 
            onSelect={() => onDeleteClick(tareaId)}
          >
             <Trash2 className="h-4 w-4 mr-2" />
             Eliminar tarea
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}