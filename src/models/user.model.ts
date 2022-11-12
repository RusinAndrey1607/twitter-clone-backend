import { Profile } from "./profile.model";
import { sequelize } from "./../db/sequelize";
import { DataTypes, Model, Optional } from "sequelize";
// import { Comment } from "./comment.model";

interface UserAttributes extends UserCreationAttributes {
  id: number;
  blocked: boolean;
}

interface UserCreationAttributes {
  password: string;
  email: string;
}

export class User extends Model<UserAttributes, UserCreationAttributes> {
  declare id: number;
  declare password: string;
  declare email: string;
  declare blocked: boolean;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedA: Date;
}
User.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    blocked: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  { sequelize, modelName: "users", freezeTableName: true }
);

User.hasOne(Profile, {
  foreignKey: "userId",
});
