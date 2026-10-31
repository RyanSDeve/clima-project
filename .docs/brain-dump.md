# Projeto: Clima

Este projeto vai pegar a cidade e baseado nisso consultar o clima daquela região, exibindo as principais informações de clima, temperatura, umidade, etc...

### Aspectos Técnicos

O projeto vai ser feito em vite + vanilla + typescript

### Informações da API que vai ser usada no projeto

Ele vai usar a API open-meteo, com os seguintes endpoints:

- Para pegar a latitude e longitude e timezone, baseado no nome da cidade:
  https://geocoding-api.open-meteo.com/v1/search?name={NOME DA CIDADE}&count=1&language=pt&format=json

  {NOME DA CIDADE} = Nome da cidade que o usuário digitou

  Exemplo de resposta:
  {
  "results": [
  {
  "id": 3451190,
  "name": "Rio de Janeiro",
  "latitude": -22.90642,
  "longitude": -43.18223,
  "elevation": 12,
  "feature_code": "PPLA",
  "country_code": "BR",
  "admin1_id": 3451189,
  "admin2_id": 6322060,
  "timezone": "America/Sao_Paulo",
  "population": 6747815,
  "country_id": 3469034,
  "country": "Brasil",
  "admin1": "Rio de Janeiro",
  "admin2": "Rio de Janeiro"
  }
  ],
  "generationtime_ms": 0.13148785
  }

  Informações que PRECISAMOS:
  - name
  - latitude
  - longitude
  - timezone
  - country_code

- Para pegar as informações de clima -
  https://api.open-meteo.com/v1/forecast?latitude={LATITUDE}&longitude={LONGITUDE}&current=precipitation_probability,temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m&timezone={TIMEZONE}

  {LATITUDE} = LATITUDE
  {LONGITUDE} = LONGITUDE
  {TIMEZONE} = TIMEZONE

  Exemplo de resposta:
  {
  "latitude": 52.512604,
  "longitude": 13.419517,
  "generationtime_ms": 0.243067741394043,
  "utc_offset_seconds": -10800,
  "timezone": "America/Sao_Paulo",
  "timezone_abbreviation": "GMT-3",
  "elevation": 38,
  "current_units": {
  "time": "iso8601",
  "interval": "seconds",
  "precipitation_probability": "%",
  "temperature_2m": "°C",
  "relative_humidity_2m": "%",
  "is_day": "",
  "apparent_temperature": "°C",
  "precipitation": "mm",
  "weather_code": "wmo code",
  "wind_speed_10m": "km/h",
  "wind_direction_10m": "°"
  },
  "current": {
  "time": "2026-10-31T17:30",
  "interval": 900,
  "precipitation_probability": 0,
  "temperature_2m": 7.1,
  "relative_humidity_2m": 84,
  "is_day": 0,
  "apparent_temperature": 4.5,
  "precipitation": 0,
  "weather_code": 2,
  "wind_speed_10m": 9,
  "wind_direction_10m": 16
  }
  }

  Informações que PRECISAMOS:
  Na resposta eu tenho 2 itens:
  - current_units tem as unidades de medida das propriedades
  - current tem os valores das propriedades

  ## Propriedades obrigatórias:
  - temperature_2m
  - relative_humidity_2m
  - is_day
  - wind_speed_10m
  - wind_direction_10m
  - precipitation_probability

#### Informação importante:

Teremos um arquivo com as funções do open-meteo para que o projeto não faça requisição direta à API, mas use as funções desse arquivo.

Fluxo de pesquisa para receber o nome da cidade e pegar as informações de clima:

- O usuário digita o nome da cidade
- O projeto pega o nome e use o open-meteo para pegar latitude longitude e timezone dessa cidade
- Ao pegar as 3 informações, o projeto usa essas informações para fazer a requisição e pegar as informações do clima dessa localização
- Caso não ache as informações da cidade, se comportar como se não tivesse achado nada
- Caso ache as informações da cidade, mas não a de clima, se comportar como se não tivesse achado nada

A busca envolve as duas requisições (buscar latitude/longitude/timezone + buscar clima), mas para o usuário é uma coisa só, com loading

As funções do open-meteo devem verificar se os parametros vieram, caso contrário, age como se não tivesse vindo.

### Aspectos visuais (Design e UX)

Tem que ter empty state

Teremos uma área superior centralizada que tem apenas o campo de busca da cidade

O projeto terá um side-bar na esquerda com as seguintes informações:

- Temperatura
- Nome da cidade, Código do pais
- Dia atual
- Se é dia ou noite (baseado no is_day)
- Weather code

Na área principal:

- Umidade relativa
- Temperatura aparente
- Probabilidade de preciptação
- Velocidade/Direção do vento

Design geral:

- O projeto terá um fundo cinza escuro
- A parte superior não terá background, mas toda sidebar quanto a área principal ficarão dentro de uma div com borda arredondada, fundo branco,centralizada, e largura máxima de 800px

Informações de interpretação sobre weather code:

WMO Weather interpretation codes (WW)
Code Description
0 Clear sky
1 Mainly clear
2 Partly cloudy
3 Overcast
45 Fog
48 Depositing rime fog
51 Light drizzle
53 Moderate drizzle
55 Dense drizzle
56 Light freezing drizzle
57 Dense freezing drizzle
61 Slight rain
63 Moderate rain
65 Heavy rain
66 Light freezing rain
67 Heavy freezing rain
71 Slight snowfall
73 Moderate snowfall
75 Heavy snowfall
77 Snow grains
80 Slight rain showers
81 Moderate rain showers
82 Violent rain showers
85 Slight snow showers
86 Heavy snow showers
95 Thunderstorm
96 Thunderstorm with slight hail _
97 Heavy thunderstorm
99 Thunderstorm with heavy hail _
