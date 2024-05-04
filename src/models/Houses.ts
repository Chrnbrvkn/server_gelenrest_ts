import { IHouses } from '../types/scheme_interfaces';

import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  HasMany,
} from 'sequelize-typescript';
import { HousesPictures } from './HousesPictures';
import { Rooms } from './Rooms';

@Table({
  timestamps: true,
  tableName: 'houses',
  modelName: 'House',
  paranoid: true,
})
export class Houses extends Model<IHouses> {
  
  @HasMany(() => HousesPictures, { onDelete: 'CASCADE' })
  declare housesPictures: HousesPictures[];

  @HasMany(() => Rooms, { onDelete: 'CASCADE' })
  declare housesRooms: Rooms[];
  
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare address: string;

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
    allowNull: false,
  })
  declare roomCount: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare roomCategories?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare meal?: string;

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
  declare allHouseBooking?: boolean;

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
