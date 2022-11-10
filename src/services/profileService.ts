import { ApiError } from "../exceptions/apiErrors";
import {
  Profile,
  ProfileAttributes,
  ProfileCreationAttributes,
} from "../models/profile.model";

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
}

export const profileService = new ProfileService();
