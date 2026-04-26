<img src="front/public/Header_ReadMe.png" alt="Título README" />

<p align="center">
  Sistema full-stack para controle de materiais e reagentes em laboratórios.
</p>

<p align="center">
  <a href="#sobre-o-projeto">Sobre</a> |
  <a href="#funcionalidades">Funcionalidades</a> |
  <a href="#demonstracao-visual">Demonstração visual</a> |
  <a href="#tecnologias">Tecnologias</a> |
  <a href="#como-executar">Como executar</a>
</p>

<p align="center">
  <img alt="Java 21" src="https://img.shields.io/badge/Java-21-007396?style=for-the-badge&logo=openjdk&logoColor=white" />
  <img alt="Spring Boot 3.2.5" src="https://img.shields.io/badge/Spring%20Boot-3.2.5-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" />
  <img alt="React 19" src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=111827" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img alt="SQL Server" src="https://img.shields.io/badge/SQL%20Server-2019-CC2927?style=for-the-badge&logo=microsoftsqlserver&logoColor=white" />
  <img alt="Flyway" src="https://img.shields.io/badge/Flyway-Migrations-CC0200?style=for-the-badge&logo=flyway&logoColor=white" />
  <img alt="Docker" src="https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
</p>

## Sobre o projeto

O **Omini** é uma aplicação web criada para apoiar laboratórios acadêmicos e institucionais no controle de estoque de reagentes, materiais, equipamentos e fornecedores. O projeto nasceu na disciplina de Engenharia de Software (INF221) da Universidade Federal de Viçosa (UFV), em colaboração com equipes do Tecnopark de Viçosa - MG.

A proposta do sistema é reduzir perdas por vencimento, melhorar a rastreabilidade das retiradas, apoiar o planejamento de compras e centralizar informações que normalmente ficam espalhadas em planilhas ou controles manuais.

## Funcionalidades

- **Painel de controle** com listagem paginada, busca por nome/código/localização e cards de status do estoque.
- **Alertas operacionais** para produtos sem estoque ou abaixo do estoque mínimo.
- **Cadastro de produtos** com tipo, fornecedor, lote, fabricante, validade, localização, estoque mínimo e indicação de controle pela Polícia Federal.
- **Retirada de produtos** com validação de quantidade disponível, motivo obrigatório e atualização do estoque.
- **Movimentações de estoque** registradas no backend para entradas, saídas e ajustes.
- **Gestão de fornecedores** com busca e cadastro de dados comerciais.
- **Gestão de usuários** com perfis, status ativo e senha criptografada no backend.
- **Relatórios** para movimentação, consumo e estoque crítico, incluindo tabela e visualização gráfica.
- **API documentada** com Swagger UI e contrato OpenAPI.
- **Base inicial versionada** por Flyway, com tipos de produto, fornecedores e carga extensa de itens laboratoriais.

<a id="demonstracao-visual"></a>

## Demonstração visual

Fluxos principais do Omini em uso.

### Acesso e identidade

<p align="center">
  <img src="docs/media/01-login.png" alt="Login do Omini" width="620" />
</p>

### Operação do estoque

| Painel e alertas | Cadastro de produto |
| --- | --- |
| <img src="docs/media/02-dashboard-alertas.gif" alt="Painel com busca, paginação e alertas de estoque" width="420" /> | <img src="docs/media/03-cadastro-produto.gif" alt="Cadastro de produto laboratorial" width="420" /> |

| Retirada de produto | Relatórios |
| --- | --- |
| <img src="docs/media/04-retirada-produto.gif" alt="Retirada de produto com validações" width="420" /> | <img src="docs/media/05-relatorios.png" alt="Relatórios de movimentação e consumo" width="420" /> |

### Gestão e análise

<p align="center">
  <img src="docs/media/06-fornecedores-usuarios.png" alt="Gestão de fornecedores e usuários" width="460" />
</p>

## Tecnologias

| Camada | Tecnologias |
| --- | --- |
| Backend | Java 21, Spring Boot 3.2.5, Spring Web, Spring Data JPA, Hibernate, Bean Validation, MapStruct, Lombok |
| Banco de dados | SQL Server 2019 via Docker, Flyway |
| API Docs | SpringDoc OpenAPI e Swagger UI |
| Frontend | React 19, TypeScript, Vite 6, Tailwind CSS, shadcn/ui, Radix UI, React Query, Axios |
| UI e dados | Recharts, lucide-react, date-fns |
| Testes | JUnit 5, Mockito, Spring Boot Test |
| Build | Maven e npm/Vite |

## Arquitetura em alto nível

```text
front/                 Aplicação React + TypeScript
src/main/java/         API REST Spring Boot
src/main/resources/    Configuração e migrations Flyway
docker-compose.yml     SQL Server para desenvolvimento local
```

O frontend consome a API em `http://localhost:8080/api` por meio da variável `VITE_API_URL`. O backend expõe recursos REST para produtos, movimentações, fornecedores, usuários, tipos de produto e alertas.

## Como executar

### Pré-requisitos

- Java 21
- Maven 3.9+
- Node.js 20+
- npm
- Docker e Docker Compose

### 1. Clone o repositório

```bash
git clone https://github.com/LucasMGcode/Omini.git
cd Omini
```

### 2. Suba o banco de dados

```bash
docker compose up -d
```

O `docker-compose.yml` disponibiliza o SQL Server em `localhost:1433` com as credenciais esperadas por `src/main/resources/application.properties`.

No primeiro uso, crie o banco esperado pela aplicação:

```bash
docker exec omini_sqlserver_dev /opt/mssql-tools18/bin/sqlcmd \
  -S localhost \
  -U sa \
  -P 'yourStrong(!)Password' \
  -C \
  -Q "IF DB_ID('OminiDB') IS NULL CREATE DATABASE OminiDB;"
```

As tabelas e a carga inicial são aplicadas automaticamente pelo Flyway quando o backend inicia.

### 3. Execute o backend

```bash
mvn spring-boot:run
```

Se precisar popular uma base mínima adicional para testes locais, execute com:

```bash
mvn spring-boot:run -Dspring-boot.run.arguments=--omini.test-data.enabled=true
```

Essa carga é idempotente: ela cria somente registros de teste que ainda não existirem.

Serviços principais:

- API: `http://localhost:8080/api`
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`

### 4. Execute o frontend

```bash
cd front
npm ci --legacy-peer-deps
npm run dev
```

Frontend local: `http://localhost:5173`

O arquivo `front/.env` já define:

```env
VITE_API_URL=http://localhost:8080/api
```

## Rotas principais do frontend

| Rota | Tela |
| --- | --- |
| `/` | Login |
| `/dashboard` | Painel de controle |
| `/product-registration` | Cadastro de produto |
| `/withdraw-product` | Retirada de produto |
| `/supplier` | Fornecedores |
| `/supplier-registration` | Cadastro de fornecedor |
| `/users` | Usuários |
| `/user-registration` | Cadastro de usuário |
| `/reports` | Relatórios |

## Qualidade e validação

Comandos recomendados antes de publicar alterações:

```bash
mvn test
```

```bash
cd front
npm run build
```

## Documentação

A documentação histórica do projeto está na [Wiki do repositório](https://github.com/LucasMGcode/Omini/wiki), com materiais de escopo, arquitetura e instalação.

## Licença

Distribuído sob a licença MIT. Veja [`LICENSE`](LICENSE) para mais detalhes.
