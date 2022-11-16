import { Tweet } from "./tweet.model";
import { sequelize } from "./../db/sequelize";
import { DataTypes, Model } from "sequelize";

export interface CommentCreationAttributes {
  text: string;
  image?: string;
  author: number;
  tweet: number;
}
export interface CommentAttributes extends CommentCreationAttributes {
  id: number;
  likes?: number[];
}

export class Comment extends Model<
  CommentAttributes,
  CommentCreationAttributes
> {
  declare id: number;
  declare text: string;
  declare author: number;
  declare image?: string;
  declare likes?: number[];
  declare tweet: number;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedA: Date;
}
Comment.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    text: { type: DataTypes.STRING, allowNull: false },
    image: { type: DataTypes.STRING, allowNull: true },
    author: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    likes: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: true,
      defaultValue: [],
    },
    tweet: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Tweet,
        key: "id",
      },
    },
  },
  { sequelize, modelName: "comment", freezeTableName: true }
);
