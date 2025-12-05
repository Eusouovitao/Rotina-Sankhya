import { useMemo, useState, useEffect } from "react";
import type { Routine, FrequencyType } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface GanttChartProps {
  routines: Routine[];
  filter?: FrequencyType | "all";
  onRoutineClick?: (routine: Routine) => void;
}

const frequencyColors: Record<FrequencyType, { bg: string; border: string; text: string }> = {
  second: {
    bg: "bg-amber-500/20 dark:bg-amber-500/30",
    border: "border-amber-500/40",
    text: "text-amber-700 dark:text-amber-300",
  },
  minute: {
    bg: "bg-primary/20 dark:bg-primary/30",
    border: "border-primary/40",
    text: "text-primary",
  },
  hour: {
    bg: "bg-purple-500/20 dark:bg-purple-500/30",
    border: "border-purple-500/40",
    text: "text-purple-700 dark:text-purple-300",
  },
};

const frequencyLabels: Record<FrequencyType, string> = {
  second: "Segundo",
  minute: "Minuto",
  hour: "Hora",
};

const frequencyUnitSuffix: Record<FrequencyType, string> = {
  second: "s",
  minute: "min",
  hour: "H",
};

const durationUnitLabels: Record<string, string> = {
  second: "seg",
  minute: "min",
  hour: "h",
};

export function GanttChart({ routines, filter = "all", onRoutineClick }: GanttChartProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  const filteredRoutines = useMemo(() => {
    if (filter === "all") return routines;
    return routines.filter(r => r.frequencyType === filter);
  }, [routines, filter]);

  const getBarPosition = (startTime: string) => {
    const [hours, minutes] = startTime.split(":").map(Number);
    return ((hours * 60 + minutes) / (24 * 60)) * 100;
  };

  const getBarWidth = (duration: number, unit: string) => {
    let durationInMinutes = duration;
    if (unit === "second") durationInMinutes = duration / 60;
    if (unit === "hour") durationInMinutes = duration * 60;
    return Math.max((durationInMinutes / (24 * 60)) * 100, 1);
  };

  const getCurrentTimePosition = () => {
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const seconds = currentTime.getSeconds();
    return ((hours * 3600 + minutes * 60 + seconds) / (24 * 3600)) * 100;
  };

  if (filteredRoutines.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <svg className="h-8 w-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-lg font-medium mb-1">Nenhuma rotina encontrada</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          {filter === "all" 
            ? "Adicione sua primeira rotina para visualizar no quadro de Gantt."
            : `Nenhuma rotina do tipo "${frequencyLabels[filter as FrequencyType]}" foi encontrada.`
          }
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      <ScrollArea className="w-full">
        <div className="min-w-[800px]">
          <div className="sticky top-0 z-10 bg-background border-b">
            <div className="flex">
              <div className="w-48 shrink-0 p-3 border-r bg-card">
                <span className="text-sm font-medium text-muted-foreground">Rotina</span>
              </div>
              <div className="flex-1 flex">
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="flex-1 min-w-[50px] p-2 text-center border-r last:border-r-0 bg-card"
                  >
                    <span className="text-xs font-mono text-muted-foreground">
                      {hour.toString().padStart(2, "0")}:00
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative">
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-destructive z-20 pointer-events-none"
              style={{ left: `calc(192px + (100% - 192px) * ${getCurrentTimePosition() / 100})` }}
              data-testid="current-time-indicator"
            >
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-destructive" />
            </div>

            {filteredRoutines.map((routine, index) => {
              const colors = frequencyColors[routine.frequencyType];
              const left = getBarPosition(routine.startTime);
              const width = getBarWidth(routine.duration, routine.durationUnit);

              return (
                <div
                  key={routine.id}
                  className={cn(
                    "flex border-b hover-elevate transition-colors",
                    index % 2 === 0 ? "bg-background" : "bg-card/50"
                  )}
                  data-testid={`gantt-row-${routine.id}`}
                >
                  <div className="w-48 shrink-0 p-3 border-r flex items-center gap-2">
                    <div className={cn("h-2 w-2 rounded-full", routine.isActive ? "bg-status-online" : "bg-status-offline")} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{routine.name}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Badge 
                          variant="outline" 
                          className={cn("text-[10px] py-0 px-1", colors.bg, colors.border, colors.text)}
                        >
                          {frequencyLabels[routine.frequencyType]}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {routine.frequencyValue}{frequencyUnitSuffix[routine.frequencyType]}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 relative h-14">
                    <div className="absolute inset-0 flex">
                      {hours.map((hour) => (
                        <div
                          key={hour}
                          className="flex-1 min-w-[50px] border-r last:border-r-0 border-dashed border-border/50"
                        />
                      ))}
                    </div>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          className={cn(
                            "absolute top-1/2 -translate-y-1/2 h-8 rounded-md border cursor-pointer transition-all",
                            colors.bg,
                            colors.border,
                            "hover:scale-[1.02] hover:shadow-md",
                            !routine.isActive && "opacity-50"
                          )}
                          style={{
                            left: `${left}%`,
                            width: `${Math.max(width, 2)}%`,
                            minWidth: "40px",
                          }}
                          onClick={() => onRoutineClick?.(routine)}
                          data-testid={`gantt-bar-${routine.id}`}
                        >
                          <span className={cn("text-[10px] font-medium px-2 truncate block", colors.text)}>
                            {routine.name}
                          </span>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs">
                        <div className="space-y-1">
                          <p className="font-medium">{routine.name}</p>
                          {routine.description && (
                            <p className="text-xs text-muted-foreground">{routine.description}</p>
                          )}
                          <div className="flex items-center gap-2 text-xs">
                            <span>Inicio: {routine.startTime}</span>
                            <span>Duracao: {routine.duration} {durationUnitLabels[routine.durationUnit]}</span>
                          </div>
                          <div className="text-xs">
                            Frequencia: A cada {routine.frequencyValue} {frequencyLabels[routine.frequencyType].toLowerCase()}(s)
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
