# Corporate Event Rentals Landing Page

## Overview
A professional, single-page React landing website for a corporate event rental business with smooth animations, responsive design, and modern UI components.

## Tech Stack
- **React 18** with Vite for optimal performance
- **TailwindCSS** for utility-first styling
- **Framer Motion** for smooth animations
- **Swiper.js** for carousels
- **React Icons** for UI icons
- **React Intersection Observer** for scroll-triggered animations
- **React Lazy Load Image Component** for performance optimization

## Features
- Fully responsive design (mobile, tablet, desktop)
- Smooth scrolling navigation
- Multiple horizontal carousels
- Scroll-triggered animations
- Lazy loading for images and videos
- Custom hover states and transitions
- Modern color scheme with dark theme

## Color Scheme
- **Background**: Dark Gray / Charcoal (#1a1a1a, #2d2d2d)
- **Text**: White / Light Gray (#ffffff, #f0f0f0)
- **Buttons / Highlights**: Gold / Electric Blue (#FFD700, #00BFFF)
- **Hover**: White background with black text

## Page Sections
1. **Navbar** - Sticky navigation with smooth scroll
2. **Hero Section** - Full-screen video background with call-to-action
3. **Venue Types** - Horizontal carousel showcasing different venue types
4. **Country Coverage** - Image/text layout about nationwide service
5. **Process Section** - Alternating image/text layout showing the process
6. **Standards** - Horizontal carousel featuring quality standards
7. **Products** - Full-width product showcase with smooth transitions
8. **Testimonials** - Horizontal testimonial carousel
9. **CTA Section** - Full-width call-to-action with animations
10. **Footer** - Contact info, social links, and quick links

## Development Commands

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Lint Code
```bash
npm run lint
```

## Project Structure
```
src/
├── components/
│   ├── Navbar.jsx
│   ├── Hero.jsx
│   ├── VenueCarousel.jsx
│   ├── CountrySection.jsx
│   ├── ProcessSection.jsx
│   ├── StandardsCarousel.jsx
│   ├── ProductsSection.jsx
│   ├── TestimonialsCarousel.jsx
│   ├── CtaSection.jsx
│   └── Footer.jsx
├── assets/
├── styles/
├── App.jsx
├── main.jsx
└── index.css
```

## Component Implementation Notes

### Navbar
- Sticky positioning with transparent background
- Smooth scroll to sections
- Hover effects with color inversion

### Carousels
- Swiper.js implementation
- Custom navigation arrows
- Touch-friendly for mobile
- Lazy loading for images

### Animations
- Framer Motion for entrance animations
- Intersection Observer for scroll triggers
- Custom CSS animations for hover states

### Responsive Design
- Mobile-first approach
- Tailwind responsive utilities
- Optimized layouts for all screen sizes

## Performance Optimizations
- Lazy loading for images and videos
- Code splitting with React.lazy()
- Optimized carousel rendering
- Efficient scroll animations

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Graceful degradation for older browsers

## Future Enhancements
- Contact form integration
- Booking system
- Image gallery zoom
- Video testimonials
- Multi-language support
- CMS integration