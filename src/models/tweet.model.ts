import { Profile } from "./profile.model";
import { sequelize } from "./../db/sequelize";
import { DataTypes, Model } from "sequelize";
import { Comment } from "./comment.model";

export interface TweetAttributes extends TweetCreationAttributes {
  id: number;
  blocked: boolean;
  likes?: number[];
}

export interface TweetCreationAttributes {
  reply?: number;
  text: string;
  image?: string;
  author: number;
  hashTags?: string[];
}
export class Tweet extends Model<TweetAttributes, TweetCreationAttributes> {
  declare id: number;
  declare text: string;
  declare author: number;
  declare reply: number;
  declare blocked: boolean;
  declare image?: string;
  declare likes?: number[];
  declare comments?: number[];

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedA: Date;
}
Tweet.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    author: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "profile",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    text: { type: DataTypes.STRING, allowNull: false },
    hashTags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
    },
    image: { type: DataTypes.STRING, allowNull: true },
    reply: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "tweet",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    blocked: { type: DataTypes.BOOLEAN, defaultValue: false },
    likes: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: true,
      defaultValue: [],
    },
  },
  {
    sequelize,
    modelName: "tweet",
    freezeTableName: true,
  }
);

Tweet.hasMany(Comment, {
  foreignKey: "tweet",
  onDelete: "CASCADE",
});
Tweet.belongsTo(Profile);
