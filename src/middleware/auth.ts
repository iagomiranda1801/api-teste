import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface UserPayload {
  id: number;
  email: string;
  role: 'admin' | 'client';
  type: 'user' | 'client';
}

interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}

// Middleware de autenticação
export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      error: 'Token de acesso requerido',
      message: 'É necessário fornecer um token de autenticação válido'
    });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET não configurado');
    }

    const decoded = jwt.verify(token, jwtSecret) as UserPayload;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      error: 'Token inválido',
      message: 'O token fornecido é inválido ou expirou'
    });
  }
};

// Middleware para verificar se é admin
export const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Não autenticado',
      message: 'Usuário não está autenticado'
    });
  }

  if (req.user.role !== 'admin' || req.user.type !== 'user') {
    return res.status(403).json({
      error: 'Acesso negado',
      message: 'Apenas administradores podem acessar este recurso'
    });
  }

  next();
};

// Middleware para verificar se é cliente
export const requireClient = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Não autenticado',
      message: 'Usuário não está autenticado'
    });
  }

  if (req.user.type !== 'client') {
    return res.status(403).json({
      error: 'Acesso negado',
      message: 'Apenas clientes podem acessar este recurso'
    });
  }

  next();
};

// Middleware para verificar se é admin ou o próprio usuário/cliente
export const requireOwnerOrAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Não autenticado',
      message: 'Usuário não está autenticado'
    });
  }

  const userId = parseInt(req.params.id);
  const isOwner = req.user.id === userId;
  const isAdmin = req.user.role === 'admin' && req.user.type === 'user';

  if (!isOwner && !isAdmin) {
    return res.status(403).json({
      error: 'Acesso negado',
      message: 'Você só pode acessar seus próprios dados ou ser um administrador'
    });
  }

  next();
};

// Utilitário para gerar token
export const generateToken = (payload: UserPayload): string => {
  const jwtSecret = process.env.JWT_SECRET;
  const jwtExpires = process.env.JWT_EXPIRES_IN || '7d';

  if (!jwtSecret) {
    throw new Error('JWT_SECRET não configurado');
  }

  return jwt.sign(payload, jwtSecret, { expiresIn: jwtExpires });
};

export { AuthenticatedRequest, UserPayload };