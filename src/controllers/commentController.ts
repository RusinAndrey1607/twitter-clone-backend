import { commentService } from "./../services/commentService";
import { Request, Response } from "express";
import { profileService } from "../services/profileService";

class CommentController {
  async addCommnet(req: Request, res: Response, next: Function) {
    try {
      //@ts-ignore
      const { id } = req.user;
      const body = req.body;

      const profile = await profileService.getProfileById(id);

      const image = req.file?.filename;

      const comment = await commentService.addComment({
        ...body,
        author: profile.id,
        image,
      });
      return res.status(200).json(comment);
    } catch (error) {
      next(error);
    }
  }
  async getByTweet(req: Request, res: Response, next: Function) {
    try {
      const { id: tweetId } = req.params;
      const { limit, offset } = req.query;


      const comments = await commentService.getCommentsByTweetId(
        Number(tweetId),
        Number(limit),
        Number(offset)
      );
      return res.status(200).json(comments);
    } catch (error) {}
  }
  async delete(req: Request, res: Response, next: Function) {
    try {
      //@ts-ignore
      const { id: userId } = req.user;
      const { id: commentId } = req.params;


      const comment = await commentService.deleteComment(+commentId, +userId);
      return res.status(200).json(comment);
    } catch (error) {
      next(error);
    }
  }
  async updateComment(req: Request, res: Response, next: Function) {
    try {
      //@ts-ignore
      const { id: userId } = req.user;
      const body = req.body;
      //@ts-ignore
      const image = req.file?.filename;
      if (image) {
        body.image = image;
      }

      const comment = await commentService.updateComment(
        {
          ...body,
        },
        userId
      );
      return res.status(200).json(comment);
    } catch (error) {
      next(error);
    }
  }
  async like(req: Request, res: Response, next: Function) {
    try {
      //@ts-ignore
      const { id: userId } = req.user;
      const { id: commentId } = req.params;
      await commentService.like(+commentId, userId);
      return res.status(200).send("successful");
    } catch (error) {
      next(error);
    }
  }
  async unlike(req: Request, res: Response, next: Function) {
    try {
      //@ts-ignore
      const { id: userId } = req.user;
      const { id: commentId } = req.params;
      await commentService.unlike(+commentId, userId);
      return res.status(200).send("successful");
    } catch (error) {
      next(error);
    }
  }
}

export const commentController = new CommentController();
