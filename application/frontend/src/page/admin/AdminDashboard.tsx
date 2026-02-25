// src/pages/AdminDashboard.tsx
import React, { useEffect, useState } from "react";
import {
  Users,
  Activity,
  ArrowRight,
  Settings,
  Zap,
} from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { useApiClient } from "../../api/useApiClient";
import { userApi } from "../../api/api";
import toast from "react-hot-toast";

// 統計カードコンポーネント
const StatCard: React.FC<{
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: "blue" | "teal" | "purple" | "orange";
  onClick?: () => void;
}> = ({ title, value, icon, color, onClick }) => {
  const colorClasses = {
    blue: "bg-gray-100 text-gray-800 border-gray-200",
    teal: "bg-gray-100 text-gray-800 border-gray-200",
    purple: "bg-gray-100 text-gray-800 border-gray-200",
    orange: "bg-gray-100 text-gray-800 border-gray-200",
  };

  return (
    <div
      onClick={onClick}
      className={`relative bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-300 transition-all cursor-pointer group min-h-[160px] flex flex-col justify-center items-center`}
    >
      <div className="absolute top-6 left-6">
        <div
          className={`p-3 rounded-lg ${colorClasses[color]} group-hover:scale-110 transition-transform`}
        >
          {icon}
        </div>
      </div>
      <div className="text-center mt-4">
        <h3 className="text-4xl font-extrabold text-gray-900 mb-1 tracking-tight">
          {value}
        </h3>
        <p className="text-sm font-bold text-gray-500">{title}</p>
      </div>
    </div>
  );
};

// クイックアクションボタン
const QuickActionBtn: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  colorClass: string;
}> = ({ title, description, icon, onClick, colorClass }) => (
  <button
    onClick={onClick}
    className="flex items-start p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md hover:border-gray-200 transition-all text-left w-full group"
  >
    <div
      className={`p-2 rounded-lg mr-4 ${colorClass} group-hover:scale-105 transition-transform`}
    >
      {icon}
    </div>
    <div className="flex-1">
      <h4 className="font-bold text-gray-900 mb-0.5 group-hover:text-gray-700 transition-colors">
        {title}
      </h4>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
    <ArrowRight className="w-5 h-5 text-gray-300 ml-2 self-center group-hover:text-gray-600 transition-colors" />
  </button>
);

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { fetchUserData } = useApiClient();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    userCount: 0,
  });
  const [recentActivities, setRecentActivities] = useState<
    Array<{
      id: string;
      type: "user";
      title: string;
      subTitle: string;
      date: Date;
    }>
  >([]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // ユーザーデータを取得
        const usersRes = await fetchUserData(() => userApi.getUserInfo());

        let userCount = 0;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const activities: any[] = [];

        // ユーザーデータ処理
        if (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (usersRes?.data as any)?.rsults?.users
        ) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const users = (usersRes?.data as any).rsults.users;
          userCount = users.length;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          users.forEach((u: any) => {
            if (u.registrationDate) {
              activities.push({
                id: `u-${u.id}`,
                type: "user",
                title: `${u.lastName} ${u.firstName}`,
                subTitle: "新規ユーザー登録",
                date: new Date(u.registrationDate),
              });
            }
          });
        }

        setStats({ userCount });

        // 日付順にソートして最新10件を取得
        activities.sort((a, b) => b.date.getTime() - a.date.getTime());
        setRecentActivities(activities.slice(0, 10));
      } catch (err) {
        console.error(err);
        toast.error("ダッシュボード情報の取得に失敗しました");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      const diffHours = Math.floor(diff / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diff / (1000 * 60));
        return `${diffMinutes}分前`;
      }
      return `${diffHours}時間前`;
    } else if (diffDays < 7) {
      return `${diffDays}日前`;
    } else {
      return date.toLocaleDateString("ja-JP");
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "user":
        return <Users className="w-4 h-4 text-gray-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActivityColor = () => {
    return "bg-gray-100";
  };

  if (isLoading) {
    return <LoadingSpinner fullPage />;
  }

  return (
    <div className="p-6 sm:p-10 font-sans text-gray-900 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center mb-2">
          <Settings className="w-8 h-8 mr-3 text-gray-800" />
          管理者ダッシュボード
        </h1>
        <p className="text-gray-500">
          システムの全体像と最新のアクティビティを一目で確認できます。
        </p>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="登録ユーザー"
          value={`${stats.userCount}名`}
          icon={<Users className="w-6 h-6" />}
          color="blue"
          onClick={() => navigate("/admin/userManagement")}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* メイン: 最近のアクティビティ */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-800 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-gray-600" />
                最近のアクティビティ
              </h2>
            </div>
            <div className="divide-y divide-gray-50 h-[500px] overflow-y-auto custom-scrollbar">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="p-4 hover:bg-gray-50 transition-colors flex items-start group"
                  >
                    <div
                      className={`p-2 rounded-full mr-4 flex-shrink-0 ${getActivityColor()}`}
                    >
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate group-hover:text-gray-700 transition-colors">
                        {activity.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {activity.subTitle}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                      {formatDate(activity.date)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-gray-400 text-sm flex flex-col items-center">
                  <Activity className="w-8 h-8 mb-2 opacity-20" />
                  アクティビティはまだありません
                </div>
              )}
            </div>
          </div>
        </div>

        {/* サイド: クイックアクション */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-yellow-500" />
              クイックアクション
            </h2>
            <div className="space-y-3">
              <QuickActionBtn
                title="ユーザー管理"
                description="ユーザーの追加・編集・権限設定"
                icon={<Users className="w-5 h-5 text-gray-600" />}
                colorClass="bg-gray-100"
                onClick={() => navigate("/admin/userManagement")}
              />
              {/* 必要に応じて追加
              <QuickActionBtn
                title="システム設定"
                description="全体設定の変更"
                icon={<Settings className="w-5 h-5 text-gray-600" />}
                colorClass="bg-gray-50"
                onClick={() => navigate("/admin/settings")}
              />
              */}
            </div>
          </div>

          {/* インフォメーション */}
          <div className="bg-gray-800 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-2 -mr-2 w-16 h-16 bg-white opacity-10 rounded-full"></div>
            <h3 className="font-bold text-lg mb-2 relative z-10">
              管理者の方へ
            </h3>
            <p className="text-sm opacity-90 mb-4 relative z-10">
              ユーザーの権限設定やチーム構成は定期的に見直すことで、セキュリティと使いやすさを維持できます。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
