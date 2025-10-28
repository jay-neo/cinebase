import type { Prisma } from "@prisma/client";
import type { CookieOptions, NextFunction, Request, Response } from "express";

import { env } from "../../config";
import { db } from "../../lib/db";
import { authUtils } from "./auth.utils";
import { authTokenService } from "./jwt-token.service";
import { oAuth2Service } from "./oauth2.service";
import type {
  OAuthResponse,
  UserPayloadPrivate,
  UserPayloadPublic,
} from "./auth.types";

class AuthService {
  private readonly refreshTokenCookieOptions: CookieOptions = {
    path: "/",
    httpOnly: true, // Prevent client-side access to cookie
    sameSite: "lax", // CSRF protection : Restrict cookie to same-site requests
    secure: process.env.NODE_ENV == "production", // Only send cookie over HTTPS
    expires: new Date(Date.now() + 60 * 60 * 24 * 30 * 1000), // 30 days in milliseconds
    domain:
      process.env.NODE_ENV == "production"
        ? authUtils.getParentDomain(env?.baseUrl)
        : undefined,
  };

  private newAuthenticatedResponse = async (
    res: Response,
    options: {
      userId: string;
      status?: number;
      message: string;
    }
  ) => {
    try {
      const user = await db.user.findUnique({
        where: {
          id: options.userId!,
        },
      });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const userPayloadPrivateSchema: {
        [K in keyof UserPayloadPrivate]: true;
      } = {
        id: true,
        name: true,
        email: true,
        username: true,
        avatar: true,
        role: true,
        isTwoFactorEnabled: true,
        isCredentialAccount: true,
      };
      const userPayloadPublicSchema: { [K in keyof UserPayloadPublic]: true } =
      {
        name: true,
        email: true,
        username: true,
        avatar: true,
        role: true,
        isTwoFactorEnabled: true,
        isCredentialAccount: true,
      };
      const userPayloadPrivate: UserPayloadPrivate = authUtils.convertToType<
        any,
        UserPayloadPrivate
      >(user, userPayloadPrivateSchema);
      const userPayloadPublic: UserPayloadPublic = authUtils.convertToType<
        any,
        UserPayloadPublic
      >(user, userPayloadPublicSchema);
      const accessToken: string = authTokenService.generateAccessToken(
        userPayloadPrivate as UserPayloadPrivate
      );
      const refreshToken: string = authTokenService.generateRefreshToken(
        userPayloadPrivate as UserPayloadPrivate
      );
      return res
        .status(options.status || 202)
        .setHeader("Authorization", `Bearer ${accessToken}`)
        .cookie("refreshToken", refreshToken, this.refreshTokenCookieOptions)
        .json({ message: options.message, user: userPayloadPublic });
    } catch (error) {
      throw error;
    }
  };

