import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { ApiError } from "../exceptions/apiErrors";
import { authService } from "../services/authService";
import { UserDto } from "../dtos/userDto";

class AuthController {
  async registration(req: Request, res: Response, next: Function) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest("Validation Failed", errors.array()));
      }

      const { email, password } = req.body;

      const userData = await authService.registration(email, password);

      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }
  async login(req: Request, res: Response, next: Function) {
    try {
      const { email, password } = req.body;
      const userData = await authService.login(email, password);

      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }
  async logout(req: Request, res: Response, next: Function) {
    try {
      const { refreshToken } = req.cookies;
      res.clearCookie("refreshToken");

      const token = await authService.logout(refreshToken);
      res.status(200).json(token);
    } catch (error) {
      next(error);
    }
  }
  async refresh(req: Request, res: Response, next: Function) {
    try {
      const { refreshToken } = req.cookies;

      const userData = await authService.refresh(refreshToken);

      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }
  async getAll(req: Request, res: Response, next: Function) {
    try {
      const users = await authService.getAll();
      return res.json(users);
    } catch (error) {
      next(error);
    }
  }
  async delete(req: Request, res: Response, next: Function) {
    try {
      // @ts-ignore
      const { id } = req.user;

      const user = await authService.delete(id);
      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
