// src/types/auth.ts
import type { GoogleTokenPayload } from "../lib/google-auth";

// Google OAuth Userの拡張型
export interface UserPayload {
  // Google OAuth基本情報
  uid: string; // Google User ID（subと同じ）
  email: string | null; // ユーザーのメールアドレス
  emailVerified: boolean; // メール確認済みかどうか
  displayName: string | null; // 表示名
  photoURL: string | null; // プロフィール画像のURL
  providerId: string; // 認証プロバイダー（常に"google"）
  
  // Google OAuth互換フィールド
  sub: string; // GoogleユーザーID
  name?: string; // ユーザーのフルネーム
  picture?: string; // プロフィール画像のURL
  given_name?: string; // 名
  family_name?: string; // 姓
  hd?: string; // 組織ドメイン
  
  // アプリ固有のフィールド
  isFirstLoginCompleted?: boolean;
  customDisplayName?: string; // ユーザーが設定した表示名
  provider?: string; // 認証プロバイダー（APIから取得: google）
}

// 認証コンテキストで使用する型
export type AuthUser = UserPayload | null;

// Google TokenPayloadからUserPayloadへの変換関数
export const googleTokenToPayload = (tokenPayload: GoogleTokenPayload): UserPayload => {
  return {
    uid: tokenPayload.sub,
    email: tokenPayload.email || null,
    emailVerified: tokenPayload.email_verified,
    displayName: tokenPayload.name || null,
    photoURL: tokenPayload.picture || null,
    providerId: "google",
    // Google OAuth互換フィールド
    sub: tokenPayload.sub,
    name: tokenPayload.name,
    picture: tokenPayload.picture,
    given_name: tokenPayload.given_name,
    family_name: tokenPayload.family_name,
    hd: tokenPayload.hd,
  };
};
