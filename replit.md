# Miraj Candles E-commerce Platform

## Overview
A modern e-commerce platform for Miraj Candles built with React, TypeScript, Vite, and Express. The platform features a customer-facing storefront, admin panel, and backend API.

## Project Status
✅ **Successfully imported and configured for Replit environment**
- All dependencies installed
- Frontend and backend services running
- Deployment configuration completed

## Architecture
```
miraj-candles/
├── client/          # React frontend (Port 5000) - Main user interface
├── server/          # Express backend API (Port 3000) - Internal API
├── admin/           # Admin panel (React) - Management interface
└── package.json     # Workspace configuration
```

## Current Configuration
- **Frontend URL**: `https://[repl-name].replit.app:5000/` (Main website)
- **Backend API**: `0.0.0.0:3000` (configurable via HOST env var)
- **Admin Panel**: Available at `/admin` route

## Key Features
- Modern React with TypeScript
- Responsive design with Tailwind CSS
- Product catalog with filtering and search
- Shopping cart and wishlist functionality
- User authentication system
- Admin panel for product management
- MongoDB integration (using sample data for development)

## Development Workflows
- **Frontend Client**: `cd client && npm run dev` (Port 5000)
- **Backend API**: `cd server && npm run dev` (Port 3000)

## Deployment
- Target: **Autoscale** (stateless e-commerce site)
- Build command: `npm run build`
- Run command: `node server/index.js`

## Recent Changes
- 2025-09-26: Initial import and Replit environment setup
- Fixed port configurations for Replit hosting
- Fixed backend server binding to use 0.0.0.0 for production deployment
- Configured deployment settings for production
- All services verified working correctly

## User Preferences
- Prefer modern web technologies (React, TypeScript, Vite)
- Focus on e-commerce functionality
- Clean, responsive design approach