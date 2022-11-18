import { sequelize } from "../db/sequelize";
import { ApiError } from "../exceptions/apiErrors";
import { Comment, CommentCreationAttributes } from "../models/comment.model";
import { deleteFile } from "../utils/deleteUtil";

class CommentService {
  async addComment(commentBody: CommentCreationAttributes) {
    const comment = await Comment.create({
      ...commentBody,
    });
    return comment;
  }
  async getCommentsByTweetId(
    tweetId: number,
    limit: number = 10,
    offset: number = 0
  ) {
    console.log(tweetId);

    const comments = await sequelize.query(`SELECT c.text, c.image,c.likes, c."createdAt", p.name as author ,p.username as author_username, p.avatar FROM comment c JOIN profile p ON c.author = p.id LIMIT ${limit ||10} OFFSET ${offset || 0};`)

    return comments[0];
  }
  async deleteComment(commentId: number, userId: number) {
    const comment = await Comment.findByPk(commentId);


    if (comment?.author == userId) {
      comment.image && (await deleteFile(comment.image));
      await comment?.destroy();
    } else {
      throw ApiError.BadRequest(
        `You are not allowed to delete this commnet because you are not author`
      );
    }

    return comment;
  }

  async updateComment(commentBody: Comment, authorId: number) {
    const oldComment = await Comment.findByPk(commentBody.id);
    if (oldComment?.author !== authorId) {
      throw ApiError.BadRequest(
        "You are not allowed to edit this comment because you are not the author"
      );
    }
    if (oldComment.image && commentBody.image) {
      await deleteFile(oldComment.image);
    }
    const comment = await Comment.update(
      {
        ...commentBody,
      },
      {
        where: {
          id: commentBody.id,
        },
        returning: true,
      }
    );
    return comment[1][0];
  }

  async like(commentId: number, userId: number) {
    const comment = await Comment.findByPk(commentId);
    if (comment?.likes && !comment.likes.includes(userId)) {
      comment.likes = [...comment.likes, userId];
    }
    await comment?.save();

    return;
  }
  async unlike(commentId: number, userId: number) {
    const comment = await Comment.findByPk(commentId);
    if (comment?.likes) {
      comment.likes = comment.likes.filter((item) => item !== userId);
    }
    await comment?.save();

    return;
  }
}

export const commentService = new CommentService();
