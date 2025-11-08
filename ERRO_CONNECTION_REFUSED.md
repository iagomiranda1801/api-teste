# 🚨 ERRO: Connection refused: getsockopt - SOLUÇÃO RÁPIDA

## ⚡ Checklist de Resolução

### ✅ **1. Verificar se PostgreSQL está instalado**
```bash
# No PowerShell
Get-Service -Name "*postgres*"
```

**Se não retornar nada** → PostgreSQL não está instalado

### ✅ **2. Instalar PostgreSQL (se necessário)**
1. **Download:** https://www.postgresql.org/download/windows/
2. **Configuração durante instalação:**
   - ✅ Porta: `5432`
   - ✅ Usuário: `postgres` 
   - ✅ Senha: `password` (ou sua escolha)
   - ✅ Locale: `Portuguese, Brazil`

### ✅ **3. Iniciar serviço PostgreSQL**
```bash
# Abrir PowerShell como ADMINISTRADOR
Start-Service postgresql-x64-15
# ou
Start-Service postgresql-x64-16
```

### ✅ **4. Verificar se está rodando**
```bash
# Verificar serviço
Get-Service -Name "*postgres*" | Where-Object {$_.Status -eq "Running"}

# Verificar porta
netstat -an | findstr 5432
```

**Deve retornar algo como:**
```
TCP    0.0.0.0:5432           0.0.0.0:0              LISTENING
```

### ✅ **5. Testar conexão**
```bash
# Testar psql (pode precisar do caminho completo)
"C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres -h localhost
```

### ✅ **6. Criar banco de dados**
```sql
-- No psql
CREATE DATABASE yebox_test;
\q
```

### ✅ **7. Testar no DBeaver**
```
Host: localhost
Port: 5432
Database: yebox_test
Username: postgres
Password: [sua_senha]
```

## 🔧 Alternativas Rápidas

### Opção A: **Docker** (Recomendado)
```bash
# Instalar Docker Desktop
# Depois executar:
docker run --name postgres-api \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=yebox_test \
  -p 5432:5432 \
  -d postgres:15
```

### Opção B: **PostgreSQL Portable**
1. Download: https://sourceforge.net/projects/postgresqlportable/
2. Extrair e executar
3. Configurar porta 5432

## 🆘 Se ainda não funcionar

### Verificar firewall:
```bash
# Verificar se porta 5432 está bloqueada
telnet localhost 5432
```

### Verificar arquivos de configuração:
```
C:\Program Files\PostgreSQL\15\data\postgresql.conf
C:\Program Files\PostgreSQL\15\data\pg_hba.conf
```

### Log de erros:
```
C:\Program Files\PostgreSQL\15\data\log\
```

## ✅ Status Final

Após resolver, você deve conseguir:

1. ✅ `Get-Service postgresql-x64-15` → Status: Running
2. ✅ `netstat -an | findstr 5432` → LISTENING
3. ✅ DBeaver conectar sem erros
4. ✅ `npm run migrate` funcionar

---
**💡 Dica:** Use Docker se quiser algo mais simples e isolado!