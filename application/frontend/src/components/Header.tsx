// src/components/Header.tsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, Settings, LogOut, Users } from "lucide-react";
import { useUser } from "../contexts/UserContext";

interface HeaderProps {
  onLogout: () => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({
  onLogout,
  toggleSidebar,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  
  // UserContextからユーザー情報を取得
  const { user, isAdmin, getDisplayName, getProfilePicture } = useUser();

  // ★ 現在のパスが /admin で始まるかどうかで管理者モードを判定
  const isAdminMode = isAdmin() && currentPath.startsWith("/admin");

  // プルダウンメニューの状態管理
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // ★ 管理者メニューへの遷移 (ユーザーモードから管理者モードへ)
  const handleAdminMenuClick = () => {
    navigate("/admin");
    setIsMenuOpen(false);
  };

  // ★ ユーザーメニューへの遷移 (管理者モードからユーザーモードへ)
  const handleUserMenuClick = () => {
    navigate("/"); // HOMEへ遷移
    setIsMenuOpen(false);
  };

  const handleLogoutClick = () => {
    onLogout();
    setIsMenuOpen(false);
  };

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  // メニュー外をクリックしたらメニューを閉じる処理
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  return (
    <header
      className={`shadow-lg border-b border-gray-200 px-6 py-2 flex-shrink-0 z-20 ${
        isAdminMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* サイドバー開閉ボタン */}
          <button
            onClick={toggleSidebar}
            className={`p-2 rounded-lg transition-colors lg:hidden ${
              isAdminMode
                ? "hover:bg-gray-700 text-white"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            <Menu className="w-6 h-6" />
          </button>

          <div
            className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate(isAdminMode ? "/admin" : "/")}
            title={isAdminMode ? "ダッシュボードに戻る" : "ホームに戻る"}
          >
            <img
              src="/logo.png"
              alt="ロゴ"
              className="w-10 h-10 object-contain"
            />
            <h1
              className={`text-xl font-bold ${
                isAdminMode ? "text-white" : "text-gray-800"
              }`}
            >
              ManaPro
              {/* ★ 管理者モードの場合は「[管理者]」の文字を追加 */}
              {isAdminMode && (
                <span className="ml-3 px-2 py-1 bg-white text-gray-800 text-xs font-bold rounded-full">
                  管理者モード
                </span>
              )}
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {user ? (
            <>
              <div ref={menuRef} className="relative">
                {/* ユーザー名と画像をクリック可能にするボタン */}
                <button
                  onClick={toggleMenu}
                  className={`flex items-center space-x-3 rounded-full px-2 py-1 transition-colors ${
                    isMenuOpen
                      ? isAdminMode
                        ? "bg-gray-700"
                        : "bg-gray-100"
                      : isAdminMode
                      ? "hover:bg-gray-700"
                      : "hover:bg-gray-100"
                  }`}
                >
                {/* プロフィール画像がある場合は画像を表示、それ以外はイニシャル */}
                {getProfilePicture() ? (
                  <img
                    src={getProfilePicture()!}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                    onError={(e) => {
                      // 画像の読み込みに失敗した場合はイニシャルを表示するため、親要素にイベントを伝播
                      const target = e.currentTarget;
                      target.style.display = "none";
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) {
                        fallback.style.display = "flex";
                      }
                    }}
                  />
                ) : null}
                {/* イニシャル表示（画像がない場合、または画像読み込み失敗時） */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    getProfilePicture() ? "hidden" : ""
                  } ${
                    isAdminMode
                      ? "bg-gray-600 text-white"
                      : "bg-gray-300 text-gray-700"
                  }`}
                >
                  {getDisplayName().charAt(0).toUpperCase()}
                </div>
                {/* ユーザー名の表示 */}
                <span
                  className={`text-sm font-medium hidden sm:block ${
                    isAdminMode ? "text-white" : "text-gray-700"
                  }`}
                >
                  {getDisplayName()}
                </span>
              </button>

              {/* プルダウンメニューの実装 */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 z-30 border border-gray-200">
                  {/* ★ 管理者権限があり、現在のモードによって表示を切り替える */}
                  {isAdmin() && (
                    <>
                      {/* 1. 現在ユーザーモードの場合: 管理者メニューへ遷移 */}
                      {!isAdminMode ? (
                        <button
                          onClick={handleAdminMenuClick}
                          className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors font-semibold"
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          管理者メニューへ
                        </button>
                      ) : (
                        // 2. 現在管理者モードの場合: ユーザーメニューへ遷移
                        <button
                          onClick={handleUserMenuClick}
                          className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors font-semibold"
                        >
                          <Users className="w-4 h-4 mr-2" />
                          ユーザーメニューへ
                        </button>
                      )}
                      <div className="border-t border-gray-100 my-1" />
                    </>
                  )}

                  {/* ログアウトボタン */}
                  <button
                    onClick={handleLogoutClick}
                    className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-red-500 hover:text-white transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    ログアウト
                  </button>
                </div>
              )}
              </div>
            </>
          ) : (
            <div className="h-8 w-20"></div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
