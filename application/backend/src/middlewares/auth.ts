import { Request, Response, NextFunction } from "express";
import { TokenPayload } from "google-auth-library";
import { 
  verifyGoogleToken, 
  verifyAccessToken,
  isIdToken,
  isAllowedDomain, 
  type GoogleTokenPayload 
} from "../lib/google-auth";
import { getUserAuthInfo } from "../services/userAuthentications";

// Google OAuth TokenPayloadを拡張した型
// TokenPayloadと互換性を持たせるため、TokenPayloadを拡張
export interface GoogleOAuthTokenPayload extends TokenPayload {
  // 互換性のためのフィールド
  uid: string; // sub と同じ
}

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("リクエストの中身確認");
  console.log(req.originalUrl);
  const authHeader = req.headers.authorization;
  console.log(authHeader ? "Authorization header present" : "No Authorization header");
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Missing or invalid Authorization header" });
  }

  const token = authHeader.split(" ")[1];
  
  try {
    let decodedToken: GoogleTokenPayload;
    
    // トークンがIDトークンかアクセストークンかを判定
    if (isIdToken(token)) {
      // IDトークンの場合
      console.log("Verifying ID token");
      decodedToken = await verifyGoogleToken(token);
    } else {
      // アクセストークンの場合
      console.log("Verifying access token");
      decodedToken = await verifyAccessToken(token);
    }
    
    console.log("Server time:", new Date());
    console.log("Token verified for user:", decodedToken.sub);

    // トークンの有効期限をチェック（IDトークンの場合のみ）
    // アクセストークンの場合は有効期限情報がないため、スキップ
    if (decodedToken.exp) {
      const now = Math.floor(Date.now() / 1000);
      if (decodedToken.exp < now) {
        console.error("Token expired");
        return res.status(401).json({ error: "Token expired" });
      }
    }

    // 組織ドメインチェック
    const allowedDomains = process.env.ALLOWED_ORGANIZATION_DOMAINS
      ? process.env.ALLOWED_ORGANIZATION_DOMAINS.split(",").map((d) => d.trim())
      : [];
    
    if (allowedDomains.length > 0 && decodedToken.email) {
      if (!isAllowedDomain(decodedToken.email, allowedDomains)) {
        console.error(`Access denied: Email domain not allowed. Email: ${decodedToken.email}`);
        return res.status(403).json({ 
          error: "Access denied: Your organization domain is not allowed" 
        });
      }
    }

    // プロバイダーは常にgoogle
    const provider = "google";

    // GoogleTokenPayloadをTokenPayload互換の形式に変換
    // TokenPayload型に必要なすべてのプロパティを含める
    const payload: GoogleOAuthTokenPayload = {
      ...decodedToken,
      uid: decodedToken.sub, // 互換性のため
      // TokenPayloadの必須プロパティを確実に含める
      iss: decodedToken.iss,
      aud: decodedToken.aud,
      sub: decodedToken.sub,
    } as GoogleOAuthTokenPayload;

    let authInfo: {
      userId: bigint;
      authority: string;
      isFirstLoginCompleted: boolean;
    } | null = null;
    
    // 初回のユーザーチェック以外ではユーザーID、権限情報を取得する
    if (req.originalUrl != "/api/check-user-info") {
      // Google subをproviderSubとして使用
      authInfo = await getUserAuthInfo(provider, decodedToken.sub);
      console.log("Auth info:", authInfo);
    }

    if (authInfo) {
      req.user = {
        ...payload,
        provider: provider,
        userId: authInfo.userId.toString(),
        authority: authInfo.authority,
        isFirstLoginCompleted: authInfo.isFirstLoginCompleted,
      };
    } else {
      req.user = {
        ...payload,
        provider: provider,
        userId: "",
        authority: "",
        isFirstLoginCompleted: true,
      };
    }

    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).json({ error: "Token verification failed" });
  }
};
