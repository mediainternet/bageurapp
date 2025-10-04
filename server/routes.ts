import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertToppingSchema, insertOrderSchema, insertOrderItemSchema, insertPackageSchema } from "@shared/schema";
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

  app.put("/api/orders/:id", async (req, res) => {
    try {
      const updateSchema = z.object({
        customerName: z.string().optional(),
        total: z.number().optional(),
        items: z.array(insertOrderItemSchema.omit({ orderId: true, id: true })).optional(),
      });
      const validatedData = updateSchema.parse(req.body);
      const { items, ...orderData } = validatedData;

      const order = await storage.updateOrder(req.params.id, orderData, items as any);
      if (!order) {
        res.status(404).json({ error: "Order not found" });
        return;
      }
      res.json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to update order" });
      }
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

  // Packages API
  app.get("/api/packages", async (req, res) => {
    try {
      const packages = await storage.getPackages();
      res.json(packages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch packages" });
    }
  });

  app.get("/api/packages/:id", async (req, res) => {
    try {
      const packageData = await storage.getPackageWithToppings(req.params.id);
      if (!packageData) {
        res.status(404).json({ error: "Package not found" });
        return;
      }
      res.json(packageData);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch package" });
    }
  });

  app.post("/api/packages", async (req, res) => {
    try {
      const packageSchema = insertPackageSchema.extend({
        toppingIds: z.array(z.string()),
      });
      const validatedData = packageSchema.parse(req.body);
      const { toppingIds, ...packageData } = validatedData;

      const pkg = await storage.createPackage(packageData, toppingIds);
      res.json(pkg);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create package" });
      }
    }
  });

  app.put("/api/packages/:id", async (req, res) => {
    try {
      const validatedData = insertPackageSchema.partial().parse(req.body);
      const pkg = await storage.updatePackage(req.params.id, validatedData);
      if (!pkg) {
        res.status(404).json({ error: "Package not found" });
        return;
      }
      res.json(pkg);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to update package" });
      }
    }
  });

  app.delete("/api/packages/:id", async (req, res) => {
    try {
      const deleted = await storage.deletePackage(req.params.id);
      if (!deleted) {
        res.status(404).json({ error: "Package not found" });
        return;
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete package" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
