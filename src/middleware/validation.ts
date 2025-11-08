import { Request, Response, NextFunction } from 'express';

// Middleware para validação de entrada usando Joi
export const validateInput = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      res.status(400).json({
        error: 'Dados inválidos',
        message: error.details[0].message,
        details: error.details
      });
      return;
    }
    
    next();
  };
};

// Middleware para tratamento de erros
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('❌ Erro:', err);

  // Erro de validação do Sequelize
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      error: 'Erro de validação',
      message: err.errors[0].message,
      details: err.errors
    });
  }

  // Erro de violação de constraint única
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      error: 'Dados duplicados',
      message: 'Este registro já existe no sistema',
      field: err.errors[0].path
    });
  }

  // Erro de chave estrangeira
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      error: 'Referência inválida',
      message: 'Registro referenciado não existe'
    });
  }

  // Erro padrão
  return res.status(500).json({
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Algo deu errado'
  });
};

// Middleware para log de requisições
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
  });
  
  next();
};

// Middleware para CORS customizado
export const corsOptions = {
  origin: function (origin: string | undefined, callback: Function) {
    // Lista de domínios permitidos
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:8081', // Expo
      'exp://localhost:8081', // Expo
    ];
    
    // Permite requisições sem origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Não permitido pelo CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Validadores específicos para diferentes endpoints
export const validateLogin = (req: Request, res: Response, next: NextFunction): void => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({
      success: false,
      error: 'Dados obrigatórios',
      message: 'Email e senha são obrigatórios'
    });
    return;
  }

  if (!email.includes('@')) {
    res.status(400).json({
      success: false,
      error: 'Email inválido',
      message: 'Formato de email inválido'
    });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({
      success: false,
      error: 'Senha inválida',
      message: 'Senha deve ter pelo menos 6 caracteres'
    });
    return;
  }

  next();
};

export const validateUserRegister = (req: Request, res: Response, next: NextFunction): void => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({
      success: false,
      error: 'Dados obrigatórios',
      message: 'Nome, email e senha são obrigatórios'
    });
    return;
  }

  if (!email.includes('@')) {
    res.status(400).json({
      success: false,
      error: 'Email inválido',
      message: 'Formato de email inválido'
    });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({
      success: false,
      error: 'Senha inválida',
      message: 'Senha deve ter pelo menos 6 caracteres'
    });
    return;
  }

  if (role && !['admin', 'client'].includes(role)) {
    res.status(400).json({
      success: false,
      error: 'Role inválida',
      message: 'Role deve ser "admin" ou "client"'
    });
    return;
  }

  next();
};

export const validateClientRegister = (req: Request, res: Response, next: NextFunction): void => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({
      success: false,
      error: 'Dados obrigatórios',
      message: 'Nome, email e senha são obrigatórios'
    });
    return;
  }

  if (!email.includes('@')) {
    res.status(400).json({
      success: false,
      error: 'Email inválido',
      message: 'Formato de email inválido'
    });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({
      success: false,
      error: 'Senha inválida',
      message: 'Senha deve ter pelo menos 6 caracteres'
    });
    return;
  }

  next();
};

export const validateUserUpdate = (req: Request, res: Response, next: NextFunction): void => {
  const { email, role } = req.body;

  if (email && !email.includes('@')) {
    res.status(400).json({
      success: false,
      error: 'Email inválido',
      message: 'Formato de email inválido'
    });
    return;
  }

  if (role && !['admin', 'client'].includes(role)) {
    res.status(400).json({
      success: false,
      error: 'Role inválida',
      message: 'Role deve ser "admin" ou "client"'
    });
    return;
  }

  next();
};