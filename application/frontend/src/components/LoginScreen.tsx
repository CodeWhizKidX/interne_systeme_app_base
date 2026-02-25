// src/components/LoginScreen.tsx
import { useState, useEffect } from "react";
import {
  signInWithGoogle,
  signInWithEmail,
  registerWithEmail,
  resendVerificationEmail,
  auth,
} from "../firebase";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Loader2,
  RefreshCw,
} from "lucide-react";

type AuthMode = "login" | "register" | "verification";

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // 再送信クールダウンタイマー
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // エラーメッセージの日本語化
  const getErrorMessage = (errorCode: string): string => {
    const errorMessages: Record<string, string> = {
      "auth/invalid-email": "無効なメールアドレス形式です",
      "auth/user-disabled": "このアカウントは無効化されています",
      "auth/user-not-found": "アカウントが見つかりません",
      "auth/wrong-password": "パスワードが正しくありません",
      "auth/invalid-credential": "メールアドレスまたはパスワードが正しくありません。またはアカウントが登録されていない可能性があります。",
      "auth/email-already-in-use": "このメールアドレスは既に使用されています",
      "auth/weak-password": "パスワードは6文字以上で設定してください",
      "auth/too-many-requests": "リクエストが多すぎます。しばらくしてからお試しください",
      "auth/popup-closed-by-user": "認証がキャンセルされました",
      "auth/network-request-failed": "ネットワークエラーが発生しました。接続を確認してください",
      "auth/operation-not-allowed": "この認証方法は有効化されていません",
    };
    return errorMessages[errorCode] || "認証エラーが発生しました。もう一度お試しください";
  };

  // フォームのリセット
  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setError(null);
  };

  // モード切り替え
  const switchMode = (newMode: AuthMode) => {
    resetForm();
    setMode(newMode);
  };

  // メールアドレス/パスワードでログイン
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const user = await signInWithEmail(email, password);

      // メール確認済みかチェック
      if (!user.emailVerified) {
        setMode("verification");
        setVerificationSent(false);
        setIsLoading(false);
        return;
      }

      onLoginSuccess();
    } catch (err: unknown) {
      const error = err as { code?: string };
      setError(getErrorMessage(error.code || ""));
    } finally {
      setIsLoading(false);
    }
  };

  // パスワード要件を満たしているかチェック
  const isPasswordValid = (pwd: string): boolean => {
    return pwd.length >= 6 && /[A-Z]/.test(pwd) && /[a-z]/.test(pwd) && /[0-9]/.test(pwd);
  };

  // メールアドレス/パスワードで新規登録
  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // パスワード確認
    if (password !== confirmPassword) {
      setError("パスワードが一致しません");
      return;
    }

    // パスワード要件チェック
    if (!isPasswordValid(password)) {
      setError("パスワードは6文字以上で、大文字・小文字・数字をそれぞれ1つ以上含める必要があります");
      return;
    }

    // メールアドレス形式チェック
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("有効なメールアドレスを入力してください");
      return;
    }

    setIsLoading(true);

    try {
      await registerWithEmail(email, password);
      setMode("verification");
      setVerificationSent(true);
      setResendCooldown(60);
    } catch (err: unknown) {
      const error = err as { code?: string };
      setError(getErrorMessage(error.code || ""));
    } finally {
      setIsLoading(false);
    }
  };

  // Google SSO認証（Firebase経由）
  const handleGoogleLogin = async () => {
    setError(null);
    setIsLoading(true);

    try {
      await signInWithGoogle();
      onLoginSuccess();
    } catch (err: unknown) {
      const error = err as { code?: string };
      if (error.code !== "auth/popup-closed-by-user") {
        setError(getErrorMessage(error.code || ""));
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 確認メールを再送信
  const handleResendVerification = async () => {
    if (resendCooldown > 0) return;
    
    setError(null);
    setIsLoading(true);

    try {
      const user = auth.currentUser;
      if (user) {
        await resendVerificationEmail(user);
        setVerificationSent(true);
        setResendCooldown(60);
      }
    } catch (err: unknown) {
      const error = err as { code?: string };
      setError(getErrorMessage(error.code || ""));
    } finally {
      setIsLoading(false);
    }
  };

  // メール確認後にログインを再試行
  const handleVerificationComplete = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const user = auth.currentUser;
      if (user) {
        await user.reload();
        if (user.emailVerified) {
          onLoginSuccess();
        } else {
          setError("メールアドレスがまだ確認されていません。メール内のリンクをクリックしてください。");
        }
      } else {
        setMode("login");
      }
    } catch (err: unknown) {
      const error = err as { code?: string };
      setError(getErrorMessage(error.code || ""));
    } finally {
      setIsLoading(false);
    }
  };

  // メール確認画面
  if (mode === "verification") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8">
            {/* ヘッダー */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <Mail className="h-8 w-8 text-gray-600" />
              </div>
            </div>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                メールアドレスの確認
              </h2>
              <p className="text-gray-600 text-sm">
                <span className="font-medium text-gray-800">{email}</span>
                <br />
                に確認メールを送信しました
              </p>
            </div>

            {/* 成功メッセージ */}
            {verificationSent && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-green-700">
                  確認メールを送信しました。メール内のリンクをクリックして認証を完了してください。
                </p>
              </div>
            )}

            {/* 迷惑メール注意 */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-700">
                <p className="font-medium mb-1">メールが届かない場合</p>
                <p>
                  確認メールが<span className="font-medium">迷惑メールフォルダ</span>に振り分けられている可能性があります。受信トレイに見当たらない場合は、迷惑メールフォルダもご確認ください。
                </p>
              </div>
            </div>

            {/* エラーメッセージ */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* 確認手順 */}
            <div className="bg-gray-50 rounded-lg p-5 mb-6">
              <h3 className="font-semibold text-gray-800 mb-4 text-sm">確認手順</h3>
              <ol className="space-y-3">
                {[
                  "メールアプリを開いてください",
                  "ManaPro からのメールを確認",
                  "メール内の「確認リンク」をクリック",
                  "このページに戻り「確認完了」をクリック",
                ].map((step, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600 flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-sm text-gray-600">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* ボタン */}
            <div className="space-y-3">
              <button
                onClick={handleVerificationComplete}
                disabled={isLoading}
                className="w-full py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    確認中...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    確認完了
                  </>
                )}
              </button>

              <button
                onClick={handleResendVerification}
                disabled={isLoading || resendCooldown > 0}
                className="w-full py-3 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                {resendCooldown > 0
                  ? `再送信まで ${resendCooldown} 秒`
                  : "確認メールを再送信"}
              </button>

              <button
                onClick={() => switchMode("login")}
                className="w-full py-3 text-gray-500 text-sm hover:text-gray-700 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                ログイン画面に戻る
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ログイン/新規登録画面
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

          {/* タブ切り替え */}
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => switchMode("login")}
              className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
                mode === "login"
                  ? "bg-white text-gray-800 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              ログイン
            </button>
            <button
              onClick={() => switchMode("register")}
              className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
                mode === "register"
                  ? "bg-white text-gray-800 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              新規登録
            </button>
          </div>

          {/* エラーメッセージ */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* フォーム */}
          <form onSubmit={mode === "login" ? handleEmailLogin : handleEmailRegister}>
            <div className="space-y-4">
              {/* メールアドレス */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  メールアドレス
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@email.com"
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-gray-200 focus:border-gray-300 transition-all outline-none"
                    required
                  />
                </div>
              </div>

              {/* パスワード */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  パスワード
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="パスワードを入力"
                    className="w-full pl-10 pr-12 py-3 bg-white border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-gray-200 focus:border-gray-300 transition-all outline-none"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {/* パスワード要件（新規登録時のみ表示） */}
                {mode === "register" && (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-gray-500 font-medium">パスワード要件:</p>
                    <ul className="text-xs text-gray-400 space-y-0.5 ml-1">
                      <li className={`flex items-center gap-1.5 ${password.length >= 6 ? "text-green-600" : ""}`}>
                        <span className={`w-1 h-1 rounded-full ${password.length >= 6 ? "bg-green-600" : "bg-gray-300"}`}></span>
                        6文字以上
                      </li>
                      <li className={`flex items-center gap-1.5 ${/[A-Z]/.test(password) ? "text-green-600" : ""}`}>
                        <span className={`w-1 h-1 rounded-full ${/[A-Z]/.test(password) ? "bg-green-600" : "bg-gray-300"}`}></span>
                        大文字を含む (A-Z)
                      </li>
                      <li className={`flex items-center gap-1.5 ${/[a-z]/.test(password) ? "text-green-600" : ""}`}>
                        <span className={`w-1 h-1 rounded-full ${/[a-z]/.test(password) ? "bg-green-600" : "bg-gray-300"}`}></span>
                        小文字を含む (a-z)
                      </li>
                      <li className={`flex items-center gap-1.5 ${/[0-9]/.test(password) ? "text-green-600" : ""}`}>
                        <span className={`w-1 h-1 rounded-full ${/[0-9]/.test(password) ? "bg-green-600" : "bg-gray-300"}`}></span>
                        数字を含む (0-9)
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {/* パスワード確認（新規登録時のみ） */}
              {mode === "register" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    パスワード（確認）
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="パスワードを再入力"
                      className="w-full pl-10 pr-12 py-3 bg-white border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-gray-200 focus:border-gray-300 transition-all outline-none"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {/* パスワード一致インジケーター */}
                  {confirmPassword && (
                    <div className={`flex items-center gap-2 mt-2 text-sm ${
                      password === confirmPassword ? "text-green-600" : "text-amber-600"
                    }`}>
                      {password === confirmPassword ? (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          パスワードが一致しています
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-4 w-4" />
                          パスワードが一致しません
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 送信ボタン */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  処理中...
                </>
              ) : mode === "login" ? (
                "ログイン"
              ) : (
                "アカウント作成"
              )}
            </button>
          </form>

          {/* 区切り線 */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-sm text-gray-400">または</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Google SSOボタン */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full py-3 bg-white border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
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
            Googleで続ける
          </button>

          {/* 補足テキスト */}
          <p className="text-center text-xs text-gray-400 mt-6">
            {mode === "login" ? (
              <>
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
              </>
            ) : (
              "アカウント作成後、確認メールが送信されます"
            )}
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
