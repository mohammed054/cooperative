# Ghaim UAE - Production Website

> Premium event production company based in Dubai, providing high-end event services for corporate events, government summits, and luxury hospitality events across the UAE.

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/your-org/cooperative.git
cd cooperative

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

## 📋 Prerequisites

- **Node.js**: v20.19.0 or higher
- **npm**: v10.0.0 or higher  
- **Git**: For version control
- **Modern Browser**: Chrome 90+, Firefox 88+, Safari 14+

## 🛠️ Development Setup

### 1. Environment Configuration
```bash
# Copy the environment template
cp .env.example .env.local

# Edit .env.local with your configuration
# Add your Google Analytics 4 Measurement ID
# Add your Sentry DSN for error monitoring
# Add your lead webhook URL for form submissions
```

### 2. Install Dependencies
```bash
# Install all dependencies
npm install

# Verify installation
npm run lint
npm run build
```

### 3. Development Commands
```bash
# Start development server (http://localhost:5173)
npm run dev

# Run linting and formatting
npm run lint          # Check for code issues
npm run test:run      # Run unit tests
npm run lint:fix       # Auto-fix linting issues
npm run format         # Format code with Prettier
npm run format:check   # Check code formatting

# Build for production
npm run build          # Build production version
npm run preview         # Preview production build locally
```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable React components
│   ├── Button.jsx      # Button variants (primary, secondary, etc.)
│   ├── HeaderDesktop.jsx # Desktop navigation
│   ├── HeaderMobile.jsx # Mobile navigation  
│   ├── MegaMenu.jsx   # Dropdown navigation menu
│   └── ...
├── context/            # React contexts
│   └── AnalyticsContext.jsx
├── hooks/              # Custom React hooks
│   ├── useAnalytics.js  # Google Analytics 4 tracking
│   └── useFocusTrap.js # Accessibility focus management
├── pages/              # Page components
│   ├── Home.jsx        # Homepage
│   ├── Services.jsx    # Services listing
│   └── ...
├── utils/              # Utility functions
│   ├── errorMonitoring.js # Sentry error tracking
│   └── healthCheck.js   # Health check utilities
└── styles/             # Global styles
    └── index.css
```

## 🔧 Configuration

### Environment Variables
```bash
# Analytics Configuration
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Error Monitoring
VITE_SENTRY_DSN=https://XXXXXXXXXX.ingest.sentry.io/XXXXX

# Lead Capture
VITE_LEAD_WEBHOOK_URL=https://your-webhook-endpoint.example.com
VITE_LEAD_WEBHOOK_KEY=optional_webhook_key

# Application Version
VITE_APP_VERSION=1.0.0
```

### Build Configuration
- **Vite**: Build tool and development server
- **React 19**: UI framework
- **Tailwind CSS**: Utility-first CSS framework
- **TypeScript Ready**: Configured for future migration
- **ESLint + Prettier**: Code quality tools

## 📊 Analytics & Monitoring

### Google Analytics 4
- **Page Views**: Automatic tracking on route changes
- **Events**: Button clicks, form submissions, downloads
- **Performance**: Core Web Vitals monitoring
- **Goals**: Conversion funnel tracking

### Error Monitoring (Sentry)
- **JavaScript Errors**: Automatic error capture
- **Performance**: Transaction monitoring
- **User Context**: Track user sessions
- **Releases**: Error tracking by version

### Health Monitoring
- **Uptime**: External monitoring via UptimeRobot
- **Performance**: Core Web Vitals
- **Security**: Automated vulnerability scanning
- **API Health**: Custom health check endpoints

## 🚀 Deployment

### Automated CI/CD Pipeline
```bash
# Pull request / main push -> lint + test + build
git push feature/your-branch

