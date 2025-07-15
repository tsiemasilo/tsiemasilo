import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { sendContactEmail, type EmailData } from "./email";
import { getComprehensiveGeoData } from "./ipGeoService";

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
      const { page, referrer, sessionId, timeSpent, fingerprint, personalData } = req.body;
      const userAgent = req.headers['user-agent'] || '';
      const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';
      
      const { browser, os, device } = parseUserAgent(userAgent);
      
      // Get comprehensive geo and business data
      console.log('Getting geo data for IP:', ipAddress);
      const geoData = await getComprehensiveGeoData(ipAddress);
      console.log('Received geo data:', geoData);
      
      // Extract personal information using advanced identification service
      const { extractPersonalInfo } = await import('./personalIdentificationService');
      const personalInfo = await extractPersonalInfo(req, fingerprint);
      
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
        // Enhanced business identification fields
        country: geoData.country,
        region: geoData.region,
        city: geoData.city,
        organization: geoData.organization,
        isp: geoData.isp,
        domain: geoData.domain,
        companyName: geoData.companyName,
        businessType: geoData.businessType,
        isBusinessVisitor: geoData.isBusinessVisitor,
        // Personal identification fields
        firstName: personalInfo.firstName || null,
        lastName: personalInfo.lastName || null,
        fullName: personalInfo.fullName || null,
        email: personalInfo.email || null,
        deviceName: personalInfo.deviceName || personalData?.deviceName || null,
        deviceId: personalInfo.deviceId || personalData?.deviceId || null,
        screenResolution: personalInfo.screenResolution || personalData?.screenResolution || null,
        timezone: personalInfo.timezone || personalData?.timezone || null,
        language: personalInfo.language || personalData?.language || null,
        platform: personalInfo.platform || personalData?.platform || null,
        networkType: personalInfo.networkType || personalData?.networkType || null,
        connectionSpeed: personalInfo.connectionSpeed || null,
        address: geoData.address || null,
        postalCode: geoData.postalCode || null,
        latitude: geoData.latitude ? geoData.latitude.toString() : null,
        longitude: geoData.longitude ? geoData.longitude.toString() : null,
        nearbyBusinesses: geoData.nearbyBusinesses || null,
        currentBusiness: geoData.currentBusiness || null,
        deviceMemory: personalInfo.deviceMemory || personalData?.deviceMemory || null,
        hardwareConcurrency: personalInfo.hardwareConcurrency || personalData?.hardwareConcurrency || null,
        socialMediaHandle: personalInfo.socialMediaHandle || null,
        linkedInProfile: personalInfo.linkedInProfile || null,
        githubProfile: personalInfo.githubProfile || null,
        twitterHandle: personalInfo.twitterHandle || null,
        metadata: { geoData, personalInfo, fingerprint }
      };
      
      const visitor = await storage.trackVisitor(visitorData);
      
      console.log('Advanced visitor tracked:', {
        ip: ipAddress,
        fullName: visitor.fullName,
        deviceName: visitor.deviceName,
        companyName: visitor.companyName,
        personalInfo: personalInfo
      });
      
      res.json({ success: true, visitor });
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
