# Ghaim UAE - Event Rental & Management Platform

A premium React.js website showcasing corporate event services, equipment rentals, and venue solutions across the UAE.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

## 📋 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Create optimized production build  
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint code quality checks

## 🛠️ Tech Stack & Frameworks

### Core Technologies
- **React 19.2.0** - Modern UI framework with concurrent features
- **Vite 7.2.4** - Lightning-fast build tool and dev server
- **Tailwind CSS 3.4.19** - Utility-first CSS framework with PostCSS
- **ESLint 9.39.1** - Code quality and consistency enforcement

### Animation & UI Libraries
- **Framer Motion 12.29.2** - Production-ready animation library
- **React Intersection Observer 10.0.2** - Scroll-triggered animations
- **Swiper 12.1.0** - Modern touch slider with hardware acceleration
- **React Icons 5.5.0** - Comprehensive icon component library

### Development Experience
- **Hot Module Replacement** - Instant component updates during development
- **ESLint Integration** - Automated code quality checks
- **Optimized Builds** - Automatic tree-shaking and minification
- **TypeScript Support** - Type safety via @types packages

## 🎨 Design System Overview

### Color Palette
- **Primary**: Charcoal/Dark Navy (#1a1a2e, #16213e) - Professional base
- **Backgrounds**: White (#ffffff), Light Gray (#f8f9fa) - Clean canvas
- **Accent**: Light Blue - Brand consistency from logo
- **Micro-accent**: Pink - Subtle separators and decorative elements
- **Typography**: Dark charcoal (#333333) body, lighter hierarchy text

### UI Components
- **Responsive Navigation**: Transparent header with mobile hamburger menu
- **Hero Section**: Full viewport with video background and centered CTA
- **Scroll-Snap Sections**: Immersive full-screen content presentation
- **Card Components**: Service showcases with hover animations
- **Testimonials**: Customer feedback with company attribution
- **CTA Sections**: Strategic conversion points throughout user journey

### Interactive Features
- **Smooth Scrolling**: Native browser optimization with scroll-snap
- **Intersection Observer**: Content animations on scroll
- **Hover States**: Professional micro-interactions on all interactive elements
- **Mobile-First**: Touch-optimized interactions and gestures
- **Responsive Design**: Adaptive layouts from mobile to desktop

## 🏗️ Architecture Overview

The application follows a component-based architecture with modular sections:

1. **Header/Navigation** - Global navigation with mobile responsiveness
2. **Hero Section** - Video background with primary value proposition
3. **Service Categories** - Scrollable event types and rental categories
4. **Process Flow** - Step-by-step service explanation
5. **Featured Projects** - Dynamic portfolio showcase
6. **Testimonials** - Social proof and customer validation
7. **Call-to-Action** - Conversion-focused final section
8. **Footer** - Multi-column information architecture

## 📁 Project Structure

```
src/
├── components/          # React UI components
├── hooks/              # Custom React hooks
├── App.jsx             # Main application component
├── main.jsx            # Application entry point
├── App.css             # Global component styles
└── index.css           # Base CSS variables and utilities
```

## 🎯 Performance Features

- **Bundle Optimization**: Automatic code splitting and tree-shaking
- **Image Optimization**: Compressed media assets with lazy loading
- **Animation Performance**: Hardware-accelerated transforms
- **Development Speed**: Instant HMR with Vite
- **Production Ready**: Optimized static assets in dist/

## 📖 Documentation

For detailed website structure, component breakdown, and implementation details, see **[WEBSITE_STRUCTURE.md](./WEBSITE_STRUCTURE.md)**.

---

## Development Notes

This project uses modern React patterns and best practices:
- Functional components with hooks
- CSS-in-JS via Tailwind utility classes
- Component composition and reusability
- Performance-conscious animation implementation
- Mobile-first responsive design principles