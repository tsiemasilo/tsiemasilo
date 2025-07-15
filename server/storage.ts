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
    businessVisitors: number;
    topPages: Array<{ page: string; count: number }>;
    topCountries: Array<{ country: string; count: number }>;
    topCompanies: Array<{ company: string; count: number }>;
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
      region: insertVisitor.region || null,
      browser: insertVisitor.browser || null,
      os: insertVisitor.os || null,
      device: insertVisitor.device || null,
      referrer: insertVisitor.referrer || null,
      sessionId: insertVisitor.sessionId || null,
      timeSpent: insertVisitor.timeSpent || null,
      organization: insertVisitor.organization || null,
      isp: insertVisitor.isp || null,
      domain: insertVisitor.domain || null,
      companyName: insertVisitor.companyName || null,
      businessType: insertVisitor.businessType || null,
      isBusinessVisitor: insertVisitor.isBusinessVisitor || false,
      // Personal identification fields
      firstName: insertVisitor.firstName || null,
      lastName: insertVisitor.lastName || null,
      fullName: insertVisitor.fullName || null,
      email: insertVisitor.email || null,
      deviceName: insertVisitor.deviceName || null,
      deviceId: insertVisitor.deviceId || null,
      screenResolution: insertVisitor.screenResolution || null,
      timezone: insertVisitor.timezone || null,
      language: insertVisitor.language || null,
      platform: insertVisitor.platform || null,
      networkType: insertVisitor.networkType || null,
      connectionSpeed: insertVisitor.connectionSpeed || null,
      batteryLevel: insertVisitor.batteryLevel || null,
      isCharging: insertVisitor.isCharging || null,
      deviceMemory: insertVisitor.deviceMemory || null,
      hardwareConcurrency: insertVisitor.hardwareConcurrency || null,
      socialMediaHandle: insertVisitor.socialMediaHandle || null,
      linkedInProfile: insertVisitor.linkedInProfile || null,
      githubProfile: insertVisitor.githubProfile || null,
      twitterHandle: insertVisitor.twitterHandle || null,
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
    businessVisitors: number;
    topPages: Array<{ page: string; count: number }>;
    topCountries: Array<{ country: string; count: number }>;
    topCompanies: Array<{ company: string; count: number }>;
    recentVisitors: Visitor[];
  }> {
    const allVisitors = Array.from(this.visitors.values());
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayVisitors = allVisitors.filter(v => 
      v.timestamp && v.timestamp >= today
    );
    
    const uniqueIPs = new Set(allVisitors.map(v => v.ipAddress));
    const businessVisitors = allVisitors.filter(v => v.isBusinessVisitor).length;
    
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
    
    // Top companies
    const companyCount = new Map<string, number>();
    allVisitors.forEach(v => {
      if (v.companyName) {
        companyCount.set(v.companyName, (companyCount.get(v.companyName) || 0) + 1);
      }
    });
    const topCompanies = Array.from(companyCount.entries())
      .map(([company, count]) => ({ company, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    return {
      totalVisitors: allVisitors.length,
      todayVisitors: todayVisitors.length,
      uniqueVisitors: uniqueIPs.size,
      businessVisitors,
      topPages,
      topCountries,
      topCompanies,
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
