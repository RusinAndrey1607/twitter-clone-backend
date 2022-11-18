import { profileController } from "./../controllers/profileController";
import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { upload } from "../libs/multer";
import { check } from "express-validator";
import bodyParser from "body-parser";
export const profileRouter = Router();


profileRouter.post(
  "/create",
  [
    authMiddleware,
    check("name").notEmpty().withMessage("Name cannot be empty"),
    check("username").notEmpty().withMessage("Username cannot be empty"),
  ],
  profileController.createProfile
);
profileRouter.get("/follow", authMiddleware, profileController.follow);
profileRouter.get("/like", authMiddleware, profileController.like);
profileRouter.get("/unlike", authMiddleware, profileController.unlike);
profileRouter.get("/unfollow", authMiddleware, profileController.unfollow);
profileRouter.put(
  "/update",
  [
    authMiddleware,
    upload.fields([
      { name: "avatar", maxCount: 1 },
      { name: "header", maxCount: 1 },
    ]),
  ],
  profileController.updateProfile
);
profileRouter.get("/:username", authMiddleware, profileController.getProfile);
profileRouter.get("/", authMiddleware, profileController.getByQuery);
profileRouter.delete("/", authMiddleware, profileController.delete);
