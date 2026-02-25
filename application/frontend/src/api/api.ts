import {
  UserApi,
  Configuration,
  AdminUserManagementApi,
} from "../generated";
import axios from "axios";

// Axiosインスタンスを作成
const axiosInstance = axios.create();

// リクエストインターセプター: リクエストのたびに最新のトークンを取得
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("id_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // トークンがない場合はAuthorizationヘッダーを削除
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const apiConfig = new Configuration({
  basePath: import.meta.env.VITE_BACKEND_ENDPOINT || "", // ← APIのベースURL
  baseOptions: {
    headers: {
      "Content-Type": "application/json",
    },
  },
});

// カスタムAxiosインスタンスを使用してAPIクライアントを作成
export const userApi = new UserApi(apiConfig, undefined, axiosInstance);

// 管理者用ユーザー管理API
export const adminUserApi = new AdminUserManagementApi(
  apiConfig,
  undefined,
  axiosInstance
);

// axiosInstanceをエクスポート（管理者用APIなどで使用）
export { axiosInstance };
