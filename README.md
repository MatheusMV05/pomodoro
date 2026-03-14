# Pomodoro & FIFO Task Manager

Uma aplicação web de produtividade baseada na técnica Pomodoro, integrada a um gerenciador de tarefas com sistema de fila FIFO.

Desenvolvido como projeto de aprimoramento técnico, com foco em Clean Architecture no ecossistema React.

## Arquitetura e Decisões de Design

Para garantir escalabilidade, testabilidade e manutenibilidade, o código é dividido em quatro camadas principais:

- **`domain/`**: Contém as entidades e regras de negócio da aplicação (`Task`, `Pomodoro`). Livre de qualquer dependência visual ou do React.
- **`application/`**: Camada responsável pela orquestração dos casos de uso. Custom Hooks (`usePomodoro`, `useTasks`) isolam a lógica de negócio, gerenciamento de estado e ciclos de vida.
- **`infrastructure/`**: Implementações concretas dos contratos definidos pelo domínio. Contém os adaptadores de persistência e qualquer mecanismo que dependa de tecnologia específica. É a única camada que conhece detalhes como LocalStorage ou APIs externas.
- **`presentation/`**: Camada visual. Componentes que refletem o estado da camada de aplicação e capturam interações do usuário. Dividida entre `components/` (elementos genéricos de UI) e `features/` (blocos por funcionalidade).

## Funcionalidades

### Motor do Pomodoro

- **Ciclos automáticos:** Transição autônoma entre Foco (25 min) e Pausa Curta (5 min).
- **Pausa longa:** Após 4 ciclos completos de foco, a aplicação avança automaticamente para uma Pausa Longa (15 min).
- **Controle de estado:** Permite iniciar, pausar e resetar o timer a qualquer momento.

### Fila de Tarefas (FIFO)

- **First-In, First-Out:** Novas tarefas entram no final da fila.
- **Foco direcionado:** A primeira tarefa da fila é automaticamente destacada como tarefa em foco.
- **Persistência:** O estado da fila é preservado entre reloads via LocalStorage.

### Interface

- Integração com **shadcn/ui** e **Tailwind CSS**.
- Suporte a Dark Mode via variáveis CSS semânticas.
- Micro-interações de hover e feedback visual nos controles.

## Tecnologias

- **React 18** com Vite 6 como bundler
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** (Radix UI)
- **npm**

## Como Executar

Certifique-se de ter o [Node.js](https://nodejs.org/) instalado.

1. Clone o repositório:
```bash
git clone https://github.com/JuliaTBarros/pomodoro
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```