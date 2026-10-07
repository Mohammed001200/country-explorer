import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchCountries } from './api.js'

function mockResponse(data, status = 200) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: vi.fn().mockResolvedValue(data),
  })
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('fetchCountries', () => {
  it('fetches countries and returns them alphabetically', async () => {
    const sweden = { name: { common: 'Sweden' }, region: 'Europe' }
    const brazil = { name: { common: 'Brazil' }, region: 'Americas' }
    const fetchMock = mockResponse([sweden, brazil])

    expect(await fetchCountries()).toEqual([brazil, sweden])
    expect(fetchMock).toHaveBeenCalledOnce()
  })

  it('accepts an empty country list', async () => {
    mockResponse([])
    expect(await fetchCountries()).toEqual([])
  })

  it('rejects an unsuccessful HTTP response', async () => {
    mockResponse({ message: 'Service unavailable' }, 503)
    await expect(fetchCountries()).rejects.toThrow('Country request failed: 503')
  })

  it('rejects a network failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network offline')))
    await expect(fetchCountries()).rejects.toThrow('Network offline')
  })

  it('rejects an error object even when the HTTP status is 200', async () => {
    mockResponse({ status: 404, message: 'This endpoint has been retired' })
    await expect(fetchCountries()).rejects.toThrow('Invalid country data')
  })

  it.each([
    ['a missing name', { region: 'Europe' }],
    ['an empty name', { name: { common: '' }, region: 'Europe' }],
    ['a whitespace name', { name: { common: '   ' }, region: 'Europe' }],
    ['a numeric name', { name: { common: 123 }, region: 'Europe' }],
    ['a missing region', { name: { common: 'Sweden' } }],
    ['a numeric region', { name: { common: 'Sweden' }, region: 123 }],
    ['a null country', null],
  ])('rejects a country with %s', async (_description, country) => {
    mockResponse([country])
    await expect(fetchCountries()).rejects.toThrow('Invalid country data')
  })
})
