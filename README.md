# Clima

Aplicação web para consultar o clima atual de uma cidade usando a API do Open-Meteo.

## Descrição

A aplicação permite:

- buscar uma cidade;
- consultar as condições climáticas atuais;
- visualizar temperatura, umidade, sensação térmica, precipitação, vento e descrição do clima;
- executar em um ambiente local com Vite + TypeScript.

## Demo

Confira a versão online em:

https://ryansdeve.github.io/clima-project/

## Tecnologias

- TypeScript
- Vite
- HTML/CSS
- API de geocodificação e clima do Open-Meteo

## Pré-requisitos

Antes de rodar o projeto, certifique-se de ter instalado:

- Node.js 18+
- npm

## Instalação

```bash
npm install
```

## Execução local

```bash
npm run dev
```

Depois, abra o endereço informado no terminal no navegador.

## Build de produção

```bash
npm run build
```

## Estrutura do projeto

```text
clima/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── public/
├── src/
│   ├── main.ts
│   ├── style.css
│   ├── weather-app.ts
│   ├── weather-format.ts
│   ├── weather-types.ts
│   └── services/
│       └── open-meteo.ts
└── README.md
```

## Observação

A busca de clima depende da disponibilidade da API do Open-Meteo e de uma conexão de internet ativa.
