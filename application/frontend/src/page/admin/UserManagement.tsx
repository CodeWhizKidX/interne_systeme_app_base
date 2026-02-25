/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/UserManagement.tsx
import React, { useEffect, useState } from "react";
import {
  UserPlus,
  Search,
  Shield,
  User,
  Users,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Wrench,
  Eye,
  Info,
  Loader2,
  AlertTriangle, // 削除確認用のアイコン
  Edit, // 編集アイコン
  Trash2, // 削除アイコン
  Upload, // CSVアップロード用
  Download, // テンプレートダウンロード用
  FileSpreadsheet, // CSV関連アイコン
} from "lucide-react";
import { adminUserApi } from "../../api/api";
import toast from "react-hot-toast";

// モック用の LoadingSpinner コンポーネント
const LoadingSpinner: React.FC<{ fixed?: boolean }> = ({ fixed }) => (
  <div
    className={`${
      fixed ? "fixed inset-0 z-50 bg-white/80" : ""
    } flex justify-center items-center`}
  >
    <Loader2 className="w-8 h-8 text-gray-600 animate-spin" />
  </div>
);

// モック用の API クライアント
const useApiClient = () => {
  const fetchUserData = async (apiCall: () => Promise<any>) => {
    return await apiCall();
  };
  return { fetchUserData };
};

// モック用の API
/*
const userApi = {
  getUserInfo: async () => {
    // ダミーデータを返す
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            rsults: {
              users: [
                {
                  id: "1", // IDを追加
                  lastName: "山田",
                  firstName: "太郎",
                  emailAddress: "yamada@example.com",
                  registrationDate: "2023-01-15T10:00:00",
                  status: "active",
                  authority: "globalAdmin", // 初期データも新しい権限体系に合わせて修正
                },
                {
                  id: "2",
                  lastName: "鈴木",
                  firstName: "花子",
                  emailAddress: "suzuki@example.com",
                  registrationDate: "2023-02-20T14:30:00",
                  status: "active",
                  authority: "serviceAdmin",
                },
                {
                  id: "3",
                  lastName: "佐藤",
                  firstName: "一郎",
                  emailAddress: "sato@example.com",
                  registrationDate: "2023-03-10T09:15:00",
                  status: "inactive",
                  authority: "user",
                },
              ],
            },
          },
        });
      }, 500);
    });
  },
};
*/

// 権限の型定義
type AdminRoleType = "globalAdmin" | "serviceAdmin" | "readonlyAdmin";
type UserAuthority = AdminRoleType | "user";

// UserData インターフェース (IDを追加)
interface UserData {
  id: string;
  lastName: string;
  firstName: string;
  lastNameKana: string;
  firstNameKana: string;
  emailAddress: string;
  registrationDate: string;
  status: "active" | "inactive";
  authority: UserAuthority;
}

// 管理者役割の詳細定義
const ADMIN_ROLE_DETAILS: Record<
  AdminRoleType,
  {
    label: string;
    description: string;
    features: string[];
    roleSummary: string;
    icon: React.ElementType;
    colorClass: string;
  }
