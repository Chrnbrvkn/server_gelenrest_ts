import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  BelongsToMany,
} from "sequelize-typescript";
import { UserRoles } from "./UserRoles";
import { Users } from "./Users";

@Table({
  timestamps: true,
  tableName: "roles",
  modelName: "Roles",
})
export class Roles extends Model<Roles> {
  @BelongsToMany(() => Users, () => UserRoles)
  declare users: Users[];

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
  })
  declare value: string;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}
