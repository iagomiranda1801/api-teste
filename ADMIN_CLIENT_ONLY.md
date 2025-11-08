# ✅ Atualização: Apenas Usuários Admin e Client

## 🎯 Mudanças Realizadas

Atualizei todo o sistema para usar apenas dois tipos de usuários:
- ✅ **admin** - Administradores do sistema
- ✅ **client** - Clientes

Removido o tipo **user** (usuário interno).

## 📝 Arquivos Atualizados

### 1. **Modelo User** (`src/models/User.ts`)
```typescript
// Antes: role: 'admin' | 'user' | 'client'
// Agora: role: 'admin' | 'client'

role: {
  type: DataTypes.ENUM('admin', 'client'),
  allowNull: false,
  defaultValue: 'client'
}
```

### 2. **Migration** (`migrations/20241108000001-create-users-table.js`)
```javascript
role: {
  type: Sequelize.ENUM('admin', 'client'),
  defaultValue: 'client',
  comment: 'Tipo do usuário: admin (administrador), client (cliente)'
}
```

### 3. **Seeder** (`seeders/20241108000001-demo-users.js`)
Usuários criados:
- **2 Admins:**
  - `admin@yebox.com` / `admin123`
  - `admin@example.com` / `admin123`
  
- **4 Clientes:**
  - `cliente@exemplo.com` / `client123`
  - `ana.costa@cliente.com` / `client123`
  - `pedro@cliente.com` / `client123` (inativo)
  - `maria@cliente.com` / `client123`

### 4. **Middleware de Validação** (`src/middleware/validation.ts`)
```typescript
// Agora aceita apenas: 'admin' ou 'client'
if (role && !['admin', 'client'].includes(role)) {
  // erro: Role deve ser "admin" ou "client"
}
```

### 5. **Middleware de Auth** (`src/middleware/auth.ts`)
```typescript
interface UserPayload {
  role: 'admin' | 'client';
}
```

## 🏗️ Estrutura Final da Tabela

```sql
Table: users
├── id (INTEGER, AUTO_INCREMENT, PRIMARY KEY)
├── name (VARCHAR(100), NOT NULL)
├── email (VARCHAR(100), NOT NULL, UNIQUE)
├── password (VARCHAR(255), NOT NULL)
├── role (ENUM: 'admin', 'client', DEFAULT: 'client')
├── isActive (BOOLEAN, DEFAULT: true)
├── createdAt (DATETIME, NOT NULL)
└── updatedAt (DATETIME, NOT NULL)
```

## 👥 Tipos de Usuário

### 🔑 **Admin**
- Acesso total ao sistema
- Pode gerenciar todos os usuários
- Login via: `POST /auth/login/user`
- Acesso a todas as rotas `/users/*`

### 👤 **Client**
- Cliente externo
- Acesso limitado às próprias informações
- Login via: `POST /auth/login/client`

## 🚀 Como Usar

### 1. **Executar Migration**
```bash
npm run migrate
```

### 2. **Popular com Dados**
```bash
npm run seed
```

### 3. **Testar Login Admin**
```bash
curl -X POST http://localhost:3000/auth/login/user \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@yebox.com","password":"admin123"}'
```

### 4. **Testar Login Client**
```bash
curl -X POST http://localhost:3000/auth/login/client \
  -H "Content-Type: application/json" \
  -d '{"email":"cliente@exemplo.com","password":"client123"}'
```

### 5. **Criar Novo Cliente via API**
```bash
curl -X POST http://localhost:3000/auth/register/client \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Novo Cliente",
    "email": "novo@cliente.com",
    "password": "123456"
  }'
```

### 6. **Listar Usuários (Admin)**
```bash
curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer <token_admin>"
```

## 📊 Dados de Teste

| Nome | Email | Senha | Tipo | Status |
|------|-------|-------|------|--------|
| Admin Master | admin@yebox.com | admin123 | admin | ativo |
| Administrador Principal | admin@example.com | admin123 | admin | ativo |
| Cliente Exemplo | cliente@exemplo.com | client123 | client | ativo |
| Ana Costa | ana.costa@cliente.com | client123 | client | ativo |
| Pedro Oliveira | pedro@cliente.com | client123 | client | inativo |
| Maria Silva | maria@cliente.com | client123 | client | ativo |

## ✅ Status: Completo

Sistema atualizado com sucesso para usar apenas **admin** e **client**! 🎉

Execute `npm run migrate` e `npm run seed` para aplicar as mudanças.