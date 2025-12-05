import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { FrequencyType } from "@shared/schema";
import { cn } from "@/lib/utils";

interface FilterTabsProps {
  value: FrequencyType | "all";
  onChange: (value: FrequencyType | "all") => void;
}

const filters: { value: FrequencyType | "all"; label: string; color?: string }[] = [
  { value: "all", label: "Todas" },
  { value: "second", label: "Segundos", color: "text-amber-600 dark:text-amber-400" },
  { value: "minute", label: "Minutos", color: "text-blue-600 dark:text-blue-400" },
  { value: "hour", label: "Horas", color: "text-purple-600 dark:text-purple-400" },
];

export function FilterTabs({ value, onChange }: FilterTabsProps) {
  return (
    <Tabs value={value} onValueChange={(v) => onChange(v as FrequencyType | "all")}>
      <TabsList>
        {filters.map((filter) => (
          <TabsTrigger
            key={filter.value}
            value={filter.value}
            className={cn(value === filter.value && filter.color)}
            data-testid={`tab-filter-${filter.value}`}
          >
            {filter.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
