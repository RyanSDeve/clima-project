import type { CityWeatherResult, CurrentWeather, GeocodedCity } from '../weather-types.ts'

export type { CityWeatherResult, CurrentWeather, GeocodedCity } from '../weather-types.ts'

const GEOCODING_ENDPOINT = 'https://geocoding-api.open-meteo.com/v1/search'
const FORECAST_ENDPOINT = 'https://api.open-meteo.com/v1/forecast'
const CURRENT_FIELDS =
  'precipitation_probability,temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export async function geocodeCity(cityName: string): Promise<GeocodedCity | null> {
  const name = cityName.trim()
  if (!name) return null

  const url = new URL(GEOCODING_ENDPOINT)
  url.search = new URLSearchParams({
    name,
    count: '1',
    language: 'pt',
    format: 'json',
  }).toString()

  try {
    const response = await fetch(url)
    if (!response.ok) return null

    const data: unknown = await response.json()
    if (!isRecord(data) || !Array.isArray(data.results)) return null

    const firstResult: unknown = data.results[0]
    if (!isRecord(firstResult)) return null

    const resultName = firstResult.name
    const latitude = firstResult.latitude
    const longitude = firstResult.longitude
    const timezone = firstResult.timezone
    const countryCode = firstResult.country_code

    if (
      typeof resultName !== 'string' ||
      !resultName.trim() ||
      typeof latitude !== 'number' ||
      !Number.isFinite(latitude) ||
      latitude < -90 ||
      latitude > 90 ||
      typeof longitude !== 'number' ||
      !Number.isFinite(longitude) ||
      longitude < -180 ||
      longitude > 180 ||
      typeof timezone !== 'string' ||
      !timezone.trim() ||
      typeof countryCode !== 'string' ||
      !countryCode.trim()
    ) {
      return null
    }

    return {
      name: resultName.trim(),
      latitude,
      longitude,
      timezone: timezone.trim(),
      countryCode: countryCode.trim().toUpperCase(),
    }
  } catch {
    return null
  }
}

export async function getCurrentWeather(
  city: GeocodedCity,
): Promise<CurrentWeather | null> {
  if (
    !Number.isFinite(city.latitude) ||
    city.latitude < -90 ||
    city.latitude > 90 ||
    !Number.isFinite(city.longitude) ||
    city.longitude < -180 ||
    city.longitude > 180 ||
    !city.timezone.trim()
  ) {
    return null
  }

  const url = new URL(FORECAST_ENDPOINT)
  url.search = new URLSearchParams({
    latitude: String(city.latitude),
    longitude: String(city.longitude),
    timezone: city.timezone,
    current: CURRENT_FIELDS,
  }).toString()

  try {
    const response = await fetch(url)
    if (!response.ok) return null

    const data: unknown = await response.json()
    if (!isRecord(data) || !isRecord(data.current) || !isRecord(data.current_units)) {
      return null
    }

    const current = data.current
    const units = data.current_units
    const values = [
      current.temperature_2m,
      current.relative_humidity_2m,
      current.apparent_temperature,
      current.precipitation_probability,
      current.wind_speed_10m,
      current.wind_direction_10m,
      current.weather_code,
    ]
    const requiredUnits = [
      units.temperature_2m,
      units.relative_humidity_2m,
      units.apparent_temperature,
      units.precipitation_probability,
      units.wind_speed_10m,
      units.wind_direction_10m,
    ]

    if (
      !values.every((value) => typeof value === 'number' && Number.isFinite(value)) ||
      (current.is_day !== 0 && current.is_day !== 1) ||
      !requiredUnits.every((unit) => typeof unit === 'string' && unit.trim())
    ) {
      return null
    }

    return {
      temperature2m: current.temperature_2m as number,
      temperature2mUnit: units.temperature_2m as string,
      relativeHumidity2m: current.relative_humidity_2m as number,
      relativeHumidity2mUnit: units.relative_humidity_2m as string,
      apparentTemperature: current.apparent_temperature as number,
      apparentTemperatureUnit: units.apparent_temperature as string,
      isDay: current.is_day === 1,
      weatherCode: current.weather_code as number,
      precipitationProbability: current.precipitation_probability as number,
      precipitationProbabilityUnit: units.precipitation_probability as string,
      windSpeed10m: current.wind_speed_10m as number,
      windSpeed10mUnit: units.wind_speed_10m as string,
      windDirection10m: current.wind_direction_10m as number,
      windDirection10mUnit: units.wind_direction_10m as string,
    }
  } catch {
    return null
  }
}

export async function searchCityWeather(
  cityName: string,
): Promise<CityWeatherResult | null> {
  try {
    const city = await geocodeCity(cityName)
    if (!city) return null

    const weather = await getCurrentWeather(city)
    if (!weather) return null

    return { city, weather }
  } catch {
    return null
  }
}