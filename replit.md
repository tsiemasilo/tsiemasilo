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

### Replit Deployment
- **Autoscale deployment** via Replit's built-in deployment system
- **Build**: `npm run build` (Vite frontend + esbuild server bundle)
- **Production run**: `node ./dist/index.js` serving on port 5000
- **Environment variables**: `DATABASE_URL` (auto-provisioned), `EMAIL_USER` and `EMAIL_PASS` (need manual setup in Secrets)

### Development Environment
- **Dev command**: `npm run dev` runs Express + Vite middleware on port 5000
- **Hot module replacement** for rapid frontend development
- **TypeScript compilation** with strict type checking
- **Database migrations** managed through Drizzle Kit (`npm run db:push`)

### Build Process
1. **Frontend build**: Vite compiles React app to `dist/public/`
2. **Backend build**: esbuild bundles Express server to `dist/index.js` (ESM format)
3. **Asset optimization**: Vite optimizes images, CSS, and JavaScript

### Configuration Management
- **Database**: PostgreSQL via `DATABASE_URL` environment variable (Replit-managed)
- **Email**: Gmail SMTP via `EMAIL_USER` and `EMAIL_PASS` secrets (no hardcoded credentials)
- **Storage**: Currently uses in-memory storage (MemStorage) for visitor tracking; DB schema ready for migration

## Tech Stack Animation
- **FloatingTechIcon component**: Extracted for proper React hooks usage
- **Scroll parallax**: Framer Motion `useTransform` + `useSpring` per icon with unique `speed` values
- **Floating bob**: CSS `@keyframes techIconFloat` animation (independent of scroll parallax)
- **14 tech icons**: React, Node, TypeScript, JavaScript, Tailwind, Python, MongoDB, PostgreSQL, CSS3, HTML5, Figma, Git, Flutter, Supabase

## Recent Changes

### Replit Migration
- Fixed React hooks violation: extracted `FloatingTechIcon` component from `.map()` callback
- Removed hardcoded email credentials from `server/email.ts` and Netlify functions
- Fixed deployment config: corrected ESM output path (`dist/index.js` not `dist/index.cjs`)
- Added CSS `@keyframes techIconFloat` for smooth icon bobbing animation
- Cleaned up unused `floatY1/2/3` motion values

### July 15, 2025 - Enhanced Real IP Geolocation System
- **Removed mock data**: Eliminated all demonstration/test data for genuine visitor tracking
- **Real IP geolocation**: Implemented multi-source IP geolocation using ipapi.co and ip-api.com
- **Business identification**: Active company detection from IP organization data
- **Location accuracy**: Precise city, region, country identification from public IP addresses
- **Private IP handling**: Local/private IPs show no location data (as expected)
- **Enhanced dashboard**: Admin dashboard displays actual geolocation data when available
- **API testing**: Added test endpoint for real-time IP geolocation verification
- **Multi-region support**: Confirmed working with IPs from US, India, South Africa, and other regions