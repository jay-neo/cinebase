import { OAuth2 } from "oauth";
import { env } from "../../config";
import logger from "../../config/logger";
import type {
  GithubUserInfo,
  GoogleUserInfo,
  OAuthResponse,
  OAuthTokenResponse,
} from "./auth.types";

class OAuth2Service {
  private static instance: OAuth2Service;
  private googleOAuth: OAuth2;
  private githubOAuth: OAuth2;

  private constructor() {
    this.googleOAuth = new OAuth2(
      env.googleClientId,
      env.googleClientSecret,
      "https://accounts.google.com", // Auth base URL
      "/o/oauth2/v2/auth", // Auth endpoint
      "/o/oauth2/token" // Token endpoint
    );

    this.githubOAuth = new OAuth2(
      env.githubClientId, // Client ID from GitHub OAuth App
      env.githubClientSecret, // Client Secret from GitHub OAuth App
      "https://github.com/", // GitHub base URL
      "login/oauth/authorize", // Authorization endpoint
      "login/oauth/access_token" // Token endpoint
    );
  }

  public static getInstance(): OAuth2Service {
    if (!OAuth2Service.instance) {
      OAuth2Service.instance = new OAuth2Service();
    }
    return OAuth2Service.instance;
  }

  public getGoogleAuthUrl(clientBaseUrl: string): string {
    return this.googleOAuth.getAuthorizeUrl({
      redirect_uri: `${clientBaseUrl}/auth/google/callback`,
      scope: "profile email",
      response_type: "code",
      access_type: "offline",
    });
  }

  public async getGoogleUserInfo(
    clientBaseUrl: string,
    code: string
  ): Promise<OAuthResponse> {
    try {
      const tokenResponse: OAuthTokenResponse =
        await new Promise<OAuthTokenResponse>((resolve, reject) => {
          this.googleOAuth.getOAuthAccessToken(
            code,
            {
              redirect_uri: `${clientBaseUrl}/auth/google/callback`,
              grant_type: "authorization_code",
              client_id: env.googleClientId,
              client_secret: env.googleClientSecret,
            },
            (
              err: Error | { statusCode: number; data?: any },
              accessToken?: string,
              refreshToken?: string,
              results?: any
            ) => {
              if (err) {
                logger.error("Google token exchange failed", { error: err });
                reject(err);
              } else if (!accessToken) {
                reject(new Error("No access token returned"));
              } else {
                resolve({
                  access_token: accessToken,
                  token_type: results?.token_type ?? "Bearer", // Default to 'Bearer' if not provided
                  expires_in: results?.expires_in ?? 3600, // Default to 1 hour if not provided
                  refresh_token: refreshToken,
                });
              }
            }
          );
        });

      // console.log("tokenResponse =>", tokenResponse);

      // Step 2: Fetch user info with access token
      const userInfoResponse = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${tokenResponse?.access_token}`,
          },
        }
      );

      // console.log("userInfoResponse =>", userInfoResponse);

      if (!userInfoResponse.ok) {
        throw new Error(
          `Failed to fetch Google user info: ${userInfoResponse.statusText}`
        );
      }

      const userInfo: GoogleUserInfo =
        (await userInfoResponse.json()) as GoogleUserInfo;

      // console.log("userInfo =>", userInfo);
      return {
        user: {
          accountId: userInfo.sub,
          email: userInfo.email,
          name: userInfo.name || userInfo.given_name || "Google User",
          avatar: userInfo?.picture,
        },
        token: tokenResponse,
      };
    } catch (error) {
      logger.error("Google callback error", { error });
      throw new Error("Google authentication failed");
    }
  }

  // GitHub methods (unchanged for this fix, but should be typed similarly)
  public getGithubAuthUrl(clientBaseUrl: string): string {
    return this.githubOAuth.getAuthorizeUrl({
      redirect_uri: `${clientBaseUrl}/auth/github/callback`,
      scope: "user:email",
    });
  }

  public async getGithubUserInfo(
    clientBaseUrl: string,
    code: string
  ): Promise<OAuthResponse> {
    try {
      // Step 1: Exchange authorization code for access token
      const tokenResponse: OAuthTokenResponse =
        await new Promise<OAuthTokenResponse>((resolve, reject) => {
          this.githubOAuth.getOAuthAccessToken(
            code,
            {
              redirect_uri: `${clientBaseUrl}/auth/github/callback`,
              grant_type: "authorization_code",
              client_id: env.githubClientId,
              client_secret: env.githubClientSecret,
            },
            (
              err: Error | { statusCode: number; data?: any },
              accessToken?: string,
              refreshToken?: string,
              results?: any
            ) => {
              if (err) {
                reject(err);
              } else if (!accessToken) {
                reject(new Error("No access token received"));
              } else {
                resolve({
                  access_token: accessToken,
                  token_type: results?.token_type ?? "Bearer",
                  expires_in: results?.expires_in ?? 3600,
                  refresh_token: refreshToken,
                });
              }
            }
          );
        });

      // Step 2: Fetch user info with access token
      const userInfoResponse = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `token ${tokenResponse?.access_token}`,
          "User-Agent": "oauth-jwt-backend", // GitHub requires a User-Agent header
          Accept: "application/vnd.github.v3+json",
        },
        credentials: "include",
      });

      if (!userInfoResponse.ok) {
        throw new Error(
          `Failed to fetch GitHub user info: ${userInfoResponse.statusText}`
        );
      }

      const userInfo: GithubUserInfo =
        (await userInfoResponse.json()) as GithubUserInfo; // GitHubUserInfo

      let email = userInfo.email;
      if (!email) {
        const emailResponse = await fetch(
          "https://api.github.com/user/emails",
          {
            headers: {
              Authorization: `token ${tokenResponse.access_token}`,
              "User-Agent": "oauth-jwt-backend",
              Accept: "application/vnd.github.v3+json",
            },
          }
        );
        const emails = (await emailResponse.json()) as {
          email: string;
          primary: boolean;
          verified: boolean;
        }[];
        email =
          emails.find((e) => e.primary && e.verified)?.email ||
          `${userInfo.login}@github.com`;
      }
      return {
        user: {
          accountId: userInfo.id.toString(),
          email: userInfo.email || `${userInfo.login}@users.noreply.github.com`,
          name: userInfo.name || userInfo.login || "GitHub User",
          avatar: userInfo.avatar_url,
        },
        token: tokenResponse,
      };
    } catch (error) {
      logger.error("GitHub callback error", { error });
      throw new Error("GitHub authentication failed");
    }
  }
}

export const oAuth2Service = OAuth2Service.getInstance();
