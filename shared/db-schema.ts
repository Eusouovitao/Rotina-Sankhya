import { pgTable, uuid, text, integer, boolean, pgEnum } from "drizzle-orm/pg-core";

export const frequencyTypeEnum = pgEnum("frequency_type_enum", ["second", "minute", "hour"]);
export const durationUnitEnum = pgEnum("duration_unit_enum", ["second", "minute", "hour"]);

export const routines = pgTable("routines", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  frequencyType: frequencyTypeEnum("frequency_type").notNull(),
  frequencyValue: integer("frequency_value").notNull(),
  startTime: text("start_time").notNull(),
  duration: integer("duration").notNull(),
  durationUnit: durationUnitEnum("duration_unit").notNull(),
  isActive: boolean("is_active").notNull(),
});
