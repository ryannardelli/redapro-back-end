# RedaPro (Back-end) — Plataforma de Correção de Redações

Bem-vindo à documentação inicial do projeto!

Este repositório contém o código-fonte do back-end, de uma plataforma para correção de redações, utilizando tecnologias modernas para garantir escalabilidade, segurança e organização.

## Tecnologias Utilizadas
- Node.js — Ambiente de execução JavaScript no servidor
- Express.js — Framework minimalista para criação de APIs
- Sequelize ORM — Mapeamento objeto-relacional para trabalhar com PostgreSQL
- PostgreSQL — Banco de dados relacional utilizado pela aplicação
- Docker + Docker Compose — Para facilitar deploy e ambiente padronizado

## Estrutura inicial do projeto
  ```bash
📁 src/
 ┣ 📁 config/          → Configurações (DB, variáveis ambiente, logger)
 ┣ 📁 controllers/     → Controladores: recebem requisições e chamam serviços
 ┣ 📁 database/        → Controladores: recebem requisições e chamam serviços
 ┣ 📁 dtos/            → Data Transfer Objects (opcional, mas útil)
 ┣ 📁 exceptions/      → Classes de erro personalizadas
 ┣ 📁 middlewares/     → Middlewares (auth, validações, logs...)
 ┣ 📁 models/          → Modelos do banco (Sequelize, Prisma ou mongoose)
 ┣ 📁 repositories/    → Comunicação com o banco (ORM / Queries)
 ┣ 📁 routes/          → Rotas organizadas por módulos
 ┣ 📁 services/        → Regras de negócio e lógica da aplicação
 ┣ 📁 tests/           → Testes organizados em módulos
 ┣ 📁 utils/           → Helpers, funções utilitárias
 ┣ 📁 validators/      → Validações (Joi, Yup, Zod)
 ┗ app.ts              → Configuração principal do app (middlewares, rotas)
 ┣ server.ts           → Inicialização do servidor Express
   ```

## Padrão de Commits (Conventional Commits)
Este projeto segue o padrão Conventional Commits para manter um histórico organizado, automatizar changelogs e facilitar releases.

### Tipos de Commits Suportados
- feat - nova funcionalidade
- fix: correção de bug
- docs: Alterações na documentação.
- style: Alterações de formatação, espaçamento, ponto e vírgula, sem alterar código.
- refactor: Refatoração do código, sem adicionar funcionalidade nem corrigir bug.
- perf: Alterações que melhoram performance.
- test: Adição ou alteração de testes.
- chore: Tarefas de manutenção, scripts, builds, deps, etc.
- ci: Integração contínua
### Relacionamento com Issues (fixes, closes, resolves)
#### Fechar issue automaticamente
  ```bash
closes #12
   ```
#### Resolver issue
  ```bash
resolves #87
   ```
#### Relacionar múltiplas issues
  ```bash
fixes #3 #5 closes #9
   ```
## Como Executar o Projeto

### 1. Clone o repositório

  ```bash
git clone https://github.com/ryannardelli/redapro-back-end.git
   ```

### 2. Navegue até o diretório da aplicação
  ```bash
cd back-end-redapro
   ```

### 3. Instale as dependências
  ```bash
npm install
   ```

### 4. Configure o arquivo .env
  ```bash
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=sua_senha
DB_NAME=nome_do_banco
DB_PORT=5432
PORT=3000
   ```

### Configuração do Sequelize

#### Gerar arquivo de configuração inicial:
  ```bash
npx sequelize init
   ```

#### Isso criará a estrutura:

```bash
/config
/models
/migrations
/seeders
```

### 4. Configurar o banco (config/config.json)
#### Edite o arquivo para usar PostgreSQL:
  ```bash
  "development": {
    "username": "postgres",
    "password": "SENHA_DO_SEU_BANCO",
    "database": "meu_banco",
    "host": "127.0.0.1",
    "dialect": "postgres"
  }
   ```
Obs: pode usar variáveis de ambiente depois para deixar mais seguro.

### 5. Criar o banco de dados
  ```bash
npx sequelize-cli db:create
   ```

### 6. Script para rodar o projeto
No package.json, adicione:
  ```bash
"scripts": {
  "dev": "nodemon index.js"
}
   ```

Rodar:
  ```bash
npm run dev
   ```



