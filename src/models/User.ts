import bcrypt from 'bcryptjs';
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Interface para os atributos do User
interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'client';
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface para criação do User (sem id, createdAt, updatedAt)
interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt' | 'isActive'> {}

// Classe do modelo User
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public role!: 'admin' | 'client';
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Método para verificar senha
  public async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  // Método para hash da senha
  public async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}

// Definição do modelo
User.init(
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
    role: {
      type: DataTypes.ENUM('admin', 'client'),
      allowNull: false,
      defaultValue: 'client',
      validate: {
        isIn: {
          args: [['admin', 'client']],
          msg: 'Role deve ser admin ou client'
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
    modelName: 'User',
    tableName: 'users',
    hooks: {
      beforeCreate: async (user: User) => {
        if (user.password) {
          user.password = await user.hashPassword(user.password);
        }
      },
      beforeUpdate: async (user: User) => {
        if (user.changed('password')) {
          user.password = await user.hashPassword(user.password);
        }
      }
    }
  }
);

export default User;