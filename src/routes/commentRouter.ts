import { commentController } from "./../controllers/commentController";
import { upload } from "./../libs/multer";
import { authMiddleware } from "./../middlewares/authMiddleware";
import { Router } from "express";

export const commentRouter = Router();

commentRouter.post(
  "/add",
  [authMiddleware, upload.single("image")],
  commentController.addCommnet
);
commentRouter.put(
  "/update",
  [authMiddleware, upload.single("image")],
  commentController.updateComment
);
commentRouter.get("/like/:id", authMiddleware, commentController.like);
commentRouter.get("/unlike/:id", authMiddleware, commentController.unlike);
commentRouter.get("/:id", commentController.getByTweet);
commentRouter.delete("/:id", authMiddleware, commentController.delete);
