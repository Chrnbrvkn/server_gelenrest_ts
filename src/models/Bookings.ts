import { IBookings } from '../types/scheme_interfaces';
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
  tableName: 'bookings',
  modelName: 'Booking',
  paranoid: true
})
export class Bookings extends Model<IBookings>{

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
  declare checkInDate: string;
  
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  declare checkOutDate: string;

  @Column({
    type: DataType.ENUM('В ожидании', 'Отменён', 'Подтвеждён'),
    allowNull: false
  })
  declare status: 'В ожидании' | 'Отменён' | 'Подтвеждён';

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  declare guestName?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  declare guestContact: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  declare guestsCount: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true
  })
  declare roomId?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true
  })
  declare apartId?: number;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  declare address: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true
  })
  declare houseId?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  declare dailyRate: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  declare totalCost: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  declare totaldays: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true
  })
  declare childAge?: number;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  declare petBreed?: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true
  })
  declare petWeight?: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true
  })
  declare smoker?: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true
  })
  declare disabledAccess?: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true
  })
  declare economyAccomodation?: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true
  })
  declare maxServiceAccomodation?: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true
  })
  declare breakfastIncluded?: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true
  })
  declare toursIncluded?: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true
  })
  declare workInternet?: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true
  })
  declare transfer?: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  declare discounts?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  declare bonuses?: string;

  @CreatedAt
  declare createdAt: string;

  @UpdatedAt
  declare updatedAt: string;
  
}