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
      console.log(username,"user");

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
}

export const profileController = new ProfileController();
