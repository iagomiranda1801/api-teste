import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import { syncDatabase } from './models';
import { errorHandler, requestLogger, corsOptions } from './middleware/validation';
import { authRoutes, userRoutes } from './routes';

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração de rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP por janela de tempo
  message: {
    error: 'Muitas tentativas',
    message: 'Tente novamente em 15 minutos'
  }
});

// Middlewares globais
app.use(helmet()); // Segurança
app.use(cors(corsOptions)); // CORS
app.use(limiter); // Rate limiting
app.use(express.json({ limit: '10mb' })); // Parser JSON
app.use(express.urlencoded({ extended: true })); // Parser URL encoded
app.use(requestLogger); // Log de requisições

// Rota de health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API funcionando corretamente',
    timestamp: new Date().toISOString(),
    version: process.env.APP_VERSION || '1.0.0'
  });
});

// Rota principal
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Bem-vindo à API-TESTE YeBox',
    version: process.env.APP_VERSION || '1.0.0',
    documentation: '/docs',
    endpoints: {
      auth: '/auth',
      users: '/users',
      clients: '/clients',
      subscriptions: '/subscriptions'
    }
  });
});

// Rotas da API
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

// Middleware de tratamento de erros (deve ser o último)
app.use(errorHandler);

// Rota para 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Rota não encontrada',
    message: `A rota ${req.method} ${req.originalUrl} não existe`
  });
});

// Função para iniciar o servidor
async function startServer() {
  try {
    // Conectar e sincronizar com o banco de dados
    await syncDatabase();
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log('🚀 Servidor iniciado com sucesso!');
      console.log(`📡 Rodando na porta: ${PORT}`);
      console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 URL: http://localhost:${PORT}`);
      console.log('📊 Health check: /health');
      
      if (process.env.NODE_ENV === 'development') {
        console.log('\n📋 Endpoints disponíveis:');
        console.log('  GET  / - Informações da API');
        console.log('  GET  /health - Status da API');
        console.log('\n🔐 Autenticação:');
        console.log('  POST /auth/login/user - Login usuário');
        console.log('  POST /auth/login/client - Login cliente');
        console.log('  POST /auth/register/user - Registro usuário (admin)');
        console.log('  POST /auth/register/client - Registro cliente');
        console.log('  GET  /auth/me - Dados do usuário logado');
        console.log('\n👥 Usuários (Admin):');
        console.log('  GET  /users - Listar usuários');
        console.log('  GET  /users/:id - Buscar por ID');
        console.log('  GET  /users/email/:email - Buscar por email');
        console.log('  POST /users - Criar usuário');
        console.log('  PUT  /users/:id - Atualizar usuário');
        console.log('  DELETE /users/:id - Deletar usuário');
        console.log('\n📚 Documentação: Ver API_ROUTES.md');
      }
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

// Tratamento de erros não capturados
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM recebido, encerrando servidor graciosamente...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT recebido, encerrando servidor graciosamente...');
  process.exit(0);
});

// Iniciar servidor
startServer();

export default app;