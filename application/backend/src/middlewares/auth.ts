import { Request, Response, NextFunction } from "express";
import { auth } from "../lib/firebase-admin";
import { getUserAuthInfo } from "../services/userAuthentications";
import type { DecodedIdToken } from "firebase-admin/auth";

// Firebase DecodedIdTokenを拡張した型
export interface FirebaseTokenPayload extends DecodedIdToken {
  // 互換性のためのフィールド
  sub: string; // uid と同じ
  email?: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
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
    // Firebase Admin SDKでIDトークンを検証
    const decodedToken = await auth.verifyIdToken(token);
    console.log("Server time:", new Date());
    console.log("Token verified for user:", decodedToken.uid);

    // プロバイダーを取得（google.com, password など）
    const signInProvider = decodedToken.firebase?.sign_in_provider || "password";
    // プロバイダー名を正規化（google.com → google）
    const provider = signInProvider === "google.com" ? "google" : signInProvider;

    // Firebase DecodedIdTokenをTokenPayload互換の形式に変換
    const payload: FirebaseTokenPayload = {
      ...decodedToken,
      sub: decodedToken.uid, // 互換性のため
      email: decodedToken.email,
      email_verified: decodedToken.email_verified,
      name: decodedToken.name,
      picture: decodedToken.picture,
    };

    let authInfo: {
      userId: bigint;
      authority: string;
      isFirstLoginCompleted: boolean;
    } | null = null;
    
    // 初回のユーザーチェック以外ではユーザーID、権限情報を取得する
    if (req.originalUrl != "/api/check-user-info") {
      // Firebase UIDをproviderSubとして使用
      authInfo = await getUserAuthInfo(provider, decodedToken.uid);
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
