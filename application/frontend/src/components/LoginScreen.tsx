// src/components/LoginScreen.tsx
import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import {
  AlertCircle,
  Loader2,
} from "lucide-react";

interface LoginScreenProps {
  onLoginSuccess: (idToken: string, userPayload: any) => void;
}

// Google IDトークンのペイロード型
interface GoogleTokenPayload {
  sub: string;
  email: string;
  email_verified: boolean;
  name?: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
  hd?: string;
  exp?: number;
  iat?: number;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Googleログイン処理
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      setError(null);

      try {
        console.log("Google login success, access token received");

        // アクセストークンを使ってユーザー情報を取得
        const userInfoResponse = await fetch(
          "https://www.googleapis.com/oauth2/v2/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );

        if (!userInfoResponse.ok) {
          throw new Error("Failed to fetch user info");
        }

        const userInfo = await userInfoResponse.json();
        console.log("User info:", userInfo);

        // トークンペイロードを作成
        // アクセストークンをIDトークンとして扱う（バックエンドで検証される）
        const tokenPayload: GoogleTokenPayload = {
          sub: userInfo.id,
          email: userInfo.email,
          email_verified: userInfo.verified_email,
          name: userInfo.name,
          picture: userInfo.picture,
          given_name: userInfo.given_name,
          family_name: userInfo.family_name,
          hd: userInfo.hd,
        };

        // アクセストークンをIDトークンとして使用（バックエンドで検証される）
        onLoginSuccess(tokenResponse.access_token, tokenPayload);
      } catch (err: unknown) {
        const error = err as Error;
        console.error("Login error:", error);
        setError("ログインに失敗しました。もう一度お試しください。");
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error("Google login error:", error);
      setError("ログインがキャンセルされました。");
      setIsLoading(false);
    },
    // flowを指定しない場合、デフォルトでimplicit flowが使用される
  });

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8">
          {/* ロゴ */}
          <div className="flex justify-center mb-4">
            <img src="/logo.png" alt="ManaPro ロゴ" className="h-16 w-auto" />
          </div>

          {/* タイトル */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-1">
              ManaPro
            </h1>
            <p className="text-gray-500 text-sm">プロンプトマネージャー</p>
          </div>

          {/* エラーメッセージ */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Google SSOボタン */}
          <button
            onClick={() => login()}
            disabled={isLoading}
            className="w-full py-3 bg-white border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                認証中...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Googleでログイン
              </>
            )}
          </button>

          {/* 補足テキスト */}
          <p className="text-center text-xs text-gray-400 mt-6">
            ログインすることで、
            <a
              href={import.meta.env.VITE_TERMS_URL || "/terms"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 hover:underline"
            >
              利用規約
            </a>
            に同意したものとみなされます
          </p>
        </div>

        {/* フッター */}
        <p className="text-center text-xs text-gray-400 mt-6">
          © 2024 ManaPro. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
