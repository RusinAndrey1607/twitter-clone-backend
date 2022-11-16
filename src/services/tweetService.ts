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
  async getTweets(limit?: number, offset?: number): Promise<Tweet[]> {
    const tweets = await Tweet.findAll({
      limit: limit || 10,
      offset: offset || 0,
      order: [["createdAt", "DESC"]],
    });
    return tweets;
  }
  async like(tweetId: number, userId: number) {
    const tweet = await Tweet.findByPk(tweetId);
    if (tweet?.likes && !tweet.likes.includes(userId)) {
      tweet.likes = [...tweet.likes, userId];
    }
    await tweet?.save();

    return;
  }
  async unlike(tweetId: number, userId: number) {
    const tweet = await Tweet.findByPk(tweetId);

    if (tweet?.likes) {
      tweet.likes = tweet.likes.filter((item) => item !== userId);
    }
    await tweet?.save();

    return;
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
  async getOne(tweetId: number) {
    const tweet = await Tweet.findByPk(tweetId);
    return tweet;
  }
}

export const tweetService = new TweetService();
