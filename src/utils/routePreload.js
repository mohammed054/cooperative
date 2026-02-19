export const loadHome = () => import('../pages/Home')
export const loadServices = () => import('../pages/Services')
export const loadServiceDetail = () => import('../pages/ServiceDetail')
export const loadWork = () => import('../pages/Work')
export const loadCaseStudyDetail = () => import('../pages/CaseStudyDetail')
export const loadProcess = () => import('../pages/Process')
export const loadAbout = () => import('../pages/About')
export const loadTestimonials = () => import('../pages/Testimonials')
export const loadPricing = () => import('../pages/Pricing')
export const loadFaq = () => import('../pages/FAQ')
export const loadContact = () => import('../pages/Contact')
export const loadPrivacy = () => import('../pages/Privacy')
export const loadTerms = () => import('../pages/Terms')
export const loadNotFound = () => import('../pages/NotFound')
export const loadProjects = () => import('../components/OurProjects')

export const preloadHighIntentRoutes = () =>
  Promise.allSettled([
    loadServices(),
    loadWork(),
    loadContact(),
    loadPricing(),
  ])
