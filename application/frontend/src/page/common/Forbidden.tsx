import { useNavigate } from "react-router-dom";
import { ShieldOff, Home } from "lucide-react"; // 新しくアイコンをインポート

const Forbidden: React.FC = () => {
  const navigate = useNavigate();

  return (
    // 全体を画面いっぱいに広げ、背景を現在のテーマに合わせる
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-10 sm:p-16 text-center max-w-lg w-full transform transition-all duration-300 hover:scale-105">
        <ShieldOff className="w-24 h-24 text-red-500 mx-auto mb-8 animate-pulse" />{" "}
        {/* アイコンを追加 */}
        <h1 className="text-6xl font-extrabold text-gray-800 mb-6 tracking-tight">
          403 Forbidden
        </h1>
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          このページへのアクセス権限がありません。
          <br />
          システム管理者にお問い合わせください。
        </p>
        <button
          onClick={() => navigate("/login")}
          className="inline-flex items-center space-x-2 px-8 py-4 bg-gray-800 text-white font-bold text-lg rounded-full shadow-lg hover:bg-gray-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-gray-300"
        >
          <Home className="w-6 h-6" />
          <span>ホームに戻る</span>
        </button>
      </div>
    </div>
  );
};

export default Forbidden;
