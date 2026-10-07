import './style.css'
import { fetchCountries } from './api.js'
import { renderCountries } from './render.js'
import { filterCountries } from './filters.js'

const countryList = document.querySelector('#countries')
const status = document.querySelector('#status')
const resultCount = document.querySelector('#result-count')
const results = document.querySelector('.results')
const filterForm = document.querySelector('#filters')
const searchInput = document.querySelector('#search')
const regionSelect = document.querySelector('#region')
const resetButton = document.querySelector('#reset')

let countries = []

/** Apply the current search and region, then update cards and result feedback. */
function updateResults() {
  const filteredCountries = filterCountries(countries, searchInput.value, regionSelect.value)
  renderCountries(countryList, filteredCountries)
  resultCount.textContent = `${filteredCountries.length} av ${countries.length}`
  status.textContent = filteredCountries.length
    ? `Visar ${filteredCountries.length} av ${countries.length} länder och territorier.`
    : 'Inga länder matchar din sökning. Ändra sökningen eller rensa filtren.'
}

searchInput.addEventListener('input', updateResults)
regionSelect.addEventListener('change', updateResults)
filterForm.addEventListener('submit', (event) => event.preventDefault())
resetButton.addEventListener('click', () => {
  searchInput.value = ''
  regionSelect.value = ''
  updateResults()
  searchInput.focus()
})

async function loadCountries() {
  status.textContent = 'Hämtar länder…'
  results.setAttribute('aria-busy', 'true')

  try {
    countries = await fetchCountries()
    searchInput.disabled = false
    regionSelect.disabled = false
    resetButton.disabled = false
    updateResults()
  } catch {
    status.textContent = 'Länderna kunde inte hämtas. Kontrollera din internetanslutning och försök igen.'
    status.classList.add('is-error')
  } finally {
    results.setAttribute('aria-busy', 'false')
  }
}

loadCountries()
