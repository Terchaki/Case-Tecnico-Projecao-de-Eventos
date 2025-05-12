# 🏆 Teste Meetime - Projeção de Eventos

<div style="background: #fff; text-align: center">
  <img src="./public/images/logo-meetime.png" alt="Logo Meetime" width="200">
</div>

<br>

Esta aplicação Angular tem como objetivo apresentar uma projeção dinâmica de eventos diários ao longo de cinco dias úteis, organizada por ciclos de atividades com diferentes níveis de prioridade. O usuário pode iniciar uma quantidade específica de entidades, que são distribuídas inteligentemente entre os ciclos de maior prioridade. Um gráfico interativo exibe a projeção, atualizando-se em tempo real conforme as configurações de ciclos e entidades são modificadas.

## 🚀 Deploy da Aplicação

[![Ver no Browser](https://img.shields.io/badge/Ver%20no%20Browser-ab00ff?style=for-the-badge)](https://projecao-de-eventos.netlify.app/)

## 📄 Documentação Técnica

Detalhes sobre as decisões de arquitetura, os desafios enfrentados e as motivações por trás das escolhas técnicas podem ser encontrados no arquivo: [Technical-Documentation.md](technical-documentation.md).

## 🛠️ Tecnologias Utilizadas

* [Angular (v19)](https://angular.io/) - Framework para construção da interface de usuário.
* [Bootstrap](https://getbootstrap.com/) - Biblioteca de estilos CSS para facilitar o layout e a responsividade.
* [RxJS](https://rxjs.dev/) - Biblioteca para programação reativa com streams de dados.
* [Ngx-Toastr](https://www.npmjs.com/package/ngx-toastr) - Biblioteca para exibir notificações e feedback visual ao usuário.
* [Chart.js](https://www.chartjs.org/docs/latest/) - Biblioteca para a criação de gráficos interativos.

## 📂 Estrutura de Pastas do Projeto

├── public/       // Armazenamento de Imagens, ícones e retorno simulado da Api.
src/
├── app/
│   ├── features/ // Funcionalidades desenvolvidas.
│   ├── shared/   // Componentes, Enums, Services e Interfaces de compartilhamento.
│   └── app.module.ts


## ⚙️ Como Executar o Projeto Localmente

### ✅ Pré-requisitos

* [Node.js](https://nodejs.org/) (versão LTS recomendada)
* [Angular CLI](https://angular.io/cli) (Instalação global: `npm install -g @angular/cli`)
* [Git](https://git-scm.com/)

### 👣 Passos para Execução

1.  Clone o repositório:
    ```bash
    git clone [https://github.com/Terchaki/teste-frontend-v4.git](https://github.com/Terchaki/Case-Tecnico-Projecao-de-Eventos.git)
    cd teste-frontend-v4
    ```
2.  Instale as dependências do projeto:
    ```bash
    npm install
    ```
3.  Inicie o servidor de desenvolvimento:
    ```bash
    ng serve -o
    ```
    Este comando irá construir a aplicação e abrir automaticamente no seu navegador em `http://localhost:4200`.

## 📚 Uso de Bibliotecas

* **Ngx-Toastr:** - A escolha desta biblioteca se deu pela familiaridade e praticidade na manipulação de estados informativos ao usuário, peritindo exibir notificações personalizadas com facilidade, com base nos parâmetros passados.
* **Chart.js:** - Familiaridade de uso e ao grande suporte de sua documentação, e também pela possibilidade de incluir extensões através de plugins.

## ✨ Sugestões de Melhorias Futuras

* **Rótulos de Quantidade no Gráfico:** Implementar a exibição de valores diretamente nas barras do gráfico para facilitar a leitura, utilizando o plugin como `ChartDataLabels`.
* **Exportação para PDF:** Adicionar a funcionalidade de gerar arquivo PDF contendo o gráfico e os dados de projeção em formato de tabela, utilizando bibliotecas front-end como `jsPDF` e `jspdf-autotable`, dispensando a necessidade de lógica no backend para esta funcionalidade.
* **Interatividade com o Gráfico:** Permitir que o usuário clique em uma barra do gráfico referente a um dia futuro para atualizar a visualização dos ciclos correspondentes no componente Cycle.
* **Filtragem de Eventos por Ciclo:** Exibir os tipos de eventos associados a cada ciclo no template, permitindo marcar/desmarcar a visualização de eventos específicos (ex: ocultar "calls") no gráfico.
* **CRUD de Projeções de Eventos:** Implementar funcionalidades para adicionar e editar projeções de eventos diretamente na interface.
* **Gerenciamento de Legendas:** Permitir a remoção seletiva de legendas/tipos de eventos do gráfico.
* **Opção de dias úteis:** Disponibilizar a opção incluir ou remover dia útil.
* **Opções de Visualização Adicionais:** Disponibilizar a opção de visualizar os dados do gráfico em formato de pizza.

## 🧑‍💻 Autor

* **Nome:** Lucas Henrique
* **E-mail:** lucas.dev.contato@outlook.com
* [LinkedIn](https://www.linkedin.com/in/lucas-henrique-sousa-mendes/)
