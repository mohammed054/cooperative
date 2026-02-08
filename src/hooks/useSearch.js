import { useMemo } from 'react';
import Fuse from 'fuse.js';
import { services, caseStudies, testimonials, faqItems } from '../data/siteData';

// Create a comprehensive search index
const createSearchIndex = () => {
  const searchData = [];

  // Add services
  services.forEach(service => {
    searchData.push({
      id: `service-${service.slug}`,
      title: service.title,
      description: service.summary,
      content: service.content || '',
      category: 'Services',
      href: `/services/${service.slug}`,
      keywords: service.keywords || []
    });
  });

  // Add case studies
  caseStudies.forEach(study => {
    searchData.push({
      id: `case-${study.slug}`,
      title: study.title,
      description: study.location,
      content: study.description || '',
      category: 'Work',
      href: `/work/${study.slug}`,
      keywords: study.keywords || []
    });
  });

  // Add testimonials
  testimonials.forEach((testimonial, index) => {
    searchData.push({
      id: `testimonial-${index}`,
      title: testimonial.client,
      description: testimonial.project,
      content: testimonial.content,
      category: 'Testimonials',
      href: '/testimonials',
      keywords: []
    });
  });

  // Add FAQ items
  faqItems.forEach((faq, index) => {
    searchData.push({
      id: `faq-${index}`,
      title: faq.question,
      description: faq.answer,
      content: faq.answer,
      category: 'FAQ',
      href: '/faq',
      keywords: []
    });
  });

  // Add static pages
  const staticPages = [
    { title: 'Home', description: 'Welcome to Ghaim UAE', category: 'Pages', href: '/' },
    { title: 'About', description: 'Our team and principles', category: 'Pages', href: '/about' },
    { title: 'Process', description: 'How we work', category: 'Pages', href: '/process' },
    { title: 'Pricing', description: 'Our pricing plans', category: 'Pages', href: '/pricing' },
    { title: 'Contact', description: 'Get in touch with us', category: 'Pages', href: '/contact' },
    { title: 'Projects', description: 'Browse production visuals', category: 'Pages', href: '/projects' },
    { title: 'Privacy Policy', description: 'Privacy policy information', category: 'Pages', href: '/privacy' },
    { title: 'Terms of Service', description: 'Terms and conditions', category: 'Pages', href: '/terms' }
  ];

  staticPages.forEach(page => {
    searchData.push({
      id: `page-${page.href.replace('/', '-')}`,
      title: page.title,
      description: page.description,
      content: page.description,
      category: page.category,
      href: page.href,
      keywords: []
    });
  });

  return searchData;
};

export const useSearch = (query = '') => {
  const searchIndex = useMemo(() => createSearchIndex(), []);

  const fuse = useMemo(() => {
    return new Fuse(searchIndex, {
      keys: [
        { name: 'title', weight: 0.4 },
        { name: 'description', weight: 0.3 },
        { name: 'content', weight: 0.2 },
        { name: 'keywords', weight: 0.1 }
      ],
      threshold: 0.3,
      includeScore: true,
      includeMatches: true,
      minMatchCharLength: 2,
      ignoreLocation: true,
      shouldSort: true,
      findAllMatches: true
    });
  }, [searchIndex]);

  const results = useMemo(() => {
    if (!query.trim()) {
      return [];
    }

    const searchResults = fuse.search(query);
    
    // Group results by category
    const groupedResults = searchResults.reduce((acc, result) => {
      const category = result.item.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push({
        ...result.item,
        score: result.score,
        matches: result.matches
      });
      return acc;
    }, {});

    // Sort categories by relevance (highest scoring item first)
    const sortedCategories = Object.entries(groupedResults)
      .sort(([, a], [, b]) => {
        const bestScoreA = Math.min(...a.map(item => item.score));
        const bestScoreB = Math.min(...b.map(item => item.score));
        return bestScoreA - bestScoreB;
      });

    return sortedCategories.map(([category, items]) => ({
      category,
      items: items.slice(0, 5) // Limit to 5 items per category
    }));
  }, [query, fuse]);

  // Get popular searches (can be expanded with analytics)
  const popularSearches = useMemo(() => [
    'event production',
    'technical production',
    'staging',
    'furniture rental',
    'case studies',
    'pricing',
    'contact'
  ], []);

  return {
    results,
    popularSearches,
    totalResults: results.reduce((sum, category) => sum + category.items.length, 0),
    hasResults: results.length > 0
  };
};