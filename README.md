# 🧪 Omini – Sistema de Controle de Materiais de Laboratório

**Omini** é um sistema web desenvolvido para auxiliar na **gestão de estoque de materiais e reagentes** utilizados em laboratórios acadêmicos ou institucionais. A aplicação foi construída com Java e tecnologias familiares ao desenvolvedor, atendendo a requisitos funcionais definidos em um projeto de graduação.

## 📌 Objetivo

Oferecer um controle eficiente dos produtos de laboratório, com destaque para:

- Acompanhamento da validade de reagentes
- Gestão do estoque mínimo e alertas automáticos
- Registro de retiradas e movimentações
- Relatórios de consumo para planejamento de compras
- Controle de usuários e fornecedores

## ⚙️ Funcionalidades (Histórias de Usuário)

| Código | Funcionalidade                                 |
|--------|-----------------------------------------------|
| HU01   | Cadastro, edição e exclusão de produtos       |
| HU02   | Registro de retirada de itens do estoque      |
| HU03   | Geração de relatórios de consumo              |
| HU04   | Controle de acesso por perfil (admin/padrão)  |
| HU05   | Atualização de estoque em lote                |
| HU06   | Alerta de validade e estoque mínimo           |
| HU07   | Cadastro e gerenciamento de fornecedores      |
| HU08   | Cadastro e gerenciamento de usuários          |

> Detalhes completos disponíveis no diretório [`docs/`](./docs/).

## 🧰 Tecnologias Utilizadas

| Camada          | Tecnologia                             |
|------------------|-----------------------------------------|
| Linguagem        | Java 17                                |
| Framework Web    | Spring Boot 3.x                        |
| Persistência     | Spring Data JPA + Hibernate            |
| Banco de Dados   | SQL Server 2019                        |
| Migração         | Flyway                                 |
| Autenticação     | Spring Security (com perfis)           |
| View (opcional)  | Thymeleaf ou PrimeFaces (JSF)          |
| Build            | Maven 3.x                              |
| Testes           | JUnit 5 + Mockito                      |
| CI/CD            | GitHub Actions                         |

## 🛠️ Como Executar Localmente

1. **Clone o projeto:**
   ```bash
   git clone https://github.com/seu-usuario/omini.git
   cd omini
    ```
2. **Configurar variáveis de ambiente (exemplo para SQL Server local)**

    ```bash
    export DB_DRIVER="com.microsoft.sqlserver.jdbc.SQLServerDriver"
    export DB_URL="jdbc:sqlserver://localhost:1433;databaseName=OminiDB"
    export DB_USER="sa"
    export DB_PASS="YourStrong@Passw0rd"
    ```

3. **Executar o projeto:**
   ```bash
   mvn spring-boot:run
   ```

4. **Acessar a aplicação:**
    - URL: `http://localhost:8080`