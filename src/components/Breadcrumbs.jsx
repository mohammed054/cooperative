import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const getBreadcrumbName = (segment, index) => {
    const fullPath = '/' + pathnames.slice(0, index + 1).join('/');
    
    // Service detail pages
    if (pathnames[0] === 'services' && index === 1) {
      const serviceNames = {
        'event-production': 'Event Production',
        'technical-production': 'Technical Production', 
        'staging-scenic': 'Staging & Scenic',
        'furniture-rentals': 'Furniture & Rentals'
      };
      return serviceNames[segment] || segment;
    }
    
    // Case study detail pages
    if (pathnames[0] === 'work' && index === 1) {
      const caseNames = {
        'skyline-investor-summit': 'Skyline Investor Summit',
        'prestige-brand-launch': 'Prestige Brand Launch',
        'elite-vip-gala': 'Elite VIP Gala'
      };
      return caseNames[segment] || segment;
    }
    
    // Regular pages
    const pageNames = {
      'services': 'Services',
      'work': 'Work', 
      'process': 'Process',
      'about': 'About',
      'testimonials': 'Testimonials',
      'pricing': 'Pricing',
      'faq': 'FAQ',
      'contact': 'Contact',
      'projects': 'Projects',
      'privacy': 'Privacy',
      'terms': 'Terms'
    };
    
    return pageNames[segment] || segment;
  };

  if (pathnames.length === 0) return null;

  return (
    <nav className="breadcrumb-nav" aria-label="Breadcrumb">
      <ol className="breadcrumb-list">
        <li className="breadcrumb-item">
          <Link to="/">Home</Link>
        </li>
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          
          return (
            <li key={routeTo} className="breadcrumb-item">
              <span className="breadcrumb-separator">/</span>
              {isLast ? (
                <span className="breadcrumb-current">{getBreadcrumbName(name, index)}</span>
              ) : (
                <Link to={routeTo}>{getBreadcrumbName(name, index)}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;