  public logout = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      // res.clearCookie("refreshToken", { maxAge: 0 });
      return res
        .status(200)
        .cookie("refreshToken", null, {
          path: "/",
          httpOnly: true,
          sameSite: "lax",
          expires: new Date(0),
          secure: process.env.NODE_ENV == "production",
          domain:
            process.env.NODE_ENV == "production"
              ? authUtils.getParentDomain(env?.baseUrl)
              : undefined,
        })
        .json({ message: "Logged out successfully" });
    } catch (error: any) {
      next(error);
    }
  };

  public getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username } = req.query;
      const user = req?.user;
      delete (user as { id?: string }).id;
      return res.status(200).json({
        user: user as UserPayloadPublic,
        isAuthByUsername: user?.username == (username as string),
      });
    } catch (error: any) {
      next(error);
    }
  };

  public authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const accessToken: string | null =
        req.headers.authorization?.split(" ")[1] || null;

      if (
        !accessToken ||
        accessToken == "" ||
        accessToken == null ||
        accessToken == "null"
      ) {
        throw new Error("Access token not found");
      }

      const userPayload: UserPayloadPrivate =
        authTokenService.verifyAccessToken(accessToken);
      if (!userPayload || !userPayload?.id) {
        throw new Error("Invalid Access Token");
      }

      const accessToken_neo: string =
        authTokenService.generateAccessToken(userPayload);

      req.user = userPayload;
      res.setHeader("Authorization", `Bearer ${accessToken_neo}`);
      next();
      return;
    } catch (error) {
      // const refreshToken = req.cookies?.refreshToken || null;
      const headerCookie = req.headers.cookie || null;
      // console.log("headerCookie =>>", headerCookie);

      if (!headerCookie) {
        return res.status(404).json({ error: "No user found" });
      }

      try {
        const cookies = headerCookie.split(";");
        let refreshToken: string | null = null;

        cookies.forEach((cookie) => {
          const [key, value] = cookie.trim().split("=");
          if (key == "refreshToken") {
            refreshToken = value;
          }
        });

        const { message } = req.query;
        console.log(`refreshToken ${message}=>>`, refreshToken);

        if (
          !refreshToken ||
          refreshToken == "" ||
          refreshToken == null ||
          refreshToken == "null"
        ) {
          return res.status(404).json({ error: "No user found" });
        }

        const userPayload: UserPayloadPrivate =
          authTokenService.verifyRefreshToken(refreshToken);

        if (!userPayload || !userPayload?.id) {
          throw new Error("Invalid Refresh Token");
        }

        const accessToken_neo: string =
          authTokenService.generateAccessToken(userPayload);
        const refreshToken_neo: string =
          authTokenService.generateRefreshToken(userPayload);

        req.user = userPayload;
        res
          .setHeader("Authorization", `Bearer ${accessToken_neo}`)
          .cookie(
            "refreshToken",
            refreshToken_neo,
            this.refreshTokenCookieOptions
          );
        return next();
      } catch (error: any) {
        return next(error);
      }
    }
  };

  public oAuthProvider = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { provider } = req.params;
      if (!provider) {
        new Error("Missing provider");
      }
      const clientBaseUrl = req.get("origin");

      let authUrl: string = "";
      if (provider == "google") {
        authUrl = oAuth2Service.getGoogleAuthUrl(clientBaseUrl as string);
      } else if (provider == "github") {
        authUrl = oAuth2Service.getGithubAuthUrl(clientBaseUrl as string);
      }

      if (authUrl) {
        return res.status(200).json({
          authUrl,
        });
      } else {
        return next();
      }
    } catch (error: any) {
      return next(error);
    }
  };

  public oAuthProviderCallback = async (
    req: Request, 
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { provider } = req.params;
      if (!provider) {
        new Error("Missing provider");
      }

      const code = req.query.code as string;
      if (!code) {
        return res.status(400).json({ error: "Missing authorization code" });
      }

      const clientBaseUrl = req.get("origin");

      let oAuthUser: OAuthResponse | null = null;
      if (provider == "google") {
        oAuthUser = await oAuth2Service.getGoogleUserInfo(
          clientBaseUrl as string,
          code
        );
      } else if (provider == "github") {
        oAuthUser = await oAuth2Service.getGithubUserInfo(
          clientBaseUrl as string,
          code
        );
      }

      if (!oAuthUser) {
        return res.status(400).redirect(`${process.env.CLIENT_1}/auth/login`);
      }

      const expiresAt = oAuthUser.token.expires_in
        ? Math.floor(Date.now() / 1000) + oAuthUser.token.expires_in
        : null;

      const userId = await db.$transaction(
        async (tx: Prisma.TransactionClient) => {
          const user = await tx.user.upsert({
            where: {
              email: oAuthUser?.user?.email,
            },
            create: {
              email: oAuthUser?.user?.email,
              name: oAuthUser?.user?.name,
              avatar: oAuthUser?.user?.avatar,
              isCredentialAccount: false,
            },
            update: {
              isCredentialAccount: false,
            },
            select: {
              id: true,
            },
          });

          await tx.account.upsert({
            where: {
              provider_providerAccountId: {
                provider: provider,
                providerAccountId: oAuthUser.user.accountId,
              },
            },
            create: {
              userId: user.id,
              provider: provider,
              providerAccountId: oAuthUser?.user?.accountId,
              type: "oauth",
              refreshToken: oAuthUser?.token?.refresh_token,
              accessToken: oAuthUser?.token?.access_token,
              expiresAt: expiresAt,
              tokenType: oAuthUser?.token?.token_type,
              idToken: oAuthUser.token.id_token,
            },
            update: {
              accessToken: oAuthUser?.token?.access_token,
              refreshToken: oAuthUser?.token?.refresh_token,
              expiresAt: expiresAt,
              tokenType: oAuthUser?.token?.token_type,
              scope: oAuthUser.token.scope,
              idToken: oAuthUser.token.id_token,
            },
          });
          return user.id;
        }
      );

      return this.newAuthenticatedResponse(res, {
        userId: userId,
        message: "Logged in successfully",
      });
    } catch (error: any) {
      console.error("My Error ==> ", error)
      next(error);
    }
  };
}

export const authService = new AuthService();
