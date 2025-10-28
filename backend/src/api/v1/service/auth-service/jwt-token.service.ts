import jwt from "jsonwebtoken";
import { env } from "../../config";
import Logger from "../../config/logger";
import type { UserPayloadPrivate } from "./auth.types";

class AuthTokenService {
  private static instance: AuthTokenService;
  private constructor() {}
  public static getInstance(): AuthTokenService {
    if (!AuthTokenService.instance) {
      AuthTokenService.instance = new AuthTokenService();
    }
    return AuthTokenService.instance;
  }

  public generateAccessToken = (userPayload: UserPayloadPrivate): string => {
    try {
      return jwt.sign(userPayload, env.accessTokenSecretKey, {
        expiresIn: "1h",
      });
    } catch (error) {
      Logger.error(error);
      throw new Error("Access token generation failed");
    }
  };

  public generateRefreshToken = (userPayload: UserPayloadPrivate): string => {
    try {
      return jwt.sign(userPayload, env.refreshTokenSecretKey, {
        expiresIn: "30d",
      });
    } catch (error) {
      Logger.error(error);
      throw new Error("Refresh token generation failed");
    }
  };

  public verifyAccessToken = (token: string): UserPayloadPrivate => {
    try {
      const payload = jwt.verify(token, env.accessTokenSecretKey);
      delete (payload as { iat?: number }).iat;
      delete (payload as { exp?: number }).exp;
      return payload as UserPayloadPrivate;
    } catch (error) {
      Logger.error(error);
      throw new Error("JWT token verification failed");
    }
  };

  public verifyRefreshToken = (token: string): UserPayloadPrivate => {
    try {
      const payload = jwt.verify(token, env.refreshTokenSecretKey);
      delete (payload as { iat?: number }).iat;
      delete (payload as { exp?: number }).exp;
      return payload as UserPayloadPrivate;
    } catch (error) {
      Logger.error(error);
      throw new Error("JWT token verification failed");
    }
  };
}

export const authTokenService = AuthTokenService.getInstance();
