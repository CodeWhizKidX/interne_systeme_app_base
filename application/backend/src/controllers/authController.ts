// src/controllers/authController.ts
import { Controller, Post, Body, Route, Tags } from "tsoa";
import { Request as ExRequest, Response as ExResponse } from "express";
import { OAuth2Client } from "google-auth-library";
import { isAllowedDomain } from "../lib/google-auth";

interface VerifyTokenRequest {
  accessToken: string;
}

interface VerifyTokenResponse {
  idToken: string;
  user: {
    sub: string;
    email: string;
    email_verified: boolean;
    name?: string;
    picture?: string;
    given_name?: string;
    family_name?: string;
    hd?: string;
  };
}

@Route("/auth")
@Tags("Auth")
export class AuthController extends Controller {
  /**
   * Googleアクセストークンを検証し、IDトークンとして扱う
   */
  @Post("/google/verify")
  public async verifyGoogleToken(
    @Body() requestBody: VerifyTokenRequest
  ): Promise<VerifyTokenResponse> {
    try {
      const { accessToken } = requestBody;

      if (!accessToken) {
        this.setStatus(400);
        throw new Error("Access token is required");
      }

      // アクセストークンを使ってユーザー情報を取得
      const userInfoResponse = await fetch(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!userInfoResponse.ok) {
        this.setStatus(401);
        throw new Error("Invalid access token");
      }

      const userInfo = await userInfoResponse.json();

      // 組織ドメインチェック
      const allowedDomains = process.env.ALLOWED_ORGANIZATION_DOMAINS
        ? process.env.ALLOWED_ORGANIZATION_DOMAINS.split(",").map((d) => d.trim())
        : [];

      if (allowedDomains.length > 0 && userInfo.email) {
        if (!isAllowedDomain(userInfo.email, allowedDomains)) {
          this.setStatus(403);
          throw new Error("Access denied: Your organization domain is not allowed");
        }
      }

      // アクセストークンをIDトークンとして扱う
      // 実際には、アクセストークンからIDトークンを取得する必要があるが、
      // ここでは、アクセストークンをIDトークンとして扱う
      // バックエンドで検証する際は、アクセストークンを検証する必要がある

      return {
        idToken: accessToken, // アクセストークンをIDトークンとして扱う
        user: {
          sub: userInfo.id,
          email: userInfo.email,
          email_verified: userInfo.verified_email,
          name: userInfo.name,
          picture: userInfo.picture,
          given_name: userInfo.given_name,
          family_name: userInfo.family_name,
          hd: userInfo.hd,
        },
      };
    } catch (error) {
      this.setStatus(500);
      throw error;
    }
  }
}
