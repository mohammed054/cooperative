import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  buildLeadPayload,
  normalizeLeadFields,
  submitLead,
} from './leadCapture'

describe('leadCapture', () => {
  const originalFetch = global.fetch

  beforeEach(() => {
    global.fetch = vi.fn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    global.fetch = originalFetch
  })

  it('normalizes and filters lead fields', () => {
    const result = normalizeLeadFields({
      name: '  Jane Doe ',
      email: 'jane@example.com',
      empty: '   ',
      nullValue: null,
      custom: 42,
    })

    expect(result).toEqual({
      name: 'Jane Doe',
      email: 'jane@example.com',
      custom: '42',
    })
  })

  it('builds payload with metadata', () => {
    const payload = buildLeadPayload(
      { name: 'Jane Doe', email: 'jane@example.com' },
      { formName: 'contact-page-form' }
    )

    expect(payload.name).toBe('Jane Doe')
    expect(payload.email).toBe('jane@example.com')
    expect(payload._meta.formName).toBe('contact-page-form')
    expect(typeof payload._meta.submittedAt).toBe('string')
  })

  it('submits leads to the configured endpoint', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ ok: true }),
    })

    await submitLead(
      { name: 'Jane Doe', email: 'jane@example.com' },
      { formName: 'contact-page-form' },
      {
        endpoint: 'https://example.com/webhook',
        apiKey: 'secret-key',
      }
    )

    expect(global.fetch).toHaveBeenCalledTimes(1)
    const [endpoint, options] = global.fetch.mock.calls[0]
    expect(endpoint).toBe('https://example.com/webhook')
    expect(options.method).toBe('POST')
    expect(options.headers['Content-Type']).toBe('application/json')
    expect(options.headers['x-api-key']).toBe('secret-key')

    const body = JSON.parse(options.body)
    expect(body.name).toBe('Jane Doe')
    expect(body.email).toBe('jane@example.com')
    expect(body._meta.formName).toBe('contact-page-form')
  })

  it('throws a readable error when endpoint is missing', async () => {
    await expect(submitLead({ name: 'Jane' }, {}, { endpoint: '' })).rejects.toThrow(
      'Lead webhook is not configured.'
    )
  })

  it('surfaces API response errors', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 422,
      json: vi.fn().mockResolvedValue({ message: 'Invalid payload' }),
      text: vi.fn().mockResolvedValue('Invalid payload'),
    })

    await expect(
      submitLead(
        { name: 'Jane Doe', email: 'jane@example.com' },
        {},
        { endpoint: 'https://example.com/webhook' }
      )
    ).rejects.toThrow('Invalid payload')
  })
})
