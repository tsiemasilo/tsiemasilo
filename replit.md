# Developer Portfolio Application

## Overview

This is a full-stack web application built as a developer portfolio website. The application uses a modern tech stack with React/TypeScript on the frontend, Express.js on the backend, and PostgreSQL with Drizzle ORM for data persistence. The UI is styled with Tailwind CSS and shadcn/ui components, creating a professional dark-themed portfolio interface.

## User Preferences

Preferred communication style: Simple, everyday language.
User name: Tsie Masilo
Portfolio brand: "Hello World" 
Personal profile image: Added user's personal photo with 3D hover effects and shimmer animations

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack React Query for server state management
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom dark theme variables
- **Animations**: Framer Motion for smooth transitions and animations
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Session Management**: Built-in session handling with connect-pg-simple
- **API Structure**: RESTful API with `/api` prefix routing

### Data Storage
- **Database**: PostgreSQL (configured for Neon serverless)
- **ORM**: Drizzle ORM with migrations support
- **Schema**: Centralized schema definition in `shared/schema.ts`
- **Development Storage**: In-memory storage fallback for development

## Key Components

### Database Schema
- **Users Table**: Basic user management with username/password authentication
- **Migrations**: Automated database migrations using Drizzle Kit
- **Type Safety**: Zod validation schemas generated from database schema

### Authentication & Authorization
- **Session-based**: Traditional session-based authentication approach
- **Password Storage**: Plain text storage (should be enhanced with hashing)
- **User Management**: Basic CRUD operations for user entities

### UI Components
- **Design System**: Comprehensive shadcn/ui component library
- **Theme**: Dark theme with green accent colors (hsl(158, 64%, 52%))
- **Responsive**: Mobile-first responsive design approach
- **Accessibility**: Built-in accessibility features from Radix UI

### Portfolio Features
- **Landing Page**: Professional portfolio homepage with animations
- **Contact Form**: Fully functional SMTP-powered contact form with Gmail integration
- **Email System**: Professional HTML email formatting with reply-to functionality
- **Mobile Navigation**: Responsive navigation with mobile menu
- **Social Links**: Integration points for GitHub, LinkedIn, Indeed

## Data Flow

1. **Client Requests**: Frontend makes API calls using TanStack React Query
2. **API Routing**: Express.js routes handle requests with `/api` prefix
3. **Data Layer**: Drizzle ORM manages database interactions
4. **Response**: JSON responses sent back to client
5. **State Updates**: React Query manages cache updates and UI synchronization

### Error Handling
- **Global Error Boundary**: Centralized error handling in Express middleware
- **Client-side**: React Query error states and toast notifications
- **Development**: Runtime error overlay for development debugging

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL driver
- **@tanstack/react-query**: Server state management
- **drizzle-orm**: Type-safe ORM
- **framer-motion**: Animation library
- **wouter**: Lightweight React router

### UI Dependencies
- **@radix-ui/***: Comprehensive primitive component library
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library

### Development Tools
- **tsx**: TypeScript execution for development
- **esbuild**: Fast bundling for production
- **drizzle-kit**: Database migration tooling

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite builds React application to `dist/public`
2. **Backend Build**: esbuild bundles server code to `dist/index.js`
3. **Static Assets**: Frontend assets served from Express in production

### Environment Configuration
- **Development**: Hot reloading with Vite middleware integration
- **Production**: Static file serving with optimized bundles
- **Database**: Environment-based connection string configuration

### Scripts
- `npm run dev`: Development server with hot reloading
- `npm run build`: Production build for both frontend and backend
- `npm run start`: Production server startup
- `npm run db:push`: Database schema deployment

### Hosting Considerations
- **Database**: Requires PostgreSQL instance (configured for Neon)
- **Node.js**: Requires Node.js runtime environment
- **Environment Variables**: `DATABASE_URL` required for database connection
- **Static Assets**: Frontend assets bundled and served by Express

## Recent Changes: Latest modifications with dates

### July 10, 2025 - SMTP Contact Form Implementation
- **Contact Form**: Successfully implemented and tested SMTP email functionality
- **Email Integration**: Gmail SMTP with nodemailer for reliable email delivery
- **Deployment**: Working solution deployed to Netlify with proper function dependencies
- **Testing**: Verified email delivery on development server before deployment
- **User Feedback**: Contact form confirmed working with success toast notifications

### July 10, 2025 - Email Animation Sequence Implementation
- **Typewriter Animation**: Full-screen overlay with original blue colors (#5C86FF, #275EFE)
- **Email Envelope Animation**: Sequential blue envelope with floating papers effect
- **Animation Flow**: Typewriter (2.5s) → Email envelope (3s) → Form reset
- **Visual Feedback**: Removed toast notifications, animations provide complete user feedback
- **Standard Sizing**: Fixed animation dimensions - typewriter (92px×56px), envelope (120px×70px)
- **Deployment**: Complete animation sequence deployed to Netlify with proper timing