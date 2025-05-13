
# 📄 Documentação Técnica - Projeção de Eventos

##  Arquitetura da Aplicação

A aplicação foi estruturada com foco em **separação de responsabilidades**, **escalabilidade** e **performance**. Desenvolvida com **Angular 19 no formato Standalone**, com a distribuição de responsabilidades entre **componentes** e **serviços**.

Mesmo sendo uma aplicação com poucas páginas, foi adotei o **Lazy Loading** para o carregamento sob demanda dos componentes. Visando possíveis expansões da aplicação e facilitação da manutenção e adição de novas rotas no futuro.

<br>

### Estrutura de Responsabilidades

A arquitetura favorece a reutilização e distribuição de responsabilidades:

- **Componente `Home`**: Responsável pela página inicial da aplicação com a disponibilidaed do botão que aciona o modal de projeção de eventos.
- **Componente `Modal-Entities`**: Centraliza o controle de entrada de dados e simula a requisição à API usando dados mockados. Após obter os dados, os envia ao componente `Cycle`.
- **Componente `Cycle`**: Recebe os dados, processa e chama o serviço `EventsProjectionService` para gerar os objetos que servirão para a renderização da tabela de ciclos e do gráfico. Em seguida, transmite os dados ao componente de gráfico.
- **Componente `Gráfico`**: Exibe a projeção de eventos baseada nas entidades distribuídas por prioridade.

<br>

## 📥 Input de Entidades

A entrada de dados respeita o enunciado do case, permitindo apenas valores **maiores ou iguais a 1**.

- Se o usuário tentar inserir o valor `0`, a aplicação automaticamente ajusta para `1`.
- Se o usuário tentar inserir valores inválidos como `" - (sinal de subtração)"`, o formulário é invalidado e uma **mensagem de erro** é exibida.
- Para controle e validação do input, foi utilizado o **Reactive Forms**, pela sua praticidade e eficiencia de controle aos dados de input.

<br>

## 🛠️ Funcionalidades Adicionais Implementadas

Apesar de não estarem no escopo original do desafio, implementei as seguintes funcionalidades visando a experiência do usuário:

- **Botão "Restaurar"**  
  Substituí o botão de "Fechar" do modal por um botão de "Restaurar", enquanto mantive o ícone de `X` para o fechamento. O botão "Restaurar" retorna a projeção para seu estado inicial, como se a aplicação tivesse acabado de ser carregada.

- **Tooltip com data completa no gráfico**  
  Como o retorno da API traz apenas os nomes dos dias da semana, implementei um **tooltip com a data completa** no gráfico, calculada a partir da data atual considerando apenas dias úteis.

- **Limite de entidades permitidas**  
  Implementada uma lógica para definir um **limite máximo de entidades** que podem ser iniciadas, com base na soma das quantidades de entidades disponíveis nos ciclos. Isso evita inserções que ultrapassem a capacidade da estrutura definida.
  
- **Deploy da Aplicação**  
  Disponibilizei o [Deploy](https://projecao-de-eventos.netlify.app/) da aplicação via netilify, para facilitar a visualização e execução.

  <br>

## 🧪 Desafios Enfrentados

Durante o desenvolvimento do case, os principais desafios foram:

- **Compreensão dos requisitos**  
  A interpretação inicial da estrutura de ciclos e da forma como as entidades deveriam ser distribuídas por prioridade exigiu atenção especial, tempo e refinamento da lógica.

- **Cálculo da projeção de eventos**  
  Desenvolver uma lógica que respeitasse a prioridade dos ciclos e distribuísse as entidades proporcionalmente ao longo dos cinco dias úteis exigiu diversas simulações e ajustes na estrutura dos dados.

## 🔧 Pendências

- ❌ **Alterar dados do gráfico com base na seleção da tabela**  
  Não foi possível concluir a funcionalidade de atualização dinâmica do gráfico ao marcar/desmarcar um ciclo específico na tabela em tempo hábil para entrega do desafio. A estrutura está preparada para suportar essa melhoria futuramente.

  <br>

## 🔮 Sugestões de Melhorias Futuras
Estas são as sugestões de melhoria que fui enxergando durante o desenvolvimento, acredito que quando implementadas iráo gerar muito valor ao projeto.
  
* **Rótulos de Quantidade no Gráfico:** Implementar a exibição de valores diretamente nas barras do gráfico para facilitar a leitura, utilizando o plugin como `ChartDataLabels`.
* **Exportação para PDF:** Adicionar a funcionalidade de gerar arquivo PDF contendo o gráfico e os dados de projeção em formato de tabela, utilizando bibliotecas front-end como `jsPDF` e `jspdf-autotable`, dispensando a necessidade de lógica no backend para esta funcionalidade.
* **Interatividade com o Gráfico:** Permitir que o usuário clique em uma barra do gráfico referente a um dia futuro para atualizar a visualização dos ciclos correspondentes no componente Cycle.
* **Filtragem de Eventos por Ciclo:** Exibir os tipos de eventos associados a cada ciclo no template, permitindo marcar/desmarcar a visualização de eventos específicos (ex: ocultar "calls") no gráfico.
* **CRUD de Projeções de Eventos:** Implementar funcionalidades para adicionar e editar projeções de eventos diretamente na interface.
* **Gerenciamento de Legendas:** Permitir a remoção seletiva de legendas/tipos de eventos do gráfico.
* **Opção de dias úteis:** Disponibilizar a opção incluir ou remover dia útil.
* **Opções de Visualização Adicionais:** Disponibilizar a opção de visualizar os dados do gráfico em formato de pizza.
* **Selecionar todos** Disponibilizar uma opção para marcar ou desmarcar todos os checkboxes dos ciclos de uma vez.
