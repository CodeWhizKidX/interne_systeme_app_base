import { useEffect, useState, useRef } from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import type { AxiosError } from "axios";

import "./App.css";
import LoginScreen from "./components/LoginScreen";
import Layout from "./components/Layout";
import Home from "./page/Home";
import type { UserPayload } from "./types/auth";
import { firebaseUserToPayload } from "./types/auth";
import { auth, logoutUser, onAuthChange } from "./firebase";
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
  
  // ログイン処理中フラグ（handleLoginSuccessが呼ばれた時にtrueになる）
  // onAuthChangeとhandleLoginSuccessの重複呼び出しを防ぐ
  // useRefを使用してクロージャの問題を回避
  const isLoggingInRef = useRef(false);

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
        // Firebase User情報を更新
        setUser({
          ...currentUser,
          isFirstLoginCompleted: result.user.isFirstLoginCompleted,
          customDisplayName: result.user.displayName ?? undefined,
          provider: result.user.provider,
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

  // Firebase認証状態の監視
  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        // メールアドレス認証の場合、メール確認が完了しているかチェック
        // Google認証などのプロバイダー経由の場合はメール確認不要
        const isEmailProvider = firebaseUser.providerData.some(
          (provider) => provider.providerId === "password"
        );
        
        if (isEmailProvider && !firebaseUser.emailVerified) {
          // メール未確認の場合はログイン状態にしない
          console.log("App: メールアドレス未確認のためログイン状態にしません");
          setIsLoading(false);
          return;
        }
        
        // Firebase UserをUserPayloadに変換
        const userPayload = firebaseUserToPayload(firebaseUser);
        
        // IDトークンを取得してlocalStorageに保存
        try {
          const idToken = await firebaseUser.getIdToken();
          localStorage.setItem("id_token", idToken);
          
          setUser(userPayload);
          console.log("App: Firebase認証済みユーザーを設定しました", userPayload);
          
          // ログイン処理中（handleLoginSuccessから呼ばれる予定）の場合はスキップ
          // handleLoginSuccessで recordLogin=true で呼び出されるため
          if (isLoggingInRef.current) {
            console.log("App: ログイン処理中のためonAuthChangeでのAPI呼び出しをスキップ");
            setIsLoading(false);
            return;
          }
          
          // DBから最新情報を取得（ページリロード時など、recordLogin=false）
          await refreshUserInfo(userPayload);
        } catch (error) {
          console.error("IDトークン取得エラー:", error);
          clearUser();
          setIsLoading(false);
        }
      } else {
        console.log("App: 未認証状態です");
        localStorage.removeItem("id_token");
        clearUser();
        setIsLoading(false);
      }
    });

    // クリーンアップ
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ログイン成功時の処理
  const handleLoginSuccess = async () => {
    // ログイン処理中フラグを立てる（onAuthChangeでのAPI呼び出しを防ぐ）
    isLoggingInRef.current = true;
    // 認証エラー状態をリセット（前回のエラーが残っている場合に備えて）
    setAuthError(null);
    console.log("App: handleLoginSuccess - ログイン処理開始");
    
    const firebaseUser = auth.currentUser;
    if (firebaseUser) {
      const userPayload = firebaseUserToPayload(firebaseUser);
      
      try {
        const idToken = await firebaseUser.getIdToken();
        localStorage.setItem("id_token", idToken);
        
        setUser(userPayload);
        // DBから最新情報を取得（ログイン時はrecordLogin=trueでログイン履歴を記録）
        await refreshUserInfo(userPayload, true);
        console.log("App: handleLoginSuccess - ログイン履歴を記録しました");
      } catch (error) {
        console.error("IDトークン取得エラー:", error);
      } finally {
        // ログイン処理完了後にフラグをリセット
        isLoggingInRef.current = false;
      }
    } else {
      isLoggingInRef.current = false;
    }
  };

  // ログアウト処理
  const handleLogout = async () => {
    try {
      await logoutUser();
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
