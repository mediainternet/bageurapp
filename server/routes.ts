import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertToppingSchema, insertOrderSchema, insertOrderItemSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Toppings API
  app.get("/api/toppings", async (req, res) => {
    try {
      const toppings = await storage.getToppings();
      res.json(toppings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch toppings" });
    }
  });

  app.post("/api/toppings", async (req, res) => {
    try {
      const validatedData = insertToppingSchema.parse(req.body);
      const topping = await storage.createTopping(validatedData);
      res.json(topping);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create topping" });
      }
    }
  });

  app.put("/api/toppings/:id", async (req, res) => {
    try {
      const validatedData = insertToppingSchema.partial().parse(req.body);
      const topping = await storage.updateTopping(req.params.id, validatedData);
      if (!topping) {
        res.status(404).json({ error: "Topping not found" });
        return;
      }
      res.json(topping);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to update topping" });
      }
    }
  });

  app.delete("/api/toppings/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteTopping(req.params.id);
      if (!deleted) {
        res.status(404).json({ error: "Topping not found" });
        return;
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete topping" });
    }
  });

  // Orders API
  app.get("/api/orders", async (req, res) => {
    try {
      const date = req.query.date ? new Date(req.query.date as string) : undefined;
      const orders = await storage.getOrders(date);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const orderWithItems = await storage.getOrderWithItems(req.params.id);
      if (!orderWithItems) {
        res.status(404).json({ error: "Order not found" });
        return;
      }
      res.json(orderWithItems);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const orderSchema = insertOrderSchema.extend({
        items: z.array(insertOrderItemSchema.omit({ orderId: true, id: true }))
      });
      const validatedData = orderSchema.parse(req.body);
      const { items, ...orderData } = validatedData;
      
      const order = await storage.createOrder(orderData, items as any);
      res.json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create order" });
      }
    }
  });

  app.patch("/api/orders/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      if (!status || typeof status !== "string") {
        res.status(400).json({ error: "Status is required" });
        return;
      }
      
      const order = await storage.updateOrderStatus(req.params.id, status);
      if (!order) {
        res.status(404).json({ error: "Order not found" });
        return;
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to update order status" });
    }
  });

  // Queue number API
  app.get("/api/queue-number", async (req, res) => {
    try {
      const date = req.query.date ? new Date(req.query.date as string) : new Date();
      const queueNumber = await storage.getNextQueueNumber(date);
      res.json({ queueNumber });
    } catch (error) {
      res.status(500).json({ error: "Failed to get queue number" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
