import { ApiError } from "../exceptions/apiErrors";
import { User } from "../models/user.model";
import bcrypt from "bcrypt";
import { tokenService } from "./tokenService";
import { UserDto } from "../dtos/userDto";

class AuthService {
  async registration(email: string, password: string) {
    const candidate = await User.findOne({ where: { email } });

    if (candidate) {
      throw ApiError.BadRequest(`User with ${email} already exists`);
    }

    const hashPassword = await bcrypt.hash(password, 6);
    const user = await User.create({ email, password: hashPassword });

    const userDto = new UserDto(user);
    const tokens = await tokenService.generateTokens({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  }
  async login(email: string, password: string) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw ApiError.BadRequest(`User with email ${email} not found`);
    }
    const passwordEqual = await bcrypt.compare(password, user.password);

    if (!passwordEqual) {
      throw ApiError.BadRequest(`Incorect password`);
    }

    const userDto = new UserDto(user);
    const tokens = await tokenService.generateTokens({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return {
      ...tokens,
      user: userDto,
    };
  }

  async logout(refreshToken: string) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData: any = await tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);

    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }

    const user = await User.findOne({
      where: {
        id: userData.id,
      },
    });
    if (!user) {
      throw ApiError.BadRequest("User was deleted");
    }
    const userDto = new UserDto(user);
    const tokens = await tokenService.generateTokens({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return {
      ...tokens,
      user: userDto,
    };
  }

  async getAll() {
    try {
      const users = await User.findAll();
      return users;
    } catch (error) {
      return error;
    }
  }

  async delete(userId: number) {
    const user = await User.findByPk(userId);
    await user?.destroy();
    return user;
  }
}

export const authService = new AuthService();
