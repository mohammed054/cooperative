# Website Structure Documentation

## 🎯 Project Overview

**Ghaim UAE** is a premium event rental and management website built with React.js. The platform showcases corporate event services, equipment rentals, and venue solutions across the UAE.

---

## 🏗️ Technology Stack

### Frontend Framework
- **React 19.2.0** - Core UI framework
- **Vite 7.2.4** - Build tool and development server
- **React DOM 19.2.0** - DOM rendering

### Styling & UI
- **Tailwind CSS 3.4.19** - Utility-first CSS framework
- **PostCSS 8.5.6** - CSS processing
- **Autoprefixer 10.4.23** - CSS vendor prefixing

### Animation & Interactivity
- **Framer Motion 12.29.2** - Animation library
- **React Intersection Observer 10.0.2** - Scroll-triggered animations
- **Swiper 12.1.0** - Touch-enabled slider/carousel
- **React Icons 5.5.0** - Icon library

### Development Tools
- **ESLint 9.39.1** - Code linting
- **TypeScript Support** - Type safety (via @types packages)

---

## 🎨 Design System

### Color Palette
- **Primary**: Charcoal/Dark Navy (`#1a1a2e`, `#16213e`)
- **Backgrounds**: White (`#ffffff`), Light Gray (`#f8f9fa`)
- **Accent**: Light Blue (derived from logo)
- **Micro-accent**: Pink (used sparingly for dots, separators)
- **Text**: Dark charcoal (`#333333`) for body, lighter shades for secondary text

### Typography
- **Headings**: Large, bold sans-serif fonts
- **Body Text**: Clean, readable sans-serif
- **Hierarchy**: Clear visual distinction between h1-h6 levels
- **Spacing**: Generous whitespace for premium feel

### Visual Style
- **Aesthetic**: Corporate, Premium, Calm, Confident
- **Layout**: Clean grid system with consistent spacing
- **Animations**: Subtle, professional transitions
- **Imagery**: High-quality event photography and venue shots

---

## 📐 Website Architecture

### 1. Global Header/Navbar
**Location**: `src/components/GhaimAEHeader.jsx`
- **Design**: Fixed transparent header with solid background on scroll
- **Desktop**: Logo left, navigation links center/right, CTA button
- **Mobile**: Hamburger menu with full-screen overlay
- **Navigation**: Services, Rentals, Process, Coverage, Contact

### 2. Hero Section
**Location**: `src/components/Hero.jsx`
- **Dimensions**: 100vw × 100vh full viewport
- **Background**: Video or high-quality hero image
- **Content**: Centered headline, supporting text, primary CTA
- **Features**: Scroll hint/arrow animation

### 3. Event Types Section
**Location**: `src/components/ScrollableCardSection.jsx`
- **Interaction**: Full-screen scroll-snap behavior
- **Content**: One event type per screen (Corporate, Conferences, Exhibitions, Government)
- **Design**: Large headlines, background visuals, no navigation controls

### 4. Rental Categories
**Location**: `src/components/ScrollableCardSection.jsx` (continued)
- **Categories**: Chairs & Seating, Stages & Platforms, Screens & Projectors, Lighting & Audio, Booths & Stands
- **Layout**: Full-screen sections with scroll-snap
- **Visual**: Large product imagery with minimal text

### 5. Country Coverage Section
**Location**: Mixed implementation in various components
- **Layout**: Two-column responsive design
- **Content**: Imagery on left, text content on right
- **CTAs**: "View Coverage" and "Contact Us" buttons

### 6. Process Section
**Location**: `src/components/GhaimAEProcessSection.jsx`
- **Steps**: 3-4 step process (Consultation → Planning → Delivery → Support)
- **Design**: Large numbers, minimal icons, clear flow visualization
- **Layout**: Professional, structured presentation

### 7. Featured Setups
**Location**: `src/components/ProjectDeck.jsx`
- **Interaction**: Scrollable story format
- **Content**: Dynamic setup images with text and tags
- **Tags**: Event specifications (e.g., "500+ Seats", "Indoor", "Corporate")
- **CTA**: "View All Solutions" button

### 8. Testimonials Section
**Location**: `src/components/TestimonialsSection.jsx`
- **Layout**: Horizontal scroll or stacked cards
- **Content**: Real quotes with company names and roles
- **Design**: Clean typography, focus on trust and credibility

