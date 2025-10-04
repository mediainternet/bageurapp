import {
  type User,
  type InsertUser,
  type Topping,
  type InsertTopping,
  type Package,
  type InsertPackage,
  type PackageTopping,
  type InsertPackageTopping,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  users,
  toppings,
  packages,
  packageToppings,
  orders,
  orderItems
} from "@shared/schema";
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import { eq, desc, and, gte, lte, sql } from "drizzle-orm";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getToppings(): Promise<Topping[]>;
  getTopping(id: string): Promise<Topping | undefined>;
  createTopping(topping: InsertTopping): Promise<Topping>;
  updateTopping(id: string, topping: Partial<InsertTopping>): Promise<Topping | undefined>;
  deleteTopping(id: string): Promise<boolean>;

  getPackages(): Promise<Package[]>;
  getPackage(id: string): Promise<Package | undefined>;
  getPackageWithToppings(id: string): Promise<{ package: Package; toppingIds: string[] } | undefined>;
  createPackage(pkg: InsertPackage, toppingIds: string[]): Promise<Package>;
  updatePackage(id: string, pkg: Partial<InsertPackage>): Promise<Package | undefined>;
  deletePackage(id: string): Promise<boolean>;

  getOrders(date?: Date): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  getOrderWithItems(id: string): Promise<{ order: Order; items: OrderItem[] } | undefined>;
  createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order>;
  updateOrder(id: string, order: Partial<InsertOrder>, items?: InsertOrderItem[]): Promise<Order | undefined>;
  updateOrderStatus(id: string, status: string): Promise<Order | undefined>;
  getNextQueueNumber(date: Date): Promise<number>;

  getOrderItems(orderId: string): Promise<OrderItem[]>;
}

export class DbStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async getToppings(): Promise<Topping[]> {
    return await db.select().from(toppings).orderBy(toppings.name);
  }

  async getTopping(id: string): Promise<Topping | undefined> {
    const result = await db.select().from(toppings).where(eq(toppings.id, id)).limit(1);
    return result[0];
  }

  async createTopping(topping: InsertTopping): Promise<Topping> {
    const result = await db.insert(toppings).values(topping).returning();
    return result[0];
  }

  async updateTopping(id: string, topping: Partial<InsertTopping>): Promise<Topping | undefined> {
    const result = await db.update(toppings).set(topping).where(eq(toppings.id, id)).returning();
    return result[0];
  }

  async deleteTopping(id: string): Promise<boolean> {
    const result = await db.delete(toppings).where(eq(toppings.id, id)).returning();
    return result.length > 0;
  }

  async getOrders(date?: Date): Promise<Order[]> {
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      return await db.select().from(orders)
        .where(and(
          gte(orders.createdAt, startOfDay),
          lte(orders.createdAt, endOfDay)
        ))
        .orderBy(desc(orders.createdAt));
    }
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
    return result[0];
  }

  async getOrderWithItems(id: string): Promise<{ order: Order; items: OrderItem[] } | undefined> {
    const order = await this.getOrder(id);
    if (!order) return undefined;
    
    const items = await this.getOrderItems(id);
    return { order, items };
  }

  async createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order> {
    const [newOrder] = await db.insert(orders).values(order).returning();
    
    if (items.length > 0) {
      await db.insert(orderItems).values(items.map(item => ({
        ...item,
        orderId: newOrder.id
      })));
    }
    
    return newOrder;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const result = await db.update(orders).set({ status }).where(eq(orders.id, id)).returning();
    return result[0];
  }

  async getNextQueueNumber(date: Date): Promise<number> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    const result = await db.select({ max: sql<number>`COALESCE(MAX(${orders.queueNumber}), 0)` })
      .from(orders)
      .where(and(
        gte(orders.createdAt, startOfDay),
        lte(orders.createdAt, endOfDay)
      ));
    
    return (result[0]?.max || 0) + 1;
  }

  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }

  async getPackages(): Promise<Package[]> {
    return await db.select().from(packages).orderBy(packages.name);
  }

  async getPackage(id: string): Promise<Package | undefined> {
    const result = await db.select().from(packages).where(eq(packages.id, id)).limit(1);
    return result[0];
  }

  async getPackageWithToppings(id: string): Promise<{ package: Package; toppingIds: string[] } | undefined> {
    const pkg = await this.getPackage(id);
    if (!pkg) return undefined;

    const pkgToppings = await db.select().from(packageToppings).where(eq(packageToppings.packageId, id));
    return { package: pkg, toppingIds: pkgToppings.map(pt => pt.toppingId) };
  }

  async createPackage(pkg: InsertPackage, toppingIds: string[]): Promise<Package> {
    const [newPackage] = await db.insert(packages).values(pkg).returning();

    if (toppingIds.length > 0) {
      await db.insert(packageToppings).values(toppingIds.map(toppingId => ({
        packageId: newPackage.id,
        toppingId,
      })));
    }

    return newPackage;
  }

  async updatePackage(id: string, pkg: Partial<InsertPackage>): Promise<Package | undefined> {
    const result = await db.update(packages).set(pkg).where(eq(packages.id, id)).returning();
    return result[0];
  }

  async deletePackage(id: string): Promise<boolean> {
    const result = await db.delete(packages).where(eq(packages.id, id)).returning();
    return result.length > 0;
  }

  async updateOrder(id: string, order: Partial<InsertOrder>, items?: InsertOrderItem[]): Promise<Order | undefined> {
    const [updatedOrder] = await db.update(orders).set(order).where(eq(orders.id, id)).returning();

    if (items && items.length > 0) {
      await db.delete(orderItems).where(eq(orderItems.orderId, id));
      await db.insert(orderItems).values(items.map(item => ({
        ...item,
        orderId: id
      })));
    }

    return updatedOrder;
  }
}

export const storage = new DbStorage();
