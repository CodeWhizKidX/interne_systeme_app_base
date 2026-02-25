// src/lib/google-auth.ts
import { OAuth2Client } from "google-auth-library";

// Google OAuth 2.0クライアントを初期化
const initializeGoogleAuth = (): OAuth2Client => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  
  if (!clientId) {
    console.error(`
❌ Google OAuth 2.0 Client ID not configured!
   
   Please set the following environment variable:
   
   GOOGLE_CLIENT_ID - Your Google OAuth 2.0 Client ID
      Example: GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
   
   To get a Client ID:
   1. Go to Google Cloud Console > APIs & Services > Credentials
   2. Create OAuth 2.0 Client ID (Web application)
   3. Set the Client ID in environment variable
    `);
    throw new Error("Google OAuth 2.0 Client ID not configured. See console for details.");
  }

  console.log("✅ Google OAuth 2.0 Client initialized");
  return new OAuth2Client(clientId);
};

// Google OAuth 2.0クライアントをエクスポート
export const googleAuthClient = initializeGoogleAuth();

// Google IDトークンを検証する関数
export interface GoogleTokenPayload {
  sub: string; // GoogleユーザーID
  email: string;
  email_verified: boolean;
  name?: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
  hd?: string; // 組織ドメイン（Google Workspaceの場合）
  exp?: number; // 有効期限（Unix timestamp）
  iat?: number; // 発行時刻（Unix timestamp）
  iss: string; // 発行者（Issuer）- Google OAuth 2.0のエンドポイント（必須）
  aud: string; // オーディエンス（Audience）- Client ID（必須）
}

export async function verifyGoogleToken(
  idToken: string
): Promise<GoogleTokenPayload> {
  try {
    const ticket = await googleAuthClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw new Error("Invalid token payload");
    }

    // issとaudは必須（Google IDトークンには必ず含まれる）
    if (!payload.iss || !payload.aud) {
      throw new Error("Invalid token: missing iss or aud");
    }

    return {
      sub: payload.sub,
      email: payload.email || "",
      email_verified: payload.email_verified || false,
      name: payload.name,
      picture: payload.picture,
      given_name: payload.given_name,
      family_name: payload.family_name,
      hd: payload.hd, // 組織ドメイン
      exp: payload.exp, // 有効期限
      iat: payload.iat, // 発行時刻
      iss: payload.iss, // 発行者（必須）
      aud: Array.isArray(payload.aud) ? payload.aud[0] : payload.aud, // オーディエンス（Client ID、必須）
    };
  } catch (error) {
    console.error("Google token verification failed:", error);
    throw new Error("Token verification failed");
  }
}

// アクセストークンを検証してユーザー情報を取得する関数
export async function verifyAccessToken(
  accessToken: string
): Promise<GoogleTokenPayload> {
  try {
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
      throw new Error("Invalid access token");
    }

    const userInfo = await userInfoResponse.json();

    // GoogleTokenPayload形式に変換
    return {
      sub: userInfo.id,
      email: userInfo.email || "",
      email_verified: userInfo.verified_email || false,
      name: userInfo.name,
      picture: userInfo.picture,
      given_name: userInfo.given_name,
      family_name: userInfo.family_name,
      hd: userInfo.hd,
      exp: undefined, // アクセストークンには有効期限情報がない
      iat: undefined,
      iss: "https://accounts.google.com", // Google OAuth 2.0のエンドポイント
      aud: process.env.GOOGLE_CLIENT_ID || "", // Client ID
    };
  } catch (error) {
    console.error("Access token verification failed:", error);
    throw new Error("Access token verification failed");
  }
}

// トークンがIDトークンかアクセストークンかを判定する関数
export function isIdToken(token: string): boolean {
  // JWT形式（3つの部分に分割できる）かどうかで判定
  const parts = token.split(".");
  return parts.length === 3;
}

// 組織ドメインをチェックする関数
export function isAllowedDomain(email: string, allowedDomains: string[]): boolean {
  if (!email || allowedDomains.length === 0) {
    return false;
  }

  const emailDomain = email.split("@")[1];
  if (!emailDomain) {
    return false;
  }

  return allowedDomains.some((domain) => {
    // 完全一致またはワイルドカード対応
    if (domain === "*") {
      return true; // すべてのドメインを許可
    }
    return emailDomain === domain || emailDomain.endsWith(`.${domain}`);
  });
}
