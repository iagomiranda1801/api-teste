import { Request, Response } from 'express';
import { UserService } from '../services';
import { AuthenticatedRequest } from '../middleware/auth';

export class UserController {
  // GET /users - Listar todos os usuários (apenas admin)
  static async getUsers(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const result = await UserService.getAllUsers(page, limit);
      
      res.status(200).json({
        success: true,
        message: 'Usuários listados com sucesso',
        data: result
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: 'Erro ao listar usuários',
        message: error.message
      });
    }
  }

  // GET /users/:id - Buscar usuário por ID
  static async getUserById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      
      const user = await UserService.getUserById(id);
      
      res.status(200).json({
        success: true,
        message: 'Usuário encontrado com sucesso',
        data: user
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        error: 'Usuário não encontrado',
        message: error.message
      });
    }
  }

  // GET /users/email/:email - Buscar usuário por email
  static async getUserByEmail(req: Request, res: Response) {
    try {
      const { email } = req.params;
      
      const user = await UserService.getUserByEmail(email);
      
      res.status(200).json({
        success: true,
        message: 'Usuário encontrado com sucesso',
        data: user
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        error: 'Usuário não encontrado',
        message: error.message
      });
    }
  }

  // POST /users - Criar novo usuário (apenas admin)
  static async createUser(req: Request, res: Response) {
    try {
      const { name, email, password, role } = req.body;
      
      const user = await UserService.createUser({
        name,
        email,
        password,
        role
      });
      
      res.status(201).json({
        success: true,
        message: 'Usuário criado com sucesso',
        data: user
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: 'Erro ao criar usuário',
        message: error.message
      });
    }
  }

  // PUT /users/:id - Atualizar usuário
  static async updateUser(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const { name, email, password, role, isActive } = req.body;
      
      const user = await UserService.updateUser(id, {
        name,
        email,
        password,
        role,
        isActive
      });
      
      res.status(200).json({
        success: true,
        message: 'Usuário atualizado com sucesso',
        data: user
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: 'Erro ao atualizar usuário',
        message: error.message
      });
    }
  }

  // PATCH /users/:id/deactivate - Desativar usuário
  static async deactivateUser(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      
      const result = await UserService.deactivateUser(id);
      
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: 'Erro ao desativar usuário',
        message: error.message
      });
    }
  }

  // PATCH /users/:id/activate - Ativar usuário
  static async activateUser(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      
      const result = await UserService.activateUser(id);
      
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: 'Erro ao ativar usuário',
        message: error.message
      });
    }
  }

  // DELETE /users/:id - Deletar usuário (apenas admin)
  static async deleteUser(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      
      const result = await UserService.deleteUser(id);
      
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: 'Erro ao deletar usuário',
        message: error.message
      });
    }
  }

  // GET /users/role/:role - Buscar usuários por role
  static async getUsersByRole(req: Request, res: Response) {
    try {
      const role = req.params.role as 'admin' | 'user';
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      if (!['admin', 'user'].includes(role)) {
        return res.status(400).json({
          success: false,
          error: 'Role inválido',
          message: 'Role deve ser "admin" ou "user"'
        });
      }
      
      const result = await UserService.getUsersByRole(role, page, limit);
      
      res.status(200).json({
        success: true,
        message: `Usuários com role "${role}" listados com sucesso`,
        data: result
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: 'Erro ao listar usuários por role',
        message: error.message
      });
    }
  }
}