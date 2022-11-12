import { authMiddleware } from "./../middlewares/authMiddleware";
import { tweetController } from "./../controllers/tweetController";
import { Router } from "express";
import { upload } from "../libs/multer";

export const tweetRouter = Router();

tweetRouter.get("/", authMiddleware, tweetController.getAll);
tweetRouter.post(
  "/add",
  [upload.single("image"), authMiddleware],
  tweetController.create
);
