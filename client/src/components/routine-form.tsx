import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertRoutineSchema, type InsertRoutine, type Routine, frequencyTypes } from "@shared/schema";
import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";

interface RoutineFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  routine?: Routine | null;
  onSubmit: (data: InsertRoutine) => void;
  isPending?: boolean;
}

const frequencyLabels = {
  second: "Segundo",
  minute: "Minuto",
  hour: "Hora",
};

const durationUnitLabels = {
  second: "Segundos",
  minute: "Minutos",
  hour: "Horas",
};

export function RoutineForm({ open, onOpenChange, routine, onSubmit, isPending }: RoutineFormProps) {
  const isEditing = !!routine;

  const form = useForm<InsertRoutine>({
    resolver: zodResolver(insertRoutineSchema),
    defaultValues: routine ? {
      name: routine.name,
      description: routine.description || "",
      frequencyType: routine.frequencyType,
      frequencyValue: routine.frequencyValue,
      startTime: routine.startTime,
      duration: routine.duration,
      durationUnit: routine.durationUnit,
      isActive: routine.isActive,
    } : {
      name: "",
      description: "",
      frequencyType: "minute",
      frequencyValue: 5,
      startTime: "00:00",
      duration: 30,
      durationUnit: "minute",
      isActive: true,
    },
  });

  useEffect(() => {
    if (routine) {
      form.reset({
        name: routine.name,
        description: routine.description || "",
        frequencyType: routine.frequencyType,
        frequencyValue: routine.frequencyValue,
        startTime: routine.startTime,
        duration: routine.duration,
        durationUnit: routine.durationUnit,
        isActive: routine.isActive,
      });
    } else {
      form.reset({
        name: "",
        description: "",
        frequencyType: "minute",
        frequencyValue: 5,
        startTime: "00:00",
        duration: 30,
        durationUnit: "minute",
        isActive: true,
      });
    }
  }, [routine, open]);

  const handleSubmit = (data: InsertRoutine) => {
    onSubmit(data);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Rotina" : "Nova Rotina"}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Altere os dados da rotina e clique em salvar." 
              : "Preencha os dados abaixo para criar uma nova rotina de atualizacao."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Rotina</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ex: Sincronizar dados" 
                      {...field} 
                      data-testid="input-routine-name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descricao (opcional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva o que esta rotina faz..." 
                      className="resize-none" 
                      {...field}
                      data-testid="input-routine-description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="frequencyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Frequencia</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-frequency-type">
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {frequencyTypes.map((type) => (
                          <SelectItem key={type} value={type} data-testid={`option-frequency-${type}`}>
                            {frequencyLabels[type]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="frequencyValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Intervalo</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={1}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                        data-testid="input-frequency-value"
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      A cada X {frequencyLabels[form.watch("frequencyType")].toLowerCase()}(s)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Horario de Inicio</FormLabel>
                  <FormControl>
                    <Input 
                      type="time" 
                      {...field}
                      data-testid="input-start-time"
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Horario em que a rotina comeca a ser executada
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duracao</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={1}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                        data-testid="input-duration"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="durationUnit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unidade</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-duration-unit">
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {frequencyTypes.map((type) => (
                          <SelectItem key={type} value={type} data-testid={`option-duration-${type}`}>
                            {durationUnitLabels[type]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Status Ativo</FormLabel>
                    <FormDescription>
                      Ativar ou desativar esta rotina
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      data-testid="switch-is-active"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => handleOpenChange(false)}
                data-testid="button-cancel"
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending} data-testid="button-submit">
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? "Salvar Alteracoes" : "Criar Rotina"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
