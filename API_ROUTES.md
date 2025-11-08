# Documentação das Rotas da API

## 📋 Sumário
- [Autenticação](#autenticação)
- [Usuários](#usuários)
- [Exemplos de Uso](#exemplos-de-uso)

## 🔐 Autenticação

Todas as rotas protegidas requerem um token Bearer no header Authorization:
```
Authorization: Bearer <token>
```

### Endpoints de Autenticação

#### POST /auth/login/user
Login para usuários (admin/user)

**Body:**
```json
{
  "email": "admin@example.com",
  "password": "123456"
}
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "user": {
      "id": 1,
      "name": "Admin",
      "email": "admin@example.com",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### POST /auth/login/client
Login para clientes

**Body:**
```json
{
  "email": "cliente@example.com",
  "password": "123456"
}
```

#### POST /auth/register/user
Criar novo usuário (apenas admin)

**Headers:** `Authorization: Bearer <token>`
**Body:**
```json
{
  "name": "Novo Usuário",
  "email": "usuario@example.com",
  "password": "123456",
  "role": "user"
}
```

#### POST /auth/register/client
Registrar novo cliente

**Body:**
```json
{
  "name": "Novo Cliente",
  "email": "cliente@example.com",
  "password": "123456",
  "phone": "(11) 99999-9999"
}
```

#### GET /auth/me
Obter dados do usuário logado

**Headers:** `Authorization: Bearer <token>`

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Dados do usuário obtidos com sucesso",
  "data": {
    "id": 1,
    "name": "Admin",
    "email": "admin@example.com",
    "role": "admin",
    "isActive": true
  }
}
```

## 👥 Usuários

Todas as rotas de usuários requerem autenticação de admin.

### Endpoints de Usuários

#### GET /users
Listar todos os usuários com paginação

**Headers:** `Authorization: Bearer <token>` (Admin)
**Query Parameters:**
- `page` (opcional): Número da página (padrão: 1)
- `limit` (opcional): Limite por página (padrão: 10)

**Exemplo:** `/users?page=1&limit=5`

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Usuários listados com sucesso",
  "data": {
    "users": [
      {
        "id": 1,
        "name": "Admin",
        "email": "admin@example.com",
        "role": "admin",
        "isActive": true,
        "createdAt": "2024-01-01T10:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalUsers": 1,
      "hasNext": false,
      "hasPrev": false
    }
  }
}
```

#### GET /users/:id
Buscar usuário por ID

**Headers:** `Authorization: Bearer <token>` (Admin)
**Parâmetros:** `id` - ID do usuário

**Exemplo:** `/users/1`

#### GET /users/email/:email
Buscar usuário por email

**Headers:** `Authorization: Bearer <token>` (Admin)
**Parâmetros:** `email` - Email do usuário

**Exemplo:** `/users/email/admin@example.com`

#### POST /users
Criar novo usuário

**Headers:** `Authorization: Bearer <token>` (Admin)
**Body:**
```json
{
  "name": "Novo Usuário",
  "email": "usuario@example.com",
  "password": "123456",
  "role": "user"
}
```

**Resposta de Sucesso (201):**
```json
{
  "success": true,
  "message": "Usuário criado com sucesso",
  "data": {
    "id": 2,
    "name": "Novo Usuário",
    "email": "usuario@example.com",
    "role": "user",
    "isActive": true
  }
}
```

#### PUT /users/:id
Atualizar usuário por ID

**Headers:** `Authorization: Bearer <token>` (Admin)
**Parâmetros:** `id` - ID do usuário
**Body:**
```json
{
  "name": "Nome Atualizado",
  "email": "email@atualizado.com",
  "role": "admin",
  "isActive": false
}
```

#### PATCH /users/:id
Atualização parcial do usuário

**Headers:** `Authorization: Bearer <token>` (Admin)
**Parâmetros:** `id` - ID do usuário
**Body (campos opcionais):**
```json
{
  "name": "Apenas o nome"
}
```

#### DELETE /users/:id
Deletar usuário por ID

**Headers:** `Authorization: Bearer <token>` (Admin)
**Parâmetros:** `id` - ID do usuário

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Usuário deletado com sucesso"
}
```

## 🔍 Pesquisa de Usuários

Para pesquisar usuários, você pode usar os seguintes métodos:

1. **Busca por email:** `GET /users/email/admin@example.com`
2. **Busca por ID:** `GET /users/1`
3. **Listagem com paginação:** `GET /users?page=1&limit=10`

## 📝 Exemplos de Uso

### 1. Login e obter token
```bash
curl -X POST http://localhost:3000/auth/login/user \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "123456"
  }'
```

### 2. Listar usuários (com token)
```bash
curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer <seu_token_aqui>"
```

### 3. Criar usuário
```bash
curl -X POST http://localhost:3000/users \
  -H "Authorization: Bearer <seu_token_aqui>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "123456",
    "role": "user"
  }'
```

### 4. Atualizar usuário
```bash
curl -X PUT http://localhost:3000/users/2 \
  -H "Authorization: Bearer <seu_token_aqui>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva Santos",
    "email": "joao.santos@example.com"
  }'
```

### 5. Deletar usuário
```bash
curl -X DELETE http://localhost:3000/users/2 \
  -H "Authorization: Bearer <seu_token_aqui>"
```

## ⚠️ Códigos de Erro Comuns

- **400** - Bad Request (dados inválidos)
- **401** - Unauthorized (token inválido ou ausente)
- **403** - Forbidden (sem permissão)
- **404** - Not Found (recurso não encontrado)
- **409** - Conflict (email já existe)
- **500** - Internal Server Error

## 🔑 Estrutura de Resposta Padrão

### Sucesso
```json
{
  "success": true,
  "message": "Descrição da operação",
  "data": { /* dados retornados */ }
}
```

### Erro
```json
{
  "success": false,
  "error": "Tipo do erro",
  "message": "Descrição detalhada do erro"
}
```