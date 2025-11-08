# 🚨 Erro SSL PostgreSQL - SOLUÇÕES

## 🔍 Problema
```
ERROR: connection is insecure (try using `sslmode=require`)
```

Este erro acontece quando o PostgreSQL está configurado para exigir conexões SSL.

## 🛠️ Soluções Testadas

### ✅ **Solução 1: Docker PostgreSQL (RECOMENDADA)**
```bash
# Pare qualquer PostgreSQL rodando
# Execute PostgreSQL via Docker (sem SSL)
docker run --name postgres-api \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=yebox_test \
  -e POSTGRES_USER=postgres \
  -p 5432:5432 \
  -d postgres:15

# Verificar se está rodando
docker ps

# Testar conexão
npm run migrate
```

### ✅ **Solução 2: Configuração Local PostgreSQL**
Editar arquivo `postgresql.conf`:
```bash
# Localizar arquivo (exemplo):
# C:\Program Files\PostgreSQL\15\data\postgresql.conf

# Adicionar/alterar:
ssl = off
```

Editar arquivo `pg_hba.conf`:
```bash
# Localizar arquivo (exemplo):
# C:\Program Files\PostgreSQL\15\data\pg_hba.conf

# Adicionar linha:
host    all             all             127.0.0.1/32            trust
```

Depois reiniciar PostgreSQL:
```bash
# PowerShell como Admin
Restart-Service postgresql-x64-15
```

### ✅ **Solução 3: Usar PostgreSQL Online**

#### **Neon.tech (Gratuito)**
1. Criar conta em https://neon.tech
2. Criar projeto PostgreSQL
3. Copiar string de conexão
4. Atualizar `.env`:

```env
DB_HOST=ep-xxx.neon.tech
DB_PORT=5432
DB_NAME=neondb
DB_USER=neondb_owner
DB_PASS=sua_senha_gerada
```

#### **Supabase (Gratuito)**
1. Criar conta em https://supabase.com
2. Criar projeto
3. Ir em Settings → Database
4. Copiar dados de conexão
5. Atualizar `.env`

### ✅ **Solução 4: Configuração SSL Disabled**
Já aplicada no projeto:

`config/config.js`:
```javascript
dialectOptions: {
  ssl: {
    require: false,
    rejectUnauthorized: false
  }
}
```

## 🚀 Teste Rápido

### Docker (Mais Rápido):
```bash
# 1. Instalar Docker Desktop
# 2. Executar:
docker run --name postgres-test -e POSTGRES_PASSWORD=password -e POSTGRES_DB=yebox_test -p 5432:5432 -d postgres:15

# 3. Aguardar 30 segundos
# 4. Testar:
npm run migrate
```

### Online (Neon):
```bash
# 1. Criar conta em neon.tech
# 2. Criar projeto
# 3. Copiar dados de conexão
# 4. Atualizar .env
# 5. Testar:
npm run migrate
```

## 📝 Variáveis .env Exemplo

### Para Docker Local:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=yebox_test
DB_USER=postgres
DB_PASS=password
```

### Para Neon.tech:
```env
DB_HOST=ep-xxx.neon.tech
DB_PORT=5432
DB_NAME=neondb
DB_USER=neondb_owner
DB_PASS=sua_senha_do_neon
```

## ✅ Verificação

Após aplicar uma solução, teste:
```bash
npm run migrate
```

Deve retornar:
```
== 20241108000001-create-users-table: migrating =======
== 20241108000001-create-users-table: migrated (xxx ms)
```

---
**💡 Recomendação:** Use Docker para desenvolvimento local ou Neon.tech para algo rápido e online.