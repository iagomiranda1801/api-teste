# 🐘 Configuração PostgreSQL no DBeaver

## 📋 Informações de Conexão

Com base na configuração do seu projeto, use os seguintes dados para conectar no DBeaver:

### 🔧 Dados de Conexão
```
Host: localhost
Porta: 5432
Database: yebox_test
Usuário: postgres
Senha: [sua_senha_do_postgres]
```

## 🚀 Passo a Passo no DBeaver

### 1. **Abrir DBeaver**
   - Inicie o DBeaver Community

### 2. **Nova Conexão**
   - Clique no ícone **"Nova Conexão"** (🔌) na barra superior
   - Ou vá em `Database` → `New Database Connection`
   - Ou use o atalho `Ctrl + Shift + O`

### 3. **Selecionar PostgreSQL**
   - Na janela "Connect to a database"
   - Selecione **PostgreSQL** na lista
   - Clique em **"Next"**

### 4. **Configurar Conexão**
   Preencha os campos:
   ```
   Server Host: localhost
   Port: 5432
   Database: yebox_test
   Username: postgres
   Password: [sua_senha]
   ```

### 5. **Configurações Adicionais (Opcional)**
   - **Show all databases**: ✅ (marcado)
   - **SSL**: Deixe desmarcado se for ambiente local

### 6. **Testar Conexão**
   - Clique em **"Test Connection"**
   - Se aparecer "Connected" ✅ = sucesso!
   - Se der erro ❌ = verifique as configurações

### 7. **Finalizar**
   - Clique em **"Finish"**
   - A conexão aparecerá no painel esquerdo

## 🔧 Configuração do Arquivo .env

Certifique-se de ter um arquivo `.env` na raiz do projeto:

```env
# Database PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=yebox_test
DB_USER=postgres
DB_PASS=sua_senha_aqui

# JWT
JWT_SECRET=seu_jwt_secret_super_seguro_aqui
JWT_EXPIRES_IN=7d

# App
NODE_ENV=development
PORT=3000
APP_NAME=API-TESTE
APP_VERSION=1.0.0
```

## 🐘 Preparar PostgreSQL

### Criar Banco de Dados (se não existir)
```sql
-- No DBeaver, execute este comando:
CREATE DATABASE yebox_test;
```

### Ou via linha de comando:
```bash
# Windows (psql)
psql -U postgres
CREATE DATABASE yebox_test;
\q
```

## 🗃️ Executar Migrations

Após conectar no DBeaver, execute as migrations do projeto:

```bash
# No terminal do projeto
npm run db:create    # Criar banco (se necessário)
npm run migrate      # Executar migrations
npm run seed         # Popular com dados de exemplo
```

## 📊 Verificar Dados no DBeaver

Após executar as migrations, você verá no DBeaver:

### Tabela `users`
```sql
-- Consultar usuários criados
SELECT id, name, email, role, "isActive", "createdAt" 
FROM users 
ORDER BY id;
```

### Usuários de Exemplo
| ID | Nome | Email | Role | Status |
|----|------|-------|------|--------|
| 1 | Administrador | admin@example.com | admin | ativo |
| 2 | Admin Master | admin@yebox.com | admin | ativo |
| 3 | João Silva | joao.silva@yebox.com | user | ativo |
| 4 | Cliente Exemplo | cliente@exemplo.com | client | ativo |

## ❌ Problemas Comuns

### 1. **Erro de Conexão - Connection refused: getsockopt**
```
Reason: Connection refused: getsockopt
```
**Problema:** PostgreSQL não está rodando ou não está acessível.

**Soluções:**

#### A) **Verificar se PostgreSQL está instalado:**
```bash
# No PowerShell, verificar se está instalado
Get-Service -Name "*postgres*"
```

#### B) **Instalar PostgreSQL (se não estiver instalado):**
1. **Download:** https://www.postgresql.org/download/windows/
2. **Versão recomendada:** PostgreSQL 15 ou 16
3. **Durante instalação:**
   - Porta: `5432` (padrão)
   - Usuário: `postgres`
   - Senha: `[escolha uma senha]`

#### C) **Iniciar serviço PostgreSQL:**
```bash
# Método 1: Services do Windows
services.msc
# Procurar por "postgresql" e iniciar

# Método 2: PowerShell (como Administrador)
Start-Service postgresql-x64-15
# ou
Start-Service postgresql-x64-16

# Método 3: net start
net start postgresql-x64-15
```

#### D) **Verificar se está rodando:**
```bash
# Verificar serviços
Get-Service -Name "*postgres*"

# Verificar porta 5432
netstat -an | findstr 5432
```

#### E) **Testar conexão local:**
```bash
# Se psql estiver no PATH
psql -U postgres -h localhost

# Se não estiver no PATH, usar caminho completo
"C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres -h localhost
```

### 2. **PostgreSQL não está no PATH**
**Problema:** Comando `psql` não encontrado.

**Solução - Adicionar ao PATH:**
1. **Encontrar instalação do PostgreSQL:**
   ```
   C:\Program Files\PostgreSQL\15\bin\
   C:\Program Files\PostgreSQL\16\bin\
   ```

2. **Adicionar ao PATH:**
   - Abrir "Variáveis de Ambiente" no Windows
   - Editar variável `PATH`
   - Adicionar: `C:\Program Files\PostgreSQL\15\bin`

3. **Ou usar caminho completo:**
   ```bash
   "C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres
   ```

### 3. **Alternativa: Docker PostgreSQL**
Se preferir usar Docker:

```bash
# Baixar e rodar PostgreSQL via Docker
docker run --name postgres-local \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=yebox_test \
  -p 5432:5432 \
  -d postgres:15

# Verificar se está rodando
docker ps
```

### 4. **Configurar PostgreSQL após instalação**
```bash
# 1. Abrir psql
"C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres

# 2. Criar banco de dados
CREATE DATABASE yebox_test;

# 3. Verificar
\l

# 4. Sair
\q
```

### 3. **Banco não existe**
```
Reason: database "yebox_test" does not exist
```
**Solução:**
```sql
CREATE DATABASE yebox_test;
```

### 4. **Driver não encontrado**
**Solução:**
- DBeaver baixa automaticamente
- Clique em "Download" quando solicitar

## 🔍 Comandos Úteis no DBeaver

### Visualizar estrutura da tabela
```sql
-- Ver estrutura da tabela users
\d users

-- Ou no DBeaver: clique direito na tabela → "View DDL"
```

### Consultas de exemplo
```sql
-- Listar todos os usuários
SELECT * FROM users;

-- Contar por tipo
SELECT role, COUNT(*) as total 
FROM users 
GROUP BY role;

-- Usuários ativos
SELECT * FROM users WHERE "isActive" = true;
```

## ✅ Teste Final

Execute no DBeaver para confirmar:
```sql
-- Teste simples
SELECT 'Conexão PostgreSQL funcionando!' as status;

-- Verificar tabela users
SELECT COUNT(*) as total_usuarios FROM users;
```

Se retornar resultados, sua conexão está funcionando perfeitamente! 🎉