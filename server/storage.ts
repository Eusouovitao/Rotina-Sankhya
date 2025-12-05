import { type Routine, type InsertRoutine } from "@shared/schema";
import { randomUUID } from "crypto";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { eq } from "drizzle-orm";
import { routines } from "@shared/db-schema";

export interface IStorage {
  getAllRoutines(): Promise<Routine[]>;
  getRoutine(id: string): Promise<Routine | undefined>;
  createRoutine(routine: InsertRoutine): Promise<Routine>;
  updateRoutine(id: string, routine: Partial<InsertRoutine>): Promise<Routine | undefined>;
  updateRoutineStatus(id: string, isActive: boolean): Promise<Routine | undefined>;
  deleteRoutine(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private routines: Map<string, Routine>;

  constructor() {
    this.routines = new Map();
    this.seedData();
  }

  private seedData() {
    const sampleRoutines: InsertRoutine[] = [
      {
        name: "Sync de Dados",
        description: "Sincroniza dados com o servidor principal",
        frequencyType: "minute",
        frequencyValue: 5,
        startTime: "00:00",
        duration: 30,
        durationUnit: "minute",
        isActive: true,
      },
      {
        name: "Health Check",
        description: "Verifica saude dos servicos",
        frequencyType: "second",
        frequencyValue: 30,
        startTime: "00:00",
        duration: 5,
        durationUnit: "second",
        isActive: true,
      },
      {
        name: "Backup Diario",
        description: "Realiza backup completo do banco de dados",
        frequencyType: "hour",
        frequencyValue: 1,
        startTime: "02:00",
        duration: 2,
        durationUnit: "hour",
        isActive: true,
      },
      {
        name: "Limpeza de Cache",
        description: "Remove arquivos temporarios antigos",
        frequencyType: "minute",
        frequencyValue: 15,
        startTime: "06:00",
        duration: 45,
        durationUnit: "minute",
        isActive: false,
      },
      {
        name: "Monitoramento de Logs",
        description: "Analisa e processa logs do sistema",
        frequencyType: "second",
        frequencyValue: 10,
        startTime: "08:00",
        duration: 3,
        durationUnit: "second",
        isActive: true,
      },
      {
        name: "Atualizacao de Indices",
        description: "Reconstroi indices do banco de dados",
        frequencyType: "hour",
        frequencyValue: 6,
        startTime: "04:00",
        duration: 1,
        durationUnit: "hour",
        isActive: true,
      },
      {
        name: "Envio de Relatorios",
        description: "Envia relatorios automaticos por email",
        frequencyType: "hour",
        frequencyValue: 24,
        startTime: "09:00",
        duration: 30,
        durationUnit: "minute",
        isActive: true,
      },
      {
        name: "Verificacao de Seguranca",
        description: "Executa scans de vulnerabilidades",
        frequencyType: "minute",
        frequencyValue: 30,
        startTime: "12:00",
        duration: 1,
        durationUnit: "hour",
        isActive: false,
      },
    ];

    for (const routine of sampleRoutines) {
      const id = randomUUID();
      this.routines.set(id, { ...routine, id });
    }
  }

  async getAllRoutines(): Promise<Routine[]> {
    return Array.from(this.routines.values()).sort((a, b) => 
      a.startTime.localeCompare(b.startTime)
    );
  }

  async getRoutine(id: string): Promise<Routine | undefined> {
    return this.routines.get(id);
  }

  async createRoutine(insertRoutine: InsertRoutine): Promise<Routine> {
    const id = randomUUID();
    const routine: Routine = { ...insertRoutine, id };
    this.routines.set(id, routine);
    return routine;
  }

  async updateRoutine(id: string, updates: Partial<InsertRoutine>): Promise<Routine | undefined> {
    const existing = this.routines.get(id);
    if (!existing) return undefined;

    const updated: Routine = { ...existing, ...updates };
    this.routines.set(id, updated);
    return updated;
  }

  async updateRoutineStatus(id: string, isActive: boolean): Promise<Routine | undefined> {
    const existing = this.routines.get(id);
    if (!existing) return undefined;

    const updated: Routine = { ...existing, isActive };
    this.routines.set(id, updated);
    return updated;
  }

  async deleteRoutine(id: string): Promise<boolean> {
    return this.routines.delete(id);
  }
}

export class PostgresStorage implements IStorage {
  private db;
  constructor(connectionString: string) {
    const pool = new Pool({ connectionString });
    this.db = drizzle(pool);
  }
  private normalize(row: any): Routine {
    return {
      id: row.id,
      name: row.name,
      description: row.description ?? undefined,
      frequencyType: row.frequencyType,
      frequencyValue: row.frequencyValue,
      startTime: row.startTime,
      duration: row.duration,
      durationUnit: row.durationUnit,
      isActive: row.isActive,
    };
  }
  async getAllRoutines(): Promise<Routine[]> {
    const rows = await this.db.select().from(routines).orderBy(routines.startTime);
    return rows.map((r: any) => this.normalize(r));
  }
  async getRoutine(id: string): Promise<Routine | undefined> {
    const rows = await this.db
      .select()
      .from(routines)
      .where(eq(routines.id, id))
      .limit(1);
    return rows[0] ? this.normalize(rows[0]) : undefined;
  }
  async createRoutine(routine: InsertRoutine): Promise<Routine> {
    const rows = await this.db.insert(routines).values(routine).returning();
    return this.normalize(rows[0]);
  }
  async updateRoutine(id: string, routine: Partial<InsertRoutine>): Promise<Routine | undefined> {
    const rows = await this.db
      .update(routines)
      .set(routine)
      .where(eq(routines.id, id))
      .returning();
    return rows[0] ? this.normalize(rows[0]) : undefined;
  }
  async updateRoutineStatus(id: string, isActive: boolean): Promise<Routine | undefined> {
    const rows = await this.db
      .update(routines)
      .set({ isActive })
      .where(eq(routines.id, id))
      .returning();
    return rows[0] ? this.normalize(rows[0]) : undefined;
  }
  async deleteRoutine(id: string): Promise<boolean> {
    const rows = await this.db
      .delete(routines)
      .where(eq(routines.id, id))
      .returning({ id: routines.id });
    return rows.length > 0;
  }
}

const connectionString = process.env.DATABASE_URL;
export const storage: IStorage = connectionString
  ? new PostgresStorage(connectionString)
  : new MemStorage();
