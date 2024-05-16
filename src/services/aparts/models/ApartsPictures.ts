// import { IApartsPictures } from '../types/scheme_interfaces';
import { Aparts } from './Aparts';
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

@Table({
  timestamps: true,
  tableName: 'apartPictures',
  modelName: 'ApartsPictures',
  paranoid: true,
})
export class ApartsPictures extends Model  {

  @BelongsTo(() => Aparts)
  declare apart: Aparts;

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

  @ForeignKey(() => Aparts)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare apartId: number;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;

}
