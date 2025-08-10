# Overview

This is a customizable portfolio website for Vimal Kumar Yadav built with React, TypeScript, and modern design patterns. The project showcases his professional experience as a Software Engineer II and QA Automation Expert. The application features a modern, responsive design with multiple theme options (6 themes), smooth auto-scrolling navigation, programming language icons, profile photo capability, and easy editing through data files. The website is optimized for GitHub Pages deployment.

# User Preferences

Preferred communication style: Simple, everyday language.

# Portfolio Website Features

## Current Implementation
- **Multi-Theme System**: 6 color themes (Light, Dark, Blue, Purple, Green, Orange) with visual theme selector
- **Profile Photo**: Editable profile photo section with placeholder and upload functionality
- **Auto-Scroll Navigation**: Smooth scrolling between sections when clicking header navigation
- **Programming Language Icons**: Icons for Java, JavaScript, Node.js, Selenium, Git, etc.
- **Responsive Design**: Mobile-first approach with optimized layouts
- **GitHub Pages Ready**: Includes deployment workflow and documentation

## Recent Changes (January 2025)
- Added 6 theme options with visual color indicators in theme selector
- Implemented profile photo section with editing capability and fallback SVG
- Enhanced navigation with smooth auto-scrolling to sections
- Added programming language and tool icons throughout skills section
- Created GitHub Actions workflow for automatic deployment
- Added comprehensive README with deployment instructions
- Optimized mobile responsive design and animations

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript, using functional components and hooks
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React Query (TanStack Query) for server state management
- **Styling**: Tailwind CSS with custom design system and CSS variables for theming
- **UI Components**: Comprehensive component library based on Radix UI primitives with shadcn/ui design patterns
- **Build Tool**: Vite for fast development and optimized production builds

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM configured for PostgreSQL
- **Session Management**: Express sessions with PostgreSQL store (connect-pg-simple)
- **API Design**: RESTful API structure with /api prefix routing
- **Development**: Hot reload with Vite middleware integration

## Data Storage
- **Database**: PostgreSQL with Neon serverless driver
- **Schema Management**: Drizzle Kit for migrations and schema generation
- **Current Storage**: In-memory storage implementation with interface for easy database integration
- **User Model**: Basic user schema with UUID primary keys, username, and password fields

## Development Architecture
- **Monorepo Structure**: Shared TypeScript types between client and server in `/shared` directory
- **Path Aliases**: Configured aliases for clean imports (@/ for client, @shared for shared types)
- **Build Process**: Separate client (Vite) and server (esbuild) build pipelines
- **Development Server**: Express serves Vite dev middleware in development, static files in production

## Design System
- **Theme Support**: Multi-theme system (light, dark, blue) with CSS custom properties
- **Component System**: Extensible component library with consistent API patterns
- **Typography**: Inter font family with responsive scaling
- **Animations**: CSS transitions and animations with Tailwind utilities
- **Responsive Design**: Mobile-first approach with breakpoint-based responsive utilities

# External Dependencies

## Frontend Dependencies
- **React Ecosystem**: React 18, React DOM, React Query for data fetching
- **UI Framework**: Radix UI primitives for accessible component foundations
- **Styling**: Tailwind CSS, class-variance-authority for component variants, clsx for conditional classes
- **Forms**: React Hook Form with Zod resolvers for validation
- **Icons**: Lucide React for consistent iconography
- **Utilities**: date-fns for date manipulation, cmdk for command palette functionality

## Backend Dependencies
- **Database**: Neon PostgreSQL serverless driver, Drizzle ORM for database operations
- **Validation**: Zod for runtime type validation and schema generation
- **Session Management**: Express session with PostgreSQL store adapter
- **Development**: tsx for TypeScript execution, esbuild for production builds

## Development Tools
- **Build Tools**: Vite with React plugin, TypeScript compiler
- **Code Quality**: ESLint configuration, TypeScript strict mode
- **Development Environment**: Replit-specific plugins for error handling and debugging
- **CSS Processing**: PostCSS with Tailwind CSS and Autoprefixer

## Database Configuration
- **Provider**: Neon Database (serverless PostgreSQL)
- **Connection**: Environment variable-based configuration (DATABASE_URL)
- **Migrations**: Drizzle Kit manages schema migrations in `/migrations` directory
- **Schema**: Located in `/shared/schema.ts` for type safety across client and server