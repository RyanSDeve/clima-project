# Tarefas de implementação - Clima

Este checklist desdobra o [PRD](prd.md), que continua sendo a fonte dos requisitos completos, parâmetros da API, campos, descrições WMO e regras visuais. Consulte as seções indicadas em cada tarefa antes de implementá-la.

## Como executar

- Execute as tarefas na ordem; cada uma deve ser concluída e aprovada antes de iniciar a próxima.
- Implemente somente o escopo da tarefa atual, respeitando as dependências e o limite de acesso à API definidos no PRD.
- Marque `[x]` apenas depois de cumprir o critério de aprovação. Se a validação encontrar um problema, corrija-o antes de marcar.

## Checklist

- [x] **T1 - Criar a estrutura semântica da aplicação**
  - Referência: PRD, seções 3 (Busca de cidade e Estados da experiência) e 4.
  - Escopo: substituir a tela demonstrativa do Vite por uma estrutura inicial da aplicação, com formulário de busca e área reservada para o conteúdo de clima. Manter a interface utilizável por teclado e incluir rótulos e regiões semânticas apropriadas.
  - Critério de aprovação: a tela inicial contém um campo de cidade associado a um rótulo, um botão de envio e uma região de conteúdo identificável; o formulário pode ser enviado com Enter e `npm run build` conclui sem erros.

- [x] **T2 - Implementar a geocodificação no serviço Open-Meteo**
  - Referência: PRD, seção 5 (Limite de acesso a API e Geocodificação).
  - Dependência: T1.
  - Escopo: criar ou iniciar o módulo de serviço responsável pelas requisições Open-Meteo e implementar a busca da primeira cidade, validando e normalizando os dados necessários antes de retorná-los.
  - Critério de aprovação: a função usa os parâmetros exigidos no PRD com o nome da cidade codificado corretamente; retorna ausência de resultado para entrada vazia, resposta sem resultado ou primeiro resultado incompleto, sem iniciar uma requisição de previsão.

- [x] **T3 - Implementar a consulta do clima atual**
  - Referência: PRD, seção 5 (Clima atual).
  - Dependência: T2.
  - Escopo: no mesmo módulo de serviço, consultar a previsão com coordenadas e timezone da geocodificação; validar os dados e unidades obrigatórios para um resultado completo.
  - Critério de aprovação: uma resposta completa retorna os campos atuais e unidades necessários; parâmetros inválidos, resposta inválida, erro HTTP/rede ou ausência de qualquer dado/unidade obrigatórios resultam em ausência de resultado.

- [x] **T4 - Compor a busca única de cidade e clima**
  - Referência: PRD, seções 3 (Busca de cidade e Estados da experiência) e 5 (Limite de acesso a API).
  - Dependência: T3.
  - Escopo: expor pelo serviço uma operação que execute geocodificação e, somente se válida, consulta do clima, normalizando falhas para o estado sem resultado da aplicação.
  - Critério de aprovação: a previsão só é consultada após geocodificação utilizável e recebe os valores retornados por ela; erros de qualquer etapa não expõem detalhes técnicos e não causam chamadas fora do módulo de serviço.

- [x] **T5 - Implementar descrições WMO e formatação dos dados**
  - Referência: PRD, seções 2, 3 (Resultado) e 5 (Interpretação do código WMO).
  - Dependência: T3.
  - Escopo: centralizar a descrição dos códigos WMO e a formatação de valores, unidades e data no locale e timezone definidos no PRD.
  - Critério de aprovação: todos os códigos listados no PRD retornam suas descrições em português; código desconhecido retorna uma descrição genérica; data e valores são formatados sem substituir as unidades da API.

- [x] **T6 - Conectar o formulário aos estados da busca**
  - Referência: PRD, seções 3 (Busca de cidade e Estados da experiência) e 4.
  - Dependência: T4.
  - Escopo: tratar o envio do formulário, ignorar nomes vazios após remoção de espaços, exibir um único estado de carregamento durante todo o fluxo e impedir envios duplicados enquanto a operação estiver ativa.
  - Critério de aprovação: enviar uma cidade inicia uma única operação do serviço; durante as duas requisições há um único indicador de carregamento e novos envios não iniciam outra busca; ao terminar, a interface sai do carregamento mesmo em caso de falha.

- [x] **T7 - Apresentar resultado, estado inicial e estado sem resultado**
  - Referência: PRD, seções 3 (Resultado e Estados da experiência) e 4.
  - Dependência: T5 e T6.
  - Escopo: renderizar os dados de uma consulta completa e as mensagens distintas para antes da primeira busca e para uma busca sem resultado, comunicando mudanças de estado de forma acessível.
  - Critério de aprovação: resultado completo apresenta todos os campos listados no PRD; estado inicial convida a buscar e estado sem resultado informa que os dados não puderam ser obtidos, sem detalhes técnicos, permitindo nova tentativa pelo mesmo formulário.

- [x] **T8 - Aplicar layout responsivo e hierarquia visual**
  - Referência: PRD, seção 6 (Instruções visuais e de UX) e seção 4 (Requisitos de sistema).
  - Dependência: T1 e T7.
  - Escopo: implementar o fundo, formulário e painel de resultado conforme a organização visual do PRD, adaptando a barra lateral e a área principal para telas estreitas.
  - Critério de aprovação: em telas estreitas e largas, o painel respeita a hierarquia e a ordem de leitura especificadas; nenhum campo, controle ou estado fica cortado, sobreposto ou exige rolagem horizontal; contraste e unidades permanecem legíveis.

- [x] **T9 - Verificar os critérios de aceite ponta a ponta**
  - Referência: PRD, seção 7 (Critérios de aceite).
  - Dependência: T1 a T8.
  - Escopo: executar o build e verificar o fluxo completo, incluindo sucesso, cidade não encontrada, dados obrigatórios ausentes, falhas de rede/API, reenvio após falha, teclado e viewport estreita. Corrigir divergências encontradas antes de concluir.
  - Critério de aprovação: `npm run build` passa e cada critério de aceite do PRD foi verificado; a interface não acessa endpoints diretamente e todos os estados podem ser alcançados conforme o resultado da busca.