> = {
  globalAdmin: {
    label: "グローバル管理者",
    description: "システム全体に関する全ての操作が可能です。",
    features: [
      "ユーザー管理（全操作）",
      "チーム管理（全操作）",
      "管理者権限の管理",
      "システム設定の変更",
    ],
    roleSummary: "最高責任者向け。慎重に割り当ててください。",
    icon: ShieldAlert,
    colorClass: "bg-red-100 text-red-800",
  },
  serviceAdmin: {
    label: "一般管理者",
    description: "日常的な運用管理が可能。システム設定は変更不可。",
    features: [
      "ユーザー管理（一般のみ）",
      "チーム管理（メンバー編集等）",
      "データ監視・レポート",
    ],
    roleSummary: "日々の運用担当者向け。",
    icon: Wrench,
    colorClass: "bg-orange-100 text-orange-800",
  },
  readonlyAdmin: {
    label: "読み取り専用管理者",
    description: "全ての管理データを閲覧可能。変更・削除は不可。",
    features: ["ユーザーリスト閲覧", "チーム構成確認", "操作ログ確認"],
    roleSummary: "監査担当者や閲覧が必要な方向け。",
    icon: Eye,
    colorClass: "bg-gray-100 text-gray-800",
  },
};

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [authorityFilter, setAuthorityFilter] = useState<
    "all" | "admin" | "user"
  >("all");

  // ページング関連のステート
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // モーダル関連のステート
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // 削除確認モーダル用
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false); // CSV一括登録モーダル用
  const [editingUser, setEditingUser] = useState<UserData | null>(null); // 編集対象ユーザー
  const [deletingUser, setDeletingUser] = useState<UserData | null>(null); // 削除対象ユーザー

  // CSV一括登録用のステート
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvPreviewData, setCsvPreviewData] = useState<
    Array<{
      lastName: string;
      firstName: string;
      lastNameKana: string;
      firstNameKana: string;
      email: string;
      authority: UserAuthority;
      isValid: boolean;
      errorMessage?: string;
    }>
  >([]);
  const [isCsvUploading, setIsCsvUploading] = useState(false);

  const [userForm, setUserForm] = useState({
    lastName: "",
    firstName: "",
    lastNameKana: "",
    firstNameKana: "",
    email: "",
    authority: "user" as UserAuthority,
  });
  const [errors, setErrors] = useState<{
    lastName?: string;
    firstName?: string;
    lastNameKana?: string;
    firstNameKana?: string;
    email?: string;
  }>({});

  const { fetchUserData } = useApiClient();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const res: any = await fetchUserData(() => adminUserApi.getAllUsers());
        const processedUsers: UserData[] = res.data!.users.map(
          (user: any) => ({
            id: user.id || Math.random().toString(36).substr(2, 9), // IDがない場合は生成（フォールバック）
            lastName: user.lastName || "",
            firstName: user.firstName || "",
            lastNameKana: user.lastNameKana || "",
            firstNameKana: user.firstNameKana || "",
            emailAddress: user.email, // getAllUsersService では email として返される
            registrationDate: user.createdAt // getAllUsersService では createdAt として返される
              ? typeof user.createdAt === "string"
                ? user.createdAt.replace("T", " ").split(".")[0]
                : new Date(user.createdAt)
                    .toISOString()
                    .replace("T", " ")
                    .split(".")[0]
              : "",
            status: user.status || "inactive",
            authority: user.authority || "user",
          })
        );
        setUsers(processedUsers);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // フォーム入力ハンドラ
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof typeof errors];
        return newErrors;
      });
    }
  };

  // 権限変更ハンドラ
  const handleAuthorityChange = (auth: UserAuthority) => {
    setUserForm((prev) => ({ ...prev, authority: auth }));
  };

  // バリデーション
  const validate = () => {
    const newErrors: {
      lastName?: string;
      firstName?: string;
      lastNameKana?: string;
      firstNameKana?: string;
      email?: string;
    } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userForm.lastName.trim()) newErrors.lastName = "姓は必須です。";
    if (!userForm.firstName.trim()) newErrors.firstName = "名は必須です。";
    if (!userForm.lastNameKana.trim())
      newErrors.lastNameKana = "姓（フリガナ）は必須です。";
    if (!userForm.firstNameKana.trim())
      newErrors.firstNameKana = "名（フリガナ）は必須です。";
    if (!userForm.email.trim()) {
      newErrors.email = "メールアドレスは必須です。";
    } else if (!emailRegex.test(userForm.email)) {
      newErrors.email = "無効なメールアドレス形式です。";
    } else if (
      // 編集時は自分自身のメールアドレス重複は許容する
      users.some(
        (user) =>
          user.emailAddress === userForm.email &&
          (!editingUser || user.emailAddress !== editingUser.emailAddress)
      )
    ) {
      newErrors.email = "このメールアドレスは既に登録されています。";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ユーザー保存処理（新規作成・編集共通）
  const handleSaveUser = async () => {
    if (!validate()) return;

    if (editingUser) {
      // 編集処理
      setIsLoading(true);
      try {
        const requestBody = {
          originalEmail: editingUser.emailAddress, // 元のメールアドレスでユーザーを特定
          firstName: userForm.firstName.trim(),
          lastName: userForm.lastName.trim(),
          firstNameKana: userForm.firstNameKana.trim(),
          lastNameKana: userForm.lastNameKana.trim(),
          email: userForm.email.trim(),
          authority: userForm.authority,
          status: editingUser.status,
        };

        const res = await fetchUserData(() => adminUserApi.updateUser(requestBody));

        if (res && res.data) {
          const updatedUser: UserData = {
            id: res.data.user.id,
            lastName: res.data.user.lastName,
            firstName: res.data.user.firstName,
            lastNameKana: res.data.user.lastNameKana,
            firstNameKana: res.data.user.firstNameKana,
            emailAddress: res.data.user.emailAddress,
            registrationDate: res.data.user.registrationDate
              .replace("T", " ")
              .split(".")[0],
            status: res.data.user.status as "active" | "inactive",
            authority: res.data.user.authority as UserAuthority,
          };
          // emailAddressでマッチング（IDは保持しない方針のため）
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.emailAddress === editingUser.emailAddress
                ? updatedUser
                : user
            )
          );
          closeModal();
          toast.success("ユーザー情報を更新しました。", { duration: 3000 });
        } else {
          console.error("ユーザー更新に失敗しました");
          toast.error("ユーザーの更新に失敗しました。", { duration: 3000 });
        }
      } catch (err: any) {
        console.error("ユーザー更新エラー:", err);
        const errorMessage =
          err.response?.data?.message || "ユーザーの更新に失敗しました。";
        toast.error(errorMessage, { duration: 3000 });
      } finally {
        setIsLoading(false);
      }
    } else {
      // 新規登録処理
      setIsLoading(true);
      try {
        const requestBody = {
          firstName: userForm.firstName.trim(),
          lastName: userForm.lastName.trim(),
          firstNameKana: userForm.firstNameKana.trim(),
          lastNameKana: userForm.lastNameKana.trim(),
          email: userForm.email.trim(),
          authority: userForm.authority,
          status: "active" as const,
        };

        const res = await fetchUserData(() => adminUserApi.createUser(requestBody));

        if (res && res.data) {
          const newUser: UserData = {
            id: res.data.user.id,
            lastName: res.data.user.lastName,
            firstName: res.data.user.firstName,
            lastNameKana: res.data.user.lastNameKana,
            firstNameKana: res.data.user.firstNameKana,
            emailAddress: res.data.user.emailAddress,
            registrationDate: res.data.user.registrationDate
              .replace("T", " ")
              .split(".")[0],
            status: res.data.user.status as "active" | "inactive",
            authority: res.data.user.authority as UserAuthority,
          };
          setUsers((prevUsers) => [...prevUsers, newUser]);
          closeModal();
          toast.success("ユーザーを追加しました。", { duration: 3000 });
        } else {
          console.error("ユーザー作成に失敗しました");
          toast.error("ユーザーの作成に失敗しました。", { duration: 3000 });
        }
      } catch (err: any) {
        console.error("ユーザー作成エラー:", err);
        const errorMessage =
          err.response?.data?.message || "ユーザーの作成に失敗しました。";
        toast.error(errorMessage, { duration: 3000 });
      } finally {
        setIsLoading(false);
      }
    }
  };

  // ユーザー削除処理
  const handleDeleteUser = async () => {
    if (!deletingUser) return;

    setIsLoading(true);
    try {
      const requestBody = {
        email: deletingUser.emailAddress,
      };

      const res = await fetchUserData(() => adminUserApi.deleteUser(requestBody));

      if (res && res.data) {
        // ユーザーリストから削除（emailAddressでマッチング）
        setUsers((prevUsers) =>
          prevUsers.filter(
            (user) => user.emailAddress !== deletingUser.emailAddress
          )
        );
        closeDeleteModal();
        toast.success("ユーザーを削除しました。", { duration: 3000 });
      } else {
        console.error("ユーザー削除に失敗しました");
        toast.error("ユーザーの削除に失敗しました。", { duration: 3000 });
      }
    } catch (err: any) {
      console.error("ユーザー削除エラー:", err);
      const errorMessage =
        err.response?.data?.message || "ユーザーの削除に失敗しました。";
      toast.error(errorMessage, { duration: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  // モーダルを開く（新規追加）
  const openAddModal = () => {
    setEditingUser(null);
    setUserForm({
      lastName: "",
      firstName: "",
      lastNameKana: "",
      firstNameKana: "",
      email: "",
      authority: "user",
    });
    setErrors({});
    setIsModalOpen(true);
  };

  // モーダルを開く（編集）
  const openEditModal = (user: UserData) => {
    setEditingUser(user);
    setUserForm({
      lastName: user.lastName,
      firstName: user.firstName,
      lastNameKana: user.lastNameKana,
      firstNameKana: user.firstNameKana,
      email: user.emailAddress,
      authority: user.authority,
    });
    setErrors({});
    setIsModalOpen(true);
  };

  // 削除確認モーダルを開く
  const openDeleteModal = (user: UserData) => {
    setDeletingUser(user);
    setIsDeleteModalOpen(true);
  };

  // モーダルを閉じる
  const closeModal = () => setIsModalOpen(false);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);
  const closeCsvModal = () => {
    setIsCsvModalOpen(false);
    setCsvFile(null);
    setCsvPreviewData([]);
  };

  // CSVテンプレートのダウンロード
  const downloadCsvTemplate = () => {
    const header = "姓,名,姓（フリガナ）,名（フリガナ）,メールアドレス,権限";
    const example1 = "山田,太郎,ヤマダ,タロウ,yamada@example.com,user";
    const example2 = "鈴木,花子,スズキ,ハナコ,suzuki@example.com,serviceAdmin";
    const csvContent = `${header}\n${example1}\n${example2}`;
    
    // BOMを追加してExcelで文字化けしないようにする
    const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
    const blob = new Blob([bom, csvContent], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ユーザー一括登録テンプレート.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // CSVファイルの解析
  const parseCsvFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split(/\r?\n/).filter((line) => line.trim() !== "");
      
      // ヘッダー行をスキップ
      const dataLines = lines.slice(1);
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      const parsedData = dataLines.map((line) => {
        // CSVの各フィールドを解析（カンマ区切り、ダブルクォート対応）
        const fields: string[] = [];
        let currentField = "";
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === "," && !inQuotes) {
            fields.push(currentField.trim());
            currentField = "";
          } else {
            currentField += char;
          }
        }
        fields.push(currentField.trim());
        
        const [lastName, firstName, lastNameKana, firstNameKana, email, authority] = fields;
        
        // バリデーション
        const errors: string[] = [];
        if (!lastName) errors.push("姓が未入力");
        if (!firstName) errors.push("名が未入力");
        if (!lastNameKana) errors.push("姓（フリガナ）が未入力");
        if (!firstNameKana) errors.push("名（フリガナ）が未入力");
        if (!email) {
          errors.push("メールアドレスが未入力");
        } else if (!emailRegex.test(email)) {
          errors.push("メールアドレスの形式が不正");
        } else if (users.some((u) => u.emailAddress === email)) {
          errors.push("既に登録済みのメールアドレス");
        }
        
        // 権限値のマッピング（大文字小文字を区別しない）
        const authorityMapping: Record<string, UserAuthority> = {
          user: "user",
          globaladmin: "globalAdmin",
          serviceadmin: "serviceAdmin",
          readonlyadmin: "readonlyAdmin",
        };
        const normalizedAuthority = authorityMapping[(authority || "user").toLowerCase()];
        if (!normalizedAuthority) {
          errors.push("権限の値が不正");
        }
        
        return {
          lastName: lastName || "",
          firstName: firstName || "",
          lastNameKana: lastNameKana || "",
          firstNameKana: firstNameKana || "",
          email: email || "",
          authority: normalizedAuthority || "user",
          isValid: errors.length === 0,
          errorMessage: errors.length > 0 ? errors.join(", ") : undefined,
        };
      });
      
      // 重複メールアドレスのチェック（CSV内での重複）
      const emailCounts = new Map<string, number>();
      parsedData.forEach((row) => {
        if (row.email) {
          emailCounts.set(row.email, (emailCounts.get(row.email) || 0) + 1);
        }
      });
      
      parsedData.forEach((row) => {
        if (row.email && (emailCounts.get(row.email) || 0) > 1) {
          row.isValid = false;
          row.errorMessage = row.errorMessage 
            ? `${row.errorMessage}, CSV内でメールアドレスが重複` 
            : "CSV内でメールアドレスが重複";
        }
      });
      
      setCsvPreviewData(parsedData);
    };
    reader.readAsText(file);
  };

  // CSVファイル選択ハンドラ
  const handleCsvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCsvFile(file);
      parseCsvFile(file);
    }
  };

  // CSV一括登録処理
  const handleCsvBulkRegister = async () => {
    const validRows = csvPreviewData.filter((row) => row.isValid);
    if (validRows.length === 0) {
      toast.error("登録可能なデータがありません。", { duration: 3000 });
      return;
    }

    setIsCsvUploading(true);
    let successCount = 0;
    let errorCount = 0;

    for (const row of validRows) {
      try {
        const requestBody = {
          firstName: row.firstName.trim(),
          lastName: row.lastName.trim(),
          firstNameKana: row.firstNameKana.trim(),
          lastNameKana: row.lastNameKana.trim(),
          email: row.email.trim(),
          authority: row.authority,
          status: "active" as const,
        };

        const res = await fetchUserData(() => adminUserApi.createUser(requestBody));

        if (res && res.data) {
          const newUser: UserData = {
            id: res.data.user.id,
            lastName: res.data.user.lastName,
            firstName: res.data.user.firstName,
            lastNameKana: res.data.user.lastNameKana,
            firstNameKana: res.data.user.firstNameKana,
            emailAddress: res.data.user.emailAddress,
            registrationDate: res.data.user.registrationDate
              .replace("T", " ")
              .split(".")[0],
            status: res.data.user.status as "active" | "inactive",
            authority: res.data.user.authority as UserAuthority,
          };
          setUsers((prevUsers) => [...prevUsers, newUser]);
          successCount++;
        } else {
          errorCount++;
        }
      } catch (err) {
        console.error("ユーザー作成エラー:", err);
        errorCount++;
      }
    }

    setIsCsvUploading(false);

    if (successCount > 0) {
      toast.success(`${successCount}件のユーザーを登録しました。`, { duration: 3000 });
    }
    if (errorCount > 0) {
      toast.error(`${errorCount}件の登録に失敗しました。`, { duration: 3000 });
    }

    closeCsvModal();
  };

  // フィルタリング
  const filteredUsers = users.filter((user) => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const textMatch =
      user.lastName.toLowerCase().includes(lowerSearchTerm) ||
      user.firstName.toLowerCase().includes(lowerSearchTerm) ||
      user.lastNameKana.toLowerCase().includes(lowerSearchTerm) ||
      user.firstNameKana.toLowerCase().includes(lowerSearchTerm) ||
      user.emailAddress.toLowerCase().includes(lowerSearchTerm);
    const statusMatch = statusFilter === "all" || user.status === statusFilter;
    const isUserAdmin = user.authority !== "user";
    const authorityMatch =
      authorityFilter === "all" ||
      (authorityFilter === "admin" && isUserAdmin) ||
      (authorityFilter === "user" && !isUserAdmin);
    return textMatch && statusMatch && authorityMatch;
  });

  // ページング計算
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // フィルター変更時にページをリセット
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, authorityFilter]);

  // 権限ラベル取得
  const getRoleLabel = (authority: UserAuthority) => {
    if (authority === "user") {
      return (
        <span className="inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800">
          <User className="w-3 h-3 mr-1" />
          一般ユーザー
        </span>
      );
    }
    const roleDetail = ADMIN_ROLE_DETAILS[authority as AdminRoleType];
    return roleDetail ? (
      <span
        className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full ${roleDetail.colorClass}`}
      >
        <roleDetail.icon className="w-3 h-3 mr-1" />
        {roleDetail.label}
      </span>
    ) : null;
  };

  return (
    <div className="p-6 sm:p-10 relative font-sans text-gray-900">
      {isLoading && <LoadingSpinner fixed={true} />}
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6 flex items-center">
        <Users className="w-8 h-8 mr-3 text-gray-600" />
        ユーザー管理
      </h1>
      <div className="flex justify-between items-center mb-6 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center space-x-4">
          <p className="text-sm font-semibold text-gray-600">登録人数:</p>
          <span className="text-2xl font-bold text-gray-800">
            {users.length} <span className="text-base font-normal">名</span>
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsCsvModalOpen(true)}
            className="flex items-center px-4 py-2 bg-white text-gray-700 font-semibold rounded-lg shadow border border-gray-300 hover:bg-gray-50 transition-all active:scale-95"
            disabled={isLoading}
          >
            <Upload className="w-5 h-5 mr-2" />
            CSV一括登録
          </button>
          <button
            onClick={openAddModal}
            className="flex items-center px-4 py-2 bg-gray-800 text-white font-semibold rounded-lg shadow hover:bg-gray-700 transition-all active:scale-95"
            disabled={isLoading}
          >
            <UserPlus className="w-5 h-5 mr-2" />
            ユーザー追加
          </button>
        </div>
      </div>

      {/* 検索・フィルターバー */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="relative flex-grow min-w-[240px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="姓、名、フリガナ、メールアドレスで検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent shadow-sm outline-none transition-all"
            disabled={isLoading}
          />
        </div>
        {/* ステータス・権限フィルター (変更なし) */}
        <div className="flex items-center space-x-2">
          <label
            htmlFor="status-filter"
            className="text-sm font-medium text-gray-700 whitespace-nowrap"
          >
            ステータス:
          </label>
          <div className="relative">
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as "all" | "active" | "inactive")
              }
              className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent shadow-sm bg-white cursor-pointer outline-none transition-all"
              disabled={isLoading}
            >
              <option value="all">すべて</option>
              <option value="active">アクティブ</option>
              <option value="inactive">停止中</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <label
            htmlFor="authority-filter"
            className="text-sm font-medium text-gray-700 whitespace-nowrap"
          >
            権限:
          </label>
          <div className="relative">
            <select
              id="authority-filter"
              value={authorityFilter}
              onChange={(e) =>
                setAuthorityFilter(e.target.value as "all" | "admin" | "user")
              }
              className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent shadow-sm bg-white cursor-pointer outline-none transition-all"
              disabled={isLoading}
            >
              <option value="all">すべて</option>
              <option value="admin">管理者</option>
              <option value="user">一般ユーザー</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* ユーザーリスト */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  氏名
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  メールアドレス
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  ステータス
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  管理権限
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  登録日
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => openEditModal(user)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="p-1.5 bg-gray-100 rounded-full mr-3">
                          <User className="w-4 h-4 text-gray-500" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.lastName} {user.firstName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {user.lastNameKana} {user.firstNameKana}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        {user.emailAddress}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {user.status === "active" ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          アクティブ
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                          <XCircle className="w-3 h-3 mr-1" />
                          停止中
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleLabel(user.authority)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {user.registrationDate}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteModal(user);
                        }}
                        className="text-red-600 hover:text-red-800 font-semibold transition-colors flex items-center inline-flex"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        削除
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    {!isLoading
                      ? "検索条件に一致するユーザーはいません。"
                      : "データを読み込み中..."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ページネーション */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            <span className="font-medium">
              {startIndex + 1} - {Math.min(endIndex, filteredUsers.length)}
            </span>
            <span className="text-gray-500"> / {filteredUsers.length} 件</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-2 rounded-lg border ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                  : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
              } transition-colors`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => {
                  // ページ数が多い場合は省略表示
                  if (totalPages <= 7) {
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                          currentPage === page
                            ? "bg-gray-800 text-white border-gray-800"
                            : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else {
                    // 最初のページ
                    if (page === 1) {
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                            currentPage === page
                              ? "bg-gray-800 text-white border-gray-800"
                              : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    }
                    // 最後のページ
                    if (page === totalPages) {
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                            currentPage === page
                              ? "bg-gray-800 text-white border-gray-800"
                              : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    }
                    // 現在のページの前後2ページ
                    if (page >= currentPage - 2 && page <= currentPage + 2) {
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                            currentPage === page
                              ? "bg-gray-800 text-white border-gray-800"
                              : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    }
                    // 省略記号
                    if (page === currentPage - 3 || page === currentPage + 3) {
                      return (
                        <span key={page} className="px-2 text-gray-500">
                          ...
                        </span>
                      );
                    }
                    return null;
                  }
                }
              )}
            </div>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
              className={`px-3 py-2 rounded-lg border ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                  : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
              } transition-colors`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ユーザー追加・編集モーダル */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex justify-center items-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8 transform transition-all">
            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <div className={`p-2 bg-gray-100 rounded-lg mr-3`}>
                    {editingUser ? (
                      <Edit className={`w-6 h-6 text-gray-600`} />
                    ) : (
                      <UserPlus className="w-6 h-6 text-gray-600" />
                    )}
                  </div>
                  {editingUser ? "ユーザー情報編集" : "新規ユーザー登録"}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveUser();
                }}
              >
                {/* 基本情報 */}
                <div className="space-y-4 mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-800 text-sm font-bold mr-2">
                      1
                    </span>
                    基本情報
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        姓 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={userForm.lastName}
                        onChange={handleInputChange}
                        className={`w-full p-2.5 border ${
                          errors.lastName
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-500/20"
                        } rounded-lg outline-none transition-all`}
                        placeholder="例: 山田"
                      />
                      {errors.lastName && (
                        <p className="text-xs text-red-600 mt-1 flex items-center">
                          <Info className="w-3 h-3 mr-1" /> {errors.lastName}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        名 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={userForm.firstName}
                        onChange={handleInputChange}
                        className={`w-full p-2.5 border ${
                          errors.firstName
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-500/20"
                        } rounded-lg outline-none transition-all`}
                        placeholder="例: 太郎"
                      />
                      {errors.firstName && (
                        <p className="text-xs text-red-600 mt-1 flex items-center">
                          <Info className="w-3 h-3 mr-1" /> {errors.firstName}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        姓（フリガナ） <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="lastNameKana"
                        value={userForm.lastNameKana}
                        onChange={handleInputChange}
                        className={`w-full p-2.5 border ${
                          errors.lastNameKana
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-500/20"
                        } rounded-lg outline-none transition-all`}
                        placeholder="例: ヤマダ"
                      />
                      {errors.lastNameKana && (
                        <p className="text-xs text-red-600 mt-1 flex items-center">
                          <Info className="w-3 h-3 mr-1" />{" "}
                          {errors.lastNameKana}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        名（フリガナ） <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="firstNameKana"
                        value={userForm.firstNameKana}
                        onChange={handleInputChange}
                        className={`w-full p-2.5 border ${
                          errors.firstNameKana
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-500/20"
                        } rounded-lg outline-none transition-all`}
                        placeholder="例: タロウ"
                      />
                      {errors.firstNameKana && (
                        <p className="text-xs text-red-600 mt-1 flex items-center">
                          <Info className="w-3 h-3 mr-1" />{" "}
                          {errors.firstNameKana}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      メールアドレス <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={userForm.email}
                      onChange={handleInputChange}
                      className={`w-full p-2.5 border ${
                        errors.email
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-500/20"
                      } rounded-lg outline-none transition-all`}
                      placeholder="user@company.com"
                    />
                    {errors.email && (
                      <p className="text-xs text-red-600 mt-1 flex items-center">
                        <Info className="w-3 h-3 mr-1" /> {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* 権限設定 */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-800 text-sm font-bold mr-2">
                      2
                    </span>
                    権限設定
                  </h3>
                  <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <span className="block text-sm font-bold text-gray-900">
                          アカウント種別
                        </span>
                        <span className="text-xs text-gray-500">
                          管理者権限を付与するか選択します
                        </span>
                      </div>
                      <label className="flex items-center cursor-pointer">
                        <div className="mr-3 text-sm font-medium text-right transition-colors min-w-[90px]">
                          {userForm.authority !== "user" ? (
                            <span className="text-gray-800 font-bold flex items-center justify-end">
                              <Shield className="w-4 h-4 mr-1" /> 管理者
                            </span>
                          ) : (
                            <span className="text-gray-500 flex items-center justify-end">
                              <User className="w-4 h-4 mr-1" /> 一般ユーザー
                            </span>
                          )}
                        </div>
                        <div className="relative">
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={userForm.authority !== "user"}
                            onChange={(e) => {
                              handleAuthorityChange(
                                e.target.checked ? "serviceAdmin" : "user"
                              );
                            }}
                          />
                          <div
                            className={`block w-14 h-8 rounded-full transition-colors duration-300 ease-in-out ${
                              userForm.authority !== "user"
                                ? "bg-gray-800"
                                : "bg-gray-300"
                            }`}
                          ></div>
                          <div
                            className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 ease-in-out shadow-sm flex items-center justify-center ${
                              userForm.authority !== "user"
                                ? "transform translate-x-6"
                                : ""
                            }`}
                          >
                            {userForm.authority !== "user" ? (
                              <Shield className="w-3.5 h-3.5 text-gray-800" />
                            ) : (
                              <User className="w-3.5 h-3.5 text-gray-400" />
                            )}
                          </div>
                        </div>
                      </label>
                    </div>

                    <div
                      className={`overflow-hidden transition-all duration-500 ease-in-out ${
                        userForm.authority !== "user"
                          ? "max-h-[1000px] opacity-100 mt-5 pt-5 border-t border-gray-200"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <p className="text-sm font-bold text-gray-900 mb-3">
                        管理者の役割を選択
                        <span className="text-red-500 ml-1">*</span>
                      </p>
                      <div className="space-y-3">
                        {(
                          Object.keys(ADMIN_ROLE_DETAILS) as AdminRoleType[]
                        ).map((roleKey) => {
                          const role = ADMIN_ROLE_DETAILS[roleKey];
                          const isSelected = userForm.authority === roleKey;
                          const RoleIcon = role.icon;
                          return (
                            <label
                              key={roleKey}
                              className={`flex flex-col p-3 rounded-lg border-2 cursor-pointer transition-all ${
                                isSelected
                                  ? "border-gray-800 bg-gray-50"
                                  : "border-gray-200 hover:border-gray-300 hover:bg-white"
                              }`}
                            >
                              <div className="flex items-start">
                                <div className="flex items-center h-5">
                                  <input
                                    type="radio"
                                    name="adminRole"
                                    value={roleKey}
                                    checked={isSelected}
                                    onChange={() =>
                                      handleAuthorityChange(roleKey)
                                    }
                                    className="h-4 w-4 text-gray-800 focus:ring-gray-500 border-gray-300"
                                  />
                                </div>
                                <div className="ml-3 flex-1">
                                  <div className="flex items-center mb-1">
                                    <RoleIcon
                                      className={`w-4 h-4 mr-1.5 ${
                                        isSelected
                                          ? "text-gray-800"
                                          : "text-gray-500"
                                      }`}
                                    />
                                    <span
                                      className={`text-sm font-bold ${
                                        isSelected
                                          ? "text-gray-900"
                                          : "text-gray-900"
                                      }`}
                                    >
                                      {role.label}
                                    </span>
                                  </div>
                                  <p
                                    className={`text-xs ${
                                      isSelected
                                        ? "text-gray-700"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    {role.description}
                                  </p>
                                  {isSelected && (
                                    <div className="mt-3 pl-3 border-l-2 border-gray-300 text-xs">
                                      <p className="font-semibold text-gray-700 mb-1">
                                        主な機能:
                                      </p>
                                      <ul className="list-disc list-inside text-gray-600 space-y-0.5 mb-2">
                                        {role.features.map((feature, idx) => (
                                          <li key={idx}>{feature}</li>
                                        ))}
                                      </ul>
                                      <p className="text-gray-500 italic">
                                        <Info className="w-3 h-3 inline mr-1" />
                                        {role.roleSummary}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* フッターボタン */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-5 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-all"
                  >
                    キャンセル
                  </button>
                  <button
                    type="submit"
                    className={`px-5 py-2.5 text-sm font-bold text-white rounded-lg shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      editingUser
                        ? "bg-gray-800 hover:bg-gray-700 focus:ring-gray-600"
                        : "bg-gray-800 hover:bg-gray-700 focus:ring-gray-600"
                    }`}
                  >
                    {editingUser ? "更新する" : "登録する"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 削除確認モーダル */}
      {isDeleteModalOpen && deletingUser && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 transform transition-all scale-100">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                ユーザーを削除しますか？
              </h3>
              <p className="text-gray-500">
                「{deletingUser.lastName} {deletingUser.firstName}
                」さんを完全に削除します。この操作は取り消せません。
              </p>
            </div>
            <div className="flex justify-center space-x-3">
              <button
                onClick={closeDeleteModal}
                className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-all"
              >
                キャンセル
              </button>
              <button
                onClick={handleDeleteUser}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-md hover:shadow-lg transition-all"
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSV一括登録モーダル */}
      {isCsvModalOpen && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex justify-center items-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8 transform transition-all">
            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <div className="p-2 bg-gray-100 rounded-lg mr-3">
                    <FileSpreadsheet className="w-6 h-6 text-gray-600" />
                  </div>
                  CSV一括登録
                </h2>
                <button
                  onClick={closeCsvModal}
                  className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* 説明とテンプレートダウンロード */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                  <Info className="w-4 h-4 mr-2" />
                  CSVファイルの形式について
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  CSVファイルは以下の列を含む必要があります：
                  <br />
                  <span className="font-mono text-xs bg-white px-2 py-1 rounded border inline-block mt-1">
                    姓, 名, 姓（フリガナ）, 名（フリガナ）, メールアドレス, 権限
                  </span>
                </p>
                <p className="text-sm text-gray-600 mb-3">
                  権限には以下の値を指定できます：
                  <span className="font-mono text-xs ml-1">user</span>（一般ユーザー）、
                  <span className="font-mono text-xs ml-1">globalAdmin</span>（グローバル管理者）、
                  <span className="font-mono text-xs ml-1">serviceAdmin</span>（一般管理者）、
                  <span className="font-mono text-xs ml-1">readonlyAdmin</span>（読み取り専用管理者）
                </p>
                <button
                  onClick={downloadCsvTemplate}
                  className="flex items-center px-4 py-2 bg-white text-gray-700 font-semibold rounded-lg shadow-sm border border-gray-300 hover:bg-gray-50 transition-all"
                >
                  <Download className="w-4 h-4 mr-2" />
                  テンプレートをダウンロード
                </button>
              </div>

              {/* ファイルアップロード */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CSVファイルを選択
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex-1">
                    <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-all">
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          {csvFile ? csvFile.name : "クリックしてファイルを選択"}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          CSV形式（.csv）
                        </p>
                      </div>
                    </div>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleCsvFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* プレビューテーブル */}
              {csvPreviewData.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3">
                    プレビュー（{csvPreviewData.filter((r) => r.isValid).length}件が登録可能）
                  </h3>
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto max-h-64 overflow-y-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">
                              状態
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">
                              姓
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">
                              名
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">
                              姓（カナ）
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">
                              名（カナ）
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">
                              メールアドレス
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">
                              権限
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {csvPreviewData.map((row, index) => (
                            <tr
                              key={index}
                              className={
                                row.isValid ? "bg-white" : "bg-red-50"
                              }
                            >
                              <td className="px-4 py-2 whitespace-nowrap">
                                {row.isValid ? (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                ) : (
                                  <span className="flex items-center text-xs text-red-600">
                                    <XCircle className="w-4 h-4 mr-1" />
                                    {row.errorMessage}
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                {row.lastName}
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                {row.firstName}
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                {row.lastNameKana}
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                {row.firstNameKana}
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                {row.email}
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                {row.authority === "user" && "一般ユーザー"}
                                {row.authority === "globalAdmin" && "グローバル管理者"}
                                {row.authority === "serviceAdmin" && "一般管理者"}
                                {row.authority === "readonlyAdmin" && "読み取り専用管理者"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* フッターボタン */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeCsvModal}
                  className="px-5 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-all"
                >
                  キャンセル
                </button>
                <button
                  type="button"
                  onClick={handleCsvBulkRegister}
                  disabled={
                    isCsvUploading ||
                    csvPreviewData.filter((r) => r.isValid).length === 0
                  }
                  className={`px-5 py-2.5 text-sm font-bold text-white rounded-lg shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    isCsvUploading ||
                    csvPreviewData.filter((r) => r.isValid).length === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gray-800 hover:bg-gray-700 focus:ring-gray-600"
                  }`}
                >
                  {isCsvUploading ? (
                    <span className="flex items-center">
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      登録中...
                    </span>
                  ) : (
                    `${csvPreviewData.filter((r) => r.isValid).length}件を一括登録`
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
