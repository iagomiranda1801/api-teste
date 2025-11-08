import { Request, Response } from 'express';
import { AuthService } from '../services';
import { AuthenticatedRequest } from '../middleware/auth';

export class AuthController {
  // POST /auth/login/user - Login para usuários (admin/user)
  static async loginUser(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      
      const result = await AuthService.loginUser({ email, password });
      
      res.status(200).json({
        success: true,
        message: 'Login realizado com sucesso',
        data: result
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        error: 'Falha na autenticação',
        message: error.message
      });
    }
  }

  // POST /auth/login/client - Login para clientes
  static async loginClient(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      
      const result = await AuthService.loginClient({ email, password });
      
      res.status(200).json({
        success: true,
        message: 'Login realizado com sucesso',
        data: result
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        error: 'Falha na autenticação',
        message: error.message
      });
    }
  }

  // POST /auth/register/user - Registro de usuário (apenas admin pode criar)
  static async registerUser(req: Request, res: Response) {
    try {
      const { name, email, password, role } = req.body;
      
      const result = await AuthService.registerUser({
        name,
        email,
        password,
        role
      });
      
      res.status(201).json({
        success: true,
        message: 'Usuário criado com sucesso',
        data: result
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: 'Falha no registro',
        message: error.message
      });
    }
  }

  // POST /auth/register/client - Registro de cliente (público)
  static async registerClient(req: Request, res: Response) {
    try {
      const { name, email, password, phone, document } = req.body;
      
      const result = await AuthService.registerClient({
        name,
        email,
        password,
        phone,
        document
      });
      
      res.status(201).json({
        success: true,
        message: 'Cliente registrado com sucesso',
        data: result
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: 'Falha no registro',
        message: error.message
      });
    }
  }

  // GET /auth/me - Verificar token e obter dados do usuário logado
  static async getMe(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Não autenticado',
          message: 'Token inválido'
        });
      }

      const userData = await AuthService.verifyToken(req.user.id, req.user.type);
      
      res.status(200).json({
        success: true,
        message: 'Dados do usuário obtidos com sucesso',
        data: userData
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        error: 'Token inválido',
        message: error.message
      });
    }
  }

  // POST /auth/logout - Logout (invalidar token do lado cliente)
  static async logout(req: Request, res: Response) {
    // Note: Com JWT, o logout é feito do lado cliente removendo o token
    // Em uma implementação mais robusta, você pode manter uma blacklist de tokens
    res.status(200).json({
      success: true,
      message: 'Logout realizado com sucesso'
    });
  }
}