import './style.css'
import { fetchCountries } from './api.js'
import { renderCountries } from './render.js'
import { filterCountries } from './filters.js'

const countryList = document.querySelector('#countries')
const status = document.querySelector('#status')
const resultCount = document.querySelector('#result-count')
const filterForm = document.querySelector('#filters')
const searchInput = document.querySelector('#search')
const regionSelect = document.querySelector('#region')
const resetButton = document.querySelector('#reset')
const retryButton = document.querySelector('#retry')

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
retryButton.addEventListener('click', loadCountries)

function setFiltersDisabled(disabled) {
  searchInput.disabled = disabled
  regionSelect.disabled = disabled
  resetButton.disabled = disabled
}

/** Fetch data and keep loading, empty-response, error and retry states usable. */
async function loadCountries() {
  const retryHadFocus = document.activeElement === retryButton
  setFiltersDisabled(true)
  retryButton.hidden = true
  retryButton.disabled = true
  countries = []
  renderCountries(countryList, [])
  resultCount.textContent = ''
  status.classList.remove('is-error')
  status.textContent = 'Hämtar länder…'
  countryList.setAttribute('aria-busy', 'true')

  try {
    countries = await fetchCountries()
    if (countries.length === 0) {
      status.textContent = 'API:et returnerade inga länder. Försök igen om en stund.'
      resultCount.textContent = '0 länder'
      retryButton.hidden = false
      return
    }
    setFiltersDisabled(false)
    updateResults()
  } catch {
    status.textContent = 'Länderna kunde inte hämtas. Kontrollera din internetanslutning och försök igen.'
    status.classList.add('is-error')
    retryButton.hidden = false
  } finally {
    countryList.setAttribute('aria-busy', 'false')
    retryButton.disabled = false
    if (retryHadFocus) {
      const nextControl = retryButton.hidden ? searchInput : retryButton
      nextControl.focus()
    }
  }
}

loadCountries()
