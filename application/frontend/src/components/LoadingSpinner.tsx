// src/components/LoadingSpinner.tsx

import React from "react";
import { Loader2 } from "lucide-react";

/**
 * 統一されたローディングスピナーコンポーネント
 * 
 * 表示モード:
 * - fullPage: ページ全体のローディング表示（main要素として）
 * - fixed: オーバーレイ表示（画面を覆う半透明背景付き）
 * - インライン: セクション内のローディング表示
 * 
 * @param {boolean} fullPage - trueの場合、ページ全体のローディング表示
 * @param {boolean} fixed - trueの場合、オーバーレイ表示
 * @param {string} message - 表示するメッセージ（デフォルト: "データを読み込み中..."）
 */
interface LoadingSpinnerProps {
  fullPage?: boolean;
  fixed?: boolean;
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  fullPage = false,
  fixed = false,
  message = "データを読み込み中...",
}) => {
  // ページ全体のローディング表示
  if (fullPage) {
    return (
      <main className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="w-8 h-8 text-gray-600 animate-spin mb-4" />
          <p className="text-gray-600">{message}</p>
        </div>
      </main>
    );
  }

  // オーバーレイ表示（画面を覆う半透明背景付き）
  if (fixed) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50/80 backdrop-blur-sm">
        <div className="flex flex-col items-center">
          <Loader2 className="w-8 h-8 text-gray-600 animate-spin mb-4" />
          <p className="text-gray-600">{message}</p>
        </div>
      </div>
    );
  }

  // インライン表示（セクション内のローディング用）
  return (
    <div className="flex items-center justify-center w-full h-full min-h-[150px]">
      <div className="flex flex-col items-center">
        <Loader2 className="w-8 h-8 text-gray-600 animate-spin mb-4" />
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
