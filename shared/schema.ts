import { pgTable, text, serial, integer, boolean, timestamp, varchar, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const visitors = pgTable("visitors", {
  id: serial("id").primaryKey(),
  ipAddress: varchar("ip_address", { length: 45 }).notNull(),
  userAgent: text("user_agent"),
  country: varchar("country", { length: 100 }),
  city: varchar("city", { length: 100 }),
  region: varchar("region", { length: 100 }),
  browser: varchar("browser", { length: 50 }),
  os: varchar("os", { length: 50 }),
  device: varchar("device", { length: 50 }),
  referrer: text("referrer"),
  page: varchar("page", { length: 255 }).notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  sessionId: varchar("session_id", { length: 255 }),
  timeSpent: integer("time_spent"), // in seconds
  // Enhanced business identification fields
  organization: varchar("organization", { length: 255 }),
  isp: varchar("isp", { length: 255 }),
  domain: varchar("domain", { length: 255 }),
  companyName: varchar("company_name", { length: 255 }),
  businessType: varchar("business_type", { length: 100 }),
  isBusinessVisitor: boolean("is_business_visitor").default(false),
  metadata: jsonb("metadata"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertVisitorSchema = createInsertSchema(visitors).pick({
  ipAddress: true,
  userAgent: true,
  country: true,
  city: true,
  region: true,
  browser: true,
  os: true,
  device: true,
  referrer: true,
  page: true,
  sessionId: true,
  timeSpent: true,
  organization: true,
  isp: true,
  domain: true,
  companyName: true,
  businessType: true,
  isBusinessVisitor: true,
  metadata: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertVisitor = z.infer<typeof insertVisitorSchema>;
export type Visitor = typeof visitors.$inferSelect;
