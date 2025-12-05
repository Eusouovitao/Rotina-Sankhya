import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Routine, InsertRoutine, FrequencyType } from "@shared/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GanttChart } from "@/components/gantt-chart";
import { RoutineForm } from "@/components/routine-form";
import { FilterTabs } from "@/components/filter-tabs";
import { Plus, Clock, Activity, Zap, Timer } from "lucide-react";

export default function Dashboard() {
  const { toast } = useToast();
  const [filter, setFilter] = useState<FrequencyType | "all">("all");
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

  const handleSubmit = (data: InsertRoutine) => {
    if (editingRoutine) {
      updateMutation.mutate({ id: editingRoutine.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleRoutineClick = (routine: Routine) => {
    setEditingRoutine(routine);
  };

  const activeCount = routines.filter((r) => r.isActive).length;
  const secondCount = routines.filter((r) => r.frequencyType === "second").length;
  const minuteCount = routines.filter((r) => r.frequencyType === "minute").length;
  const hourCount = routines.filter((r) => r.frequencyType === "hour").length;

  const stats = [
    {
      title: "Total de Rotinas",
      value: routines.length,
      icon: Clock,
      description: "Rotinas cadastradas",
    },
    {
      title: "Rotinas Ativas",
      value: activeCount,
      icon: Activity,
      description: "Em execucao",
      color: "text-status-online",
    },
    {
      title: "Por Segundo",
      value: secondCount,
      icon: Zap,
      description: "Alta frequencia",
      color: "text-amber-600 dark:text-amber-400",
    },
    {
      title: "Por Minuto/Hora",
      value: minuteCount + hourCount,
      icon: Timer,
      description: "Frequencia regular",
      color: "text-primary",
    },
  ];

  return (
    <div className="flex-1 space-y-6 p-6 overflow-auto">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Visualize e gerencie suas rotinas de atualizacao do sistema.
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)} data-testid="button-new-routine">
          <Plus className="mr-2 h-4 w-4" />
          Nova Rotina
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color || "text-muted-foreground"}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid={`stat-${stat.title.toLowerCase().replace(/\s/g, "-")}`}>
                {isLoading ? "-" : stat.value}
              </div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Quadro de Gantt</CardTitle>
            <CardDescription>
              Visualizacao das rotinas ao longo das 24 horas do dia
            </CardDescription>
          </div>
          <FilterTabs value={filter} onChange={setFilter} />
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : (
            <GanttChart
              routines={routines}
              filter={filter}
              onRoutineClick={handleRoutineClick}
            />
          )}
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
