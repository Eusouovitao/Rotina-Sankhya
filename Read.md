# Gerenciador de Rotinas do Sistema

## Visao Geral
Painel administrativo com quadro de Gantt para gerenciar e visualizar rotinas de atualizacao do sistema em tempo real. Permite acompanhar tarefas agendadas por segundo, minuto ou hora ao longo das 24 horas do dia.

## Estrutura do Projeto

```
├── client/                      # Frontend React
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/             # Componentes Shadcn UI
│   │   │   ├── app-sidebar.tsx # Barra lateral com navegacao
│   │   │   ├── filter-tabs.tsx # Tabs para filtrar rotinas
│   │   │   ├── gantt-chart.tsx # Visualizacao Gantt interativa
│   │   │   ├── routine-form.tsx # Modal de criacao/edicao
│   │   │   ├── routine-list.tsx # Tabela de rotinas
│   │   │   └── theme-toggle.tsx # Alternador de tema
│   │   ├── hooks/              # Hooks customizados
│   │   ├── lib/
│   │   │   ├── queryClient.ts  # Configuracao React Query
│   │   │   ├── theme-provider.tsx # Provider de tema
│   │   │   └── utils.ts        # Funcoes utilitarias
│   │   ├── pages/
│   │   │   ├── dashboard.tsx   # Pagina principal
│   │   │   ├── routines.tsx    # Lista de rotinas
│   │   │   ├── active-routines.tsx # Rotinas ativas
│   │   │   ├── settings.tsx    # Configuracoes
│   │   │   └── not-found.tsx   # Pagina 404
│   │   ├── App.tsx             # Componente raiz
│   │   ├── index.css           # Estilos globais
│   │   └── main.tsx            # Entry point
├── server/                      # Backend Express
│   ├── index.ts                # Server entry point
│   ├── routes.ts               # API routes
│   ├── storage.ts              # Armazenamento em memoria
│   └── vite.ts                 # Vite middleware
├── shared/                      # Codigo compartilhado
│   └── schema.ts               # Schemas Zod e tipos
└── design_guidelines.md        # Diretrizes de design
```

## Funcionalidades

### Dashboard
- Visualizacao de estatisticas em cards
- Quadro de Gantt com timeline de 24 horas
- Indicador de tempo atual em tempo real
- Filtros por tipo de frequencia

### Gerenciamento de Rotinas
- Criar, editar e excluir rotinas
- Tipos de frequencia: segundo, minuto, hora
- Configurar horario de inicio e duracao
- Ativar/desativar rotinas

### Navegacao
- Sidebar com navegacao entre paginas
- Estatisticas rapidas no sidebar
- Indicador de status do sistema

## API Endpoints

| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET | /api/routines | Lista todas as rotinas |
| GET | /api/routines/:id | Obtem uma rotina |
| POST | /api/routines | Cria uma rotina |
| PATCH | /api/routines/:id | Atualiza uma rotina |
| PATCH | /api/routines/:id/status | Atualiza status |
| DELETE | /api/routines/:id | Remove uma rotina |

## Modelo de Dados

```typescript
interface Routine {
  id: string;
  name: string;
  description?: string;
  frequencyType: "second" | "minute" | "hour";
  frequencyValue: number;
  startTime: string; // HH:mm
  duration: number;
  durationUnit: "second" | "minute" | "hour";
  isActive: boolean;
}
```

## Tecnologias

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Shadcn UI
- TanStack Query v5
- Wouter (routing)
- React Hook Form + Zod

### Backend
- Express.js
- TypeScript
- Zod (validacao)
- Armazenamento em memoria

## Comandos

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Compila para producao

## Preferencias do Usuario

- Interface em portugues (PT-BR)
- Tema claro/escuro com alternador
- Design system inspirado em Linear/Notion
