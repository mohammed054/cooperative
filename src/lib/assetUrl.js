/**
 * assetUrl — resolves asset paths relative to the base URL.
 * In production, assets are typically served from the public directory.
 */
const BASE = typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL
  ? import.meta.env.BASE_URL
  : '/'

export const assetUrl = (path) => {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('/')) {
    return path
  }
  return `${BASE}${path}`.replace(/\/+/g, '/').replace(/^\/\//, '/')
}

export default assetUrl