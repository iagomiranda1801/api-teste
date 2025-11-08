# API-TESTE - YeBox

API completa em Node.js com Express, TypeScript, Sequelize e PostgreSQL para sistema de autenticação e controle de assinaturas.

## 🏗️ Arquitetura

```
src/
├── config/          # Configurações (banco, etc)
├── models/          # Models do Sequelize
├── services/        # Lógica de negócio
├── controllers/     # Controllers leves
├── middleware/      # Middlewares (auth, validação)
├── routes/          # Definição de rotas
└── server.ts        # Servidor principal
```

## 📦 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **TypeScript** - Tipagem estática
- **Sequelize** - ORM para PostgreSQL
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **bcryptjs** - Hash de senhas
- **Joi** - Validação de dados

## 🗃️ Modelos

### User (Usuários - Admin/User)
- id, name, email, password, role (admin|user), isActive
- Responsável por gerenciar o sistema

### Client (Clientes)
- id, name, email, password, phone, document, isActive
- Usuários finais com assinaturas

### Subscription (Assinaturas)
- id, clientId, type (monthly|quarterly|semester|annual), status, startDate, endDate, price
- Controle de assinaturas dos clientes

## 🔐 Autenticação

### Tipos de Login:
1. **Admin/User**: `/auth/login/user`
2. **Cliente**: `/auth/login/client`

### Níveis de Acesso:
- **Admin**: Acesso total (CRUD usuários, clientes, assinaturas)
- **User**: Acesso limitado (apenas leitura)
- **Client**: Acesso apenas aos próprios dados

## 🚀 Configuração

### 1. Instalar dependências:
```bash
npm install
```

### 2. Configurar PostgreSQL:
- Criar banco de dados: `yebox_test`
- Configurar usuário e senha

### 3. Configurar variáveis de ambiente:
```bash
cp .env.example .env
```

Editar `.env`:
```env
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=yebox_test
DB_USER=postgres
DB_PASS=sua_senha

# JWT
JWT_SECRET=seu_jwt_secret_super_seguro_aqui
JWT_EXPIRES_IN=7d
```

### 4. Executar migrations:
```bash
npm run migrate
```

### 5. Iniciar servidor:
```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
```

## 📡 Endpoints

### Autenticação
```
POST /auth/login/user        # Login usuário/admin
POST /auth/login/client      # Login cliente
POST /auth/register/user     # Registro usuário (admin only)
POST /auth/register/client   # Registro cliente (público)
GET  /auth/me               # Dados do usuário logado
POST /auth/logout           # Logout
```

### Usuários (Admin only)
```
GET    /users              # Listar usuários
GET    /users/:id          # Buscar por ID
POST   /users              # Criar usuário
PUT    /users/:id          # Atualizar usuário
DELETE /users/:id          # Deletar usuário
PATCH  /users/:id/activate # Ativar usuário
```

### Clientes
```
GET    /clients            # Listar clientes (admin)
GET    /clients/:id        # Buscar por ID
POST   /clients            # Criar cliente (admin)
PUT    /clients/:id        # Atualizar cliente
DELETE /clients/:id        # Deletar cliente (admin)
```

### Assinaturas
```
GET    /subscriptions                # Listar todas (admin)
GET    /subscriptions/client/:id     # Assinaturas do cliente
POST   /subscriptions                # Criar assinatura
PUT    /subscriptions/:id            # Atualizar assinatura
PATCH  /subscriptions/:id/cancel     # Cancelar assinatura
PATCH  /subscriptions/:id/renew      # Renovar assinatura
```

## 🔑 Exemplos de Uso

### 1. Registro de Cliente:
```json
POST /auth/register/client
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "123456",
  "phone": "(11) 99999-9999",
  "document": "12345678901"
}
```

### 2. Login:
```json
POST /auth/login/client
{
  "email": "joao@email.com",
  "password": "123456"
}
```

### 3. Criar Assinatura:
```json
POST /subscriptions
Authorization: Bearer <token>
{
  "clientId": 1,
  "type": "monthly",
  "price": 29.90
}
```

## 🏭 Deploy no Render

### 1. Configurar banco PostgreSQL no Render
### 2. Configurar variáveis de ambiente
### 3. Deploy automático via Git

## 🧪 Testes

```bash
npm test
```

## 📋 Scripts Disponíveis

```bash
npm run dev      # Desenvolvimento com hot reload
npm run build    # Build para produção
npm start        # Iniciar produção
npm run migrate  # Executar migrations
npm run seed     # Executar seeds
npm test         # Executar testes
```

## 🏢 Estrutura de Responsabilidades

### Services (Lógica de Negócio)
- **AuthService**: Login, registro, verificação de token
- **UserService**: CRUD de usuários, busca por role
- **ClientService**: CRUD de clientes, estatísticas
- **SubscriptionService**: Gestão de assinaturas, renovações

### Controllers (Interface HTTP)
- Recebem requests HTTP
- Validam entrada básica
- Chamam services apropriados
- Retornam responses padronizadas

### Middleware
- **Autenticação**: Verificação de JWT
- **Autorização**: Controle de acesso por role
- **Validação**: Joi para validação de entrada
- **Erro**: Tratamento centralizado de erros

## 📊 Funcionalidades Especiais

- ✅ Soft delete para usuários/clientes
- ✅ Paginação em listagens
- ✅ Filtros por role/status
- ✅ Estatísticas de assinaturas
- ✅ Rate limiting
- ✅ CORS configurado
- ✅ Logs de requisições
- ✅ Health check endpoint
- ✅ Tratamento de erros robusto

## 🔧 Próximos Passos

1. Criar rotas completas
2. Adicionar validações Joi
3. Implementar testes unitários
4. Documentação Swagger
5. Sistema de logs mais robusto
6. Cache com Redis (opcional)
7. Notificações por email (opcional)