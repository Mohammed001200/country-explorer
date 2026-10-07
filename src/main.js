import './style.css'
import { fetchCountries } from './api.js'
import { renderCountries } from './render.js'

const countryList = document.querySelector('#countries')
const status = document.querySelector('#status')
const resultCount = document.querySelector('#result-count')
const results = document.querySelector('.results')

async function loadCountries() {
  status.textContent = 'Hämtar länder…'
  results.setAttribute('aria-busy', 'true')

  try {
    const countries = await fetchCountries()
    renderCountries(countryList, countries)
    resultCount.textContent = `${countries.length} länder och territorier`
    status.textContent = countries.length ? 'Länderna är redo att utforskas.' : 'API:et returnerade inga länder.'
  } catch {
    status.textContent = 'Länderna kunde inte hämtas. Kontrollera din internetanslutning och försök igen.'
    status.classList.add('is-error')
  } finally {
    results.setAttribute('aria-busy', 'false')
  }
}

loadCountries()
