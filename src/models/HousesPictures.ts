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
import { Houses } from './Houses';

@Table({
  timestamps: true,
  tableName: 'housePictures',
  modelName: 'HousesPictures',
  paranoid: true,
})
export class HousesPictures extends Model  {

  
  @BelongsTo(() => Houses)
  declare house: Houses;
  
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

  @ForeignKey(() => Houses)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare houseId: number;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;

}
