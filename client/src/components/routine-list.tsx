import type { Routine, FrequencyType } from "@shared/schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal, Pencil, Trash2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface RoutineListProps {
  routines: Routine[];
  onEdit: (routine: Routine) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, isActive: boolean) => void;
  isLoading?: boolean;
}

const frequencyColors: Record<FrequencyType, { bg: string; border: string; text: string }> = {
  second: {
    bg: "bg-amber-500/15",
    border: "border-amber-500/20",
    text: "text-amber-600 dark:text-amber-400",
  },
  minute: {
    bg: "bg-blue-500/15",
    border: "border-blue-500/20",
    text: "text-blue-600 dark:text-blue-400",
  },
  hour: {
    bg: "bg-purple-500/15",
    border: "border-purple-500/20",
    text: "text-purple-600 dark:text-purple-400",
  },
};

const frequencyLabels: Record<FrequencyType, string> = {
  second: "Segundo",
  minute: "Minuto",
  hour: "Hora",
};

const durationUnitLabels: Record<string, string> = {
  second: "seg",
  minute: "min",
  hour: "h",
};

export function RoutineList({ routines, onEdit, onDelete, onToggleStatus, isLoading }: RoutineListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-muted animate-pulse rounded-md" />
        ))}
      </div>
    );
  }

  if (routines.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Clock className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-1">Nenhuma rotina cadastrada</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Clique no botao "Nova Rotina" para adicionar sua primeira rotina de atualizacao.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">Status</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Inicio</TableHead>
              <TableHead>Duracao</TableHead>
              <TableHead>Frequencia</TableHead>
              <TableHead className="w-[70px]">Acoes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {routines.map((routine) => {
              const colors = frequencyColors[routine.frequencyType];
              return (
                <TableRow key={routine.id} data-testid={`row-routine-${routine.id}`}>
                  <TableCell>
                    <Switch
                      checked={routine.isActive}
                      onCheckedChange={(checked) => onToggleStatus(routine.id, checked)}
                      data-testid={`switch-status-${routine.id}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{routine.name}</span>
                      {routine.description && (
                        <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {routine.description}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline"
                      className={cn(colors.bg, colors.border, colors.text)}
                    >
                      {frequencyLabels[routine.frequencyType]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-sm">{routine.startTime}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {routine.duration} {durationUnitLabels[routine.durationUnit]}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      A cada {routine.frequencyValue} {frequencyLabels[routine.frequencyType].toLowerCase()}(s)
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" data-testid={`button-actions-${routine.id}`}>
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Acoes</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(routine)} data-testid={`button-edit-${routine.id}`}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => setDeleteId(routine.id)}
                          data-testid={`button-delete-${routine.id}`}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir rotina?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acao nao pode ser desfeita. A rotina sera permanentemente removida do sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) {
                  onDelete(deleteId);
                  setDeleteId(null);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
