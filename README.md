
# Miraj Candles E-commerce Platform

A modern e-commerce platform built with React, TypeScript, and Tailwind CSS.

## Project Structure

```
miraj-candles/
├── client/          # Frontend React application
├── server/          # Backend Express server
├── admin/           # Admin panel (separate React app)
└── README.md
```

## Getting Started

### Client (Frontend)
```bash
cd client
npm install
npm run dev
```
The client will run on http://localhost:5000

### Server (Backend)
```bash
cd server
npm install
npm run dev
```
The server will run on http://localhost:3000

### Admin Panel
```bash
cd admin
npm install
npm run dev
```
The admin panel will run on http://localhost:5001

## Features

- Modern React with TypeScript
- Responsive design with Tailwind CSS
- Product catalog with filtering and search
- Shopping cart and wishlist
- User authentication
- Admin panel for product management
- Firebase integration ready

## Deployment

Each part of the application can be deployed separately:
- Client: Static hosting (Vercel, Netlify, Replit)
- Server: Node.js hosting (Railway, Heroku, Replit)
- Admin: Static hosting (separate subdomain)

## Technologies

- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Build Tool**: Vite
