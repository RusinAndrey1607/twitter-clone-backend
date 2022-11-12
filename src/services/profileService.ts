import { tweetService } from "./tweetService";
import { ApiError } from "../exceptions/apiErrors";
import {
  Profile,
  ProfileAttributes,
  ProfileCreationAttributes,
} from "../models/profile.model";
import { deleteFile } from "../utils/deleteUtil";

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
      throw ApiError.BadRequest(`Profile already created`);
    }

    const isUsernameUsed = await Profile.findOne({
      where: {
        username: profile.username,
      },
    });

    if (isUsernameUsed) {
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

  async follow(subscriberId: number, userId: number) {
    const subscriber = await Profile.findOne({
      where: {
        userId: subscriberId,
      },
    });

    if (!subscriber) {
      throw ApiError.BadRequest(`User with ${subscriberId} not found`);
    }

    if (!subscriber.subscribtions?.includes(userId)) {
      //@ts-ignore
      subscriber.subscribtions = [...subscriber.subscribtions, userId];
      await subscriber?.save({
        fields: ["subscribtions"],
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

    if (!user.subscribers?.includes(subscriberId)) {
      user.subscribers = [...user.subscribers, subscriberId];
      await user.save({
        fields: ["subscribers"],
      });
    }

    return;
  }

  async unfollow(subscriberId: number, userId: number) {
    const subscriber = await Profile.findOne({
      where: {
        userId: subscriberId,
      },
    });

    if (!subscriber) {
      throw ApiError.BadRequest(`User with ${subscriberId} not found`);
    }

    subscriber.subscribtions = subscriber.subscribtions?.filter(
      (item) => item !== userId
    );
    await subscriber?.save();

    const user = await Profile.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw ApiError.BadRequest(`User with ${userId} not found`);
    }

    user.subscribers = user?.subscribers?.filter(
      (item) => item !== subscriberId
    );
    await user?.save();

    return;
  }

  async like(tweetId: number, userId: number) {
    const user = await Profile.findOne({
      where: {
        userId: userId,
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
        userId: userId,
      },
    });
    await tweetService.unlike(tweetId, userId);

    if (user?.likes) {
      user.likes = user.likes.filter((item) => item !== tweetId);
    }
    await user?.save();
    return;
  }
  async getAll() {
    const profiles = await Profile.findAll();

    return profiles;
  }
}

export const profileService = new ProfileService();
