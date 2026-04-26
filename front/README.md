# Frontend do Omini

Aplicação React + TypeScript do Omini, responsável pelas telas de login, painel de controle, cadastro de produtos, retirada de estoque, fornecedores, usuários e relatórios.

## Stack

- React 19
- TypeScript
- Vite 6
- Tailwind CSS
- shadcn/ui e Radix UI
- React Query
- Axios
- Recharts
- lucide-react

## Como executar

### Pré-requisitos

- Node.js 20+
- npm
- Backend do Omini rodando em `http://localhost:8080`

### Instalar dependências

```bash
npm install
```

### Configurar API

O arquivo `.env` define a URL base consumida pelo Axios:

```env
VITE_API_URL=http://localhost:8080/api
```

Caso o backend esteja em outro endereço, ajuste essa variável antes de iniciar o Vite.

### Rodar em desenvolvimento

```bash
npm run dev
```

A aplicação fica disponível em `http://localhost:5173`.

### Gerar build de produção

```bash
npm run build
```

### Preview local do build

```bash
npm run preview
```

## Rotas principais

| Rota | Tela |
| --- | --- |
| `/` | Login |
| `/dashboard` | Painel de controle com produtos e alertas |
| `/product-registration` | Cadastro de produto |
| `/withdraw-product` | Retirada de produto |
| `/supplier` | Lista e busca de fornecedores |
| `/supplier-registration` | Cadastro de fornecedor |
| `/users` | Lista e busca de usuários |
| `/user-registration` | Cadastro de usuário |
| `/reports` | Relatórios e movimentações |

## Integração com API

O cliente HTTP fica em `src/services/api.ts` e usa `VITE_API_URL` como `baseURL`. Os dados são carregados pelos hooks em `src/hooks`, com cache e invalidação via React Query.

Principais recursos consumidos:

- `/produtos`
- `/fornecedores`
- `/usuarios`
- `/tipos-produto`
- `/movimentacoes`
- `/alertas`

## Validação

Antes de publicar mudanças no frontend, rode:

```bash
npm run build
```
