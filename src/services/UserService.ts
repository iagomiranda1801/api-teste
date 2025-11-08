import { User } from '../models';

interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'user';
}

interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
  role?: 'admin' | 'user';
  isActive?: boolean;
}

export class UserService {
  // Listar todos os usuários (apenas para admin)
  static async getAllUsers(page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;

    const { count, rows: users } = await User.findAndCountAll({
      offset,
      limit,
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });

    return {
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalUsers: count,
        limit
      }
    };
  }

  // Buscar usuário por ID
  static async getUserById(id: number) {
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    return user;
  }

  // Buscar usuário por email
  static async getUserByEmail(email: string) {
    const user = await User.findOne({
      where: { email },
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    return user;
  }

  // Criar novo usuário (apenas admin pode criar)
  static async createUser(userData: CreateUserData) {
    const existingUser = await User.findOne({
      where: { email: userData.email }
    });

    if (existingUser) {
      throw new Error('Email já está em uso');
    }

    const user = await User.create({
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role || 'user'
    });

    // Retornar sem a senha
    const { password, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;
  }

  // Atualizar usuário
  static async updateUser(id: number, userData: UpdateUserData) {
    const user = await User.findByPk(id);

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // Verificar se email já existe (se estiver sendo alterado)
    if (userData.email && userData.email !== user.email) {
      const existingUser = await User.findOne({
        where: { email: userData.email }
      });

      if (existingUser) {
        throw new Error('Email já está em uso');
      }
    }

    await user.update(userData);

    // Retornar sem a senha
    const { password, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;
  }

  // Desativar usuário (soft delete)
  static async deactivateUser(id: number) {
    const user = await User.findByPk(id);

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    await user.update({ isActive: false });

    return { message: 'Usuário desativado com sucesso' };
  }

  // Ativar usuário
  static async activateUser(id: number) {
    const user = await User.findByPk(id);

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    await user.update({ isActive: true });

    return { message: 'Usuário ativado com sucesso' };
  }

  // Deletar usuário (hard delete - apenas admin)
  static async deleteUser(id: number) {
    const user = await User.findByPk(id);

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    await user.destroy();

    return { message: 'Usuário deletado com sucesso' };
  }

  // Buscar usuários por role
  static async getUsersByRole(role: 'admin' | 'user', page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;

    const { count, rows: users } = await User.findAndCountAll({
      where: { role },
      offset,
      limit,
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });

    return {
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalUsers: count,
        limit
      }
    };
  }
}