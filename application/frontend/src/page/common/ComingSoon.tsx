// src/page/ComingSoon.tsx
import React from "react";
import { Clock } from "lucide-react";

const ComingSoon: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center justify-start pt-16 text-center">
      <Clock className="w-16 h-16 text-gray-500 mb-6 animate-pulse" />
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        リリースまでもうしばらくお待ちください！
      </h1>
      <p className="text-lg text-gray-600 mb-6">
        現在システムは開発中です。
        皆さまにリリースされるまで少々お待ちください。
      </p>
      <div className="mt-4">
        <button
          onClick={() => window.location.reload()}
          className="bg-gray-800 hover:bg-gray-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition-colors"
        >
          ページを更新
        </button>
      </div>
    </div>
  );
};

export default ComingSoon;
