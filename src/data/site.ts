export type CaseStudy = {
  id: string;
  title: string;
  category: string;
  location: string;
  year: string;
  image: string;
  summary: string;
  metric: string;
  impact: string;
};

export type Service = {
  id: string;
  title: string;
  summary: string;
};

export type Testimonial = {
  quote: string;
  author: string;
  title: string;
  company: string;
};

export const brand = {
  name: 'GHAIM',
  email: 'enquiries@ghaim.ae',
  phone: '+971 4 000 0000',
  address: 'DIFC, Dubai, UAE',
  tagline: 'Luxury corporate event management',
};

export const stats = [
  { value: '200+', label: 'High-stakes events' },
  { value: '18', label: 'Countries activated' },
  { value: '12', label: 'Years of protocol' },
  { value: '96%', label: 'Repeat briefings' },
];

export const clients = [
  'MAG Group',
  'Emaar',
  'DIFC',
  'Dubai Holding',
  'Meraas',
  'Aldar',
  'Atlantis',
  'Jumeirah',
];

export const services: Service[] = [
  {
    id: 'strategy',
    title: 'Event Strategy',
    summary:
      'Narrative architecture, audience mapping, stakeholder flow, and executive-level briefing systems.',
  },
  {
    id: 'production',
    title: 'Production Direction',
    summary:
      'Spatial design, staging, lighting, showcalling, vendor orchestration, and technical delivery.',
  },
  {
    id: 'hospitality',
    title: 'Protocol Hospitality',
    summary:
      'VIP movement, guest experience, security-aware arrivals, private dining, and discreet concierge care.',
  },
];

export const caseStudies: CaseStudy[] = [
  {
    id: 'grand-cascade',
    title: 'The Grand Cascade',
    category: 'Gala & Awards',
    location: 'Dubai, UAE',
    year: '2024',
    image:
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1800&auto=format&fit=crop&q=86',
    summary:
      'A landmark gala for 600 invited guests, transforming a grand ballroom into a controlled theatre of light, service, and executive protocol.',
    metric: '600 guests',
    impact: 'Zero visible downtime across a three-day install and live programme.',
  },
  {
    id: 'summit-edge',
    title: 'Summit at the Edge',
    category: 'Corporate Retreat',
    location: 'Davos, Switzerland',
    year: '2024',
    image:
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&auto=format&fit=crop&q=84',
    summary:
      'An executive leadership summit designed for board-level decision making, private dinners, and keynote transitions at altitude.',
    metric: '120 executives',
    impact: 'Four-day agenda delivered across nine venues with one command team.',
  },
  {
    id: 'meridian-forum',
    title: 'The Meridian Forum',
    category: 'Conference & Forum',
    location: 'Singapore',
    year: '2023',
    image:
      'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1600&auto=format&fit=crop&q=84',
    summary:
      'A finance forum blending investor theatre, broadcast-grade production, and hospitality routes for global delegates.',
    metric: '450 delegates',
    impact: 'Main-stage, media, and reception programming moved as one system.',
  },
  {
    id: 'aurora-banquet',
    title: 'The Aurora Banquet',
    category: 'Brand Experience',
    location: 'Tromso, Norway',
    year: '2023',
    image:
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1600&auto=format&fit=crop&q=84',
    summary:
      'A private brand dinner where sound, scent, table service, and reveal lighting were choreographed as a single story.',
    metric: '80 VIP guests',
    impact: 'An intimate launch environment built for memory, not spectacle.',
  },
  {
    id: 'renaissance-gala',
    title: 'The Renaissance Gala',
    category: 'Gala & Awards',
    location: 'Paris, France',
    year: '2022',
    image:
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1600&auto=format&fit=crop&q=84',
    summary:
      'A museum awards evening curated in chapters, using arrival, dinner, performance, and after-hours rooms as narrative acts.',
    metric: '350 guests',
    impact: 'Historic venue constraints handled without compromising guest movement.',
  },
  {
    id: 'celestial-union',
    title: 'Celestial Union',
    category: 'Private Commission',
    location: 'Amalfi Coast, Italy',
    year: '2023',
    image:
      'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=1600&auto=format&fit=crop&q=84',
    summary:
      'A multi-day private commission beneath suspended crystal light, delivered with corporate-grade privacy and logistics.',
    metric: '280 guests',
    impact: 'Five-day guest journey designed from airport arrival to final farewell.',
  },
];

export const testimonials: Testimonial[] = [
  {
    quote:
      'GHAIM gave our forum the authority it needed without ever making the production feel loud. Every handoff, every room turn, every VIP moment was quietly exact.',
    author: 'Khalid Al Mansouri',
    title: 'Chief Executive Officer',
    company: 'Dubai Holding',
  },
  {
    quote:
      'The team understood that our annual summit is not just an event. It is reputation, timing, and trust in front of the people who matter most.',
    author: 'Fatima Al Rashid',
    title: 'Director of Strategy',
    company: 'DIFC Authority',
  },
  {
    quote:
      'We have worked with event houses in London, Geneva, and Singapore. GHAIM matched that standard and brought a sharper sense of local protocol.',
    author: 'James Whitfield',
    title: 'Group Managing Director',
    company: 'MAG Group',
  },
];
