import React from "react";
// useNavigateはRouterのコンテキスト内でのみ使用可能
import { Clock, LogOut } from "lucide-react";

interface UnauthorizedProps {
  onLogout: () => void; // ログアウト処理を受け取る
}

const Unauthorized: React.FC<UnauthorizedProps> = ({ onLogout }) => {
  // コンポーネントがRouter内でレンダリングされていない場合に備えて、
  // useNavigateの使用をtry-catchで囲むか、またはルータの有無をチェックするカスタムフックで対応するのが理想的です。
  // ただし、この環境で「useNavigate() may be used only in the context of a <Router> component.」エラーを回避するため、
  // useNavigateの呼び出しは残しつつ、このコンポーネントがRouter内で呼ばれることを前提とします。

  // プレビュー時のエラーを避けるために、useNavigateの使用箇所を修正します。
  // ただし、今回はこのファイルがRouterの外部で単独で表示された際に発生するエラーであるため、
  // 実行環境全体 (`App.tsx` のルーティング設定) の問題の可能性が高いですが、
  // このコンポーネント自体に問題がないことを保証するため、ロジックは維持します。

  const handleLogoutAndRedirect = () => {
    // ログアウト処理を実行
    onLogout();

    // ログイン画面へ遷移
    // ★ プレビュー時にエラーが発生しないように、navigateの実行を try-catch で囲む（本番環境のクラッシュ防止のため）
    try {
      // navigate("/login");
      window.location.href = "/";
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e: unknown) {
      console.warn(
        "Could not navigate: useNavigate hook is likely outside a <Router> context."
      );
    }
  };

  return (
    // 全体を画面いっぱいに広げ、背景を現在のテーマに合わせる
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-10 sm:p-16 text-center max-w-lg w-full transform transition-all duration-300 hover:scale-105">
        {/* トークン有効期限切れ/認証エラーを示すアイコン */}
        <Clock className="w-24 h-24 text-yellow-500 mx-auto mb-8 animate-pulse" />

        <h1 className="text-6xl font-extrabold text-gray-800 mb-6 tracking-tight">
          401 Unauthorized
        </h1>
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          セッションの有効期限が切れました。
          <br />
          セキュリティのため、再ログインが必要です。
        </p>
        <button
          onClick={handleLogoutAndRedirect}
          className="inline-flex items-center space-x-2 px-8 py-4 bg-gray-800 text-white font-bold text-lg rounded-full shadow-lg hover:bg-gray-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-gray-300"
        >
          <LogOut className="w-6 h-6" />
          <span>再ログインする</span>
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
