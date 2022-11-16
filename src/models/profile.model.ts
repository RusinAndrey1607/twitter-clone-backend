import { sequelize } from "./../db/sequelize";
import { DataTypes, Model } from "sequelize";
import { Tweet } from "./tweet.model";

export type ProfileCreationAttributes = {
  userId: number;
  name: string;
  bio?: string;
  username: string;
  avatar?: string;
  header?: string;
};
export interface ProfileAttributes extends ProfileCreationAttributes {
  id: number;
  subscribers?: number[];
  subscribtions?: number[];
  likes?: number[];
  savedTweets?: number[];
}

export class Profile extends Model<
  ProfileAttributes,
  ProfileCreationAttributes
> {
  declare id: number;
  declare userId: number;
  declare name: string;
  declare bio: string;
  declare username: string;
  declare avatar: string;
  declare header: string;

  //Foreign keys
  declare subscribers?: number[];
  declare subscribtions?: number[];
  declare likes?: number[];
  declare tweets?: number[];
  declare savedTweets?: number[];

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedA: Date;
}
Profile.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    avatar: { type: DataTypes.STRING, allowNull: true, defaultValue: "" },
    bio: { type: DataTypes.STRING, allowNull: true, defaultValue: "" },
    header: { type: DataTypes.STRING, allowNull: true, defaultValue: "" },
    likes: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: true,
      defaultValue: [],
    },
    savedTweets: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: true,
      defaultValue: [],
    },

    subscribers: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: true,
      defaultValue: [],
    },
    subscribtions: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: true,
      defaultValue: [],
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
      onDelete:"CASCADE"

    },
  },
  { sequelize, modelName: "profile", freezeTableName: true }
);

Profile.hasMany(Tweet, {
  foreignKey: "author",
  onDelete: "CASCADE",
});
