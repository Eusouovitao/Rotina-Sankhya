import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRoutineSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get("/api/routines", async (req, res) => {
    try {
      const routines = await storage.getAllRoutines();
      res.json(routines);
    } catch (error) {
      console.error("Error fetching routines:", error);
      res.status(500).json({ error: "Failed to fetch routines" });
    }
  });

  app.get("/api/routines/:id", async (req, res) => {
    try {
      const routine = await storage.getRoutine(req.params.id);
      if (!routine) {
        return res.status(404).json({ error: "Routine not found" });
      }
      res.json(routine);
    } catch (error) {
      console.error("Error fetching routine:", error);
      res.status(500).json({ error: "Failed to fetch routine" });
    }
  });

  app.post("/api/routines", async (req, res) => {
    try {
      const parsed = insertRoutineSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: parsed.error.errors 
        });
      }
      
      const routine = await storage.createRoutine(parsed.data);
      res.status(201).json(routine);
    } catch (error) {
      console.error("Error creating routine:", error);
      res.status(500).json({ error: "Failed to create routine" });
    }
  });

  app.patch("/api/routines/:id", async (req, res) => {
    try {
      const partialSchema = insertRoutineSchema.partial();
      const parsed = partialSchema.safeParse(req.body);
      
      if (!parsed.success) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: parsed.error.errors 
        });
      }
      
      const routine = await storage.updateRoutine(req.params.id, parsed.data);
      if (!routine) {
        return res.status(404).json({ error: "Routine not found" });
      }
      res.json(routine);
    } catch (error) {
      console.error("Error updating routine:", error);
      res.status(500).json({ error: "Failed to update routine" });
    }
  });

  app.patch("/api/routines/:id/status", async (req, res) => {
    try {
      const statusSchema = z.object({ isActive: z.boolean() });
      const parsed = statusSchema.safeParse(req.body);
      
      if (!parsed.success) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: parsed.error.errors 
        });
      }
      
      const routine = await storage.updateRoutineStatus(req.params.id, parsed.data.isActive);
      if (!routine) {
        return res.status(404).json({ error: "Routine not found" });
      }
      res.json(routine);
    } catch (error) {
      console.error("Error updating routine status:", error);
      res.status(500).json({ error: "Failed to update routine status" });
    }
  });

  app.delete("/api/routines/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteRoutine(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Routine not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting routine:", error);
      res.status(500).json({ error: "Failed to delete routine" });
    }
  });

  return httpServer;
}
