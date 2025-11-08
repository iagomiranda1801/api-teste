# 🚨 Erro: Permission denied for schema public

## 🔍 Problema Identificado
```
ERROR: permission denied for schema public
```

O usuário PostgreSQL não tem permissões para criar tabelas no schema `public`.

## 🛠️ Soluções

### ✅ **Solução 1: Docker PostgreSQL (RECOMENDADA)**
```bash
# Para e remove containers existentes
docker stop postgres-api postgres-local 2>$null
docker rm postgres-api postgres-local 2>$null

# Cria novo container com usuário admin
docker run --name postgres-api \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=yebox_test \
  -e POSTGRES_USER=postgres \
  -p 5432:5432 \
  -d postgres:15

# Aguardar 30 segundos para inicializar
Start-Sleep 30

# Testar
npm run migrate
```

### ✅ **Solução 2: Corrigir Permissões PostgreSQL Local**

#### Se PostgreSQL estiver instalado:
```bash
# Localizar psql.exe
Get-ChildItem "C:\Program Files\" -Name "psql.exe" -Recurse -ErrorAction SilentlyContinue

# Executar com caminho completo (ajustar versão):
& "C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres -c "
  GRANT ALL PRIVILEGES ON SCHEMA public TO postgres;
  GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
  GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres;
"
```

#### Criar usuário com permissões:
```sql
-- Executar no psql como superuser
CREATE USER api_user WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE yebox_test TO api_user;
ALTER USER api_user CREATEDB;
```

### ✅ **Solução 3: PostgreSQL Online (Neon.tech)**

#### Criar conta gratuita:
1. **Acessar:** https://neon.tech
2. **Criar conta gratuita**
3. **Criar novo projeto:**
   - Nome: `api-teste`
   - Região: `US East`
4. **Copiar dados de conexão**

#### Atualizar .env:
```env
# Exemplo de dados do Neon
DB_HOST=ep-billowing-thunder-12345678.us-east-1.aws.neon.tech
DB_PORT=5432
DB_NAME=neondb
DB_USER=neondb_owner
DB_PASS=AbCdEf123456
```

### ✅ **Solução 4: Supabase (Alternativa Online)**

#### Criar projeto:
1. **Acessar:** https://supabase.com
2. **Criar conta**
3. **New Project:**
   - Nome: `api-teste`
   - Database Password: `password123`
4. **Settings → Database**
5. **Copiar Connection Parameters**

#### Atualizar .env:
```env
DB_HOST=db.abc123def456.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASS=password123
```

## 🚀 Solução Express (Docker)

Execute estes comandos em sequência:

```bash
# 1. Parar/remover containers existentes
docker stop $(docker ps -q) 2>$null; docker rm $(docker ps -aq) 2>$null

# 2. Criar novo PostgreSQL
docker run --name postgres-fresh \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=yebox_test \
  -e POSTGRES_USER=postgres \
  -p 5432:5432 \
  -d postgres:15

# 3. Aguardar inicialização
timeout 30

# 4. Atualizar .env
echo "DB_HOST=localhost
DB_PORT=5432
DB_NAME=yebox_test
DB_USER=postgres
DB_PASS=password" > .env.local

# 5. Testar migration
npm run migrate
```

## 🔧 Script de Verificação

```bash
# Verificar se Docker está funcionando
docker --version

# Verificar se PostgreSQL está rodando
docker ps | findstr postgres

# Testar conexão (se tiver Docker)
docker exec postgres-fresh psql -U postgres -d yebox_test -c "SELECT version();"
```

## 📝 Arquivo .env Correto

Para Docker local:
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=yebox_test
DB_USER=postgres
DB_PASS=password

# JWT
JWT_SECRET=seu_jwt_secret_super_seguro_aqui
JWT_EXPIRES_IN=7d

# App
NODE_ENV=development
PORT=3000
```

## ✅ Verificação Final

Após aplicar uma solução:
```bash
# 1. Verificar conexão
npm run migrate

# 2. Se funcionar, popular dados
npm run seed

# 3. Testar API
npm run dev
```

## 🎯 Ordem de Prioridade

1. **Docker** - Mais confiável, ambiente isolado
2. **Neon.tech** - Online, gratuito, sem configuração
3. **Supabase** - Alternativa online
4. **PostgreSQL local** - Mais complexo, requer configuração

---
**💡 Recomendação:** Use Docker se tiver instalado, ou Neon.tech para uma solução rápida online.