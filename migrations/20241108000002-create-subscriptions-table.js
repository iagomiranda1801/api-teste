'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Criar ENUMs para tipo e status da assinatura
    await queryInterface.sequelize.query(`
      DO 'BEGIN
        CREATE TYPE "enum_subscriptions_type" AS ENUM(
          ''monthly'', 
          ''quarterly'', 
          ''semester'', 
          ''annual''
        );
      EXCEPTION WHEN duplicate_object THEN null;
      END';
    `);

    await queryInterface.sequelize.query(`
      DO 'BEGIN
        CREATE TYPE "enum_subscriptions_status" AS ENUM(
          ''active'', 
          ''inactive'', 
          ''cancelled'', 
          ''expired''
        );
      EXCEPTION WHEN duplicate_object THEN null;
      END';
    `);

    // Criar tabela subscriptions
    await queryInterface.createTable('subscriptions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      client_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      type: {
        type: 'enum_subscriptions_type',
        allowNull: false
      },
      status: {
        type: 'enum_subscriptions_status',
        allowNull: false,
        defaultValue: 'active'
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    // Criar índices para otimização
    await queryInterface.addIndex('subscriptions', ['client_id'], {
      name: 'idx_subscriptions_client_id'
    });

    await queryInterface.addIndex('subscriptions', ['status'], {
      name: 'idx_subscriptions_status'
    });

    await queryInterface.addIndex('subscriptions', ['type'], {
      name: 'idx_subscriptions_type'
    });

    await queryInterface.addIndex('subscriptions', ['start_date', 'end_date'], {
      name: 'idx_subscriptions_date_range'
    });
  },

  async down(queryInterface, Sequelize) {
    // Remover índices
    await queryInterface.removeIndex('subscriptions', 'idx_subscriptions_client_id');
    await queryInterface.removeIndex('subscriptions', 'idx_subscriptions_status');
    await queryInterface.removeIndex('subscriptions', 'idx_subscriptions_type');
    await queryInterface.removeIndex('subscriptions', 'idx_subscriptions_date_range');

    // Remover tabela
    await queryInterface.dropTable('subscriptions');

    // Remover ENUMs
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_subscriptions_type"');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_subscriptions_status"');
  }
};