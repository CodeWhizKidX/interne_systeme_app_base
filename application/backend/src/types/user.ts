// ユーザー関連の型定義
import { UserAuthority, UserStatus } from "../constants/user";

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  firstNameKana: string;
  lastNameKana: string;
  email: string;
  authority: UserAuthority;
  status?: UserStatus;
}

export interface CreateUserSuccessResponse {
  message: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    firstNameKana: string;
    lastNameKana: string;
    emailAddress: string;
    status: string;
    authority: string;
    registrationDate: string;
    isFirstLoginCompleted: boolean;
    displayName: string | null;
  };
}

export interface UpdateUserRequest {
  originalEmail: string; // 更新前のメールアドレス（ユーザー特定用）
  firstName: string;
  lastName: string;
  firstNameKana: string;
  lastNameKana: string;
  email: string; // 更新後のメールアドレス
  authority: UserAuthority;
  status?: UserStatus;
}

export interface UpdateUserSuccessResponse {
  message: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    firstNameKana: string;
    lastNameKana: string;
    emailAddress: string;
    status: string;
    authority: string;
    registrationDate: string;
    isFirstLoginCompleted: boolean;
    displayName: string | null;
  };
}

export interface DeleteUserRequest {
  email: string; // 削除対象ユーザーのメールアドレス
}

export interface DeleteUserSuccessResponse {
  message: string;
}

export interface CompleteFirstLoginRequest {
  displayName: string;
  /** publicサブドメインの場合に必要な追加情報 */
  firstName?: string;
  lastName?: string;
  firstNameKana?: string;
  lastNameKana?: string;
}

export interface CompleteFirstLoginSuccessResponse {
  message: string;
  user: {
    id: string;
    displayName: string;
    isFirstLoginCompleted: boolean;
  };
}

export interface UpdateDisplayNameRequest {
  displayName: string;
}

export interface UpdateDisplayNameSuccessResponse {
  message: string;
  user: {
    id: string;
    displayName: string;
  };
}

// ユーザー自身がプロフィールを更新するためのリクエスト
export interface CreateStripeCheckoutSessionSuccessResponse {
  message: string;
  checkoutUrl: string;
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  firstNameKana: string;
  lastNameKana: string;
  displayName: string;
}

export interface UpdateProfileSuccessResponse {
  message: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    firstNameKana: string;
    lastNameKana: string;
    displayName: string;
  };
}

export interface LoginHistoryMonthlyData {
  year: number;
  month: number;
  loginCount: number;
}

export interface LoginHistoryDailyData {
  year: number;
  month: number;
  day: number;
  loginCount: number;
}

export interface GetLoginHistoryResponse {
  message: string;
  data: LoginHistoryMonthlyData[] | LoginHistoryDailyData[];
  isDaily?: boolean; // 日単位データかどうか
}

export interface CheckUserInfoSuccessResponse {
  message: string;
  user: {
    firstName: string;
    lastName: string;
    firstNameKana: string | null;
    lastNameKana: string | null;
    emailAddress: string;
    status: string;
    authority: string;
    registrationDate: Date;
    isFirstLoginCompleted: boolean;
    displayName: string | null;
    lastLoginAt: Date | null;
    provider: string; // 認証プロバイダー（google, password など）
  };
}
