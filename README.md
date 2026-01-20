# @FIAP/dashboard

## Descrição

Microfrontend principal da aplicação, responsável por exibir a visão geral das finanças, incluindo gráficos, widgets de resumo e a listagem de transações recentes.

## Tecnologias

- **Framework**: React.
- **Linguagem**: TypeScript.
- **Arquitetura**: Single-SPA.
- **Design System**: [`@valoro/ui`](https://www.npmjs.com/package/@valoro/ui).
- **Build Tool**: Webpack.

## Pré-requisitos

- **Node.js**: Versão LTS (v20+ recomendada).
- **Gerenciador de Pacotes**: pnpm.

## Como Rodar

1. Instale as dependências:

   ```bash
   pnpm install
   ```

2. Inicie o servidor de desenvolvimento:
   ```bash
   pnpm start
   ```
   A aplicação rodará na porta configurada (ex: `http://localhost:8081`).

## Funcionalidades

- ** Visão Geral**: Cards com saldo total, receitas e despesas.
- **Gráficos**: Visualização interativa da evolução financeira.
- **Lista de Transações**: Tabela com histórico recente e opções de exclusão.
- **Integração de Eventos**: Escuta eventos de criação/edição de transações para atualizar os dados em tempo real.
