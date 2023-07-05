import { authMiddleware } from "./../middlewares/authMiddleware";
import { tweetController } from "./../controllers/tweetController";
import { Router } from "express";
import { upload } from "../libs/multer";

export const tweetRouter = Router();

tweetRouter.get("/", authMiddleware, tweetController.getAll);
tweetRouter.post(
  "/add",
  [authMiddleware, upload.single("image")],
  tweetController.create
);
tweetRouter.put(
  "/update",
  [authMiddleware, upload.single("image")],
  tweetController.update
);
tweetRouter.delete("/:id", [authMiddleware], tweetController.delete);
tweetRouter.get("/:id", [authMiddleware], tweetController.getOne);
