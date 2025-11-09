import { User, Subscription, SubscriptionStatus, SubscriptionType } from '../models';

interface CreateSubscriptionData {
  clientId: number;
  type: SubscriptionType;
  price: number;
  startDate?: Date;
}

interface UpdateSubscriptionData {
  type?: SubscriptionType;
  status?: SubscriptionStatus;
  startDate?: Date;
  endDate?: Date;
  price?: number;
}

// Preços padrão para cada tipo de assinatura
const SUBSCRIPTION_PRICES = {
  [SubscriptionType.MONTHLY]: 29.90,
  [SubscriptionType.QUARTERLY]: 79.90,
  [SubscriptionType.SEMESTER]: 149.90,
  [SubscriptionType.ANNUAL]: 279.90
};

export class SubscriptionService {
  // Listar todas as assinaturas (apenas admin)
  static async getAllSubscriptions(page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;

    const { count, rows: subscriptions } = await Subscription.findAndCountAll({
      offset,
      limit,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return {
      subscriptions,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalSubscriptions: count,
        limit
      }
    };
  }

  // Buscar assinatura por ID
  static async getSubscriptionById(id: number) {
    const subscription = await Subscription.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    if (!subscription) {
      throw new Error('Assinatura não encontrada');
    }

    return subscription;
  }

  // Buscar assinaturas de um cliente
  static async getClientSubscriptions(clientId: number, page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;

    // Verificar se o cliente existe
    const client = await User.findByPk(clientId);
    if (!client) {
      throw new Error('Cliente não encontrado');
    }

    const { count, rows: subscriptions } = await Subscription.findAndCountAll({
      where: { clientId },
      offset,
      limit,
      order: [['createdAt', 'DESC']]
    });

    return {
      subscriptions,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalSubscriptions: count,
        limit
      }
    };
  }

  // Buscar assinatura ativa de um cliente
  static async getActiveClientSubscription(clientId: number) {
    const subscription = await Subscription.findOne({
      where: {
        clientId,
        status: SubscriptionStatus.ACTIVE
      },
      order: [['createdAt', 'DESC']]
    });

    return subscription;
  }

  // Criar nova assinatura
  static async createSubscription(subscriptionData: CreateSubscriptionData) {
    // Verificar se o cliente existe
    const client = await User.findByPk(subscriptionData.clientId);
    if (!client) {
      throw new Error('Cliente não encontrado');
    }

    // Verificar se já existe uma assinatura ativa para o cliente
    const existingActiveSubscription = await this.getActiveClientSubscription(subscriptionData.clientId);
    if (existingActiveSubscription) {
      throw new Error('Cliente já possui uma assinatura ativa');
    }

    // Usar preço padrão se não fornecido
    const price = subscriptionData.price || SUBSCRIPTION_PRICES[subscriptionData.type];

    const subscription = await Subscription.create({
      clientId: subscriptionData.clientId,
      type: subscriptionData.type,
      price,
      startDate: subscriptionData.startDate || new Date(),
      status: SubscriptionStatus.ACTIVE
    });

    return subscription;
  }

  // Atualizar assinatura
  static async updateSubscription(id: number, subscriptionData: UpdateSubscriptionData) {
    const subscription = await Subscription.findByPk(id);

    if (!subscription) {
      throw new Error('Assinatura não encontrada');
    }

    await subscription.update(subscriptionData);

    return subscription;
  }

  // Cancelar assinatura
  static async cancelSubscription(id: number) {
    const subscription = await Subscription.findByPk(id);

    if (!subscription) {
      throw new Error('Assinatura não encontrada');
    }

    if (subscription.status === SubscriptionStatus.CANCELLED) {
      throw new Error('Assinatura já está cancelada');
    }

    await subscription.update({
      status: SubscriptionStatus.CANCELLED
    });

    return { message: 'Assinatura cancelada com sucesso' };
  }

