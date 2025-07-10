import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { sendContactEmail, type EmailData } from "./email";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

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
