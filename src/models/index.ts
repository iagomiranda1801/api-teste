import sequelize from '../config/database';
import User from './User';
import Client from './Client';
import Subscription, { SubscriptionType, SubscriptionStatus } from './Subscription';

// Definir relacionamentos
Client.hasMany(Subscription, {
  foreignKey: 'clientId',
  as: 'subscriptions'
});

Subscription.belongsTo(Client, {
  foreignKey: 'clientId',
  as: 'client'
});

// Função para sincronizar os modelos com o banco
export const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com o banco estabelecida com sucesso.');
    
    await sequelize.sync({ force: false, alter: true });
    console.log('✅ Modelos sincronizados com o banco de dados.');
  } catch (error) {
    console.error('❌ Erro ao conectar com o banco:', error);
    throw error;
  }
};

// Exportar modelos
export {
  sequelize,
  User,
  Client,
  Subscription,
  SubscriptionType,
  SubscriptionStatus
};

export default {
  sequelize,
  User,
  Client,
  Subscription,
  SubscriptionType,
  SubscriptionStatus,
  syncDatabase
};