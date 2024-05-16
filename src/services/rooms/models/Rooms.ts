import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  BelongsTo,
  ForeignKey,
} from "sequelize-typescript";
import { Houses } from "../../houses/models/Houses";

@Table({
  timestamps: true,
  tableName: "rooms",
  modelName: "Room",
  paranoid: true,
})
export class Rooms extends Model {
  @BelongsTo(() => Houses)
  declare house: Houses;

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
    type: DataType.DOUBLE,
    allowNull: false,
  })
  declare price: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare roomCount: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare bedCount: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare bedroom?: string;

  @Column({
    type: DataType.ENUM("в номере", "на этаже"),
    allowNull: false,
  })
  declare bathroom: "в номере" | "на этаже";

  @Column({
    type: DataType.ENUM("ванна", "душ"),
    allowNull: false,
  })
  declare bathType: "ванна" | "душ";

  @Column({
    type: DataType.ENUM("в номере", "отдельно"),
    allowNull: false,
  })
  declare meal: "в номере" | "отдельно";

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare facilities?: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  declare robotCleaner?: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  declare yandexColumn: boolean;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare level: number;

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
