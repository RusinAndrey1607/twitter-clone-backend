import { sequelize } from "./../db/sequelize";
import { ApiError } from "./../exceptions/apiErrors";
import { TweetAttributes } from "./../models/tweet.model";
import { TweetCreationAttributes, Tweet } from "../models/tweet.model";
import { deleteFile } from "../utils/deleteUtil";
class TweetService {
  async addTweet(tweetBody: TweetCreationAttributes): Promise<Tweet> {
    const tweet = await Tweet.create({ ...tweetBody });
    return tweet;
  }
  async updateTweet(
    tweetBody: TweetAttributes,
    authorId: number
  ): Promise<Tweet> {
    const oldTweet = await Tweet.findByPk(tweetBody.id);

    if (oldTweet?.author !== authorId) {
      throw ApiError.BadRequest(
        "You are not allowed to edit this tweet because you are not the author"
      );
    }
    if (tweetBody.image && oldTweet?.image) {
      await deleteFile(oldTweet.image);
    }
    const updatedTweet = await Tweet.update(
      {
        ...tweetBody,
      },
      {
        where: {
          id: tweetBody.id,
        },
        returning: true,
      }
    );
    return updatedTweet[1][0];
  }
  async getTweets(limit: number = 20, offset: number = 0) {
    const tweets = await sequelize.query(
      `SELECT t.id, t.text,t."hashTags",t."createdAt", t.image,t.author as author_id, t.likes, t.reply, p.name as author ,p.username as author_username, p.avatar FROM tweet as t  JOIN profile as p ON p.id = t.author ORDER BY t.id DESC LIMIT ${
        limit || 20
      } OFFSET ${offset || 0} ;`
    );
    const count = await Tweet.count();
    return { tweets: tweets[0], count };
  }
  async like(tweetId: number, profileId: number) {
    const tweet = await Tweet.findByPk(tweetId);
    if (tweet?.likes && !tweet.likes.includes(profileId)) {
      tweet.likes = [...tweet.likes, profileId];
    }
    await tweet?.save();

    return tweet;
  }
  async unlike(tweetId: number, profileId: number) {
    const tweet = await Tweet.findByPk(tweetId);

    if (tweet?.likes) {
      tweet.likes = tweet.likes.filter((item) => item !== profileId);
    }
    await tweet?.save();

    return tweet;
  }
  async delete(tweetId: number, userId: number) {
    const tweet = await Tweet.findByPk(tweetId);

    if (tweet?.author == userId) {
      tweet.image && (await deleteFile(tweet.image));
      await tweet?.destroy();
    } else {
      throw ApiError.BadRequest(
        `You are not allowed to delete this tweet because you are not author`
      );
    }

    return tweet;
  }
  async getOne(id: number) {
    const tweet = await Tweet.findByPk(id);
    if (!tweet) {
      throw ApiError.BadRequest(`Tweet with id ${id} not found`);
    }
    return tweet;
  }
}

export const tweetService = new TweetService();
