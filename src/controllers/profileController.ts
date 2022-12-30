import { ApiError } from "./../exceptions/apiErrors";
import { profileService } from "./../services/profileService";
import { Request, Response } from "express";

class ProfileController {
  async createProfile(req: Request, res: Response, next: Function) {
    try {
      const body = req.body;
      // @ts-ignore
      const avatar = req.files["avatar"];
      // @ts-ignore
      const header = req.files["header"];

      if (header) {
        body.header = header[0].filename;
      }
      if (avatar) {
        body.avatar = avatar[0].filename;
      }
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

  async checkUsername(req: Request, res: Response, next: Function) {
    try {
      const { username } = req.params;
      const profile = await profileService.getProfileByUsername(username);
      return res.status(200).json(true);
    } catch (error) {
      return res.status(200).json(false);
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
      const avatar = req.files["avatar"];
      // @ts-ignore
      const header = req.files["header"];

      if (header) {
        body.header = header[0].filename;
      }
      if (avatar) {
        body.avatar = avatar[0].filename;
      }

      const profile = await profileService.updateProfile({
        ...body,
        userId: id,
      });
      return res.status(200).json(profile);
    } catch (error) {
      next(error);
    }
  }

  async follow(req: Request, res: Response, next: Function) {
    try {
      const { accountId } = req.query;
      const { userId } = req.query;

      if (!accountId) {
        throw ApiError.BadRequest(
          `Incorect Request. You Must pass accountId as query parametr`
        );
      }
      if (!userId) {
        throw ApiError.BadRequest(
          `Incorect Request. You Must pass userId as query parametr`
        );
      }

      if (userId === accountId) {
        throw ApiError.BadRequest(
          `Incorect Request. userId must not be equal to accountId`
        );
      }
      await profileService.follow(+accountId, +userId);
      return res.status(200).send("successful");
    } catch (error) {
      next(error);
    }
  }

  async unfollow(req: Request, res: Response, next: Function) {
    try {
      const { accountId } = req.query;
      const { userId } = req.query;

      if (!accountId) {
        throw ApiError.BadRequest(
          `Incorect Request. You Must pass accountId as query parametr`
        );
      }
      if (!userId) {
        throw ApiError.BadRequest(
          `Incorect Request. You Must pass userId as query parametr`
        );
      }

      if (userId === accountId) {
        throw ApiError.BadRequest(
          `Incorect Request. userId must not be equal to accountId`
        );
      }
      await profileService.unfollow(+accountId, +userId);
      return res.status(200).send("successful");
    } catch (error) {
      next(error);
    }
  }
  async like(req: Request, res: Response, next: Function) {
    const { tweetId } = req.query;
    const { userId } = req.query;

    if (!tweetId) {
      throw ApiError.BadRequest(
        `Incorect Request. You Must pass tweetId as query parametr`
      );
    }
    await profileService.like(Number(tweetId), Number(userId));
    return res.status(200).send("successful");
  }
  async unlike(req: Request, res: Response, next: Function) {
    const { tweetId } = req.query;
    const { userId } = req.query;

    if (!tweetId) {
      throw ApiError.BadRequest(
        `Incorect Request. You Must pass tweetId as query parametr`
      );
    }
    await profileService.unlike(Number(tweetId), Number(userId));
    return res.status(200).send("successful");
  }
  async getByQuery(req: Request, res: Response, next: Function) {
    try {
      const { query } = req.query;
      const { limit } = req.query;
      const { offset } = req.query;
      //@ts-ignore
      const profiles = await profileService.getByQuery( query,
        Number(limit),
        Number(offset)
      );
      return res.json(profiles);
    } catch (error) {
      next(error);
    }
  }
  async delete(req: Request, res: Response, next: Function) {
    try {
      // @ts-ignore
      const { id: userId } = req.user;
      const profile = await profileService.deleteProfile(userId);
      return res.status(200).json(profile);
    } catch (error) {
      next(error);
    }
  }
}

export const profileController = new ProfileController();
