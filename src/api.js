// The original restcountries.com v3.1 endpoint has been retired.
// This public mirror keeps the same data format and needs no API key.
const API_URL = 'https://restcountries.conventus.de/v3.1/all?fields=name,capital,region,population,flags,cca3'

/**
 * @typedef {Object} Country
 * @property {{common: string}} name
 * @property {string[]} [capital]
 * @property {string} region
 * @property {number} [population]
 * @property {{png?: string}} [flags]
 */

/**
 * Fetch and alphabetically sort countries. Reject failed or malformed responses.
 * @returns {Promise<Country[]>}
 * @throws {Error} When the request fails or the response has an invalid format.
 */
export async function fetchCountries() {
  const response = await fetch(API_URL, { signal: AbortSignal.timeout(15000) })

  if (!response.ok) {
    throw new Error(`Country request failed: ${response.status}`)
  }

  const countries = await response.json()
  const isValid = Array.isArray(countries) && countries.every((country) =>
    typeof country?.name?.common === 'string' &&
    country.name.common.trim() !== '' &&
    typeof country.region === 'string',
  )

  if (!isValid) {
    throw new Error('Invalid country data')
  }

  return countries.sort((a, b) => a.name.common.localeCompare(b.name.common, 'en'))
}
