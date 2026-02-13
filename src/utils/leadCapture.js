const REQUEST_TIMEOUT_MS = 12000

const getEnvValue = key => {
  const rawValue = import.meta.env?.[key]
  return typeof rawValue === 'string' ? rawValue.trim() : ''
}

export const getLeadWebhookUrl = () => getEnvValue('VITE_LEAD_WEBHOOK_URL')

export const getLeadWebhookKey = () => getEnvValue('VITE_LEAD_WEBHOOK_KEY')

export const isLeadCaptureConfigured = () => Boolean(getLeadWebhookUrl())

const normalizeFieldValue = value => {
  if (typeof value === 'string') return value.trim()
  if (value == null) return ''
  return String(value).trim()
}

export const normalizeLeadFields = fields => {
  if (!fields || typeof fields !== 'object') return {}

  return Object.entries(fields).reduce((acc, [key, value]) => {
    const normalizedKey = String(key || '').trim()
    if (!normalizedKey) return acc

    const normalizedValue = normalizeFieldValue(value)
    if (!normalizedValue) return acc

    acc[normalizedKey] = normalizedValue
    return acc
  }, {})
}

export const buildLeadPayload = (fields, metadata = {}) => {
  const normalizedFields = normalizeLeadFields(fields)

  return {
    ...normalizedFields,
    _meta: {
      submittedAt: new Date().toISOString(),
      ...metadata,
    },
  }
}

const parseErrorMessage = async response => {
  try {
    const json = await response.json()
    if (typeof json?.error === 'string') return json.error
    if (typeof json?.message === 'string') return json.message
  } catch {
    // Ignore JSON parsing failures and fall back to plain text.
  }

  try {
    const text = await response.text()
    if (text) return text
  } catch {
    // Ignore text parsing failures and use fallback.
  }

  return `Lead request failed with status ${response.status}`
}

export const submitLead = async (fields, metadata = {}, options = {}) => {
  const endpoint = (options.endpoint || getLeadWebhookUrl()).trim()
  const apiKey = (options.apiKey || getLeadWebhookKey()).trim()

  if (!endpoint) {
    throw new Error('Lead webhook is not configured.')
  }

  const payload = buildLeadPayload(fields, metadata)
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(apiKey ? { 'x-api-key': apiKey } : {}),
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })

    if (!response.ok) {
      throw new Error(await parseErrorMessage(response))
    }

    return { ok: true }
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw new Error('Submission timed out. Please try again.')
    }

    throw error instanceof Error
      ? error
      : new Error('Lead submission failed. Please try again.')
  } finally {
    clearTimeout(timeoutId)
  }
}
