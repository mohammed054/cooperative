export type Metric = {
  value: string;
  label: string;
  detail?: string;
};

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
  timeline: string;
  privateNote: string;
  scope: string[];
  deliverables: string[];
};

export type Service = {
  id: string;
  title: string;
  kicker: string;
  summary: string;
  deliverables: string[];
};

export type Principle = {
  title: string;
  body: string;
  signal: string;
};

export type ProcessStep = {
  step: string;
  title: string;
  body: string;
};

export type Testimonial = {
  quote: string;
  author: string;
  title: string;
  company: string;
  focus: string;
};

export const brand = {
  name: 'GHAIM',
  email: 'private.briefing@ghaim.ae',
  phone: '+971 4 548 0920',
  tel: '+97145480920',
  address: 'DIFC, Dubai, UAE',
  tagline: 'Private event command for consequential rooms',
};

export const stats: Metric[] = [
  { value: '240+', label: 'Executive events', detail: 'Delivered across private, corporate, and sovereign-adjacent briefs.' },
  { value: '21', label: 'Markets activated', detail: 'Dubai, Riyadh, London, Geneva, Singapore, Paris, and beyond.' },
  { value: '14 yrs', label: 'Protocol practice', detail: 'Guest movement, security-aware hospitality, and board-level pacing.' },
  { value: '97%', label: 'Return briefings', detail: 'Clients re-engage when the audience, timing, and reputational risk matter.' },
];

export const clients = [
  'DIFC',
  'Dubai Holding',
  'MAG Group',
  'Emaar',
  'Meraas',
  'Aldar',
  'Atlantis',
  'Jumeirah',
  'Mubadala',
  'NEOM',
];

export const services: Service[] = [
  {
    id: 'briefing',
    title: 'Executive Briefing',
    kicker: '01 / Intent',
    summary:
      'We translate business stakes into a clear event thesis, audience map, cadence, and decision path before production begins.',
    deliverables: ['Stakeholder interviews', 'Narrative architecture', 'Experience thesis', 'Success metrics'],
  },
  {
    id: 'architecture',
    title: 'Experience Architecture',
    kicker: '02 / Guest Flow',
    summary:
      'Arrival, room reveal, seating, speaker movement, dining, and exits are choreographed as one controlled operating system.',
    deliverables: ['Guest journey maps', 'VIP movement routes', 'Spatial programming', 'Run-of-show logic'],
  },
  {
    id: 'production',
    title: 'Production Command',
    kicker: '03 / Delivery',
    summary:
      'A senior control layer manages vendors, stage, lighting, showcalling, rehearsals, and live-room decision making.',
    deliverables: ['Technical direction', 'Showcalling', 'Vendor governance', 'Rehearsal systems'],
  },
  {
    id: 'protocol',
    title: 'Protocol Hospitality',
    kicker: '04 / Discretion',
    summary:
      'Private arrivals, dignitary handling, executive dining, concierge detail, and security-aware guest support stay invisible.',
    deliverables: ['VIP desk', 'Hospitality scripts', 'Protocol routing', 'Concierge controls'],
  },
  {
    id: 'contingency',
    title: 'Risk & Contingency',
    kicker: '05 / Assurance',
    summary:
      'Weather, transport, speaker timing, guest sensitivities, technical failure, and press exposure are scenario-planned.',
    deliverables: ['Risk register', 'Fallback plans', 'Crisis comms paths', 'Decision escalation'],
  },
  {
    id: 'intelligence',
    title: 'Post-Event Intelligence',
    kicker: '06 / Aftercare',
    summary:
      'The event closes with evidence: attendance quality, stakeholder sentiment, moments captured, and next-brief recommendations.',
    deliverables: ['Performance debrief', 'Media handoff', 'Stakeholder notes', 'Next-phase recommendations'],
  },
];

