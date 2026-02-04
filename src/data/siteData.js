export const services = [
  {
    slug: 'event-production',
    title: 'Event Production',
    summary:
      "End-to-end planning and delivery for high-stakes events with one accountable producer.",
    description:
      "We own the timeline, vendors, and show-day execution so your team can focus on the room, not the logistics.",
    includes: [
      "Run of show and timeline ownership",
      "Vendor coordination and on-site supervision",
      "Stage, AV, and guest flow integration",
      "Show-day operations and cue management",
    ],
    idealFor: [
      "Investor summits and corporate conferences",
      "Government and protocol-sensitive events",
      "Brand launches with executive visibility",
    ],
    standards: [
      "Single point of accountability",
      "Pre-flight checks before load-in",
      "Post-event strike and handover reports",
    ],
    relatedCase: 'skyline-investor-summit',
  },
  {
    slug: 'technical-production',
    title: 'Technical Production',
    summary:
      "Reliable AV, lighting, video, and power systems engineered for complex rooms.",
    description:
      "We design and operate the technical backbone - from signal flow to redundancy - so every cue lands cleanly.",
    includes: [
      "Audio, lighting, and video systems design",
      "Signal routing, power distribution, redundancy",
      "Operator teams and rehearsal support",
      "On-site troubleshooting and backups",
    ],
    idealFor: [
      "Multi-speaker conferences and live panels",
      "Hybrid or broadcast-ready events",
      "Brand reveals and show-critical content",
    ],
    standards: [
      "Tested, labeled, and documented systems",
      "Backup plans for all critical paths",
      "Precise cueing with show caller support",
    ],
    relatedCase: 'prestige-brand-launch',
  },
  {
    slug: 'staging-scenic',
    title: 'Staging & Scenic',
    summary:
      "Stage architecture and scenic builds that look premium without slowing production.",
    description:
      "We translate design intent into buildable, safe, and elegant structures that support the show flow.",
    includes: [
      "Stage platforms and riser systems",
      "Backdrop fabrication and scenic finishes",
      "Custom build coordination and installation",
      "Safety and load compliance",
    ],
    idealFor: [
      "Gala dinners and award nights",
      "Executive town halls and brand showcases",
      "Press moments and VIP receptions",
    ],
    standards: [
      "Detailed shop drawings and approvals",
      "Strict load and safety checks",
      "Clean, camera-ready finishes",
    ],
    relatedCase: 'elite-vip-gala',
  },
  {
    slug: 'furniture-rentals',
    title: 'Furniture & Rentals',
    summary:
      "Curated inventory that arrives clean, labeled, and event-ready.",
    description:
      "Premium seating, tables, staging, and accessories delivered with the same discipline as full production.",
    includes: [
      "Seating, lounge, and table packages",
      "Staging, risers, and crowd control",
      "Logistics, loading, and onsite placement",
      "Strike and collection with inventory checks",
    ],
    idealFor: [
      "Corporate gatherings and VIP lounges",
      "Product launches and pop-ups",
      "Private and government events",
    ],
    standards: [
      "Pre-flight quality inspections",
      "Consistent, labeled delivery",
      "White-glove handling and strike",
    ],
    relatedCase: 'skyline-investor-summit',
  },
];

