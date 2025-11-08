# 🗃️ Guia de Migrations - Tabela de Usuários

## 📋 Resumo

Foi criada uma migration para a tabela `users` com suporte a três tipos de usuários:
- **admin**: Administradores do sistema
- **user**: Usuários internos
- **client**: Clientes

## 🏗️ Estrutura da Tabela

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user', 'client') NOT NULL DEFAULT 'user',
  isActive BOOLEAN NOT NULL DEFAULT true,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
);
```

### Índices Criados
- `unique_users_email` - Email único
- `idx_users_role` - Busca por tipo de usuário
- `idx_users_isActive` - Busca por status ativo

## 🚀 Como Executar

### 1. Criar Banco de Dados
```bash
npm run db:create
```

### 2. Executar Migration
```bash
npm run migrate
```

### 3. Popular com Dados de Exemplo (Opcional)
```bash
npm run seed
```

## 👥 Usuários Criados

### Migration (Usuário Padrão)
- **Email**: `admin@example.com`
- **Senha**: `admin123`
- **Tipo**: `admin`

### Seeders (Usuários de Exemplo)
1. **Admin Master**
   - Email: `admin@yebox.com`
   - Senha: `admin123`
   - Tipo: `admin`

2. **João Silva**
   - Email: `joao.silva@yebox.com`
   - Senha: `user123`
   - Tipo: `user`

3. **Maria Santos**
   - Email: `maria.santos@yebox.com`
   - Senha: `user123`
   - Tipo: `user`

4. **Cliente Exemplo**
   - Email: `cliente@exemplo.com`
   - Senha: `client123`
   - Tipo: `client`

5. **Ana Costa**
   - Email: `ana.costa@cliente.com`
   - Senha: `client123`
   - Tipo: `client`

6. **Pedro Oliveira** (Inativo)
   - Email: `pedro@cliente.com`
   - Senha: `client123`
   - Tipo: `client`
   - Status: `inativo`

## 📝 Comandos Úteis

### Migrations
```bash
# Executar todas as migrations
npm run migrate

# Desfazer última migration
npm run migrate:undo

# Desfazer todas as migrations
npm run migrate:undo:all

# Ver status das migrations
npm run migrate:status
```

### Seeders
```bash
# Executar todos os seeders
npm run seed

# Desfazer todos os seeders
npm run seed:undo
```

### Banco de Dados
```bash
# Criar banco de dados
npm run db:create

# Apagar banco de dados
npm run db:drop
```

## 🔧 Configuração

### Arquivo .env
Certifique-se de ter as seguintes variáveis:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=yebox_test
DB_USER=postgres
DB_PASS=sua_senha
```

### Arquivos de Configuração
- `config/config.js` - Configuração do Sequelize
- `.sequelizerc` - Caminhos das migrations e seeders
- `migrations/20241108000001-create-users-table.js` - Migration da tabela
- `seeders/20241108000001-demo-users.js` - Dados de exemplo

## 🎯 Próximos Passos

1. **Executar a migration**:
   ```bash
   npm run migrate
   ```

2. **Popular com dados de exemplo**:
   ```bash
   npm run seed
   ```

3. **Testar autenticação**:
   ```bash
   curl -X POST http://localhost:3000/auth/login/user \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@yebox.com","password":"admin123"}'
   ```

## ⚠️ Observações

- As senhas são automaticamente hasheadas pelo modelo User
- A migration inclui um usuário admin padrão
- Os seeders criam usuários de exemplo para teste
- Todos os usuários podem fazer login nas rotas apropriadas:
  - Admins e Users: `/auth/login/user`
  - Clientes: `/auth/login/client`

## 🔐 Tipos de Usuário

### Admin
- Acesso total ao sistema
- Pode gerenciar usuários
- Pode criar/editar/deletar outros usuários

### User
- Usuário interno da empresa
- Acesso limitado baseado em permissões

### Client
- Cliente externo
- Acesso apenas às suas próprias informações
- Login via `/auth/login/client`