export const principles: Principle[] = [
  {
    title: 'Quiet Control',
    body: 'Guests should feel ease, not effort. Every visible moment is backed by an invisible operating rhythm.',
    signal: 'No public handoff feels improvised.',
  },
  {
    title: 'Executive Pacing',
    body: 'The room moves at the speed of the decision makers inside it, with enough breathing space for authority.',
    signal: 'Every minute has a purpose.',
  },
  {
    title: 'Scenario Discipline',
    body: 'Premium is not optimism. Premium is having credible alternatives before the first guest arrives.',
    signal: 'Plan A is elegant. Plan B is ready.',
  },
];

export const processSteps: ProcessStep[] = [
  {
    step: '01',
    title: 'Intelligence Intake',
    body: 'We collect stakes, audience sensitivities, brand rules, security realities, and what must happen after the event.',
  },
  {
    step: '02',
    title: 'Command Blueprint',
    body: 'The brief becomes a production map covering guest journeys, run-of-show, vendor ownership, and decision gates.',
  },
  {
    step: '03',
    title: 'Rehearsed Delivery',
    body: 'Every critical transition is rehearsed with timing, fallback, and escalation paths before the room goes live.',
  },
  {
    step: '04',
    title: 'After-Action Proof',
    body: 'The closeout captures outcomes, sentiment, assets, and recommendations so the next engagement starts smarter.',
  },
];

export const riskControls = [
  'Private arrivals and discreet exits',
  'VIP seating and movement matrix',
  'Vendor accountability grid',
  'Weather and transport contingencies',
  'Speaker and protocol rehearsal',
  'Media and confidentiality rules',
  'Live escalation channels',
  'Post-event executive debrief',
];

