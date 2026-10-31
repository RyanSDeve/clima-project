# PRD - Clima

## 1. Visão do produto

O Clima permite consultar as condições meteorológicas atuais de uma cidade. A pessoa informa o nome da cidade e recebe, em uma única busca, a temperatura, a situação do tempo e outras medidas atuais obtidas pela Open-Meteo.

### Objetivos

- Consultar o clima atual a partir do nome de uma cidade.
- Apresentar os dados de forma direta, legível e adaptável a diferentes telas.
- Manter a busca simples: localizar a cidade e consultar sua previsão fazem parte da mesma ação.

### Fora do escopo da primeira versao

- Previsao horaria ou para varios dias.
- Geolocalizacao automatica, mapa ou busca por coordenadas.
- Historico, favoritos, comparacao entre cidades ou conversao manual de unidades.
- Escolha entre vários resultados de cidades homônimas; a busca usa o primeiro resultado da API (`count=1`).

## 2. Publico e idioma

O produto atende pessoas que querem consultar rapidamente o clima atual de uma cidade. A interface e as descrições meteorológicas devem ser apresentadas em português do Brasil. Valores e unidades devem ser exibidos de acordo com os campos de unidade retornados pela API.

## 3. Requisitos funcionais

### Busca de cidade

- Disponibilizar um campo para digitar o nome da cidade e uma acao de envio.
- Aceitar a busca por envio do formulario, inclusive pela tecla Enter.
- Ignorar uma consulta cujo nome esteja vazio ou contenha apenas espaços.
- Codificar o nome da cidade corretamente como parâmetro de URL.
- Executar a geocodificação e, em seguida, a consulta meteorológica como uma única operação para a pessoa usuária.
- Manter um indicador de carregamento durante as duas requisições e evitar envios duplicados enquanto a busca estiver em andamento.

### Resultado

Quando a cidade e o clima forem encontrados, exibir:

- Temperatura atual em destaque.
- Nome da cidade e código do país.
- Data atual no fuso horário da cidade.
- Indicacao de dia ou noite, usando `is_day`.
- Descricao do tempo correspondente a `weather_code`.
- Umidade relativa.
- Temperatura aparente.
- Probabilidade de precipitação.
- Velocidade e direcao do vento.

Exibir valores com as unidades retornadas em `current_units`. A direção do vento deve ser apresentada em graus, conforme a unidade da API. A data deve usar o locale `pt-BR` e o timezone retornado para a cidade.

### Estados da experiência

- **Inicial:** mostrar um estado vazio antes de qualquer consulta.
- **Carregando:** indicar que a busca está em andamento sem separar visualmente as duas requisições.
- **Resultado:** mostrar os dados da cidade consultada.
- **Sem resultado:** mostrar o estado sem resultado quando a cidade não for localizada, a resposta meteorológica não estiver disponível, faltar algum dado obrigatório ou ocorrer falha de rede/API. A pessoa pode tentar outra busca pelo mesmo formulário.

O estado inicial e o estado sem resultado são distintos: o primeiro convida a iniciar uma consulta; o segundo informa que a última consulta não produziu dados.

## 4. Requisitos de sistema

- A aplicacao deve funcionar em navegadores modernos com suporte a JavaScript e `fetch`.
- O layout deve continuar utilizável em telas estreitas e largas, sem perda ou sobreposição de informações.
- O campo de busca e os estados de carregamento e resultado devem ser utilizáveis por teclado e possuir rótulos acessíveis.
- Mudanças de estado e mensagens de resultado devem ser comunicadas de forma acessível, por exemplo com uma região de status apropriada.
- A aplicacao depende de conexao com a internet para consultar os servicos da Open-Meteo.
- Nao e necessario cadastro, autenticacao ou chave de API para o fluxo definido neste PRD.

## 5. Detalhes técnicos

### Stack

- Vite para desenvolvimento e build.
- TypeScript sem framework de interface, usando DOM e APIs nativas do navegador.
- CSS para layout, responsividade e estados visuais.

### Limite de acesso a API

As requisições à Open-Meteo devem ficar encapsuladas em um módulo de serviço (por exemplo, `open-meteo.ts`). A interface não deve chamar os endpoints diretamente. As funções do módulo devem validar os parâmetros necessários antes da requisição e retornar ausência de resultado quando os parâmetros forem inválidos ou estiverem ausentes.

### Geocodificacao

Endpoint:

```text
https://geocoding-api.open-meteo.com/v1/search
```

Parâmetros:

- `name`: texto informado no formulario.
- `count=1`.
- `language=pt`.
- `format=json`.

Dados necessários do primeiro resultado: `name`, `latitude`, `longitude`, `timezone` e `country_code`. Se a resposta não contiver um resultado utilizável com esses dados, encerrar a busca como sem resultado e não consultar a previsão.

