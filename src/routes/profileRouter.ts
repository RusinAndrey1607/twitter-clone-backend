import { profileController } from "./../controllers/profileController";
import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { upload } from "../libs/multer";
export const profileRouter = Router();


profileRouter.post(
  "/create",
  [
    authMiddleware,
    
    // upload.single("avatar")
    upload.fields([
      { name: "avatar", maxCount: 1 },
      { name: "header", maxCount: 1 },
    ]),
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
profileRouter.get("/", authMiddleware, profileController.getProfile);
profileRouter.get("/paths", profileController.getUsernames);
profileRouter.get("/:username", profileController.getProfileByUserName);
profileRouter.get("/check/:username", profileController.checkUsername);
profileRouter.get("/", authMiddleware, profileController.getByQuery);
profileRouter.delete("/", authMiddleware, profileController.delete);
