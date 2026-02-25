// ユーザー関連の定数定義

/**
 * 有効なユーザー権限のリスト
 */
export const VALID_AUTHORITIES = [
  "globalAdmin",
  "serviceAdmin",
  "readonlyAdmin",
  "user",
] as const;

/**
 * ユーザー権限の型定義
 */
export type UserAuthority =
  | "globalAdmin"
  | "serviceAdmin"
  | "readonlyAdmin"
  | "user";

/**
 * 有効なユーザーステータスのリスト
 */
export const VALID_STATUSES = ["active", "inactive"] as const;

/**
 * ユーザーステータスの型定義
 */
export type UserStatus = "active" | "inactive";

/**
 * デフォルトのユーザーステータス
 */
export const DEFAULT_USER_STATUS: UserStatus = "active";