### Clima atual

Endpoint:

```text
https://api.open-meteo.com/v1/forecast
```

Parâmetros:

- `latitude` e `longitude` vindas da geocodificacao.
- `timezone` retornado pela geocodificacao.
- `current=precipitation_probability,temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m`.

Dados obrigatórios em `current` para considerar a consulta completa: `temperature_2m`, `relative_humidity_2m`, `apparent_temperature`, `is_day`, `weather_code`, `precipitation_probability`, `wind_speed_10m` e `wind_direction_10m`. `current_units` deve fornecer as unidades correspondentes para formatação. Embora `precipitation` seja solicitado, ele não é exibido nem obrigatório para o resultado da primeira versão.

Se a resposta não tiver os dados obrigatórios, tratar a consulta como sem resultado. A mesma regra se aplica a erros HTTP, falhas de rede e respostas inválidas; não apresentar detalhes técnicos da API na interface.

### Interpretação do código WMO

Mapear `weather_code` para uma descrição em português:

| Codigo | Descricao                    |
| ------ | ---------------------------- |
| 0      | Céu limpo                    |
| 1      | Predominantemente limpo      |
| 2      | Parcialmente nublado         |
| 3      | Encoberto                    |
| 45     | Neblina                      |
| 48     | Neblina com geada            |
| 51     | Chuvisco leve                |
| 53     | Chuvisco moderado            |
| 55     | Chuvisco intenso             |
| 56     | Chuvisco congelante leve     |
| 57     | Chuvisco congelante intenso  |
| 61     | Chuva leve                   |
| 63     | Chuva moderada               |
| 65     | Chuva intensa                |
| 66     | Chuva congelante leve        |
| 67     | Chuva congelante intensa     |
| 71     | Neve leve                    |
| 73     | Neve moderada                |
| 75     | Neve intensa                 |
| 77     | Grãos de neve                |
| 80     | Pancadas de chuva leves      |
| 81     | Pancadas de chuva moderadas  |
| 82     | Pancadas de chuva violentas  |
| 85     | Pancadas de neve leves       |
| 86     | Pancadas de neve intensas    |
| 95     | Trovoada                     |
| 96     | Trovoada com granizo leve    |
| 97     | Trovoada intensa             |
| 99     | Trovoada com granizo intenso |

Para um código não mapeado, mostrar uma descrição genérica de condição meteorológica, sem impedir a exibição das demais medidas.

## 6. Instruções visuais e de UX

- Usar fundo geral cinza escuro.
- Manter a área superior sem fundo próprio, centralizada, contendo apenas o campo de busca e os controles necessários para enviar a consulta.
- Abaixo da busca, centralizar um único painel branco com cantos arredondados e largura máxima de 800 px.
- Dividir o painel em uma barra lateral à esquerda e uma área principal. Em telas estreitas, reorganizar as áreas em uma sequência vertical legível.
- Na barra lateral, priorizar temperatura, cidade e código do país; incluir data, indicação de dia/noite e descrição WMO.
- Na área principal, apresentar umidade, temperatura aparente, probabilidade de precipitação e velocidade/direção do vento em blocos facilmente identificáveis.
- O estado vazio inicial deve ocupar o espaço do resultado sem competir com o formulário. O carregamento deve ser perceptível e o estado sem resultado deve explicar que não foi possível obter os dados, sem expor erro técnico.
- Garantir contraste adequado entre texto, fundo e controles. Usar hierarquia tipográfica clara e unidades visíveis junto dos valores.
- O painel deve preservar a leitura e a ordem das informações em dispositivos móveis; evitar larguras fixas que provoquem rolagem horizontal.

## 7. Critérios de aceite

1. Ao enviar uma cidade válida, a aplicação consulta primeiro a geocodificação e depois usa coordenadas e timezone retornados para consultar o clima.
2. A busca apresenta um único estado de carregamento durante todo o fluxo e evita submissão duplicada enquanto está ativa.
3. Uma cidade não localizada não dispara a requisição de previsão e apresenta o estado sem resultado.
4. Falha de rede/API, resposta meteorológica ausente ou dado obrigatório ausente apresentam o mesmo estado sem resultado.
5. Um resultado completo exibe todos os campos especificados neste PRD com unidades da resposta, data no timezone da cidade e período do dia baseado em `is_day`.
6. Os códigos WMO listados são apresentados com suas descrições em português; código desconhecido não impede a exibição das demais medidas.
7. A experiência inclui estado inicial, carregamento, resultado e sem resultado, e permanece legível em telas estreitas.
8. A interface não faz requisições diretas aos endpoints; somente o módulo de serviço Open-Meteo acessa a API.