export const caseStudies: CaseStudy[] = [
  {
    id: 'grand-cascade',
    title: 'The Grand Cascade',
    category: 'Gala & Awards',
    location: 'Dubai, UAE',
    year: '2025',
    image:
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1800&auto=format&fit=crop&q=86',
    summary:
      'A landmark gala for 720 invited guests, transforming a grand ballroom into a controlled theatre of light, service, and executive protocol.',
    metric: '720 guests',
    impact: 'Zero visible downtime across a three-day install, executive arrivals, awards, dinner service, and live programme.',
    timeline: '10-week build, 72-hour install, 8-hour live programme',
    privateNote: 'Guest experience was built around discreet sponsor visibility and a no-delay awards cadence.',
    scope: ['Executive gala', 'Sponsor protocol', 'Awards flow', 'Dinner service', 'Live showcalling'],
    deliverables: ['Run-of-show command', 'Stage and lighting direction', 'VIP routing', 'Vendor governance'],
  },
  {
    id: 'summit-edge',
    title: 'Summit at the Edge',
    category: 'Leadership Summit',
    location: 'Davos, Switzerland',
    year: '2025',
    image:
      'https://images.unsplash.com/photo-1774092137702-2abdbf38e683?w=1600&auto=format&fit=crop&q=84',
    summary:
      'An executive leadership summit designed for board-level decision making, private dinners, and keynote transitions at altitude.',
    metric: '132 executives',
    impact: 'Four-day agenda delivered across nine venues with one command team and no missed transport window.',
    timeline: '14-week logistics track, 9 venues, 4 live days',
    privateNote: 'Designed around private bilateral meetings between programmed sessions.',
    scope: ['Board summit', 'Delegate hospitality', 'Multi-venue transport', 'Private dining', 'Speaker care'],
    deliverables: ['Route matrix', 'Delegate app content', 'Venue readiness checks', 'Private dinner programming'],
  },
  {
    id: 'meridian-forum',
    title: 'The Meridian Forum',
    category: 'Investor Forum',
    location: 'Singapore',
    year: '2024',
    image:
      'https://images.unsplash.com/photo-1769798643655-e0f10f62c3fd?w=1600&auto=format&fit=crop&q=84',
    summary:
      'A finance forum blending investor theatre, broadcast-grade production, and hospitality routes for global delegates.',
    metric: '480 delegates',
    impact: 'Main-stage, media, investor lounge, and reception programming moved as one system.',
    timeline: '8-week production sprint, 2 broadcast stages',
    privateNote: 'The investor lounge was managed as a separate high-discretion environment.',
    scope: ['Investor programming', 'Broadcast capture', 'Speaker green rooms', 'Media rules', 'Reception flow'],
    deliverables: ['Forum narrative', 'Stage management', 'Broadcast cues', 'Delegate journey'],
  },
  {
    id: 'aurora-banquet',
    title: 'The Aurora Banquet',
    category: 'Brand Experience',
    location: 'Tromso, Norway',
    year: '2024',
    image:
      'https://images.unsplash.com/photo-1770140304098-46700a5c45c8?w=1600&auto=format&fit=crop&q=84',
    summary:
      'A private brand dinner where sound, scent, table service, and reveal lighting were choreographed as a single story.',
    metric: '86 VIP guests',
    impact: 'An intimate launch environment built for memory, privacy, and controlled documentation.',
    timeline: '6-week concept, 2-night private programme',
    privateNote: 'Designed to create content moments without letting content production dominate the room.',
    scope: ['Private dinner', 'Brand reveal', 'Scent and sound design', 'Guest gifting', 'Photography rules'],
    deliverables: ['Creative direction', 'Tablescape system', 'Reveal cues', 'Content capture map'],
  },
  {
    id: 'renaissance-gala',
    title: 'The Renaissance Gala',
    category: 'Cultural Gala',
    location: 'Paris, France',
    year: '2023',
    image:
      'https://images.unsplash.com/photo-1763231575952-98244918f99b?w=1600&auto=format&fit=crop&q=84',
    summary:
      'A museum awards evening curated in chapters, using arrival, dinner, performance, and after-hours rooms as narrative acts.',
    metric: '360 patrons',
    impact: 'Historic venue constraints handled without compromising guest movement or conservation rules.',
    timeline: '12-week stakeholder track, 1-night museum takeover',
    privateNote: 'The room plan balanced donor visibility with institutional protocol.',
    scope: ['Museum gala', 'Donor protocol', 'Performance cues', 'Conservation constraints', 'After-hours lounge'],
    deliverables: ['Venue method statement', 'Donor seating logic', 'Performance flow', 'Guest communications'],
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
    metric: '290 guests',
    impact: 'Five-day guest journey designed from airport arrival to final farewell with private family office reporting.',
    timeline: '16-week design and hospitality track, 5-day guest journey',
    privateNote: 'Family-office reporting meant hospitality, security, and budget visibility were managed daily.',
    scope: ['Private hospitality', 'Family office reporting', 'Airport arrivals', 'Dining programme', 'Guest recovery'],
    deliverables: ['Guest care desk', 'Hospitality staffing', 'Daily reporting', 'Movement command'],
  },
];

export const testimonials: Testimonial[] = [
  {
    quote:
      'GHAIM gave our forum the authority it needed without ever making the production feel loud. Every handoff, room turn, and VIP moment was quietly exact.',
    author: 'Khalid Al Mansouri',
    title: 'Chief Executive Officer',
    company: 'Dubai Holding',
    focus: 'Investor forum delivery',
  },
  {
    quote:
      'The team understood that our annual summit is not just an event. It is reputation, timing, and trust in front of the people who matter most.',
    author: 'Fatima Al Rashid',
    title: 'Director of Strategy',
    company: 'DIFC Authority',
    focus: 'Board summit protocol',
  },
  {
    quote:
      'We have worked with event houses in London, Geneva, and Singapore. GHAIM matched that standard and brought a sharper sense of local protocol.',
    author: 'James Whitfield',
    title: 'Group Managing Director',
    company: 'MAG Group',
    focus: 'Regional launch programme',
  },
];
