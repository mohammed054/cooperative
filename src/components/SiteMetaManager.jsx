import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { caseStudies, services } from '../data/siteData'
import { assetUrl } from '../lib/assetUrl'

const DEFAULT_META = {
  title: 'Ghaim UAE | Premium Event Rentals & Production',
  description:
    'Ghaim UAE delivers premium event rentals, production, and full-service execution across the UAE. Corporate, private, and government events designed with precision.',
  image: assetUrl('images/event1.jpg'),
}

const STATIC_META = {
  '/': {
    title: 'Ghaim UAE | Luxury Event Production Across the UAE',
    description:
      'Senior-led event production, technical systems, and white-glove rentals for high-stakes corporate, government, and private events.',
    image: assetUrl('images/event1.jpg'),
  },
  '/services': {
    title: 'Services | Event Production, Technical, Scenic & Rentals | Ghaim UAE',
    description:
      'Explore Ghaim UAE services: full event production, technical production, staging and scenic, and curated furniture rentals.',
    image: assetUrl('images/event-planning.png'),
  },
  '/work': {
    title: 'Work | Case Studies & Production Projects | Ghaim UAE',
    description:
      'Selected case studies from premium events across Dubai, Abu Dhabi, and Sharjah delivered with disciplined execution.',
    image: assetUrl('images/event2.jpg'),
  },
  '/process': {
    title: 'Process | How Ghaim Delivers High-Stakes Events',
    description:
      'A disciplined event production process with clear approvals, rehearsals, and show-day command.',
    image: assetUrl('images/event-planning-in-action.png'),
  },
  '/about': {
    title: 'About | Ghaim UAE Event Production Team',
    description:
      'Learn about Ghaim UAE, a senior-led event production partner built around composure, detail, and execution discipline.',
    image: assetUrl('images/full-production.png'),
  },
  '/testimonials': {
    title: 'Testimonials | Client Feedback | Ghaim UAE',
    description:
      'Read feedback from clients who trusted Ghaim UAE for calm, precise event production under tight timelines.',
    image: assetUrl('images/event3.jpg'),
  },
  '/pricing': {
    title: 'Engagement Models | Pricing Approach | Ghaim UAE',
    description:
      'Clear engagement models and scoped proposals for premium event production services across the UAE.',
    image: assetUrl('images/product-large.jpg'),
  },
  '/faq': {
    title: 'FAQ | Event Planning Questions | Ghaim UAE',
    description:
      'Answers to common event production questions including timelines, coverage, vendors, and on-site support.',
    image: assetUrl('images/product-small.jpg'),
  },
  '/contact': {
    title: 'Contact | Request a Proposal | Ghaim UAE',
    description:
      'Contact Ghaim UAE to request a premium event production proposal. Response within 24 hours.',
    image: assetUrl('images/country-bg.jpg'),
  },
  '/projects': {
    title: 'Project Gallery | Production Visuals | Ghaim UAE',
    description:
      'Browse production visuals from recent events and room builds delivered by Ghaim UAE.',
    image: assetUrl('images/event1.jpg'),
  },
  '/privacy': {
    title: 'Privacy Policy | Ghaim UAE',
    description:
      'Read how Ghaim UAE collects and uses data for event planning, production, and communication.',
    image: assetUrl('images/logo.webp'),
  },
  '/terms': {
    title: 'Terms of Service | Ghaim UAE',
    description:
      'Review the terms governing engagement scopes, changes, and service expectations.',
    image: assetUrl('images/logo.webp'),
  },
}

const SERVICE_IMAGE_BY_SLUG = {
  'event-production': assetUrl('images/event-planning.png'),
  'technical-production': assetUrl('images/av-setup.png'),
  'staging-scenic': assetUrl('images/seating.png'),
  'furniture-rentals': assetUrl('images/lighting-effects.png'),
}

const ORG_SCHEMA = {
  '@type': 'Organization',
  name: 'Ghaim UAE',
  url: 'https://ghaimuae.com',
  logo: 'https://ghaimuae.com/images/logo.webp',
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: '+97142345678',
      contactType: 'sales',
      areaServed: 'AE',
      availableLanguage: ['en'],
    },
  ],
}

