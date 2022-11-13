import { profileController } from "./../controllers/profileController";
import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { upload } from "../libs/multer";
import { check } from "express-validator";
export const profileRouter = Router();

profileRouter.post(
  "/create",
  [check("name").notEmpty(), check("username").notEmpty(), authMiddleware],
  profileController.createProfile
);
profileRouter.get("/follow", authMiddleware, profileController.follow);
profileRouter.get("/like", authMiddleware, profileController.like);
profileRouter.get("/unlike", authMiddleware, profileController.unlike);
profileRouter.get("/unfollow", authMiddleware, profileController.unfollow);
profileRouter.put(
  "/update",
  [
    upload.fields([
      { name: "avatar", maxCount: 1 },
      { name: "header", maxCount: 1  },
    ]),
    authMiddleware,
  ],
  profileController.updateProfile
);
profileRouter.get("/:username", authMiddleware, profileController.getProfile);
// profileRouter.get("/", authMiddleware, profileController.getProfile);
profileRouter.delete(
  "/delete/:id",
  authMiddleware,
  profileController.deleteProfile
);
profileRouter.get("/", authMiddleware, profileController.getAll);
