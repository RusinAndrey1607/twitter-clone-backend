import { profileController } from "./../controllers/profileController";
import express, { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { upload } from "../libs/multer";
import formidable from "express-formidable";
export const profileRouter = Router();

profileRouter.post("/create", authMiddleware, profileController.createProfile);
profileRouter.get("/follow", authMiddleware, profileController.follow)
profileRouter.get("/unfollow", authMiddleware, profileController.unfollow)
profileRouter.put(
  "/update",
  [
    upload.fields([
      { name: "avatar", maxCount: 1 },
      { name: "header", maxCount: 1 },
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
