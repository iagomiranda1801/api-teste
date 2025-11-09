import { generateToken } from '../middleware/auth';
import { Client, User } from '../models';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterUserData {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'user';
}

interface RegisterClientData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  document?: string;
}

export class AuthService {
  // Login para usuários (admin/user)
  static async loginUser(credentials: LoginCredentials) {
    const { email, password } = credentials;

    const user = await User.findOne({ 
      where: { email, isActive: true } 
    });

    if (!user) {
      throw new Error('Credenciais inválidas');
    }

    const isValidPassword = await user.validatePassword(password);
    console.log("isValidPassword:", isValidPassword);
    if (!isValidPassword) {
      throw new Error('Credenciais inválidas');
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      type: user.role === 'admin' ? 'user' : 'client' // Se for admin, type é 'user', senão é 'client'
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      },
      token
    };
  }

  // Login para clientes
  static async loginClient(credentials: LoginCredentials) {
    const { email, password } = credentials;

    const client = await Client.findOne({ 
      where: { email, isActive: true } 
    });

    if (!client) {
      throw new Error('Credenciais inválidas');
    }

    const isValidPassword = await client.validatePassword(password);
    if (!isValidPassword) {
      throw new Error('Credenciais inválidas');
    }

    const token = generateToken({
      id: client.id,
      email: client.email,
      role: 'user', // Clientes sempre são 'user'
      type: 'client'
    });

    return {
      client: {
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        document: client.document,
        isActive: client.isActive
      },
      token
    };
  }

  // Registro de usuário (admin/user)
  static async registerUser(userData: RegisterUserData) {
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

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      type: 'user'
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      },
      token
    };
  }

  // Registro de cliente
  static async registerClient(clientData: RegisterClientData) {
    const existingClient = await Client.findOne({ 
      where: { email: clientData.email } 
    });

    if (existingClient) {
      throw new Error('Email já está em uso');
    }

    const client = await Client.create({
      name: clientData.name,
      email: clientData.email,
      password: clientData.password,
      phone: clientData.phone,
      document: clientData.document
    });

    const token = generateToken({
      id: client.id,
      email: client.email,
      role: 'user',
      type: 'client'
    });

    return {
      client: {
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        document: client.document,
        isActive: client.isActive
      },
      token
    };
  }

  // Verificar token e retornar dados do usuário
  static async verifyToken(userId: number, userType: 'user' | 'client') {
    if (userType === 'user') {
      const user = await User.findByPk(userId);
      if (!user || !user.isActive) {
        throw new Error('Usuário não encontrado ou inativo');
      }
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        type: 'user'
      };
    } else {
      const client = await Client.findByPk(userId);
      if (!client || !client.isActive) {
        throw new Error('Cliente não encontrado ou inativo');
      }
      return {
        id: client.id,
        name: client.name,
        email: client.email,
        type: 'client'
      };
    }
  }
}