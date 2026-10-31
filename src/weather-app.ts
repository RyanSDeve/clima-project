import type { CityWeatherResult } from './weather-types.ts'
import {
  formatMeasurement,
  formatWeatherDate,
  getWeatherDescription,
} from './weather-format.ts'

export type CityWeatherSearch = (cityName: string) => Promise<CityWeatherResult | null>

export function mountWeatherApp(root: HTMLElement, searchCityWeather: CityWeatherSearch): void {
  root.innerHTML = `
    <main class="app-shell">
      <header class="search-header">
        <h1>Clima</h1>
        <form id="city-search-form" role="search">
          <label for="city-input">Cidade</label>
          <div class="search-controls">
            <input id="city-input" name="city" type="search" autocomplete="address-level2" placeholder="Ex.: São Paulo" />
            <button type="submit">Buscar</button>
          </div>
        </form>
      </header>
      <section id="weather-content" aria-live="polite" aria-atomic="true" aria-labelledby="content-heading">
        <h2 id="content-heading">Consulte o clima de uma cidade</h2>
        <p>Informe uma cidade para ver as condições atuais.</p>
      </section>
    </main>
  `

  const searchForm = root.querySelector<HTMLFormElement>('#city-search-form')!
  const cityInput = root.querySelector<HTMLInputElement>('#city-input')!
  const submitButton = searchForm.querySelector<HTMLButtonElement>('button[type="submit"]')!
  const weatherContent = root.querySelector<HTMLElement>('#weather-content')!
  let isLoading = false

  function renderInitialState(): void {
    weatherContent.innerHTML = `
      <h2 id="content-heading">Consulte o clima de uma cidade</h2>
      <p>Informe uma cidade para ver as condições atuais.</p>
    `
  }

  function renderLoadingState(): void {
    weatherContent.innerHTML = '<h2 id="content-heading">Buscando o clima...</h2>'
  }

  function renderNoResult(): void {
    weatherContent.innerHTML = `
      <h2 id="content-heading">Não foi possível obter os dados</h2>
      <p>Confira o nome da cidade e tente novamente.</p>
    `
  }

  function renderWeatherResult(result: CityWeatherResult): void {
    const { city, weather } = result
    weatherContent.replaceChildren()

    const article = document.createElement('article')
    article.className = 'weather-result'

    const summary = document.createElement('aside')
    summary.className = 'weather-summary'

    const cityHeading = document.createElement('h2')
    cityHeading.id = 'content-heading'
    cityHeading.textContent = `${city.name}, ${city.countryCode}`

    const temperature = document.createElement('p')
    temperature.className = 'weather-temperature'
    temperature.textContent = formatMeasurement(weather.temperature2m, weather.temperature2mUnit)

    const description = document.createElement('p')
    description.className = 'weather-description'
    description.textContent = getWeatherDescription(weather.weatherCode)

    const localDate = document.createElement('p')
    localDate.className = 'weather-date'
    localDate.textContent = formatWeatherDate(city.timezone) ?? 'Data indisponível'

    const dayPeriod = document.createElement('p')
    dayPeriod.className = 'weather-day-period'
    dayPeriod.textContent = weather.isDay ? 'Dia' : 'Noite'

    summary.append(cityHeading, temperature, description, localDate, dayPeriod)

    const main = document.createElement('div')
    main.className = 'weather-main'
    const measurementsHeading = document.createElement('h3')
    measurementsHeading.textContent = 'Condições atuais'
    main.append(measurementsHeading)

    const measurements = document.createElement('dl')
    measurements.className = 'weather-measurements'
    const values = [
      ['Umidade relativa', weather.relativeHumidity2m, weather.relativeHumidity2mUnit],
      ['Sensação térmica', weather.apparentTemperature, weather.apparentTemperatureUnit],
      [
        'Probabilidade de precipitação',
        weather.precipitationProbability,
        weather.precipitationProbabilityUnit,
      ],
      ['Velocidade do vento', weather.windSpeed10m, weather.windSpeed10mUnit],
      ['Direção do vento', weather.windDirection10m, weather.windDirection10mUnit],
    ] as const

    for (const [label, value, unit] of values) {
      const metric = document.createElement('div')
      const term = document.createElement('dt')
      const detail = document.createElement('dd')
      term.textContent = label
      detail.textContent = formatMeasurement(value, unit)
      metric.append(term, detail)
      measurements.append(metric)
    }

    main.append(measurements)
    article.append(summary, main)
    weatherContent.append(article)
  }

  renderInitialState()

  searchForm.addEventListener('submit', async (event) => {
    event.preventDefault()
    if (isLoading) return

    const cityName = cityInput.value.trim()
    if (!cityName) return

    isLoading = true
    submitButton.disabled = true
    weatherContent.setAttribute('aria-busy', 'true')
    renderLoadingState()

    try {
      const result = await searchCityWeather(cityName)
      if (result) {
        renderWeatherResult(result)
      } else {
        renderNoResult()
      }
    } catch {
      renderNoResult()
    } finally {
      isLoading = false
      submitButton.disabled = false
      weatherContent.removeAttribute('aria-busy')
    }
  })
}
