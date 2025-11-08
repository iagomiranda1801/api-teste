import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Interface para os atributos do Client
interface ClientAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  phone?: string;
  document?: string; // CPF/CNPJ
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface para criação do Client
interface ClientCreationAttributes extends Optional<ClientAttributes, 'id' | 'createdAt' | 'updatedAt' | 'isActive' | 'phone' | 'document'> {}

// Classe do modelo Client
class Client extends Model<ClientAttributes, ClientCreationAttributes> implements ClientAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public phone?: string;
  public document?: string;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Método para verificar senha
  public async validatePassword(password: string): Promise<boolean> {
    const bcrypt = require('bcryptjs');
    return bcrypt.compare(password, this.password);
  }
}

// Definição do modelo
Client.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
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
      type: DataTypes.STRING(100),
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
      type: DataTypes.STRING(255),
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
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        len: {
          args: [10, 20],
          msg: 'Telefone deve ter entre 10 e 20 caracteres'
        }
      }
    },
    document: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        len: {
          args: [11, 20],
          msg: 'Documento deve ter entre 11 e 20 caracteres'
        }
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  },
  {
    sequelize,
    modelName: 'Client',
    tableName: 'clients',
    hooks: {
      beforeCreate: async (client: Client) => {
        if (client.password) {
          const bcrypt = require('bcryptjs');
          client.password = await bcrypt.hash(client.password, 10);
        }
      },
      beforeUpdate: async (client: Client) => {
        if (client.password && client.changed && client.changed('password')) {
          const bcrypt = require('bcryptjs');
          client.password = await bcrypt.hash(client.password, 10);
        }
      }
    }
  }
);

export default Client;