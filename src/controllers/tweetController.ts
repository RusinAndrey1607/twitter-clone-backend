import { profileService } from "./../services/profileService";
import { tweetService } from "./../services/tweetService";
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { ApiError } from "../exceptions/apiErrors";

class TweetController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const image = req.file?.filename;
      const body = req.body;

      //   @ts-ignore
      const { id } = req.user;
      const profile = await profileService.getProfileById(id);

      if (body.hashTags && typeof body.hashTags === "string") {
        body.hashTags = JSON.parse(body.hashTags);
      }
      const tweet = await tweetService.addTweet({
        ...body,
        image,
        author: profile.id,
      });

      return res.status(200).json(tweet);
    } catch (error) {
      next(error);
    }
  }
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { limit, offset } = req.query;
      const tweets = await tweetService.getTweets(
        Number(limit),
        Number(offset)
      );
      return res.status(200).json(tweets);
    } catch (error) {
      next(error);
    }
  }
  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const tweet = await tweetService.getOne(+id);
      return res.status(200).json(tweet);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: Function) {
    try {
      const body = req.body;
      // @ts-ignore
      const { id } = req.user;
      const profile = await profileService.getProfileById(id);

      const image = req.file?.filename;

      if (image) {
        body.image = image;
      }
      const tweet = await tweetService.updateTweet(
        {
          ...body,
        },
        profile.id
      );
      return res.status(200).json(tweet);
    } catch (error) {
      next(error);
    }
  }
  async delete(req: Request, res: Response, next: Function) {
    try {
      const { id } = req.params;

      // @ts-ignore
      const { id: authorId } = req.user;
      const tweet = await tweetService.delete(+id, authorId);
      return res.status(200).json(tweet);
    } catch (error) {
      next(error);
    }
  }
}

export const tweetController = new TweetController();