# Main branch -> Production deploy
git push main
```

### Environments
- **Development**: Local development
- **Production**: `main` branch deployment

### Build Process
1. **Code Quality**: Linting and formatting checks
2. **Tests**: Unit tests via Vitest
3. **Build**: Production optimization
4. **Upload**: GitHub Pages deployment

### Code Standards
- **ESLint**: Enforces code quality
- **Prettier**: Consistent formatting
- **Component Structure**: Single responsibility principle
- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: Optimized for Core Web Vitals

### Component Development
```jsx
// Example: Using analytics tracking
import { useAnalyticsContext } from '../context/AnalyticsContext'

const MyComponent = () => {
  const { trackCTAClick } = useAnalyticsContext()
  
  return (
    <Button 
      onClick={() => trackCTAClick('Contact', 'Header')}
      analyticsLabel="header-contact"
    >
      Contact Us
    </Button>
  )
}
```

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/new-feature
```

## 🧪 Testing

### Code Quality
```bash
# Run all quality checks
npm run lint          # Check for issues
npm run test:run      # Run unit tests
npm run format:check   # Verify formatting
npm run build         # Test build process
```

### Manual Testing
- **Responsive**: Test mobile, tablet, desktop
- **Accessibility**: Keyboard navigation, screen readers
- **Performance**: Load times, Core Web Vitals
- **Cross-browser**: Chrome, Firefox, Safari, Edge

## 🔍 Debugging

### Development
- **React DevTools**: Component inspection
- **Network Tab**: API request monitoring
- **Console**: Error and warning tracking
- **Performance Tab**: Runtime performance analysis

### Production
- **Sentry Dashboard**: Error monitoring and debugging
- **Google Analytics**: User behavior analysis
- **Lighthouse**: Performance and accessibility audits
- **Status Page**: Service availability monitoring

## 📋 Tasks & Scripts

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Check code quality
npm run lint:fix     # Auto-fix issues
npm run test         # Watch tests
npm run test:run     # Run tests once
npm run format       # Format code
npm run format:check # Check formatting
```

### Common Development Tasks
```bash
# Add new page
1. Create component in src/pages/
2. Add route in src/App.jsx
3. Update navigation data if needed
4. Test responsive behavior

# Add new component  
1. Create in src/components/
2. Export in index file if needed
3. Add documentation comments
4. Test accessibility

# Update analytics
1. Import useAnalyticsContext
2. Add tracking events as needed
3. Test in development console
4. Verify in production
```

## 🚨 Troubleshooting

### Common Issues
**Build Fails**:
```bash
# Clear dependencies
rm -rf node_modules package-lock.json
npm install

# Check for Node version conflicts
node --version  # Should be v18+
```

**Analytics Not Working**:
```bash
# Check environment variables
echo $VITE_GA_MEASUREMENT_ID

# Verify browser console for errors
# Check network tab for failed requests
```

**Development Server Issues**:
```bash
# Check port availability
netstat -an | grep 5173

# Clear Vite cache
rm -rf .vite
```

## 🔒 Security

### Implementation
- **Content Security Policy**: Configured headers
- **Dependency Scanning**: Automated in CI/CD
- **Environment Variables**: Secured in GitHub Secrets
- **Input Validation**: Form data sanitization
- **HTTPS Enforcement**: Production HTTPS only

### Best Practices
- Regular security updates (`npm audit`)
- Code review for all changes
- Minimal data collection
- Privacy-first analytics implementation

## 📄 Documentation

- **Component Documentation**: JSDoc comments
- **API Documentation**: Component props and methods
- **Deployment Guide**: Step-by-step instructions
- **Monitoring Setup**: Analytics and error tracking
- **Backup Strategy**: Recovery procedures documented

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📞 Support

### Technical Support
- **Documentation**: Check this README first
- **Issues**: [GitHub Issues](https://github.com/your-org/cooperative/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/cooperative/discussions)

### Emergency Contacts
- **Production Issues**: Contact DevOps team
- **Security Issues**: Report to security@ghaim-uae.com
- **General Inquiries**: hello@ghaim-uae.com

---

## 📄 License

This project is proprietary to Ghaim UAE. All rights reserved.

---

**Last Updated**: December 2024
**Version**: 1.0.0



