'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Primeiro, vamos verificar se existem usuários do tipo client para associar assinaturas
    const clients = await queryInterface.sequelize.query(
      "SELECT id FROM users WHERE role = 'client' LIMIT 5",
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (clients.length === 0) {
      console.log('Nenhum cliente encontrado. Criando assinaturas apenas se houver clientes.');
      return;
    }

    // Inserir assinaturas de exemplo
    const subscriptions = [
      {
        client_id: clients[0]?.id,
        type: 'monthly',
        status: 'active',
        start_date: new Date('2024-01-01'),
        end_date: new Date('2024-02-01'),
        price: 29.90,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        client_id: clients[1]?.id || clients[0]?.id,
        type: 'quarterly',
        status: 'active',
        start_date: new Date('2024-01-01'),
        end_date: new Date('2024-04-01'),
        price: 79.90,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        client_id: clients[2]?.id || clients[0]?.id,
        type: 'semester',
        status: 'active',
        start_date: new Date('2024-01-01'),
        end_date: new Date('2024-07-01'),
        price: 149.90,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        client_id: clients[3]?.id || clients[0]?.id,
        type: 'annual',
        status: 'active',
        start_date: new Date('2024-01-01'),
        end_date: new Date('2025-01-01'),
        price: 279.90,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        client_id: clients[4]?.id || clients[0]?.id,
        type: 'monthly',
        status: 'cancelled',
        start_date: new Date('2023-12-01'),
        end_date: new Date('2024-01-01'),
        price: 29.90,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    // Filtrar assinaturas com client_id válido
    const validSubscriptions = subscriptions.filter(sub => sub.client_id);

    if (validSubscriptions.length > 0) {
      await queryInterface.bulkInsert('subscriptions', validSubscriptions);
      console.log(`${validSubscriptions.length} assinaturas inseridas com sucesso!`);
    }
  },

  async down(queryInterface, Sequelize) {
    // Remover todas as assinaturas de exemplo
    await queryInterface.bulkDelete('subscriptions', null, {});
  }
};