const normalisePath = pathname => {
  if (!pathname || pathname === '/') return '/'
  return pathname.replace(/\/+$/, '')
}

const getSiteOrigin = () => {
  const configuredOrigin = String(import.meta.env.VITE_SITE_URL || '').trim()
  if (configuredOrigin) return configuredOrigin.replace(/\/+$/, '')
  if (typeof window !== 'undefined') return window.location.origin
  return ''
}

const toAbsoluteUrl = value => {
  if (!value) return ''
  if (/^https?:\/\//i.test(value)) return value

  const origin = getSiteOrigin()
  if (!origin) return value

  try {
    return new URL(value, `${origin}/`).href
  } catch {
    return value
  }
}

const upsertMetaByName = (name, content) => {
  if (!content) return
  let tag = document.head.querySelector(`meta[name="${name}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute('name', name)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

const upsertMetaByProperty = (property, content) => {
  if (!content) return
  let tag = document.head.querySelector(`meta[property="${property}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute('property', property)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

const upsertCanonical = href => {
  if (!href) return
  let link = document.head.querySelector('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }
  link.setAttribute('href', href)
}

const upsertStructuredData = graph => {
  let script = document.getElementById('dynamic-route-schema')
  if (!script) {
    script = document.createElement('script')
    script.id = 'dynamic-route-schema'
    script.type = 'application/ld+json'
    document.head.appendChild(script)
  }

  script.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': graph,
  })
}

const getDynamicMeta = pathname => {
  if (pathname.startsWith('/services/')) {
    const slug = pathname.split('/')[2]
    const service = services.find(item => item.slug === slug)

    if (service) {
      return {
        title: `${service.title} | Services | Ghaim UAE`,
        description: service.description,
        image:
          SERVICE_IMAGE_BY_SLUG[service.slug] || assetUrl('images/event-planning.png'),
        schema: {
          '@type': 'Service',
          name: service.title,
          description: service.description,
          areaServed: 'United Arab Emirates',
          provider: { '@type': 'Organization', name: 'Ghaim UAE' },
        },
      }
    }
  }

  if (pathname.startsWith('/work/')) {
    const slug = pathname.split('/')[2]
    const study = caseStudies.find(item => item.slug === slug)

    if (study) {
      return {
        title: `${study.title} | Case Study | Ghaim UAE`,
        description: study.summary,
        image: study.image || assetUrl('images/event2.jpg'),
        schema: {
          '@type': 'Event',
          name: study.title,
          location: {
            '@type': 'Place',
            name: study.location,
          },
          description: study.summary,
          organizer: { '@type': 'Organization', name: 'Ghaim UAE' },
        },
      }
    }
  }

  return null
}

const SiteMetaManager = () => {
  const location = useLocation()

  useEffect(() => {
    const pathname = normalisePath(location.pathname)
    const meta =
      getDynamicMeta(pathname) || STATIC_META[pathname] || DEFAULT_META

    const canonical = toAbsoluteUrl(pathname)
    const image = toAbsoluteUrl(meta.image || DEFAULT_META.image)
    const darkThemeRoutes =
      pathname === '/' ||
      pathname === '/contact' ||
      pathname.startsWith('/work/')

    document.title = meta.title
    upsertMetaByName('description', meta.description)
    upsertMetaByName('theme-color', darkThemeRoutes ? '#111317' : '#f8f4ee')
    upsertMetaByProperty('og:title', meta.title)
    upsertMetaByProperty('og:description', meta.description)
    upsertMetaByProperty('og:url', canonical)
    upsertMetaByProperty('og:image', image)
    upsertMetaByProperty('og:image:alt', meta.title)
    upsertMetaByName('twitter:title', meta.title)
    upsertMetaByName('twitter:description', meta.description)
    upsertMetaByName('twitter:image', image)
    upsertCanonical(canonical)

    const graph = [
      ORG_SCHEMA,
      {
        '@type': 'WebPage',
        name: meta.title,
        description: meta.description,
        url: canonical,
      },
    ]

    if (meta.schema) {
      graph.push(meta.schema)
    }

    upsertStructuredData(graph)
  }, [location.pathname])

  return null
}

export default SiteMetaManager
