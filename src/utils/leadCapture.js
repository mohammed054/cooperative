/**
 * leadCapture — stub implementation.
 * Replace with real integration (e.g. HubSpot, Salesforce, custom API).
 */

/**
 * Normalize lead fields from form data
 * @param {Record<string, unknown>} data - Raw form data
 * @returns {Record<string, unknown>} Normalized lead fields
 */
export const normalizeLeadFields = (data = {}) => {
  const normalized = {}

  // Map common field variations to standard names
  const fieldMappings = {
    name: ['name', 'fullName', 'full_name', 'clientName', 'client_name'],
    email: ['email', 'emailAddress', 'email_address'],
    phone: ['phone', 'phoneNumber', 'phone_number', 'tel', 'telephone'],
    company: ['company', 'companyName', 'company_name', 'organization'],
    message: ['message', 'comments', 'notes', 'description', 'inquiry'],
    service: ['service', 'serviceType', 'service_type', 'interest'],
    budget: ['budget', 'budgetRange', 'budget_range'],
    eventDate: ['eventDate', 'event_date', 'date', 'eventDate'],
    eventLocation: ['eventLocation', 'event_location', 'location', 'venue'],
  }

  for (const [standardField, aliases] of Object.entries(fieldMappings)) {
    for (const alias of aliases) {
      if (data[alias] !== undefined && data[alias] !== '') {
        normalized[standardField] = data[alias]
        break
      }
    }
  }

  // Copy any remaining fields that weren't mapped
  for (const [key, value] of Object.entries(data)) {
    if (!normalized[key] && value !== undefined && value !== '') {
      normalized[key] = value
    }
  }

  return normalized
}

export const isLeadCaptureConfigured = () => {
  return Boolean(
    typeof import.meta !== 'undefined' &&
    import.meta.env?.VITE_LEAD_CAPTURE_ENDPOINT
  )
}

export const submitLead = async (fields, meta = {}) => {
  const endpoint = import.meta?.env?.VITE_LEAD_CAPTURE_ENDPOINT
  if (!endpoint) {
    // Stub: simulate network delay
    await new Promise(r => setTimeout(r, 680))
    console.info('[leadCapture] Stub submission:', { fields, meta })
    return { ok: true, mode: 'stub' }
  }
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...fields, ...meta }),
  })
  if (!res.ok) throw new Error(`Lead capture failed: ${res.status}`)
  return { ok: true, mode: 'live' }
}