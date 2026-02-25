import React, { useState } from "react";
import toast from "react-hot-toast";
import { userApi } from "../api/api";

interface FirstLoginModalProps {
  isOpen: boolean;
  onComplete: (displayName: string) => void;
}

const FirstLoginModal: React.FC<FirstLoginModalProps> = ({
  isOpen,
  onComplete,
}) => {
  const [displayName, setDisplayName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!displayName.trim()) {
      toast.error("表示名を入力してください");
      return;
    }

    if (displayName.length > 16) {
      toast.error("表示名は16文字以内で入力してください");
      return;
    }

    setIsSubmitting(true);
    try {
      const requestData = { displayName };

      await userApi.completeFirstLogin(requestData);
      
      toast.success("初回設定が完了しました");
      onComplete(displayName);
    } catch (error: any) {
      console.error("初回設定エラー:", error);
      const errorMessage =
        error.response?.data?.message || "エラーが発生しました";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // フォームが有効かどうかを判定
  const isFormValid = displayName.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm transition-opacity duration-300">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full p-8 m-4 transform transition-all duration-300 scale-100 max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 text-center">
          ようこそ！
        </h2>
        <p className="text-gray-600 mb-6 text-center leading-relaxed text-sm">
          はじめに、アプリ内で表示する
          <br />
          あなたのお名前を設定してください。
        </p>

        <form onSubmit={handleSubmit}>
          {/* 表示名 */}
          <div className="mb-6">
            <label
              htmlFor="displayName"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              表示名{" "}
              <span className="text-gray-400 font-normal ml-1">(必須)</span>
            </label>
            <input
              type="text"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all bg-gray-50 hover:bg-white text-gray-900 placeholder-gray-400"
              placeholder="例: 山田 太郎"
              maxLength={16}
              disabled={isSubmitting}
              required
            />
            <div className="text-right text-xs text-gray-400 mt-2 font-medium">
              {displayName.length}/16文字
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting || !isFormValid}
              className={`w-full py-3 px-6 rounded-xl text-white font-bold text-lg shadow-md transition-all transform hover:-translate-y-0.5 ${
                isSubmitting || !isFormValid
                  ? "bg-gray-300 cursor-not-allowed shadow-none text-gray-500"
                  : "bg-gray-800 hover:bg-gray-900 hover:shadow-lg"
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  設定中...
                </span>
              ) : (
                "はじめる"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FirstLoginModal;
