'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Nome é obrigatório'
          },
          len: {
            args: [2, 100],
            msg: 'Nome deve ter entre 2 e 100 caracteres'
          }
        }
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: {
            msg: 'Email deve ter um formato válido'
          },
          notEmpty: {
            msg: 'Email é obrigatório'
          }
        }
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Senha é obrigatória'
          },
          len: {
            args: [6, 255],
            msg: 'Senha deve ter pelo menos 6 caracteres'
          }
        }
      },
      role: {
        type: Sequelize.ENUM('admin', 'client'),
        allowNull: false,
        defaultValue: 'client',
        comment: 'Tipo do usuário: admin (administrador), client (cliente)'
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Indica se o usuário está ativo no sistema'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Adicionar índices para melhor performance
    await queryInterface.addIndex('users', ['email'], {
      unique: true,
      name: 'unique_users_email'
    });

    await queryInterface.addIndex('users', ['role'], {
      name: 'idx_users_role'
    });

    await queryInterface.addIndex('users', ['isActive'], {
      name: 'idx_users_isActive'
    });

    // Criar usuário admin padrão (senha: admin123)
    await queryInterface.bulkInsert('users', [
      {
        name: 'Administrador',
        email: 'admin@example.com',
        password: '$2a$10$fVBGwXGJ3muDhMvXcpiPae.otoHND3sVV51qMCRXFiI.DO0i4LZp.', // admin123
        role: 'admin',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    // Remover índices
    await queryInterface.removeIndex('users', 'unique_users_email');
    await queryInterface.removeIndex('users', 'idx_users_role');
    await queryInterface.removeIndex('users', 'idx_users_isActive');
    
    // Remover tabela
    await queryInterface.dropTable('users');
  }
};