# 🧪 Omini – Sistema de Controle de Materiais de Laboratório

**Omini** é um sistema web desenvolvido para auxiliar na **gestão eficiente do estoque de materiais e reagentes** utilizados em laboratórios acadêmicos ou institucionais. A aplicação utiliza Java com Spring Boot e oferece uma interface moderna em React.

## 📌 Objetivos principais

* Monitorar validade de reagentes
* Controlar estoque mínimo com alertas automáticos
* Registrar retiradas e movimentações de materiais
* Gerar relatórios detalhados para planejamento de compras
* Administrar usuários e fornecedores

## ⚙️ Funcionalidades

| Código | Funcionalidade                                 |
| ------ | ---------------------------------------------- |
| HU01   | Cadastro, edição e exclusão de produtos        |
| HU02   | Registro de retirada de itens do estoque       |
| HU03   | Geração de relatórios de consumo               |
| HU04   | Controle de acesso por perfil (admin/usuário)  |
| HU05   | Atualização de estoque em lote                 |
| HU06   | Alerta automático de validade e estoque mínimo |
| HU07   | Cadastro e gerenciamento de fornecedores       |
| HU08   | Cadastro e gerenciamento de usuários           |

## 🧰 Tecnologias

| Camada             | Tecnologia                                                                |
| ------------------ | ------------------------------------------------------------------------- |
| **Backend**        | **Java 21**                                                               |
| **Framework Web**  | Spring Boot 3.2 ( Jakarta EE 10 )                                         |
| **Persistência**   | Spring Data JPA + Hibernate 6 / HikariCP                                  |
| **Banco de Dados** | SQL Server 2019 ou 2022 (via Docker)                                      |
| **Migração**       | Flyway 9                                                                  |
| **API Docs**       | SpringDoc OpenAPI 2 + Swagger UI                                          |
| **Autenticação**   | Spring Security 6 + JWT                                                   |
| **Frontend**       | React 18 + TypeScript ✚ Vite ✚ Material UI / TanStack Table / React Query |
| **Build**          | Maven 3.9 (backend) • Vite (bottom-up) (frontend)                         |
| **Utilitários**    | Lombok, MapStruct, ModelMapper (opcional)                                 |
| **Testes**         | JUnit 5 • Mockito • Testcontainers (para integração)                      |
| **CI/CD**          | GitHub Actions (pipeline Maven + Docker Compose)                          |

## 🚀 Execução Local

### Backend

Clone e acesse o diretório:

```bash
git clone https://github.com/seu-usuario/omini.git
cd omini
```

Configure o banco de dados no `application.properties`:

```properties
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=OminiDB
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha
spring.jpa.hibernate.ddl-auto=update
```

Execute o backend:

```bash
mvn spring-boot:run
```

### Frontend (React)

Na pasta raiz, crie e inicie o projeto React (usando Vite):

```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install axios
npm run dev
```

Certifique-se de configurar corretamente as chamadas à API no React usando Axios:

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api'
});

export default api;
```

## 🌐 Acesso

* **Backend:** `http://localhost:8080`
* **Frontend React:** `http://localhost:5173`

## 📖 Documentação

A documentação completa da API está disponível em:

* Swagger UI: `http://localhost:8080/swagger-ui.html`
* JSON da API: `http://localhost:8080/v3/api-docs`

## 📦 Estrutura do Projeto

```
omini
├── frontend          # Projeto React
├── src               # Código-fonte Java (backend)
│   ├── main
│   │   ├── java
│   │   └── resources
│   └── test
├── pom.xml           # Maven Build File
└── README.md         # Este documento
```
