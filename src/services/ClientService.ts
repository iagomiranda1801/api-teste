import { Client, Subscription } from '../models';

interface CreateClientData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  document?: string;
}

interface UpdateClientData {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  document?: string;
  isActive?: boolean;
}

export class ClientService {
  // Listar todos os clientes (apenas para admin)
  static async getAllClients(page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;

    const { count, rows: clients } = await Client.findAndCountAll({
      offset,
      limit,
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Subscription,
          as: 'subscriptions',
          order: [['createdAt', 'DESC']],
          limit: 1 // Apenas a assinatura mais recente
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return {
      clients,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalClients: count,
        limit
      }
    };
  }

  // Buscar cliente por ID
  static async getClientById(id: number, includeSubscriptions: boolean = false) {
    const client = await Client.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: includeSubscriptions ? [
        {
          model: Subscription,
          as: 'subscriptions',
          order: [['createdAt', 'DESC']]
        }
      ] : []
    });

    if (!client) {
      throw new Error('Cliente não encontrado');
    }

    return client;
  }

  // Buscar cliente por email
  static async getClientByEmail(email: string) {
    const client = await Client.findOne({
      where: { email },
      attributes: { exclude: ['password'] }
    });

    if (!client) {
      throw new Error('Cliente não encontrado');
    }

    return client;
  }

  // Criar novo cliente (admin ou auto-registro)
  static async createClient(clientData: CreateClientData) {
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

    // Retornar sem a senha
    const { password, ...clientWithoutPassword } = client.toJSON();
    return clientWithoutPassword;
  }

  // Atualizar cliente
  static async updateClient(id: number, clientData: UpdateClientData) {
    const client = await Client.findByPk(id);

    if (!client) {
      throw new Error('Cliente não encontrado');
    }

    // Verificar se email já existe (se estiver sendo alterado)
    if (clientData.email && clientData.email !== client.email) {
      const existingClient = await Client.findOne({
        where: { email: clientData.email }
      });

      if (existingClient) {
        throw new Error('Email já está em uso');
      }
    }

    await client.update(clientData);

    // Retornar sem a senha
    const { password, ...clientWithoutPassword } = client.toJSON();
    return clientWithoutPassword;
  }

  // Desativar cliente (soft delete)
  static async deactivateClient(id: number) {
    const client = await Client.findByPk(id);

    if (!client) {
      throw new Error('Cliente não encontrado');
    }

    await client.update({ isActive: false });

    return { message: 'Cliente desativado com sucesso' };
  }

  // Ativar cliente
  static async activateClient(id: number) {
    const client = await Client.findByPk(id);

    if (!client) {
      throw new Error('Cliente não encontrado');
    }

    await client.update({ isActive: true });

    return { message: 'Cliente ativado com sucesso' };
  }

  // Deletar cliente (hard delete - apenas admin)
  static async deleteClient(id: number) {
    const client = await Client.findByPk(id);

    if (!client) {
      throw new Error('Cliente não encontrado');
    }

    await client.destroy();

    return { message: 'Cliente deletado com sucesso' };
  }

  // Buscar clientes ativos com assinaturas válidas
  static async getActiveClientsWithSubscriptions(page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;

    const { count, rows: clients } = await Client.findAndCountAll({
      where: { isActive: true },
      offset,
      limit,
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Subscription,
          as: 'subscriptions',
          where: { status: 'active' },
          required: true,
          order: [['createdAt', 'DESC']]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return {
      clients,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalClients: count,
        limit
      }
    };
  }

  // Obter estatísticas dos clientes
  static async getClientStats() {
    const totalClients = await Client.count();
    const activeClients = await Client.count({ where: { isActive: true } });
    const inactiveClients = await Client.count({ where: { isActive: false } });

    const clientsWithActiveSubscriptions = await Client.count({
      include: [
        {
          model: Subscription,
          as: 'subscriptions',
          where: { status: 'active' },
          required: true
        }
      ]
    });

    return {
      total: totalClients,
      active: activeClients,
      inactive: inactiveClients,
      withActiveSubscriptions: clientsWithActiveSubscriptions,
      withoutActiveSubscriptions: activeClients - clientsWithActiveSubscriptions
    };
  }
}