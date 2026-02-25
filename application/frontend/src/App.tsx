import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import type { AxiosError } from "axios";

import "./App.css";
import LoginScreen from "./components/LoginScreen";
import Layout from "./components/Layout";
import Home from "./page/Home";
import type { UserPayload } from "./types/auth";
import { googleTokenToPayload } from "./types/auth";
import { jwtDecode } from "jwt-decode";
import AdminDashboard from "./page/admin/AdminDashboard";
import UserManagement from "./page/admin/UserManagement";
import Forbidden from "./page/common/Forbidden";
import Unauthorized from "./page/common/Unauthorized";
import Settings from "./page/user/Settings";

import FirstLoginModal from "./components/FirstLoginModal";
import { userApi } from "./api/api";
import {
  UserProvider,
  useUser,
} from "./contexts/UserContext";
import type { DbUserInfo } from "./contexts/UserContext";

/**
 * メインアプリケーションの内部コンポーネント
 * UserContextを使用するため、Provider内で使用する
 */
function AppContent() {
  const {
    user,
    setUser,
    setDbUserInfo,
    isLoading,
    setIsLoading,
    clearUser,
  } = useUser();
  
  // 認証エラー状態（403 Forbiddenなど）
  const [authError, setAuthError] = useState<number | null>(null);

  // ユーザー情報を最新化する関数
  const refreshUserInfo = async (
    currentUser: UserPayload,
    recordLogin?: boolean
  ) => {
    try {
      const response = await userApi.checkUserInfo(recordLogin);
      const result = response.data;
      console.log("Debug - API response user:", result?.user);
      console.log("Debug - provider from API:", result?.user?.provider);

      if (result && result.user) {
        // Google OAuth User情報を更新
        // photoURLとpictureは保持する（表示名更新などで失われないようにする）
        // 既存の画像URLを優先的に保持（currentUserまたはlocalStorageから）
        const savedPicture = localStorage.getItem("google_profile_picture");
        const existingPhotoURL = currentUser?.photoURL || currentUser?.picture || savedPicture;
        const existingPicture = currentUser?.picture || currentUser?.photoURL || savedPicture;
        
        setUser({
          ...currentUser,
          isFirstLoginCompleted: result.user.isFirstLoginCompleted,
          customDisplayName: result.user.displayName ?? undefined,
          provider: result.user.provider,
          // Googleのプロフィール画像を保持（既存の値があればそれを使用）
          photoURL: existingPhotoURL || null,
          picture: existingPicture || undefined,
        });

        // DBから取得したユーザー情報をContextに保存
        setDbUserInfo(result.user as DbUserInfo);
      }
    } catch (error) {
      console.error("ユーザー情報取得失敗:", error);
      
      // AxiosErrorの場合、ステータスコードを確認
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        const statusCode = axiosError.response.status;
        console.error("APIエラーステータス:", statusCode);
        
        // 403, 401, 500などのエラー時はForbiddenページへ遷移
        if (statusCode === 403 || statusCode === 401 || statusCode >= 500) {
          setAuthError(statusCode);
          clearUser();
          return;
        }
      }
      
      // その他のエラーもForbiddenページへ遷移
      setAuthError(500);
      clearUser();
      } finally {
      setIsLoading(false);
    }
  };

  // 認証状態の監視（ページリロード時など）
  useEffect(() => {
    const checkAuthState = async () => {
      const idToken = localStorage.getItem("id_token");
      if (idToken) {
        try {
          // トークンがJWT形式（IDトークン）かどうかを判定
          const isJWT = idToken.split(".").length === 3;
          
          if (isJWT) {
            // IDトークンの場合、有効期限をチェック
            const tokenPayload = jwtDecode<{ exp?: number; sub?: string; email?: string; email_verified?: boolean; picture?: string; name?: string }>(idToken);
            const now = Math.floor(Date.now() / 1000);
            
            if (tokenPayload.exp && tokenPayload.exp < now) {
              // トークンが期限切れの場合は削除
              console.log("App: トークンが期限切れです");
              localStorage.removeItem("id_token");
              clearUser();
              setIsLoading(false);
              return;
            }
            
            // トークンが有効な場合は、ユーザー情報を復元
            // GoogleTokenPayload形式に変換
            const googleTokenPayload = {
              sub: tokenPayload.sub || "",
              email: tokenPayload.email || "",
              email_verified: tokenPayload.email_verified || false,
              name: tokenPayload.name,
              picture: tokenPayload.picture,
              given_name: undefined,
              family_name: undefined,
              hd: undefined,
            };
            const userPayload = googleTokenToPayload(googleTokenPayload);
          
          // Googleのプロフィール画像をlocalStorageに保存（表示名更新などで失われないようにする）
          if (userPayload.photoURL || userPayload.picture) {
            const pictureUrl = userPayload.photoURL || userPayload.picture;
            if (pictureUrl) {
              localStorage.setItem("google_profile_picture", pictureUrl);
            }
          }
          
          setUser(userPayload);
          
          // DBから最新情報を取得
          await refreshUserInfo(userPayload, false);
          } else {
            // アクセストークンの場合、バックエンドで検証してもらうため、
            // 一時的なユーザー情報を作成してAPIを呼び出す
            // 実際には、バックエンドで検証されるため、ここでは空のペイロードを使用
            const tempPayload = {
              sub: "",
              email: "",
              email_verified: false,
            };
            const userPayload = googleTokenToPayload(tempPayload);
            setUser(userPayload);
            
            // DBから最新情報を取得（バックエンドでトークンが検証される）
            await refreshUserInfo(userPayload, false);
          }
        } catch (error) {
          console.error("トークン検証エラー:", error);
          localStorage.removeItem("id_token");
          clearUser();
          setIsLoading(false);
        }
      } else {
        console.log("App: 未認証状態です");
        clearUser();
        setIsLoading(false);
      }
    };
    
    checkAuthState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ログイン成功時の処理
  const handleLoginSuccess = async (idToken: string, tokenPayload: any) => {
    // 認証エラー状態をリセット（前回のエラーが残っている場合に備えて）
    setAuthError(null);
    console.log("App: handleLoginSuccess - ログイン処理開始");
    
    try {
      // IDトークンをlocalStorageに保存
      localStorage.setItem("id_token", idToken);
      
      // トークンペイロードをUserPayloadに変換
      const userPayload = googleTokenToPayload(tokenPayload);
      setUser(userPayload);
      
      // DBから最新情報を取得（ログイン時はrecordLogin=trueでログイン履歴を記録）
      await refreshUserInfo(userPayload, true);
      console.log("App: handleLoginSuccess - ログイン履歴を記録しました");
    } catch (error) {
      console.error("ログイン処理エラー:", error);
      localStorage.removeItem("id_token");
      clearUser();
    }
  };

  // ログアウト処理
  const handleLogout = async () => {
    try {
      clearUser(); // User情報をクリア
      setAuthError(null); // 認証エラー状態をリセット
      localStorage.removeItem("id_token");
    } catch (error) {
      console.error("ログアウトエラー:", error);
    }
  };

  // 初回ログイン完了時の処理
  const handleFirstLoginComplete = (displayName: string) => {
    if (user) {
      setUser({
        ...user,
        isFirstLoginCompleted: true,
        customDisplayName: displayName,
        // Googleのプロフィール画像を保持
        photoURL: user.photoURL || user.picture || null,
        picture: user.picture || user.photoURL || undefined,
      });
    }
  };

  // ローディング中は何も表示しない（またはローディング表示）
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-slate-400">読み込み中...</div>
        </div>
      </div>
    );
  }

  // 認証エラーがある場合はForbiddenページへリダイレクト
  if (authError) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/forbidden" element={<Forbidden />} />
          <Route path="*" element={<Navigate to="/forbidden" replace />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      {user && (
        <FirstLoginModal
          isOpen={user.isFirstLoginCompleted === false}
          onComplete={handleFirstLoginComplete}
        />
      )}
      <Routes>
        {/* ログイン画面 */}
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <LoginScreen onLoginSuccess={handleLoginSuccess} />
            )
          }
        />

        {/* エラーページ（認証不要） */}
        <Route
          path="/unauthorized"
          element={<Unauthorized onLogout={handleLogout} />}
        />
        <Route path="/forbidden" element={<Forbidden />} />

        {/* ログイン済み向け共通 Layout */}
        <Route
          element={
            user ? (
              <Layout onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          {/* 子ルート */}
          <Route path="/" element={<Home />} />
          <Route path="/settings" element={<Settings />} />
          {/* 管理者メニュー */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/userManagement" element={<UserManagement />} />

          {/* 未定義パスはホームへ */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>

      <Toaster position="top-right" reverseOrder={false} />
    </BrowserRouter>
  );
}

/**
 * メインアプリケーション（UserProviderでラップ）
 */
function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;
