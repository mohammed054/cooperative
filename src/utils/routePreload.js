// Route preloaders — lazy import wrappers to prefetch chunks
export const loadServices       = () => import('../pages/Services.jsx').catch(() => ({ default: () => null }))
export const loadServiceDetail  = () => import('../pages/ServiceDetail.jsx').catch(() => ({ default: () => null }))
export const loadWork           = () => import('../pages/Work.jsx').catch(() => ({ default: () => null }))
export const loadCaseStudyDetail= () => import('../pages/CaseStudyDetail.jsx').catch(() => ({ default: () => null }))
export const loadProcess        = () => import('../pages/Process.jsx').catch(() => ({ default: () => null }))
export const loadAbout          = () => import('../pages/About.jsx').catch(() => ({ default: () => null }))
export const loadTestimonials   = () => import('../pages/Testimonials.jsx').catch(() => ({ default: () => null }))
export const loadPricing        = () => import('../pages/Pricing.jsx').catch(() => ({ default: () => null }))
export const loadFaq            = () => import('../pages/FAQ.jsx').catch(() => ({ default: () => null }))
export const loadContact        = () => import('../pages/Contact.jsx').catch(() => ({ default: () => null }))
export const loadPrivacy        = () => import('../pages/Privacy.jsx').catch(() => ({ default: () => null }))
export const loadTerms          = () => import('../pages/Terms.jsx').catch(() => ({ default: () => null }))
export const loadNotFound       = () => import('../pages/NotFound.jsx').catch(() => ({ default: () => null }))

export const preloadHighIntentRoutes = () => {
  loadWork()
  loadServices()
  loadContact()
}