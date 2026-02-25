// src/components/Layout.tsx
import React, { useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
// Users (複数ユーザー) アイコンを導入し、ユーザーメニューへの切り替えに利用
import {
  Home,
  Settings,
  Users,
  X,
  BookOpen,
  HelpCircle,
} from "lucide-react";
import { useUser } from "../contexts/UserContext";
import Header from "./Header";

// --------------------------------------------------------------------------------
// ユーザーメニューと管理者メニューの定義
// --------------------------------------------------------------------------------

const USER_MENU_ITEMS = [
  {
    path: "/",
    label: "HOME",
    icon: <Home className="w-5 h-5" />,
  },
];

const ADMIN_MENU_ITEMS = [
  {
    path: "/admin",
    label: "ダッシュボード",
    icon: <Settings className="w-5 h-5" />,
  },
  {
    path: "/admin/userManagement",
    label: "ユーザー管理",
    icon: <Users className="w-5 h-5" />,
  },
];

// --------------------------------------------------------------------------------
// Sidebar コンポーネントの修正 (isAdminMode を受け取る)
// --------------------------------------------------------------------------------
const Sidebar: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  // ★ 管理者モードの状態を受け取る
  isAdminMode: boolean;
}> = ({
  isOpen,
  onClose,
  isAdminMode, // 受け取り
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  // ★ isAdminMode によって表示するメニューアイテムを切り替える
  const menuItems = isAdminMode ? ADMIN_MENU_ITEMS : USER_MENU_ITEMS;

  return (
    <>
      {/* モバイルでサイドバーが開いている時のオーバーレイ */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen bg-white shadow-xl transition-all duration-300 z-30 flex flex-col
    ${
      isOpen
        ? "w-64 sm:w-72 translate-x-0"
        : "w-0 -translate-x-full overflow-hidden"
    }
    lg:relative lg:w-72 lg:flex-shrink-0 lg:translate-x-0 lg:flex lg:h-full lg:overflow-hidden lg:bg-white`}
        style={
          {
            // height: "calc(100vh - 64px)", // このスタイルを削除し、親のflexコンテナに高さを合わせる
          }
        }
      >
        {/* 閉じるボタン（モバイルのみ表示） */}
        {isOpen && (
          <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
            <h2 className="text-lg font-semibold text-gray-800">メニュー</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="メニューを閉じる"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        )}

        <nav
          className={`space-y-1 flex-1 min-h-0 overflow-y-auto custom-scrollbar ${
            isOpen ? "p-4" : "p-0"
          } lg:p-4`}
        >
          {menuItems.map((item) => {
            // 💡 修正箇所: '/' と '/admin' のアクティブ判定を、完全に一致する場合のみアクティブになるように変更
            const isActive =
              item.path === "/" || item.path === "/admin"
                ? currentPath === item.path // パスが '/' または '/admin' の場合は、完全に一致する場合のみアクティブ
                : currentPath.startsWith(item.path); // それ以外は前方一致でOK

            return (
              <div
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  if (window.innerWidth < 1024) onClose(); // モバイルは閉じる
                }}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all
                ${
                  // 修正後のisActive変数を使用
                  isActive
                    ? "bg-gray-800 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center space-x-3">
                  {item.icon}
                  <span className="text-sm font-semibold">{item.label}</span>
                </div>
              </div>
            );
          })}
        </nav>

        {/* 下部メニュー（設定・利用マニュアル・サポート） */}
        <div
          className={`border-t border-gray-200 flex-shrink-0 ${
            isOpen ? "p-4" : "p-0"
          } lg:p-4`}
        >
          <div className="space-y-1">
            {/* 設定 */}
            <div
              onClick={() => {
                navigate("/settings");
                if (window.innerWidth < 1024) onClose();
              }}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all ${
                currentPath.startsWith("/settings")
                  ? "bg-gray-800 text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Settings className="w-5 h-5" />
              <span className="text-sm font-semibold">設定</span>
            </div>
            {import.meta.env.VITE_MANUAL_URL && (
              <div
                onClick={() => {
                  // 利用マニュアルへのリンク（環境変数から取得）
                  window.open(import.meta.env.VITE_MANUAL_URL, "_blank");
                  if (window.innerWidth < 1024) onClose();
                }}
                className="flex items-center space-x-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all text-gray-700 hover:bg-gray-100"
              >
                <BookOpen className="w-5 h-5" />
                <span className="text-sm font-semibold">利用マニュアル</span>
              </div>
            )}
            {import.meta.env.VITE_GUIDE_URL && (
              <div
                onClick={() => {
                  // サポートへのリンク（環境変数から取得）
                  window.open(import.meta.env.VITE_GUIDE_URL, "_blank");
                  if (window.innerWidth < 1024) onClose();
                }}
                className="flex items-center space-x-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all text-gray-700 hover:bg-gray-100"
              >
                <HelpCircle className="w-5 h-5" />
                <span className="text-sm font-semibold">サポート</span>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

// --------------------------------------------------------------------------------
// Footer コンポーネント
// --------------------------------------------------------------------------------
const APP_VERSION = "1.0.0";

const Footer: React.FC = () => {
  return (
      <footer className="bg-white border-t border-gray-200 px-6 py-4 shadow-inner flex-shrink-0">
      <div className="text-center text-sm text-gray-500">
        © 2024 Application Base - All Rights Reserved
        <span className="mx-2">|</span>
        <span>v{APP_VERSION}</span>
      </div>
    </footer>
  );
};

// --------------------------------------------------------------------------------
// Layout コンポーネントの Props
// --------------------------------------------------------------------------------
interface LayoutProps {
  onLogout: () => void;
}

// --------------------------------------------------------------------------------
// Layout コンポーネント
// --------------------------------------------------------------------------------
const Layout: React.FC<LayoutProps> = ({ onLogout }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // UserContextからユーザー情報を取得
  const { isAdmin } = useUser();

  // ★ 現在のパスが /admin で始まるかどうかで管理者モードを判定
  const isAdminMode = isAdmin() && currentPath.startsWith("/admin");

  // サイドバーの開閉状態を管理
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header */}
      <Header
        onLogout={onLogout}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      {/* メインコンテンツエリア */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* SidebarにisAdminModeを渡す */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
          isAdminMode={isAdminMode}
        />
        {/* メインコンテンツ */}
        <main className="flex-1 overflow-y-auto transition-all duration-300 relative">
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
