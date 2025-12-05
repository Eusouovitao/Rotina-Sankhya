import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Routine, InsertRoutine, FrequencyType } from "@shared/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RoutineList } from "@/components/routine-list";
import { RoutineForm } from "@/components/routine-form";
import { FilterTabs } from "@/components/filter-tabs";
import { Plus, Activity } from "lucide-react";

export default function ActiveRoutines() {
  const { toast } = useToast();
  const [filter, setFilter] = useState<FrequencyType | "all">("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null);

  const { data: routines = [], isLoading } = useQuery<Routine[]>({
    queryKey: ["/api/routines"],
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: InsertRoutine }) =>
      apiRequest("PATCH", `/api/routines/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/routines"] });
      setEditingRoutine(null);
      toast({
        title: "Rotina atualizada",
        description: "As alteracoes foram salvas com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Nao foi possivel atualizar a rotina.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/routines/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/routines"] });
      toast({
        title: "Rotina excluida",
        description: "A rotina foi removida com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Nao foi possivel excluir a rotina.",
        variant: "destructive",
      });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      apiRequest("PATCH", `/api/routines/${id}/status`, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/routines"] });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Nao foi possivel alterar o status da rotina.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: InsertRoutine) => {
    if (editingRoutine) {
      updateMutation.mutate({ id: editingRoutine.id, data });
    }
  };

  const handleEdit = (routine: Routine) => {
    setEditingRoutine(routine);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleToggleStatus = (id: string, isActive: boolean) => {
    toggleStatusMutation.mutate({ id, isActive });
  };

  const activeRoutines = routines.filter((r) => r.isActive);
  const filteredRoutines = activeRoutines.filter((routine) => {
    return filter === "all" || routine.frequencyType === filter;
  });

  return (
    <div className="flex-1 space-y-6 p-6 overflow-auto">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-status-online/10">
            <Activity className="h-5 w-5 text-status-online" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Rotinas Ativas</h1>
            <p className="text-sm text-muted-foreground">
              Rotinas que estao em execucao no sistema.
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Rotinas em Execucao</CardTitle>
              <CardDescription>
                {filteredRoutines.length} rotina(s) ativa(s)
              </CardDescription>
            </div>
            <FilterTabs value={filter} onChange={setFilter} />
          </div>
        </CardHeader>
        <CardContent>
          {activeRoutines.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Activity className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-1">Nenhuma rotina ativa</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Nenhuma rotina esta em execucao no momento. Ative uma rotina na pagina de rotinas.
              </p>
            </div>
          ) : (
            <RoutineList
              routines={filteredRoutines}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
              isLoading={isLoading}
            />
          )}
        </CardContent>
      </Card>

      <RoutineForm
        open={!!editingRoutine}
        onOpenChange={(open) => {
          if (!open) {
            setEditingRoutine(null);
          }
        }}
        routine={editingRoutine}
        onSubmit={handleSubmit}
        isPending={updateMutation.isPending}
      />
    </div>
  );
}
