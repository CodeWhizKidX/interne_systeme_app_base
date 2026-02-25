import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import type { AuthUser } from "../types/auth";

/**
 * DBから取得するユーザー情報
 */
export interface DbUserInfo {
  firstName: string;
  lastName: string;
  firstNameKana: string | null;
  lastNameKana: string | null;
  emailAddress: string;
  status: string;
  authority: string;
  registrationDate: string;
  isFirstLoginCompleted: boolean;
  displayName: string | null;
  lastLoginAt: string | null;
  provider: string;
}

/**
 * ユーザーコンテキストの型
 */
interface UserContextType {
  /** Google OAuth認証ユーザー情報 */
  user: AuthUser;
  /** ユーザー情報を設定 */
  setUser: (user: AuthUser) => void;
  /** DBから取得したユーザー情報 */
  dbUserInfo: DbUserInfo | null;
  /** DBユーザー情報を設定 */
  setDbUserInfo: (info: DbUserInfo | null) => void;
  /** ロード中かどうか */
  isLoading: boolean;
  /** ロード状態を設定 */
  setIsLoading: (loading: boolean) => void;

  // ========== ヘルパー関数 ==========

  /** 管理者かどうか（user以外の権限） */
  isAdmin: () => boolean;
  /** グローバル管理者かどうか */
  isGlobalAdmin: () => boolean;
  /** サービス管理者かどうか */
  isServiceAdmin: () => boolean;
  /** 読み取り専用管理者かどうか */
  isReadonlyAdmin: () => boolean;
  /** 表示名を取得 */
  getDisplayName: () => string;
  /** プロフィール画像URLを取得 */
  getProfilePicture: () => string | null;
  /** 認証プロバイダーを取得 */
  getProvider: () => string | null;
  /** ログアウト時のクリア */
  clearUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

/**
 * ユーザー情報プロバイダー
 */
export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<AuthUser>(null);
  const [dbUserInfo, setDbUserInfo] = useState<DbUserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Googleのプロフィール画像URLを常に保持（表示名更新などで失われないようにする）
  // localStorageから復元（ページリロード時にも保持）
  const [googleProfilePicture, setGoogleProfilePicture] = useState<string | null>(() => {
    return localStorage.getItem("google_profile_picture");
  });

  /**
   * 管理者かどうか（user以外の権限）
   */
  const isAdmin = useCallback((): boolean => {
    if (!dbUserInfo) return false;
    return dbUserInfo.authority !== "user";
  }, [dbUserInfo]);

  /**
   * グローバル管理者かどうか
   */
  const isGlobalAdmin = useCallback((): boolean => {
    if (!dbUserInfo) return false;
    return dbUserInfo.authority === "globalAdmin";
  }, [dbUserInfo]);

  /**
   * サービス管理者かどうか
   */
  const isServiceAdmin = useCallback((): boolean => {
    if (!dbUserInfo) return false;
    return dbUserInfo.authority === "serviceAdmin";
  }, [dbUserInfo]);

  /**
   * 読み取り専用管理者かどうか
   */
  const isReadonlyAdmin = useCallback((): boolean => {
    if (!dbUserInfo) return false;
    return dbUserInfo.authority === "readonlyAdmin";
  }, [dbUserInfo]);

  /**
   * 表示名を取得
   */
  const getDisplayName = useCallback((): string => {
    // 優先順位: カスタム表示名 > Google OAuth表示名 > メールアドレス > "ユーザー"
    if (dbUserInfo?.displayName) return dbUserInfo.displayName;
    if (user?.customDisplayName) return user.customDisplayName;
    if (user?.displayName) return user.displayName;
    if (user?.name) return user.name;
    if (user?.email) return user.email;
    return "ユーザー";
  }, [user, dbUserInfo]);

  /**
   * プロフィール画像URLを取得
   * 常にGoogleのプロフィール画像を返す（表示名更新などで失われないようにする）
   */
  const getProfilePicture = useCallback((): string | null => {
    // 優先順位: 保存されたGoogle画像 > userのphotoURL > userのpicture > localStorage
    // 常にGoogleの画像を返す（nullでない限り）
    const savedPicture = localStorage.getItem("google_profile_picture");
    return googleProfilePicture || savedPicture || user?.photoURL || user?.picture || null;
  }, [user, googleProfilePicture]);

  /**
   * 認証プロバイダーを取得
   */
  const getProvider = useCallback((): string | null => {
    return dbUserInfo?.provider || user?.provider || null;
  }, [user, dbUserInfo]);

  /**
   * ユーザー情報を設定（Googleのプロフィール画像も保存）
   */
  const setUserWithProfilePicture = useCallback((newUser: AuthUser) => {
    setUser(newUser);
    // Googleのプロフィール画像URLを保存（表示名更新などで失われないようにする）
    // 新しいユーザー情報に画像URLがある場合は更新、ない場合は既存の値を保持
    if (newUser?.photoURL || newUser?.picture) {
      const pictureUrl = newUser.photoURL || newUser.picture || null;
      setGoogleProfilePicture(pictureUrl);
      // localStorageにも保存（ページリロード時にも保持）
      if (pictureUrl) {
        localStorage.setItem("google_profile_picture", pictureUrl);
      }
    }
    // 新しいユーザー情報に画像URLがない場合でも、既存のgoogleProfilePictureは保持する
    // （表示名更新などでuserオブジェクトが更新されても、画像URLは失われない）
  }, []);

  /**
   * ログアウト時のクリア
   */
  const clearUser = useCallback(() => {
    setUser(null);
    setDbUserInfo(null);
    setGoogleProfilePicture(null);
    localStorage.removeItem("google_profile_picture");
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser: setUserWithProfilePicture,
        dbUserInfo,
        setDbUserInfo,
        isLoading,
        setIsLoading,
        isAdmin,
        isGlobalAdmin,
        isServiceAdmin,
        isReadonlyAdmin,
        getDisplayName,
        getProfilePicture,
        getProvider,
        clearUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

/**
 * ユーザー情報を使用するフック
 * @throws UserProvider外で使用した場合
 */
export function useUser(): UserContextType {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

