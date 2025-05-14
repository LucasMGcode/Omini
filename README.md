# 🧪 Omini – Sistema de Controle de Materiais de Laboratório

**Omini** é um sistema web desenvolvido para auxiliar na **gestão eficiente do estoque de materiais e reagentes** utilizados em laboratórios acadêmicos ou institucionais. Este projeto é uma iniciativa da disciplina de Engenharia de Software (INF221) da Universidade Federal de Viçosa (UFV), em colaboração com equipes do Tecnopark de Viçosa - MG.

## Visão Geral do Projeto

O objetivo principal do Omini é fornecer uma solução robusta para:

*   Monitorar a validade de reagentes.
*   Controlar o estoque mínimo com alertas automáticos.
*   Registrar retiradas e movimentações de materiais.
*   Gerar relatórios detalhados para planejamento de compras.
*   Administrar usuários e fornecedores.

Para uma compreensão completa dos objetivos, escopo, arquitetura e demais detalhes do projeto, consulte nossa **[Wiki Completa](https://github.com/LucasMGcode/Omini/wiki)**.

## Tecnologias Utilizadas

| Camada          | Tecnologia                                                                          |
| :-------------- | :---------------------------------------------------------------------------------- |
| **Backend**     | Java 21, Spring Boot 3.2 (Jakarta EE 10), Spring Data JPA, Hibernate 6, Spring Security 6 (JWT) |
| **Banco de Dados**| SQL Server 2019/2022 (via Docker), Flyway 9                                         |
| **API Docs**    | SpringDoc OpenAPI 2 + Swagger UI                                                    |
| **Frontend**    | React 18, TypeScript, Vite, Material UI, TanStack Table, React Query, Axios        |
| **Build**       | Maven 3.9 (backend), Vite (frontend)                                                |
| **Testes**      | JUnit 5, Mockito, Testcontainers                                                    |
| **CI/CD**       | GitHub Actions (Maven + Docker Compose)                                             |

Para mais detalhes sobre a arquitetura e as tecnologias, visite a seção **[Arquitetura do Sistema](https://github.com/LucasMGcode/Omini/wiki/Arquitetura-do-Sistema)** na nossa Wiki.

## Como Começar

As instruções detalhadas para configuração do ambiente de desenvolvimento, instalação de dependências e execução do projeto (backend e frontend) estão disponíveis no nosso **[Guia de Instalação e Configuração](https://github.com/LucasMGcode/Omini/wiki/Guia-de-Instala%C3%A7%C3%A3o)** na Wiki.https:

Resumidamente:

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/LucasMGcode/Omini.git
    cd Omini
    ```
2.  **Configure e inicie o banco de dados** (SQL Server via Docker, conforme o guia).
3.  **Configure o backend** (`application.properties`) e execute com `mvn spring-boot:run`.
4.  **Navegue até a pasta do frontend** (se aplicável, ou crie-o), instale as dependências (`npm install`) e execute com `npm run dev`.

*   **Backend acessível em:** `http://localhost:8080`
*   **Frontend React acessível em:** `http://localhost:5173` (ou conforme indicado pelo Vite)
*   **Documentação da API (Swagger UI):** `http://localhost:8080/swagger-ui.html`

## Contribuindo

Valorizamos sua contribuição! Se você deseja colaborar com o desenvolvimento do Omini, por favor, leia nosso **[Guia de Contribuição](https://github.com/LucasMGcode/Omini/wiki/Guia-de-Contribuição)** para entender nosso processo de desenvolvimento, padrões de código e como submeter suas alterações.

Para encontrar tarefas disponíveis, bugs a serem corrigidos ou para propor novas funcionalidades, acesse nossa seção de **[Issues](https://github.com/LucasMGcode/Omini/issues)** e nosso **[Quadro de Tarefas (Projects)](https://github.com/LucasMGcode/Omini/projects)**.

## Documentação Completa

Toda a documentação do projeto, incluindo visão geral, requisitos funcionais e não funcionais, arquitetura do sistema, modelo de dados, guias de instalação e contribuição, e o cronograma do projeto, está centralizada na **[Wiki do Repositório](https://github.com/LucasMGcode/Omini/wiki)**.

## Licença

Este projeto é distribuído sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes (se aplicável, adicione um arquivo LICENSE).
