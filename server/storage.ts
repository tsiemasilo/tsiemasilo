import { users, visitors, type User, type InsertUser, type Visitor, type InsertVisitor } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Visitor tracking methods
  trackVisitor(visitor: InsertVisitor): Promise<Visitor>;
  getVisitorStats(): Promise<{
    totalVisitors: number;
    todayVisitors: number;
    uniqueVisitors: number;
    topPages: Array<{ page: string; count: number }>;
    topCountries: Array<{ country: string; count: number }>;
    recentVisitors: Visitor[];
  }>;
  getAllVisitors(): Promise<Visitor[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private visitors: Map<number, Visitor>;
  currentId: number;
  currentVisitorId: number;

  constructor() {
    this.users = new Map();
    this.visitors = new Map();
    this.currentId = 1;
    this.currentVisitorId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async trackVisitor(insertVisitor: InsertVisitor): Promise<Visitor> {
    const id = this.currentVisitorId++;
    const visitor: Visitor = { 
      ...insertVisitor,
      userAgent: insertVisitor.userAgent || null,
      country: insertVisitor.country || null,
      city: insertVisitor.city || null,
      browser: insertVisitor.browser || null,
      os: insertVisitor.os || null,
      device: insertVisitor.device || null,
      referrer: insertVisitor.referrer || null,
      sessionId: insertVisitor.sessionId || null,
      timeSpent: insertVisitor.timeSpent || null,
      metadata: insertVisitor.metadata || null,
      id, 
      timestamp: new Date()
    };
    this.visitors.set(id, visitor);
    return visitor;
  }

  async getVisitorStats(): Promise<{
    totalVisitors: number;
    todayVisitors: number;
    uniqueVisitors: number;
    topPages: Array<{ page: string; count: number }>;
    topCountries: Array<{ country: string; count: number }>;
    recentVisitors: Visitor[];
  }> {
    const allVisitors = Array.from(this.visitors.values());
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayVisitors = allVisitors.filter(v => 
      v.timestamp && v.timestamp >= today
    );
    
    const uniqueIPs = new Set(allVisitors.map(v => v.ipAddress));
    
    // Top pages
    const pageCount = new Map<string, number>();
    allVisitors.forEach(v => {
      pageCount.set(v.page, (pageCount.get(v.page) || 0) + 1);
    });
    const topPages = Array.from(pageCount.entries())
      .map(([page, count]) => ({ page, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    // Top countries
    const countryCount = new Map<string, number>();
    allVisitors.forEach(v => {
      if (v.country) {
        countryCount.set(v.country, (countryCount.get(v.country) || 0) + 1);
      }
    });
    const topCountries = Array.from(countryCount.entries())
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    return {
      totalVisitors: allVisitors.length,
      todayVisitors: todayVisitors.length,
      uniqueVisitors: uniqueIPs.size,
      topPages,
      topCountries,
      recentVisitors: allVisitors
        .sort((a, b) => (b.timestamp?.getTime() || 0) - (a.timestamp?.getTime() || 0))
        .slice(0, 50)
    };
  }

  async getAllVisitors(): Promise<Visitor[]> {
    return Array.from(this.visitors.values())
      .sort((a, b) => (b.timestamp?.getTime() || 0) - (a.timestamp?.getTime() || 0));
  }
}

export const storage = new MemStorage();
