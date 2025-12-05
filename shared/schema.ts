import { z } from "zod";

export const frequencyTypes = ["second", "minute", "hour"] as const;
export type FrequencyType = typeof frequencyTypes[number];

export const routineSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  frequencyType: z.enum(frequencyTypes),
  frequencyValue: z.number().min(1, "Valor deve ser maior que 0"),
  startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato de hora inválido"),
  duration: z.number().min(1, "Duração deve ser maior que 0"),
  durationUnit: z.enum(["second", "minute", "hour"]),
  isActive: z.boolean(),
});

export const insertRoutineSchema = routineSchema.omit({ id: true });

export type Routine = z.infer<typeof routineSchema>;
export type InsertRoutine = z.infer<typeof insertRoutineSchema>;

export const users = {
  id: "",
  username: "",
  password: "",
};

export type User = typeof users;
export type InsertUser = Omit<User, "id">;
