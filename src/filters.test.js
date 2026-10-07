import { describe, expect, it } from 'vitest'
import { filterCountries } from './filters.js'

const countries = [
  { name: { common: 'Sweden' }, region: 'Europe' },
  { name: { common: 'Germany' }, region: 'Europe' },
  { name: { common: 'India' }, region: 'Asia' },
  { name: { common: 'Indonesia' }, region: 'Asia' },
  { name: { common: 'Brazil' }, region: 'Americas' },
  { name: { common: 'Canada' }, region: 'Americas' },
]

describe('filterCountries', () => {
  it('matches a partial country name', () => {
    expect(filterCountries(countries, 'ind')).toEqual([
      countries[2],
      countries[3],
    ])
  })

  it('ignores search case and surrounding whitespace', () => {
    expect(filterCountries(countries, '  sWeD  ')).toEqual([countries[0]])
  })

  it('filters by region', () => {
    expect(filterCountries(countries, '', 'Americas')).toEqual([
      countries[4],
      countries[5],
    ])
  })

  it('returns countries that match both search and region', () => {
    expect(filterCountries(countries, 'a', 'Europe')).toEqual([countries[1]])
  })

  it('excludes name matches outside the selected region', () => {
    expect(filterCountries(countries, 'ind', 'Europe')).toEqual([])
  })

  it('returns an empty list when no country matches', () => {
    expect(filterCountries(countries, 'Atlantis')).toEqual([])
    expect(filterCountries(countries, '', 'Antarctic')).toEqual([])
  })

  it('returns all countries for empty filters', () => {
    expect(filterCountries(countries)).toEqual(countries)
    expect(filterCountries(countries, '   ', '')).toEqual(countries)
  })

  it('does not change the original list', () => {
    const original = structuredClone(countries)
    const result = filterCountries(countries, 'ind', 'Asia')

    expect(countries).toEqual(original)
    expect(result).not.toBe(countries)
  })

  it('handles an empty country list', () => {
    expect(filterCountries([])).toEqual([])
    expect(filterCountries([], 'Sweden', 'Europe')).toEqual([])
  })
})
