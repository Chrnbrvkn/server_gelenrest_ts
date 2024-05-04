// import sequelize from '../db';
import { Users } from './Users';
import { Roles } from './Roles';
import { IUserRoles } from '../types/scheme_interfaces';
import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
} from 'sequelize-typescript';

@Table({
  timestamps: true,
  tableName: 'userRoles',
  modelName: 'userRoles',
})
export class UserRoles extends Model<IUserRoles> {

  @ForeignKey(() => Users)
  @Column({
    type: DataType.INTEGER,
    references: {
      model: Users,
      key: 'id',
    },  
  })
  declare userId: number;

  @ForeignKey(() => Roles)
  @Column({
    type: DataType.INTEGER,
    references: {
      model: Roles,
      key: 'id',
    },
  })
  declare roleId: number;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}
