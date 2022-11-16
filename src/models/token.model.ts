import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../db/sequelize";
import { User } from "./user.model";

type TokenAttributes = {
  id: number;
  refreshToken: string;
  user: number;
};
type TokenCreationAttributes = Optional<TokenAttributes, "id">;

export class Token extends Model<TokenAttributes, TokenCreationAttributes> {
  declare id: number;
  declare refreshToken: string;
  declare user: number;
}

Token.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    refreshToken: { type: DataTypes.STRING, allowNull: false },
    user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete:"CASCADE"
    },
  },
  {
    sequelize,
    modelName: "token",
    freezeTableName: true
  }
);