### 9. Final CTA Section
**Location**: `src/components/FinalCta.jsx`
- **Purpose**: Primary conversion point
- **Content**: Strong headline, supporting sentence, prominent CTA button
- **Design**: Simple, impactful, conversion-focused

### 10. Footer
**Location**: `src/components/Footer.jsx`
- **Columns**: Brand description, Services, Rentals, Contact
- **Bottom Bar**: Copyright, Privacy Policy, Terms
- **Style**: Multi-column, clean, professional

---

## 🗂️ File Organization

### Component Structure
```
src/
├── components/
│   ├── Hero.jsx                    # Main hero section
│   ├── GhaimAEHeader.jsx           # Navigation header
│   ├── ScrollableCardSection.jsx   # Event types & categories
│   ├── GhaimAEProcessSection.jsx   # Process steps
│   ├── ProjectDeck.jsx             # Featured setups
│   ├── TestimonialsSection.jsx     # Customer testimonials
│   ├── FinalCta.jsx               # Final call-to-action
│   ├── Footer.jsx                 # Site footer
│   ├── GetStartedButton.jsx       # CTA button component
│   ├── CurvedArrow.jsx            # Animated arrow elements
│   └── AnimatedArrow.jsx          # Scroll animations
├── hooks/
│   └── useScrollSnap.js           # Custom scroll-snap hook
├── App.jsx                        # Main app component
├── main.jsx                       # App entry point
├── App.css                        # Global styles
└── index.css                      # Base styles
```

### Asset Organization
```
public/
├── videos/
│   └── background.mp4             # Hero background video
└── images/                        # Static images
```

### Configuration Files
- `vite.config.js` - Vite build configuration
- `tailwind.config.js` - Tailwind CSS customization
- `postcss.config.js` - PostCSS setup
- `eslint.config.js` - Linting rules

---

## ⚡ Key Features & Interactions

### Scroll-Snap Sections
- **Implementation**: Custom hook in `useScrollSnap.js`
- **Behavior**: Full-screen sections with smooth snap scrolling
- **Purpose**: Immersive content presentation

### Responsive Design
- **Mobile**: Hamburger menu, stacked layouts, touch-optimized
- **Tablet**: Adaptive layouts and navigation
- **Desktop**: Full multi-column layouts and hover effects

### Animation System
- **Framer Motion**: Component-level animations
- **Intersection Observer**: Scroll-triggered effects
- **CSS Transitions**: Smooth hover and focus states

### Performance Optimizations
- **Vite**: Fast development and optimized builds
- **Code Splitting**: Automatic bundle optimization
- **Image Optimization**: Compressed media assets

---

## 🚀 Development Workflow

### Local Development
```bash
npm run dev      # Start development server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Code quality check
```

### Build Output
- **Development**: Hot module replacement with fast refresh
- **Production**: Optimized static files in `/dist` directory
- **Assets**: Automatic image and video optimization

### Component Development Pattern
1. Each section is a self-contained React component
2. Consistent prop structure across components
3. Modular CSS using Tailwind utility classes
4. Reusable UI components (buttons, arrows, cards)

---

## 🎯 UI/UX Principles

### User Experience Goals
- **First Impressions**: Instant understanding of services offered
- **Navigation**: Intuitive section discovery
- **Engagement**: Smooth, professional interactions
- **Conversion**: Clear pathways to contact and quote requests

### Design Decisions
- **Minimal Navigation**: 4-5 main links maximum
- **Full-Screen Sections**: Immersive content presentation
- **High-Quality Imagery**: Professional event photography
- **Clean Typography**: Enhanced readability and brand perception

### Accessibility Considerations
- **Semantic HTML**: Proper heading hierarchy and structure
- **Keyboard Navigation**: Full keyboard accessibility
- **Color Contrast**: WCAG compliant color choices
- **Responsive Design**: Optimized for all screen sizes

---

## 📊 Performance Metrics

### Load Optimization
- **Bundle Size**: Optimized via Vite's tree-shaking
- **Image Loading**: Lazy loading for below-fold content
- **Video Optimization**: Compressed background video
- **CSS Purging**: Tailwind's unused class removal

### Animation Performance
- **Hardware Acceleration**: GPU-accelerated transforms
- **Reduced Motion**: Respects user's motion preferences
- **Smooth Scrolling**: Native browser optimization

---

This structure documentation provides a comprehensive overview of how the Ghaim UAE website is organized, styled, and implemented across all sections from the hero background video to the final CTA and footer.