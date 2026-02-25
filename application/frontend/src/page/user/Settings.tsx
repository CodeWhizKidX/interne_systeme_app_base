// src/page/user/Settings.tsx
import { useState, useEffect } from "react";
import { useApiClient } from "../../api/useApiClient";
import { userApi } from "../../api/api";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";


interface ProfileForm {
  lastName: string;
  firstName: string;
  lastNameKana: string;
  firstNameKana: string;
  displayName: string;
}

function Settings() {
  const [profileForm, setProfileForm] = useState<ProfileForm>({
    lastName: "",
    firstName: "",
    lastNameKana: "",
    firstNameKana: "",
    displayName: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { fetchUserData } = useApiClient();

  // 現在のユーザー情報を取得
  useEffect(() => {
    const loadUserInfo = async () => {
      setIsLoading(true);
      try {
        const res = await fetchUserData(() => userApi.checkUserInfo());
        if (res?.data?.user) {
          const user = res.data.user;
          setProfileForm({
            lastName: user.lastName || "",
            firstName: user.firstName || "",
            lastNameKana: user.lastNameKana || "",
            firstNameKana: user.firstNameKana || "",
            displayName: user.displayName || "",
          });
        }
      } catch (err) {
        console.error("ユーザー情報の取得に失敗しました:", err);
        toast.error("ユーザー情報の取得に失敗しました");
      } finally {
        setIsLoading(false);
      }
    };

    loadUserInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // フォーム入力ハンドラ
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  // バリデーション
  const validate = (): boolean => {
    if (!profileForm.lastName.trim()) {
      toast.error("姓を入力してください");
      return false;
    }
    if (!profileForm.firstName.trim()) {
      toast.error("名を入力してください");
      return false;
    }
    if (!profileForm.lastNameKana.trim()) {
      toast.error("姓（フリガナ）を入力してください");
      return false;
    }
    if (!profileForm.firstNameKana.trim()) {
      toast.error("名（フリガナ）を入力してください");
      return false;
    }
    if (!profileForm.displayName.trim()) {
      toast.error("表示名を入力してください");
      return false;
    }
    if (profileForm.displayName.length > 16) {
      toast.error("表示名は16文字以内で入力してください");
      return false;
    }
    return true;
  };

  // プロフィールを更新
  const handleSave = async () => {
    if (!validate()) return;

    setIsSaving(true);
    try {
      const response = await fetchUserData(() =>
        userApi.updateProfile({
          lastName: profileForm.lastName.trim(),
          firstName: profileForm.firstName.trim(),
          lastNameKana: profileForm.lastNameKana.trim(),
          firstNameKana: profileForm.firstNameKana.trim(),
          displayName: profileForm.displayName.trim(),
        })
      );

      if (response?.data) {
        toast.success("プロフィールを更新しました");
        // ページをリロードして最新の情報を取得
        window.location.reload();
      }
    } catch (err: any) {
      console.error("プロフィールの更新に失敗しました:", err);
      toast.error(err.message || "プロフィールの更新に失敗しました");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullPage />;
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8 flex flex-col items-center justify-start pt-16">
      <div className="max-w-2xl mx-auto w-full">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">設定</h2>

          <div className="space-y-6">
            {/* 表示名セクション */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                表示名
              </h3>
              <div>
                <label
                  htmlFor="displayName"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  表示名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="displayName"
                  name="displayName"
                  value={profileForm.displayName}
                  onChange={handleInputChange}
                  placeholder="表示名を入力してください"
                  maxLength={16}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent text-gray-800"
                />
                <p className="mt-2 text-sm text-gray-500">
                  {profileForm.displayName.length}/16文字
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  この表示名は他のユーザーにも表示されます
                </p>
              </div>
            </div>

            {/* 氏名セクション */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                氏名
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    姓 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={profileForm.lastName}
                    onChange={handleInputChange}
                    placeholder="例: 山田"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent text-gray-800"
                  />
                </div>
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={profileForm.firstName}
                    onChange={handleInputChange}
                    placeholder="例: 太郎"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent text-gray-800"
                  />
                </div>
              </div>
            </div>

            {/* フリガナセクション */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                フリガナ
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="lastNameKana"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    姓（フリガナ） <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastNameKana"
                    name="lastNameKana"
                    value={profileForm.lastNameKana}
                    onChange={handleInputChange}
                    placeholder="例: ヤマダ"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent text-gray-800"
                  />
                </div>
                <div>
                  <label
                    htmlFor="firstNameKana"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    名（フリガナ） <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstNameKana"
                    name="firstNameKana"
                    value={profileForm.firstNameKana}
                    onChange={handleInputChange}
                    placeholder="例: タロウ"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent text-gray-800"
                  />
                </div>
              </div>
            </div>

            {/* 保存ボタン */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? "保存中..." : "保存"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Settings;
