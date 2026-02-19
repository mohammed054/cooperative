import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { caseStudies, services } from '../data/siteData'

const DEFAULT_META = {
  title: 'Ghaim UAE | Premium Event Rentals & Production',
  description:
    'Ghaim UAE delivers premium event rentals, production, and full-service execution across the UAE. Corporate, private, and government events designed with precision.',
}

const STATIC_META = {
  '/': {
    title: 'Ghaim UAE | Luxury Event Production Across the UAE',
    description:
      'Senior-led event production, technical systems, and white-glove rentals for high-stakes corporate, government, and private events.',
  },
  '/services': {
    title: 'Services | Event Production, Technical, Scenic & Rentals | Ghaim UAE',
    description:
      'Explore Ghaim UAE services: full event production, technical production, staging and scenic, and curated furniture rentals.',
  },
  '/work': {
    title: 'Work | Case Studies & Production Projects | Ghaim UAE',
    description:
      'Selected case studies from premium events across Dubai, Abu Dhabi, and Sharjah delivered with disciplined execution.',
  },
  '/process': {
    title: 'Process | How Ghaim Delivers High-Stakes Events',
    description:
      'A disciplined event production process with clear approvals, rehearsals, and show-day command.',
  },
  '/about': {
    title: 'About | Ghaim UAE Event Production Team',
    description:
      'Learn about Ghaim UAE, a senior-led event production partner built around composure, detail, and execution discipline.',
  },
  '/testimonials': {
    title: 'Testimonials | Client Feedback | Ghaim UAE',
    description:
      'Read feedback from clients who trusted Ghaim UAE for calm, precise event production under tight timelines.',
  },
  '/pricing': {
    title: 'Engagement Models | Pricing Approach | Ghaim UAE',
    description:
      'Clear engagement models and scoped proposals for premium event production services across the UAE.',
  },
  '/faq': {
    title: 'FAQ | Event Planning Questions | Ghaim UAE',
    description:
      'Answers to common event production questions including timelines, coverage, vendors, and on-site support.',
  },
  '/contact': {
    title: 'Contact | Request a Proposal | Ghaim UAE',
    description:
      'Contact Ghaim UAE to request a premium event production proposal. Response within 24 hours.',
  },
  '/projects': {
    title: 'Project Gallery | Production Visuals | Ghaim UAE',
    description:
      'Browse production visuals from recent events and room builds delivered by Ghaim UAE.',
  },
  '/privacy': {
    title: 'Privacy Policy | Ghaim UAE',
    description:
      'Read how Ghaim UAE collects and uses data for event planning, production, and communication.',
  },
  '/terms': {
    title: 'Terms of Service | Ghaim UAE',
    description:
      'Review the terms governing engagement scopes, changes, and service expectations.',
  },
}

const normalisePath = pathname => {
  if (!pathname || pathname === '/') return '/'
  return pathname.replace(/\/+$/, '')
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
  let link = document.head.querySelector('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }
  link.setAttribute('href', href)
}

const getDynamicMeta = pathname => {
  if (pathname.startsWith('/services/')) {
    const slug = pathname.split('/')[2]
    const service = services.find(item => item.slug === slug)

    if (service) {
      return {
        title: `${service.title} | Services | Ghaim UAE`,
        description: service.description,
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

    document.title = meta.title
    upsertMetaByName('description', meta.description)
    upsertMetaByProperty('og:title', meta.title)
    upsertMetaByProperty('og:description', meta.description)
    upsertMetaByName('twitter:title', meta.title)
    upsertMetaByName('twitter:description', meta.description)

    const canonical = `${window.location.origin}${pathname}`
    upsertCanonical(canonical)
    upsertMetaByProperty('og:url', canonical)
  }, [location.pathname])

  return null
}

export default SiteMetaManager
