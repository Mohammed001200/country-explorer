/**
 * Filter by a partial country name and region without changing the original list.
 * Search ignores letter case and surrounding whitespace. Empty filters match all.
 * @param {import('./api.js').Country[]} countries Validated countries from the API.
 * @param {string} [searchTerm=''] A full or partial English country name.
 * @param {string} [region=''] An API region, or an empty string for all regions.
 * @returns {import('./api.js').Country[]} Countries matching both filters.
 */
export function filterCountries(countries, searchTerm = '', region = '') {
  const search = searchTerm.trim().toLowerCase()

  return countries.filter((country) => {
    const matchesName = country.name.common.toLowerCase().includes(search)
    const matchesRegion = region === '' || country.region === region
    return matchesName && matchesRegion
  })
}
