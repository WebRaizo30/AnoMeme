# ANOMEME Frontend

Next.js 15 frontend for ANOMEME - Social Intent Terminal for Memecoin Trading.

## 🚀 Quick Start

### Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit [`localhost:3000`](http://localhost:3000) from your browser.

### Production Build
```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🌐 Production Environment

- **Live URL:** https://anomeme.fun
- **VPS:** 157.180.46.198
- **Build:** Static export (out/ directory)
- **Server:** Nginx

## 🛠️ Tech Stack

- **Next.js 15** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Zustand** - State management
- **Radix UI** - Component library

## 📁 Project Structure

```
src/
├── app/                 # Next.js app directory
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   └── terminal/       # Terminal interface components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── services/           # API services
└── types/              # TypeScript type definitions
```

## 🔧 Configuration

### Environment Variables
- `NEXT_PUBLIC_API_BASE_URL` - Backend API URL (https://anomeme.fun/api)

### Next.js Config
- Static export enabled
- Asset prefix for production
- Image optimization disabled for static export
- Trailing slash enabled

## 🚀 Deployment

The frontend is configured for static export and served by Nginx on the VPS.

### Build Process
```bash
npm run build
```

This creates a static export in the `out/` directory that can be served by any web server.

### Nginx Configuration
The static files are served from `/var/www/anomeme/anomeme/out` on the VPS.

## 📱 Features

- **Terminal Interface** - Command-line style UI
- **Intent Creation** - Visual intent builder
- **Risk Assessment** - Real-time risk analysis
- **Social Signals** - Live social media monitoring
- **Wallet Integration** - Web3 wallet connection
- **Responsive Design** - Mobile-friendly interface

## 🔗 API Integration

The frontend communicates with the Phoenix backend API:
- Authentication endpoints
- Intent management
- Social signal processing
- Risk assessment
- Real-time WebSocket connections
