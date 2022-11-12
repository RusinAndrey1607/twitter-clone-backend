import { TweetAttributes } from "./../models/tweet.model";
import { TweetCreationAttributes, Tweet } from "../models/tweet.model";

class TweetService {
  async addTweet(tweetBody: TweetCreationAttributes): Promise<Tweet> {
    const tweet = await Tweet.create({ ...tweetBody });
    return tweet;
  }
  async getTweets(limit?: number, offset?: number): Promise<Tweet[]> {
    const tweets = await Tweet.findAll({
      limit: limit || 10,
      offset: offset || 0,
      order:["createdAt","DESK"]
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
}

export const tweetService = new TweetService();
