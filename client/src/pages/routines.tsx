import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Routine, InsertRoutine, FrequencyType } from "@shared/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RoutineList } from "@/components/routine-list";
import { RoutineForm } from "@/components/routine-form";
import { FilterTabs } from "@/components/filter-tabs";
import { Plus, Search } from "lucide-react";

export default function Routines() {
  const { toast } = useToast();
  const [filter, setFilter] = useState<FrequencyType | "all">("all");
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null);

  const { data: routines = [], isLoading } = useQuery<Routine[]>({
    queryKey: ["/api/routines"],
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertRoutine) => apiRequest("POST", "/api/routines", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/routines"] });
      setFormOpen(false);
      toast({
        title: "Rotina criada",
        description: "A rotina foi adicionada com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Nao foi possivel criar a rotina.",
        variant: "destructive",
      });
    },
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
    } else {
      createMutation.mutate(data);
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

  const filteredRoutines = routines.filter((routine) => {
    const matchesFilter = filter === "all" || routine.frequencyType === filter;
    const matchesSearch = routine.name.toLowerCase().includes(search.toLowerCase()) ||
      routine.description?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex-1 space-y-6 p-6 overflow-auto">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Todas as Rotinas</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie todas as rotinas de atualizacao do sistema.
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)} data-testid="button-new-routine">
          <Plus className="mr-2 h-4 w-4" />
          Nova Rotina
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Lista de Rotinas</CardTitle>
              <CardDescription>
                {filteredRoutines.length} rotina(s) encontrada(s)
              </CardDescription>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar rotinas..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 w-full sm:w-64"
                  data-testid="input-search"
                />
              </div>
              <FilterTabs value={filter} onChange={setFilter} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <RoutineList
            routines={filteredRoutines}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      <RoutineForm
        open={formOpen || !!editingRoutine}
        onOpenChange={(open) => {
          if (!open) {
            setFormOpen(false);
            setEditingRoutine(null);
          }
        }}
        routine={editingRoutine}
        onSubmit={handleSubmit}
        isPending={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}
