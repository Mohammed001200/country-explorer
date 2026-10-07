const populationFormatter = new Intl.NumberFormat('sv-SE')
const regionLabels = {
  Africa: 'Afrika',
  Americas: 'Amerika',
  Antarctic: 'Antarktis',
  Asia: 'Asien',
  Europe: 'Europa',
  Oceania: 'Oceanien',
}

/**
 * Replace the list with country cards, inserting external text safely.
 * @param {HTMLElement} container The country list in the page.
 * @param {import('./api.js').Country[]} countries Countries to display.
 */
export function renderCountries(container, countries) {
  const fragment = document.createDocumentFragment()

  for (const country of countries) {
    const item = document.createElement('li')
    item.append(createCountryCard(country))
    fragment.append(item)
  }

  container.replaceChildren(fragment)
}

function createCountryCard(country) {
  const card = document.createElement('article')
  card.className = 'country-card'

  const flag = document.createElement('div')
  flag.className = 'flag'
  flag.textContent = 'Flagga saknas'
  const flagUrl = country.flags?.svg || country.flags?.png

  if (typeof flagUrl === 'string' && flagUrl.startsWith('https://')) {
    const image = document.createElement('img')
    image.src = flagUrl
    image.alt = `Flagga för ${country.name.common}`
    image.loading = 'lazy'
    image.width = 320
    image.height = 200
    image.addEventListener('error', () => {
      flag.textContent = 'Flagga kunde inte laddas'
    }, { once: true })
    flag.replaceChildren(image)
  }

  const body = document.createElement('div')
  body.className = 'card-body'
  const heading = document.createElement('h3')
  heading.textContent = country.name.common

  const details = document.createElement('dl')
  const capitals = Array.isArray(country.capital)
    ? country.capital.filter((capital) => typeof capital === 'string').join(', ')
    : ''
  const population = Number.isFinite(country.population) && country.population >= 0
    ? populationFormatter.format(country.population)
    : 'Uppgift saknas'

  details.append(
    createDetail('Huvudstad', capitals || 'Uppgift saknas'),
    createDetail('Region', regionLabels[country.region] || country.region || 'Uppgift saknas'),
    createDetail('Befolkning', population),
  )
  body.append(heading, details)
  card.append(flag, body)
  return card
}

function createDetail(label, value) {
  const row = document.createElement('div')
  row.className = 'country-detail'
  const term = document.createElement('dt')
  term.textContent = label
  const description = document.createElement('dd')
  description.textContent = value
  row.append(term, description)
  return row
}