  // Reativar assinatura
  static async reactivateSubscription(id: number) {
    const subscription = await Subscription.findByPk(id);

    if (!subscription) {
      throw new Error('Assinatura não encontrada');
    }

    if (subscription.status === SubscriptionStatus.ACTIVE) {
      throw new Error('Assinatura já está ativa');
    }

    // Verificar se não expirou
    const now = new Date();
    if (subscription.endDate < now) {
      throw new Error('Assinatura expirada. Crie uma nova assinatura.');
    }

    await subscription.update({
      status: SubscriptionStatus.ACTIVE
    });

    return { message: 'Assinatura reativada com sucesso' };
  }

  // Renovar assinatura
  static async renewSubscription(id: number, newType?: SubscriptionType) {
    const currentSubscription = await Subscription.findByPk(id);

    if (!currentSubscription) {
      throw new Error('Assinatura não encontrada');
    }

    // Cancelar assinatura atual
    await currentSubscription.update({
      status: SubscriptionStatus.INACTIVE
    });

    // Criar nova assinatura
    const subscriptionType = newType || currentSubscription.type;
    const price = SUBSCRIPTION_PRICES[subscriptionType];

    const newSubscription = await Subscription.create({
      clientId: currentSubscription.clientId,
      type: subscriptionType,
      price,
      startDate: new Date(),
      status: SubscriptionStatus.ACTIVE
    });

    return newSubscription;
  }

  // Obter estatísticas de assinaturas
  static async getSubscriptionStats() {
    const totalSubscriptions = await Subscription.count();
    const activeSubscriptions = await Subscription.count({ where: { status: SubscriptionStatus.ACTIVE } });
    const cancelledSubscriptions = await Subscription.count({ where: { status: SubscriptionStatus.CANCELLED } });
    const expiredSubscriptions = await Subscription.count({ where: { status: SubscriptionStatus.EXPIRED } });

    // Estatísticas por tipo
    const monthlySubscriptions = await Subscription.count({ 
      where: { 
        type: SubscriptionType.MONTHLY,
        status: SubscriptionStatus.ACTIVE
      } 
    });
    const quarterlySubscriptions = await Subscription.count({ 
      where: { 
        type: SubscriptionType.QUARTERLY,
        status: SubscriptionStatus.ACTIVE
      } 
    });
    const semesterSubscriptions = await Subscription.count({ 
      where: { 
        type: SubscriptionType.SEMESTER,
        status: SubscriptionStatus.ACTIVE
      } 
    });
    const annualSubscriptions = await Subscription.count({ 
      where: { 
        type: SubscriptionType.ANNUAL,
        status: SubscriptionStatus.ACTIVE
      } 
    });

    return {
      total: totalSubscriptions,
      active: activeSubscriptions,
      cancelled: cancelledSubscriptions,
      expired: expiredSubscriptions,
      byType: {
        monthly: monthlySubscriptions,
        quarterly: quarterlySubscriptions,
        semester: semesterSubscriptions,
        annual: annualSubscriptions
      }
    };
  }

  // Verificar assinaturas que estão prestes a expirar
  static async getExpiringSubscriptions(daysAhead: number = 7) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);

    const subscriptions = await Subscription.findAll({
      where: {
        status: SubscriptionStatus.ACTIVE,
        endDate: {
          // Implementar operador de comparação quando instalar sequelize
          // [Op.lte]: futureDate
        }
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['endDate', 'ASC']]
    });

    return subscriptions;
  }

  // Marcar assinaturas expiradas
  static async markExpiredSubscriptions() {
    const now = new Date();

    const expiredSubscriptions = await Subscription.findAll({
      where: {
        status: SubscriptionStatus.ACTIVE,
        endDate: {
          // [Op.lt]: now
        }
      }
    });

    for (const subscription of expiredSubscriptions) {
      await subscription.update({
        status: SubscriptionStatus.EXPIRED
      });
    }

    return {
      message: `${expiredSubscriptions.length} assinaturas marcadas como expiradas`,
      count: expiredSubscriptions.length
    };
  }
}