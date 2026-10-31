import './style.css'
import { searchCityWeather } from './services/open-meteo.ts'
import { mountWeatherApp } from './weather-app.ts'

const appRoot = document.querySelector<HTMLDivElement>('#app')

if (!appRoot) {
  throw new Error('Não foi possível iniciar a aplicação.')
}

mountWeatherApp(appRoot, searchCityWeather)
