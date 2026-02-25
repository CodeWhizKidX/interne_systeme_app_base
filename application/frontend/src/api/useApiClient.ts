/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";

/**
 * 共通APIクライアントHook
 */
export function useApiClient() {
  const navigate = useNavigate(); // ✅ Hookはここで呼び出す（トップレベル）

  /**
   * 任意のAPI呼び出しを実行し、共通エラー処理を適用
   * @param apiCall API呼び出し関数 (例: () => userApi.getUserInfo())
   */
  const fetchUserData = async <T>(
    apiCall: () => Promise<T>
  ): Promise<T | null> => {
    try {
      const res = await apiCall();
      return res;
    } catch (err: any) {
      const status = err.response?.status;
      console.error("useApiClient: APIエラー発生", {
        status,
        message: err.message,
        response: err.response?.data,
        fullError: err,
      });

      if (status === 401) {
        console.log("useApiClient: 401エラー - /unauthorized にリダイレクト");
        navigate("/unauthorized");
      } else if (status === 403) {
        console.log("useApiClient: 403エラー - /forbidden にリダイレクト");
        navigate("/forbidden");
      } else {
        console.error("useApiClient: その他のAPIエラー", err);
      }
      return null;
    }
  };

  return { fetchUserData };
}
