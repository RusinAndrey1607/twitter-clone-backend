import { tweetService } from "./tweetService";
import { ApiError } from "../exceptions/apiErrors";
import {
  Profile,
  ProfileAttributes,
  ProfileCreationAttributes,
} from "../models/profile.model";
import { deleteFile } from "../utils/deleteUtil";
import { sequelize } from "../db/sequelize";

class ProfileService {
  async createProfile(
    profile: ProfileCreationAttributes
  ): Promise<ProfileAttributes> {
    const candidate = await Profile.findOne({
      where: {
        userId: profile.userId,
      },
    });
    if (candidate) {
      profile?.avatar && await deleteFile(profile.avatar)
      throw ApiError.BadRequest(`Profile already created`);
    }

    const isUsernameUsed = await Profile.findOne({
      where: {
        username: profile.username,
      },
    });

    if (isUsernameUsed) {
      profile?.avatar && await deleteFile(profile.avatar)

      throw ApiError.BadRequest(
        `Username ${profile.username} already used. Choose another one`
      );
    }

    const profileData = await Profile.create({ ...profile });

    return profileData;
  }

  async getProfileById(userId: number): Promise<ProfileAttributes> {
    const profile = await Profile.findOne({
      where: {
        userId,
      },
    });
    if (!profile) {
      throw ApiError.BadRequest(`Profile with id ${userId} not found`);
    }
    return profile;
  }
  async getProfileByUsername(username: string): Promise<ProfileAttributes> {
    const profile = await Profile.findOne({
      where: {
        username,
      },
    });
    if (!profile) {
      throw ApiError.BadRequest(`Profile with username ${username} not found`);
    }
    return profile;
  }

  async deleteProfile(userId: number) {
    const profile = await Profile.findOne({
      where: {
        userId,
      },
    });

    profile?.header && (await deleteFile(profile.header));
    profile?.avatar && (await deleteFile(profile.avatar));

    await profile?.destroy();

    return profile;
  }
  async updateProfile(profile: ProfileCreationAttributes) {
    const oldProfile = await Profile.findOne({
      where: {
        userId: profile.userId,
      },
    });

    //Delete  old avatar
    if (profile.avatar && oldProfile?.avatar) {
      await deleteFile(oldProfile.avatar);
    }
    if (profile.header && oldProfile?.header) {
      await deleteFile(oldProfile.header);
    }
    const profileData = await Profile.update(
      { ...profile },
      {
        where: {
          userId: profile.userId,
        },
        returning: true,
      }
    );

    return profileData[1][0];
  }

  async follow(accountId: number, userId: number) {
    const account = await Profile.findOne({
      where: {
        id: accountId,
      },
    });

    if (!account) {
      throw ApiError.BadRequest(`User with id ${accountId} not found`);
    }

    if (!account.subscribers?.includes(userId)) {
      //@ts-ignore
      account.subscribers = [...account.subscribers, userId];
      await account?.save({
        fields: ["subscribers"],
      });
    }

    const user = await Profile.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw ApiError.BadRequest(`User with ${userId} not found`);
    }

    if (!user.subscribtions?.includes(accountId)) {
      user.subscribtions = [...user.subscribtions, accountId];
      await user.save({
        fields: ["subscribtions"],
      });
    }

    return;
  }

  async unfollow(accountId: number, userId: number) {
    const account = await Profile.findOne({
      where: {
        id: accountId,
      },
    });

    if (!account) {
      throw ApiError.BadRequest(`User with id ${accountId} not found`);
    }

    if (account.subscribers?.includes(userId)) {
      //@ts-ignore
      account.subscribers = account.subscribers.filter(
        (item) => item != userId
      );
      await account.save();
    }

    const user = await Profile.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw ApiError.BadRequest(`User with ${userId} not found`);
    }

    if (user.subscribtions?.includes(accountId)) {
      user.subscribtions = user.subscribtions.filter(
        (item) => item != accountId
      );
      await user.save();
    }
    return;
  }

  async like(tweetId: number, userId: number) {
    const user = await Profile.findOne({
      where: {
        id: userId,
      },
    });
    await tweetService.like(tweetId, userId);

    if (user?.likes && !user.likes.includes(tweetId)) {
      user.likes = [...user.likes, tweetId];
    }
    await user?.save();
    return;
  }
  async unlike(tweetId: number, userId: number) {
    const user = await Profile.findOne({
      where: {
        id: userId,
      },
    });
    await tweetService.unlike(tweetId, userId);

    if (user?.likes) {
      user.likes = user.likes.filter((item) => item !== tweetId);
    }
    await user?.save();
    return;
  }
  async getByQuery(q: string = "", limit: number = 20, offset: number = 0) {
    const profileQuery = q.toLocaleLowerCase()
      ? q.toLocaleLowerCase() + "%"
      : "%";
    const profiles = await sequelize.query(
      `SELECT name,avatar,username, bio, id, header,"createdAt", cardinality(subscribers)  as subscribers  FROM profile WHERE LOWER(name)  LIKE '${profileQuery}' ORDER BY subscribers DESC LIMIT ${
        limit ? limit : 20
      } OFFSET ${offset ? offset : 0}`
    );

    return profiles[0];
  }
}

export const profileService = new ProfileService();
