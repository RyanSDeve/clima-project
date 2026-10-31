export interface GeocodedCity {
  name: string
  latitude: number
  longitude: number
  timezone: string
  countryCode: string
}

export interface CurrentWeather {
  temperature2m: number
  temperature2mUnit: string
  relativeHumidity2m: number
  relativeHumidity2mUnit: string
  apparentTemperature: number
  apparentTemperatureUnit: string
  isDay: boolean
  weatherCode: number
  precipitationProbability: number
  precipitationProbabilityUnit: string
  windSpeed10m: number
  windSpeed10mUnit: string
  windDirection10m: number
  windDirection10mUnit: string
}

export interface CityWeatherResult {
  city: GeocodedCity
  weather: CurrentWeather
}
