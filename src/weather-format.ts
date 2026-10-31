const WEATHER_DESCRIPTIONS: Record<number, string> = {
  0: 'Céu limpo',
  1: 'Predominantemente limpo',
  2: 'Parcialmente nublado',
  3: 'Encoberto',
  45: 'Neblina',
  48: 'Neblina com geada',
  51: 'Chuvisco leve',
  53: 'Chuvisco moderado',
  55: 'Chuvisco intenso',
  56: 'Chuvisco congelante leve',
  57: 'Chuvisco congelante intenso',
  61: 'Chuva leve',
  63: 'Chuva moderada',
  65: 'Chuva intensa',
  66: 'Chuva congelante leve',
  67: 'Chuva congelante intensa',
  71: 'Neve leve',
  73: 'Neve moderada',
  75: 'Neve intensa',
  77: 'Grãos de neve',
  80: 'Pancadas de chuva leves',
  81: 'Pancadas de chuva moderadas',
  82: 'Pancadas de chuva violentas',
  85: 'Pancadas de neve leves',
  86: 'Pancadas de neve intensas',
  95: 'Trovoada',
  96: 'Trovoada com granizo leve',
  97: 'Trovoada intensa',
  99: 'Trovoada com granizo intenso',
}

export function getWeatherDescription(weatherCode: number): string {
  return WEATHER_DESCRIPTIONS[weatherCode] ?? 'Condição meteorológica não identificada'
}

export function formatMeasurement(value: number, unit: string): string {
  const formattedValue = new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: 1,
  }).format(value)

  return `${formattedValue} ${unit}`
}

export function formatWeatherDate(timezone: string, date = new Date()): string | null {
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'full',
      timeZone: timezone,
    }).format(date)
  } catch {
    return null
  }
}
