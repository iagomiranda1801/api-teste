import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Enum para tipos de assinatura
export enum SubscriptionType {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  SEMESTER = 'semester',
  ANNUAL = 'annual'
}

// Enum para status da assinatura
export enum SubscriptionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired'
}

// Interface para os atributos da Subscription
interface SubscriptionAttributes {
  id: number;
  clientId: number;
  type: SubscriptionType;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date;
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface para criação da Subscription
interface SubscriptionCreationAttributes extends Optional<SubscriptionAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

// Classe do modelo Subscription
class Subscription extends Model<SubscriptionAttributes, SubscriptionCreationAttributes> implements SubscriptionAttributes {
  public id!: number;
  public clientId!: number;
  public type!: SubscriptionType;
  public status!: SubscriptionStatus;
  public startDate!: Date;
  public endDate!: Date;
  public price!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Método para verificar se a assinatura está ativa
  public isActiveSubscription(): boolean {
    const now = new Date();
    return this.status === SubscriptionStatus.ACTIVE && 
           this.startDate <= now && 
           this.endDate >= now;
  }

  // Método para calcular dias restantes
  public daysRemaining(): number {
    const now = new Date();
    const diff = this.endDate.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }
}

// Definição do modelo
Subscription.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    type: {
      type: DataTypes.ENUM(...Object.values(SubscriptionType)),
      allowNull: false,
      validate: {
        isIn: {
          args: [Object.values(SubscriptionType)],
          msg: 'Tipo de assinatura inválido'
        }
      }
    },
    status: {
      type: DataTypes.ENUM(...Object.values(SubscriptionStatus)),
      allowNull: false,
      defaultValue: SubscriptionStatus.ACTIVE,
      validate: {
        isIn: {
          args: [Object.values(SubscriptionStatus)],
          msg: 'Status de assinatura inválido'
        }
      }
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isAfterStartDate(value: Date) {
          if (value <= this.startDate) {
            throw new Error('Data de fim deve ser posterior à data de início');
          }
        }
      }
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: 'Preço deve ser maior que zero'
        }
      }
    }
  },
  {
    sequelize,
    modelName: 'Subscription',
    tableName: 'subscriptions',
    hooks: {
      beforeCreate: async (subscription: Subscription) => {
        // Calcular data de fim baseada no tipo
        const start = new Date(subscription.startDate);
        const end = new Date(start);
        
        switch (subscription.type) {
          case SubscriptionType.MONTHLY:
            end.setMonth(end.getMonth() + 1);
            break;
          case SubscriptionType.QUARTERLY:
            end.setMonth(end.getMonth() + 3);
            break;
          case SubscriptionType.SEMESTER:
            end.setMonth(end.getMonth() + 6);
            break;
          case SubscriptionType.ANNUAL:
            end.setFullYear(end.getFullYear() + 1);
            break;
        }
        
        subscription.endDate = end;
      }
    }
  }
);

export default Subscription;