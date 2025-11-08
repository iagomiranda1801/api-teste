'use strict';

const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Gerar hashes das senhas
    const adminPasswordHash = await bcrypt.hash('admin123', 10);
    const clientPasswordHash = await bcrypt.hash('client123', 10);

    await queryInterface.bulkInsert('users', [
      {
        name: 'Admin Master',
        email: 'admin@yebox.com',
        password: adminPasswordHash,
        role: 'admin',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Cliente Exemplo',
        email: 'cliente@exemplo.com',
        password: clientPasswordHash,
        role: 'client',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Ana Costa',
        email: 'ana.costa@cliente.com',
        password: clientPasswordHash,
        role: 'client',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Pedro Oliveira',
        email: 'pedro@cliente.com',
        password: clientPasswordHash,
        role: 'client',
        isActive: false, // Cliente inativo para teste
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Maria Silva',
        email: 'maria@cliente.com',
        password: clientPasswordHash,
        role: 'client',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};