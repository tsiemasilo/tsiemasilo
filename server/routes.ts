import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { sendContactEmail, type EmailData } from "./email";

// Utility function to detect device info from user agent
function parseUserAgent(userAgent: string | undefined) {
  if (!userAgent) return { browser: null, os: null, device: null };
  
  let browser = null;
  let os = null;
  let device = null;
  
  // Browser detection
  if (userAgent.includes('Chrome')) browser = 'Chrome';
  else if (userAgent.includes('Firefox')) browser = 'Firefox';
  else if (userAgent.includes('Safari')) browser = 'Safari';
  else if (userAgent.includes('Edge')) browser = 'Edge';
  
  // OS detection
  if (userAgent.includes('Windows')) os = 'Windows';
  else if (userAgent.includes('Mac')) os = 'macOS';
  else if (userAgent.includes('Linux')) os = 'Linux';
  else if (userAgent.includes('Android')) os = 'Android';
  else if (userAgent.includes('iOS')) os = 'iOS';
  
  // Device detection
  if (userAgent.includes('Mobile')) device = 'Mobile';
  else if (userAgent.includes('Tablet')) device = 'Tablet';
  else device = 'Desktop';
  
  return { browser, os, device };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Visitor tracking endpoint
  app.post("/api/track-visitor", async (req, res) => {
    try {
      const { page, referrer, sessionId, timeSpent } = req.body;
      const userAgent = req.headers['user-agent'] || '';
      const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';
      
      const { browser, os, device } = parseUserAgent(userAgent);
      
      const visitorData = {
        ipAddress,
        userAgent,
        browser,
        os,
        device,
        referrer: referrer || null,
        page: page || '/',
        sessionId: sessionId || null,
        timeSpent: timeSpent || null,
        country: null, // We'll enhance this later with IP geolocation
        city: null,
        metadata: null
      };
      
      await storage.trackVisitor(visitorData);
      res.json({ success: true });
    } catch (error) {
      console.error("Visitor tracking error:", error);
      res.status(500).json({ error: "Failed to track visitor" });
    }
  });

  // Hidden dashboard API endpoints
  app.get("/api/admin/visitors/stats", async (req, res) => {
    try {
      const stats = await storage.getVisitorStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching visitor stats:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  app.get("/api/admin/visitors", async (req, res) => {
    try {
      const visitors = await storage.getAllVisitors();
      res.json(visitors);
    } catch (error) {
      console.error("Error fetching visitors:", error);
      res.status(500).json({ error: "Failed to fetch visitors" });
    }
  });

  // Email contact form endpoint
  app.post("/api/send-email", async (req, res) => {
    try {
      const { name, email, message } = req.body as EmailData;

      // Validate required fields
      if (!name || !email || !message) {
        return res.status(400).json({ 
          error: "Missing required fields: name, email, and message are required" 
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ 
          error: "Invalid email format" 
        });
      }

      // Send email
      const result = await sendContactEmail({ name, email, message });
      
      res.json({ 
        success: true, 
        message: "Email sent successfully",
        messageId: result.messageId 
      });
    } catch (error) {
      console.error("Email sending error:", error);
      res.status(500).json({ 
        error: "Failed to send email. Please try again later." 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
