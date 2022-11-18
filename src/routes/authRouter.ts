import { Router } from "express";
import { check } from "express-validator";
import { authController } from "../controllers/authController";
import { authMiddleware } from "../middlewares/authMiddleware";

export const authRouter = Router();

authRouter.post(
  "/registration",
  [
    check("email").isEmail(),
    check("password")
      .isLength({ min: 4, max: 32 })
      .withMessage(
        "Password must contain at least 4 chars and cannot be longer than 32"
      ),
  ],
  authController.registration
);
authRouter.post("/login", authController.login);
authRouter.post("/logout", authController.logout);
authRouter.get("/refresh", authController.refresh);
authRouter.get("/", authMiddleware, authController.getAll);
authRouter.delete("/", authMiddleware, authController.delete);
