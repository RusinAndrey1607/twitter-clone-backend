import { ApiError } from "./../exceptions/apiErrors";
import { profileService } from "./../services/profileService";
import { Request, Response } from "express";

class ProfileController {
  async createProfile(req: Request, res: Response, next: Function) {
    try {
      const body = req.body;
      // @ts-ignore
      const { id } = req.user;
      const profile = await profileService.createProfile({
        ...body,
        userId: id,
      });
      return res.status(200).json(profile);
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req: Request, res: Response, next: Function) {
    try {
      const { username } = req.params;
      // @ts-ignore
      const { id } = req.user;

      if (!username) {
        const profile = await profileService.getProfileById(id);
        return res.status(200).json(profile);
      }

      const profile = await profileService.getProfileByUsername(username);
      return res.status(200).json(profile);
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: Request, res: Response, next: Function) {
    try {
      const body = req.body;
      // @ts-ignore
      const { id } = req.user;
      // @ts-ignore
      const avatar = req.files["avatar"][0];

      // @ts-ignore
      const header = req.files["header"][0];

      const profile = await profileService.updateProfile({
        ...body,
        userId: id,
        header: header.filename,
        avatar: avatar.filename,
      });
      return res.status(200).json(profile);
    } catch (error) {
      next(error);
    }
  }

  async deleteProfile(req: Request, res: Response, next: Function) {
    try {
    } catch (error) {
      next(error);
    }
  }

  async follow(req: Request, res: Response, next: Function) {
    try {
      const { subscriberId } = req.query;
      // @ts-ignore
      const { id: userId } = req.user;

      if (!subscriberId) {
        throw ApiError.BadRequest(
          `Incorect Request. You Must pass ubscriberId as query parametr`
        );
      }

      if (userId === subscriberId) {
        throw ApiError.BadRequest(
          `Incorect Request. userId must not be equal to subscriberId`
        );
      }
      await profileService.follow(+subscriberId, +userId);
      return res.status(200).send();
    } catch (error) {
      next(error);
    }
  }

  async unfollow(req: Request, res: Response, next: Function) {
    try {
      const { subscriberId } = req.query;
      // @ts-ignore
      const { id: userId } = req.user;

      if (!subscriberId) {
        throw ApiError.BadRequest(
          `Incorect Request. You Must pass ubscriberId as query parametr`
        );
      }

      if (userId === subscriberId) {
        throw ApiError.BadRequest(
          `Incorect Request. userId must not be equal to subscriberId`
        );
      }
      await profileService.unfollow(+subscriberId, +userId);
      return res.status(200).send();
    } catch (error) {
      next(error);
    }
  }
  async like(req: Request, res: Response, next: Function) {
    const { tweetId } = req.query;
    // @ts-ignore
    const { id: userId } = req.user;

    if (!tweetId) {
      throw ApiError.BadRequest(
        `Incorect Request. You Must pass tweetId as query parametr`
      );
    }
    await profileService.like(Number(tweetId), Number(userId));
    return res.status(200).send();
  }
  async unlike(req: Request, res: Response, next: Function) {
    const { tweetId } = req.query;
    // @ts-ignore
    const { id: userId } = req.user;

    if (!tweetId) {
      throw ApiError.BadRequest(
        `Incorect Request. You Must pass tweetId as query parametr`
      );
    }
    await profileService.unlike(Number(tweetId), Number(userId));
    return res.status(200).send();
  }
  async getAll(req: Request, res: Response, next: Function) {
    try {
      const profiles = await profileService.getAll();
      return res.json(profiles);
    } catch (error) {
      next(error);
    }
  }
}

export const profileController = new ProfileController();
