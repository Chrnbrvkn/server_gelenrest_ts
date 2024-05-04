// import sequelize from '../db';
import { IUsers } from '../types/scheme_interfaces';
import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  BelongsToMany,
} from 'sequelize-typescript';
import { UserRoles } from './UserRoles';
import { Roles } from './Roles';


@Table({
  timestamps: true,
  tableName: 'users',
  modelName: 'Users',
  paranoid: true,
})
export class Users extends Model<IUsers> {

  @BelongsToMany(() => Roles, () => UserRoles)
  declare roles: Roles[];

  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      notEmpty: true,
    },
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password: string;

  @Column({
    type: DataType.STRING,
  })
  declare name: string;

  @Column({
    type: DataType.STRING,
  })
  declare surname: string;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}

export default Users;
