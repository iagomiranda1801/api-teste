# 👥 Rotas para Criar Usuários - JSONs e Endpoints

## 🔐 Rotas de Criação de Usuários

### 1. **Criar Cliente (Público)**
**Endpoint:** `POST /auth/register/client`  
**Acesso:** Público (não precisa de token)

**JSON:**
```json
{
  "name": "João Silva",
  "email": "joao@cliente.com",
  "password": "123456"
}
```

**Exemplo com curl:**
```bash
curl -X POST http://localhost:3000/auth/register/client \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@cliente.com",
    "password": "123456"
  }'
```

**Resposta de Sucesso:**
```json
{
  "success": true,
  "message": "Cliente registrado com sucesso",
  "data": {
    "user": {
      "id": 5,
      "name": "João Silva",
      "email": "joao@cliente.com",
      "role": "client",
      "isActive": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. **Criar Usuário Admin (Apenas Admin)**
**Endpoint:** `POST /auth/register/user`  
**Acesso:** Apenas administradores (precisa de token admin)

**Headers:**
```
Authorization: Bearer <token_admin>
Content-Type: application/json
```

**JSON:**
```json
{
  "name": "Maria Admin",
  "email": "maria@admin.com",
  "password": "123456",
  "role": "admin"
}
```

**Exemplo com curl:**
```bash
curl -X POST http://localhost:3000/auth/register/user \
  -H "Authorization: Bearer <SEU_TOKEN_ADMIN>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maria Admin",
    "email": "maria@admin.com",
    "password": "123456",
    "role": "admin"
  }'
```

### 3. **Criar Usuário via Rota /users (Apenas Admin)**
**Endpoint:** `POST /users`  
**Acesso:** Apenas administradores

**Headers:**
```
Authorization: Bearer <token_admin>
Content-Type: application/json
```

**JSON para Cliente:**
```json
{
  "name": "Ana Cliente",
  "email": "ana@cliente.com",
  "password": "123456",
  "role": "client"
}
```

**JSON para Admin:**
```json
{
  "name": "Pedro Admin",
  "email": "pedro@admin.com",
  "password": "123456",
  "role": "admin"
}
```

## 🚀 Como Obter Token de Admin

### 1. **Login como Admin:**
```bash
curl -X POST http://localhost:3000/auth/login/user \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@yebox.com",
    "password": "admin123"
  }'
```

### 2. **Copiar o token da resposta:**
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "user": {...},
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1h..."
  }
}
```

## 📋 Validações dos Campos

### **Campos Obrigatórios:**
- ✅ `name` - Entre 2 e 100 caracteres
- ✅ `email` - Formato válido e único
- ✅ `password` - Mínimo 6 caracteres

### **Campo Opcional:**
- `role` - "admin" ou "client" (padrão: "client")

### **Validações:**
```json
{
  "name": "string (2-100 chars)",
  "email": "string (formato email válido)",
  "password": "string (mínimo 6 chars)",
  "role": "admin | client"
}
```

## 🎯 Exemplos Práticos

### **Criar Cliente Simples:**
```json
{
  "name": "Cliente Teste",
  "email": "teste@cliente.com",
  "password": "123456"
}
```

### **Criar Admin Completo:**
```json
{
  "name": "Administrador Novo",
  "email": "novo@admin.com",
  "password": "senhaSegura123",
  "role": "admin"
}
```

### **Dados de Teste:**
```json
{
  "name": "Maria da Silva",
  "email": "maria.silva@exemplo.com",
  "password": "minhaSenha123"
}
```

## ❌ Erros Comuns

### **1. Email já existe:**
```json
{
  "success": false,
  "error": "Dados duplicados",
  "message": "Este registro já existe no sistema",
  "field": "email"
}
```

### **2. Dados inválidos:**
```json
{
  "success": false,
  "error": "Dados obrigatórios",
  "message": "Nome, email e senha são obrigatórios"
}
```

### **3. Senha muito curta:**
```json
{
  "success": false,
  "error": "Senha inválida",
  "message": "Senha deve ter pelo menos 6 caracteres"
}
```

### **4. Token inválido (rota admin):**
```json
{
  "success": false,
  "error": "Token inválido",
  "message": "Token não fornecido ou inválido"
}
```

## 🔍 Teste das Rotas

### **1. Iniciar servidor:**
```bash
npm run dev
```

### **2. Testar criação de cliente:**
```bash
curl -X POST http://localhost:3000/auth/register/client \
  -H "Content-Type: application/json" \
  -d '{"name":"Teste User","email":"teste@user.com","password":"123456"}'
```

### **3. Fazer login admin:**
```bash
curl -X POST http://localhost:3000/auth/login/user \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@yebox.com","password":"admin123"}'
```

### **4. Usar token para criar outro admin:**
```bash
curl -X POST http://localhost:3000/users \
  -H "Authorization: Bearer <TOKEN_AQUI>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Novo Admin","email":"novo@admin.com","password":"123456","role":"admin"}'
```

---
**✅ Essas são todas as rotas e JSONs para criar usuários no sistema!**