export const caseStudies = [
  {
    slug: 'skyline-investor-summit',
    title: 'Skyline Investor Summit',
    location: 'Dubai',
    summary:
      "A 650-seat investor summit delivered with a two-week production window and zero show delays.",
    challenge:
      "A compressed timeline, VIP protocol, and a complex room layout that had to be reset between sessions.",
    approach:
      "We built a tight run of show, assigned one producer for approvals, and staged a full technical rehearsal before doors.",
    results: [
      "Doors opened on time across all sessions",
      "Three room resets completed without delays",
      "Client approvals finalized 48 hours before load-in",
    ],
    stats: [
      { label: 'Guests', value: '650' },
      { label: 'Production window', value: '2 weeks' },
      { label: 'Room resets', value: '3' },
    ],
    services: ['Event Production', 'Technical Production', 'Furniture & Rentals'],
    image: '/cooperative/images/event1.jpg',
  },
  {
    slug: 'prestige-brand-launch',
    title: 'Prestige Brand Launch',
    location: 'Abu Dhabi',
    summary:
      "A product launch with synchronized lighting and video cues across a 180-degree stage environment.",
    challenge:
      "Multiple vendors and a tight rehearsal schedule required a single technical lead to align systems.",
    approach:
      "We consolidated signal flow, mapped cueing, and ran redundancy for all show-critical media.",
    results: [
      "Flawless cue alignment across video and lighting",
      "Two rehearsals reduced show-day adjustments",
      "Client global marketing team signed off on the first run",
    ],
    stats: [
      { label: 'Screens', value: '6' },
      { label: 'Cues', value: '120+' },
      { label: 'Rehearsals', value: '2' },
    ],
    services: ['Technical Production', 'Staging & Scenic'],
    image: '/cooperative/images/event2.jpg',
  },
  {
    slug: 'elite-vip-gala',
    title: 'Elite VIP Gala',
    location: 'Sharjah',
    summary:
      "A discreet, high-touch gala built for VIP arrivals, press moments, and live music.",
    challenge:
      "A premium finish was required without disrupting the venue daily operations.",
    approach:
      "We staged the build in phases, used low-impact rigging, and maintained a discreet onsite crew.",
    results: [
      "Venue operations stayed uninterrupted",
      "VIP arrivals moved through a polished, controlled flow",
      "The scenic build matched the creative render exactly",
    ],
    stats: [
      { label: 'Build phases', value: '4' },
      { label: 'Live acts', value: '3' },
      { label: 'VIP guests', value: '150' },
    ],
    services: ['Staging & Scenic', 'Event Production'],
    image: '/cooperative/images/event3.jpg',
  },
];

export const testimonials = [
  {
    id: 'skyline',
    name: 'Sarah Al-Mansouri',
    role: 'CEO',
    company: 'Skyline Ventures',
    quote:
      "They ran the entire summit with calm precision. Every cue landed, every reset hit the timeline, and we never had to chase updates.",
    project: 'Investor summit',
    location: 'Dubai',
  },
  {
    id: 'prestige',
    name: 'James Mitchell',
    role: 'Marketing Director',
    company: 'Prestige Group',
    quote:
      "The technical team was meticulous. Equipment arrived tested, labeled, and ready. Our launch ran exactly to the rehearsal.",
    project: 'Brand launch',
    location: 'Abu Dhabi',
  },
  {
    id: 'elite',
    name: 'Layla Hassan',
    role: 'Events Manager',
    company: 'Elite Hospitality',
    quote:
      "They anticipate issues before they surface. The build was clean, the crew was discreet, and the room looked expensive.",
    project: 'VIP gala',
    location: 'Sharjah',
  },
];

export const engagementModels = [
  {
    title: 'Production Partner',
    description:
      "We own the full production timeline, vendor coordination, and show-day execution. Best for high-stakes, multi-vendor events.",
    details: ['Single accountable producer', 'Weekly planning cadence', 'On-site show control'],
  },
  {
    title: 'Technical Lead',
    description:
      "We design and operate the technical core while your team manages creative or venue logistics.",
    details: ['System design and engineering', 'Rehearsal and cue management', 'Redundancy and backup systems'],
  },
  {
    title: 'Curated Rentals',
    description:
      "Premium inventory delivered with white-glove handling and strict quality checks.",
    details: ['Curated furniture packages', 'Delivery, placement, strike', 'Inventory QA before load-in'],
  },
];

export const faqItems = [
  {
    question: 'How early should we book?',
    answer:
      "For complex productions, six to eight weeks gives the best planning window. We can move faster when needed, but we will flag any risks early.",
  },
  {
    question: 'Do you cover all emirates?',
    answer:
      "Yes. We operate across the UAE with dedicated crews and logistics partners in each major emirate.",
  },
  {
    question: 'Can you work with our existing vendors?',
    answer:
      "Absolutely. We are comfortable integrating into your vendor stack or taking full ownership when you prefer a single team.",
  },
  {
    question: 'What does a typical proposal include?',
    answer:
      "A clear scope, timeline, technical plan, and the team assigned to your event. We keep it lean and transparent.",
  },
  {
    question: 'Do you offer onsite support during the event?',
    answer:
      "Always. Every project includes an onsite lead and crew sized to the scope of the show.",
  },
];