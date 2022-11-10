import { profileController } from "./../controllers/profileController";
import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";

export const profileRouter = Router();

profileRouter.post("/create", authMiddleware, profileController.createProfile);
profileRouter.get("/:username", authMiddleware, profileController.getProfile);
profileRouter.get("/", authMiddleware, profileController.getProfile);
profileRouter.put("/:id", authMiddleware, profileController.updateProfile);
profileRouter.delete(
  "/delete/:id",
  authMiddleware,
  profileController.deleteProfile
);
