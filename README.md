# Passagens Vargas — Front-end

Front-end web do sistema **Passagens Vargas**, uma plataforma de venda e gestão de passagens de ônibus. A aplicação atende três perfis de uso: clientes do público geral, administradores da plataforma e empresas de transporte (com seus funcionários).

Construído com **React + TypeScript + Vite** e estilizado com **Tailwind CSS**. Consome uma API REST via Axios, com autenticação por token JWT (e refresh token automático).

## Funcionalidades

A aplicação organiza-se em três áreas principais, cada uma com seu layout e rotas:

### Público (`/`)
- Página inicial e busca de viagens
- Listagem de viagens disponíveis
- Seleção de assentos (sillas) e listagem de passagens
- Cadastro, login, validação de usuário e redefinição de senha

### Admin (`/admin`)
- Dashboard administrativo
- Gestão de empresas de transporte
- Gestão de cidades e lugares (paradas)

### Empresa (`/empresa`)
- Gestão de ônibus (autobuses), incluindo pisos e layout de assentos
- Gestão de viagens: criação, venda de passagens, pagamentos e relatórios
- Gestão de paradas
- Gestão de funcionários
- Emissão de faturas e impressão de relatórios

## Tecnologias

| Categoria        | Ferramenta                          |
| ---------------- | ----------------------------------- |
| Framework        | React 18                            |
| Linguagem        | TypeScript                          |
| Build / Dev      | Vite 5 (plugin `react-swc`)         |
| Estilização      | Tailwind CSS + PostCSS              |
| Roteamento       | React Router DOM 6                  |
| HTTP             | Axios                               |
| Componentes      | React Select, React Datepicker, React Icons |
| Lint             | ESLint + `@typescript-eslint`       |

## Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 18 ou superior recomendada)
- npm
- API back-end em execução (por padrão, em `http://127.0.0.1:8080/`)

## Instalação

```bash
# Instalar as dependências
npm install
```

## Scripts disponíveis

```bash
# Inicia o servidor de desenvolvimento (HMR)
npm run dev

# Verifica os tipos e gera a build de produção em dist/
npm run build

# Executa o ESLint
npm run lint

# Pré-visualiza a build de produção localmente
npm run preview
```

## Configuração da API

A URL base da API é definida em [`src/http.tsx`](src/http.tsx):

```ts
const http = axios.create({
    baseURL: 'http://127.0.0.1:8080/',
    // ...
})
```

Ajuste a `baseURL` conforme o ambiente. O cliente HTTP já inclui:
- Injeção automática do token de autenticação (`Bearer`) em cada requisição
- Renovação automática via refresh token quando a resposta retorna `401`/`403`, com redirecionamento para `/login` em caso de falha

## Estrutura do projeto

```
src/
├── assets/            # Imagens e recursos estáticos
├── Classes/           # Classes utilitárias (ex.: DataHora)
├── Components/        # Componentes reutilizáveis (botões, inputs, tabelas, formulários)
├── Helpers/           # Funções utilitárias (cookies, datas, validações, exceptions)
├── Pages/             # Páginas, organizadas por área
│   ├── Admin/         # Área administrativa (empresas, cidades, lugares)
│   ├── Auth/          # Login, registro, validação, redefinição de senha
│   ├── Empresa/       # Área da empresa (ônibus, viagens, paradas, funcionários)
│   ├── Layout/        # Layouts de cada área
│   └── Publico/       # Páginas públicas (busca, viagens, assentos)
├── routes/            # Definição das rotas (AppRouter, EmpresaRoutes)
├── templates/         # Templates de páginas
├── Types/             # Interfaces e tipos TypeScript do domínio
├── http.tsx           # Cliente Axios configurado
└── main.tsx           # Ponto de entrada da aplicação
```

> O alias `@` aponta para `src/` (configurado em `vite.config.ts` e `tsconfig.json`), permitindo importações como `import X from '@/Pages/...'`.
