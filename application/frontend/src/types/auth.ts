// src/types/auth.ts
import type { User as FirebaseUser } from "firebase/auth";

// Firebase Userの拡張型
export interface UserPayload {
  // Firebase User基本情報
  uid: string; // Firebase User ID（一意の識別子）
  email: string | null; // ユーザーのメールアドレス
  emailVerified: boolean; // メール確認済みかどうか
  displayName: string | null; // 表示名
  photoURL: string | null; // プロフィール画像のURL
  providerId: string; // 認証プロバイダー（google.com, password など）
  
  // 旧Google OAuth互換フィールド（後方互換性のため）
  sub?: string; // GoogleユーザーID（uid と同じ）
  name?: string; // ユーザーのフルネーム（displayName と同じ）
  picture?: string; // プロフィール画像のURL（photoURL と同じ）
  given_name?: string; // 名
  family_name?: string; // 姓
  
  // アプリ固有のフィールド
  isFirstLoginCompleted?: boolean;
  customDisplayName?: string; // ユーザーが設定した表示名
  provider?: string; // 認証プロバイダー（APIから取得: google, password など）
}

// 認証コンテキストで使用する型
export type AuthUser = UserPayload | null;

// Firebase UserからUserPayloadへの変換関数
export const firebaseUserToPayload = (user: FirebaseUser): UserPayload => {
  // プロバイダー情報を取得
  const providerData = user.providerData[0];
  const providerId = providerData?.providerId || "password";
  
  return {
    uid: user.uid,
    email: user.email,
    emailVerified: user.emailVerified,
    displayName: user.displayName,
    photoURL: user.photoURL,
    providerId,
    // 後方互換性のためのフィールド
    sub: user.uid,
    name: user.displayName || undefined,
    picture: user.photoURL || undefined,
  };
};

// Firebase User型をエクスポート
export type { FirebaseUser };
