import { sequelize } from "./../db/sequelize";
import { DataTypes, Model } from "sequelize";

interface CommentsAttributes {
  id: number;
  text: string;
  image?: string;
  author: number;
  likes?: number[];
}

export class Comment extends Model<CommentsAttributes, CommentsAttributes> {
  declare id: number;
  declare text: string;
  declare author: number;
  declare image?: number;
  declare likes?: number[];

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedA: Date;
}
Comment.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    text: { type: DataTypes.STRING, allowNull: false },
    image: { type: DataTypes.STRING, allowNull: false },
    author: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "user",
        key: "id",
      },
    },
    likes: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: true,
      defaultValue: [],
    },
  },
  { sequelize, modelName: "comment", freezeTableName: true }
);
