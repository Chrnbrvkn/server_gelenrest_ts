import { IAparts } from '../types/scheme_interfaces';
import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';

@Table({
  timestamps: true,
  tableName: 'aparts',
  modelName: 'Apart',
  paranoid: true,
})
export class Aparts extends Model<IAparts> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  declare name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  declare address: string;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false
  })
  declare price: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare description_1?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare description_2?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare description_3?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare description_4?: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  declare bedCount: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  declare roomCount: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare roomCategories?: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  declare level: number;

  @Column({
    type: DataType.ENUM('в номере', 'отдельно'),
    allowNull: false
  })
  declare meal: 'в номере' | 'отдельно';

  @Column({
    type: DataType.ENUM('в номере', 'на этаже'),
    allowNull: false
  })
  declare bathroom: 'в номере' | 'на этаже';

  @Column({
    type: DataType.ENUM('ванна', 'душ'),
    allowNull: false
  })
  declare bathType: 'ванна' | 'душ';

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare bookingConditions?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare checkoutTime?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare timeToSea?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare timeToMarket?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare timeToCafe?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare timeToBusStop?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare timeToBusCityCenter?: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  declare internet?: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  declare robotCleaner?: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  declare yandexColumn?: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  declare tv?: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  declare pool?: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  declare babyCot?: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  declare yard?: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  declare dishwasher?: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  declare washingMachine?: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  declare diningArea?: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  declare freeParking?: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  declare roomCleaning?: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  declare beddingChange?: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  declare sharedKitchen?: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  declare iron?: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  declare bbqGrill?: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  declare refrigerator?: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  declare transferService?: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  declare laundryService?: boolean;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}
