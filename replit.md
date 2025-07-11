# Tsie Masilo - Professional Portfolio

## Overview

A modern, responsive developer portfolio website built with React and TypeScript, featuring interactive project showcases, a functional contact system, and a professional dark theme. The application demonstrates full-stack capabilities with a React frontend and Express.js backend, designed to showcase professional projects and facilitate client communication.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript for type safety and modern React features
- **Vite** as the build tool and development server for fast development
- **Tailwind CSS** for utility-first styling with custom dark theme
- **Framer Motion** for smooth animations and interactive transitions
- **Wouter** for lightweight client-side routing
- **Component-based architecture** using shadcn/ui and Radix UI primitives

### Backend Architecture
- **Express.js** server with TypeScript support
- **Serverless deployment** ready with Netlify Functions
- **RESTful API** design with `/api` prefix for all endpoints
- **Email service integration** for contact form functionality
- **Database-ready** with Drizzle ORM configuration for PostgreSQL

### Database Strategy
- **Drizzle ORM** configured for PostgreSQL with type-safe queries
- **Neon Database** integration ready (@neondatabase/serverless)
- **Migration system** set up with drizzle-kit
- **Schema-first approach** with shared types between frontend and backend

## Key Components

### Contact System
- **Nodemailer integration** with Gmail SMTP for email delivery
- **Professional email templates** with HTML formatting
- **Form validation** with proper error handling
- **Multiple email service options** (Gmail SMTP, SendGrid backup)
- **CORS-enabled** API endpoints for cross-origin requests

### UI Component Library
- **shadcn/ui** component system with consistent design tokens
- **Radix UI primitives** for accessible, unstyled components
- **Custom theme system** with CSS variables for dark mode
- **Responsive design** with mobile-first approach
- **Interactive animations** using Framer Motion

### Project Showcase
- **Featured projects** with live demo links
- **Category filtering** for different project types
- **Interactive project cards** with hover effects
- **External link integration** for GitHub and live demos

## Data Flow

### Contact Form Flow
1. User fills out contact form with name, email, and message
2. Frontend validates form data and sends POST request to `/api/send-email`
3. Backend validates data and formats professional email template
4. Email sent via Nodemailer with Gmail SMTP or SendGrid fallback
5. Success/error response returned to frontend with toast notifications

### Development Workflow
1. **Frontend development** served by Vite dev server with hot reload
2. **Backend API** runs on Express.js with TypeScript compilation
3. **Database operations** handled through Drizzle ORM with type safety
4. **Static assets** served from client/public directory

## External Dependencies

### Core Dependencies
- **React ecosystem**: React 18, React DOM, React Query for state management
- **TypeScript**: Full type safety across frontend and backend
- **Styling**: Tailwind CSS, class-variance-authority, clsx utilities
- **Animations**: Framer Motion for smooth interactions
- **Forms**: React Hook Form with Zod validation resolvers

### Backend Services
- **Email delivery**: Nodemailer with Gmail SMTP, SendGrid as backup
- **Database**: Neon PostgreSQL with Drizzle ORM
- **Authentication**: Ready for session-based auth with connect-pg-simple

### UI Libraries
- **Radix UI**: Accessible component primitives
- **Lucide React**: Consistent icon library
- **React Icons**: Additional icon sets (SimpleIcons for brand logos)

## Deployment Strategy

### Production Deployment
- **Netlify Functions** for serverless backend API
- **Static site hosting** for optimized frontend build
- **Environment variables** for email credentials and database URLs
- **Build optimization** with Vite's production build system

### Development Environment
- **Local development** with Express.js server and Vite dev server
- **Hot module replacement** for rapid development
- **TypeScript compilation** with strict type checking
- **Database migrations** managed through Drizzle Kit

### Build Process
1. **Frontend build**: Vite compiles React app to static files
2. **Backend build**: ESBuild bundles Express.js server for deployment
3. **Type checking**: TypeScript validates all code before build
4. **Asset optimization**: Vite optimizes images, CSS, and JavaScript

### Configuration Management
- **Environment-specific configs** for development and production
- **Database connection** through environment variables
- **Email service configuration** with fallback options
- **CORS settings** for cross-origin API requests