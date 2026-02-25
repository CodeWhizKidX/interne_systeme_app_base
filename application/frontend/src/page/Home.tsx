// src/page/Home.tsx
import React from "react";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-8 flex flex-col items-center justify-center">
      {/* ヒーローセクション */}
      <div className="text-center max-w-2xl">
        {/* タイトル */}
        <div className="mb-6">
          <span className="inline-block text-xs font-semibold tracking-[0.3em] text-gray-400 uppercase mb-4">
            Welcome to
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">
            <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
              Application
            </span>
          </h1>
          <div className="mt-3 h-1 w-24 mx-auto bg-gradient-to-r from-transparent via-gray-300 to-transparent rounded-full" />
        </div>

        {/* サブタイトル */}
        <p className="text-gray-500 text-base md:text-lg leading-relaxed font-light">
          アプリケーションのベースシステム
          <br />
          <span className="text-gray-700 font-medium">認証とユーザー管理機能を提供</span>
        </p>
      </div>
    </div>
  );
};

export default Home;
