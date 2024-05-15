import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Rooms } from './Rooms';

@Table({
  timestamps: true,
  tableName: 'roomPictures',
  modelName: 'RoomPictures',
  paranoid: true,
})
export class RoomsPictures extends Model {

  @BelongsTo(() => Rooms)
  declare room: Rooms;
  
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare url: string;

  @ForeignKey(() => Rooms)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare roomId: number;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}
