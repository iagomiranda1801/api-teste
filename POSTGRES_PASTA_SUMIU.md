# 🔍 PostgreSQL Instalado mas Pasta Sumiu - SOLUÇÃO

## 🚨 Problema Identificado
Você instalou o PostgreSQL mas:
- ❌ Pasta não encontrada em `C:\Program Files\`
- ❌ Serviços não aparecem
- ❌ Comando `psql` não funciona

## 🔍 Diagnóstico Completo

### 1. **Verificar Locais Alternativos**
```bash
# Procurar em todos os discos
Get-ChildItem "C:\" -Name "*postgres*" -Directory -Recurse -ErrorAction SilentlyContinue

# Verificar AppData (instalação por usuário)
Get-ChildItem "$env:USERPROFILE\AppData\" -Name "*postgres*" -Directory -Recurse -ErrorAction SilentlyContinue

# Verificar ProgramData
Get-ChildItem "C:\ProgramData\" -Name "*postgres*" -Directory -ErrorAction SilentlyContinue
```

### 2. **Verificar Registro do Windows**
```bash
# Verificar programas instalados
Get-ItemProperty HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\* | Where-Object {$_.DisplayName -like "*postgres*"}
```

### 3. **Verificar se foi instalação portátil**
Algumas instalações podem ter ido para:
- `C:\PostgreSQL\`
- `C:\postgres\`
- `D:\PostgreSQL\`
- Desktop ou Downloads

## 🛠️ Soluções

### **Solução A: Busca Completa**
```bash
# Buscar em todo o sistema (pode demorar)
Get-ChildItem "C:\" -Name "postgres.exe" -Recurse -ErrorAction SilentlyContinue
Get-ChildItem "C:\" -Name "psql.exe" -Recurse -ErrorAction SilentlyContinue
```

### **Solução B: Reinstalar PostgreSQL Corretamente**

#### 1. **Limpar instalação anterior**
```bash
# Verificar e parar serviços
Get-Service -Name "*postgres*" | Stop-Service -Force

# Limpar registro (opcional)
# Fazer backup do registro antes!
```

#### 2. **Download e Instalação Fresh**
1. **Download oficial:** https://www.postgresql.org/download/windows/
2. **Escolher:** PostgreSQL 15 ou 16
3. **Executar como Administrador**
4. **Configurações importantes:**
   ```
   ✅ Pasta: C:\Program Files\PostgreSQL\15\
   ✅ Porta: 5432
   ✅ Usuário: postgres
   ✅ Senha: password (anote!)
   ✅ Locale: Portuguese, Brazil
   ✅ Instalar Stack Builder: SIM
   ✅ Criar serviço Windows: SIM
   ```

### **Solução C: Usar Docker (Mais Confiável)**
```bash
# 1. Instalar Docker Desktop se não tiver
# 2. Executar PostgreSQL via Docker
docker run --name postgres-local `
  -e POSTGRES_PASSWORD=password `
  -e POSTGRES_DB=yebox_test `
  -p 5432:5432 `
  -d postgres:15

# 3. Verificar se está rodando
docker ps
```

### **Solução D: PostgreSQL Portable**
1. **Download:** https://sourceforge.net/projects/postgresqlportable/
2. **Extrair em:** `C:\PostgreSQLPortable\`
3. **Executar:** `PostgreSQLPortable.exe`
4. **Configurar porta 5432**

## 🔧 Verificação Pós-Instalação

### 1. **Verificar serviço**
```bash
Get-Service -Name "*postgres*"
# Deve mostrar: postgresql-x64-15 Running
```

### 2. **Verificar pasta**
```bash
Test-Path "C:\Program Files\PostgreSQL\15\bin\psql.exe"
# Deve retornar: True
```

### 3. **Testar conexão**
```bash
& "C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres -h localhost
```

### 4. **Verificar porta**
```bash
netstat -an | findstr 5432
# Deve mostrar: TCP 0.0.0.0:5432 LISTENING
```

## ⚡ Solução Express (Docker)

Se quiser resolver rapidamente:

```bash
# 1. Instalar Docker Desktop
# 2. Reiniciar Windows
# 3. Executar:
docker run --name postgres-api -e POSTGRES_PASSWORD=password -e POSTGRES_DB=yebox_test -p 5432:5432 -d postgres:15

# 4. Testar no DBeaver:
# Host: localhost
# Port: 5432  
# Database: yebox_test
# User: postgres
# Password: password
```

## 🎯 Próximos Passos

1. **Escolha uma solução acima**
2. **Execute os comandos de verificação**
3. **Teste a conexão no DBeaver**
4. **Execute as migrations:** `npm run migrate`

---
**💡 Recomendação:** Use Docker se quiser algo garantido e isolado, ou reinstale o PostgreSQL prestando atenção no caminho de instalação.