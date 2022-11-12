import { tweetService } from "./../services/tweetService";
import { NextFunction, Request, Response } from "express";

class TweetController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const image = req.file?.filename;
      const body = req.body;

      //   @ts-ignore
      const { id } = req.user;

      if (body.hashTags) {
        body.hashTags = JSON.parse(body.hashTags);
      }
      const tweet = await tweetService.addTweet({
        ...body,
        image,
        author: id,
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
}

export const tweetController = new TweetController();
