// src/lib/google-auth.ts
import { jwtDecode } from "jwt-decode";

// Google OAuth 2.0設定
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if (!GOOGLE_CLIENT_ID) {
  console.error("VITE_GOOGLE_CLIENT_ID is not set");
}

// Google IDトークンのペイロード型
export interface GoogleTokenPayload {
  sub: string; // GoogleユーザーID
  email: string;
  email_verified: boolean;
  name?: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
  hd?: string; // 組織ドメイン（Google Workspaceの場合）
  exp?: number; // 有効期限
  iat?: number; // 発行時刻
}

// Google Identity Servicesライブラリが読み込まれたかチェック
function waitForGoogleScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) {
      resolve();
      return;
    }

    // 既に読み込み中の場合は待機
    let attempts = 0;
    const maxAttempts = 50; // 5秒間待機
    const checkInterval = setInterval(() => {
      attempts++;
      if (window.google?.accounts?.id) {
        clearInterval(checkInterval);
        resolve();
      } else if (attempts >= maxAttempts) {
        clearInterval(checkInterval);
        reject(new Error("Google Identity Services failed to load"));
      }
    }, 100);
  });
}

// Google Sign-Inを初期化
export async function initializeGoogleSignIn(): Promise<void> {
  if (!GOOGLE_CLIENT_ID) {
    throw new Error("Google Client ID is not configured");
  }

  await waitForGoogleScript();

  if (!window.google?.accounts?.id) {
    throw new Error("Google Identity Services not available");
  }

  // 認証コールバックを設定
  window.google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: handleCredentialResponse,
    auto_select: false,
    cancel_on_tap_outside: true,
  });
}

// 認証コールバック
let currentResolve: ((credential: string) => void) | null = null;
let currentReject: ((error: Error) => void) | null = null;
let currentTimeoutId: ReturnType<typeof setTimeout> | null = null;

function handleCredentialResponse(response: { credential: string }) {
  if (response.credential) {
    if (currentResolve) {
      // タイムアウトをクリア
      if (currentTimeoutId) {
        clearTimeout(currentTimeoutId);
        currentTimeoutId = null;
      }
      currentResolve(response.credential);
      currentResolve = null;
      currentReject = null;
    }
  } else {
    if (currentReject) {
      // タイムアウトをクリア
      if (currentTimeoutId) {
        clearTimeout(currentTimeoutId);
        currentTimeoutId = null;
      }
      currentReject(new Error("Sign in cancelled or failed"));
      currentResolve = null;
      currentReject = null;
    }
  }
}

// Google Sign-Inを実行（カスタムボタン用）
// この関数は、カスタムボタンがクリックされたときに呼び出される
export function signInWithGoogle(): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!GOOGLE_CLIENT_ID) {
      reject(new Error("Google Client ID is not configured"));
      return;
    }

    if (!window.google?.accounts?.id) {
      reject(new Error("Google Identity Services not initialized. Call initializeGoogleSignIn() first."));
      return;
    }

    // コールバックを保存
    currentResolve = resolve;
    currentReject = reject;

    // タイムアウトを設定（30秒）
    currentTimeoutId = setTimeout(() => {
      if (currentReject) {
        currentReject(new Error("Sign in timeout. Please try again."));
        currentResolve = null;
        currentReject = null;
        currentTimeoutId = null;
      }
    }, 30000);

    // タイムアウトをクリアしてエラーを返す関数
    const clearTimeoutAndReject = (error: Error) => {
      if (currentTimeoutId) {
        clearTimeout(currentTimeoutId);
        currentTimeoutId = null;
      }
      if (currentReject) {
        currentReject(error);
        currentResolve = null;
        currentReject = null;
      }
    };

    // 認証フローを開始（One Tapを表示）
    window.google.accounts.id.prompt((notification: any) => {
      // One Tapが表示されない、またはスキップされた場合は、エラーを返す
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        console.log("One Tap not available or skipped");
        clearTimeoutAndReject(new Error("One Tap not available. Please try again or use a different browser."));
      } else if (notification.isDismissedMoment()) {
        // ユーザーが明示的に閉じた場合はエラー
        clearTimeoutAndReject(new Error("Sign in was dismissed"));
      }
      // One Tapが表示された場合は、handleCredentialResponseが呼ばれるまで待機
    });
  });
}

// IDトークンをデコードしてペイロードを取得
export function decodeToken(idToken: string): GoogleTokenPayload {
  return jwtDecode<GoogleTokenPayload>(idToken);
}

// ログアウト
export function signOut(): void {
  if (window.google?.accounts?.id) {
    window.google.accounts.id.disableAutoSelect();
  }
  localStorage.removeItem("id_token");
}

// グローバル型定義
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          prompt: (notificationCallback?: (notification: {
            isNotDisplayed: () => boolean;
            isSkippedMoment: () => boolean;
            isDismissedMoment: () => boolean;
          }) => void) => void;
          disableAutoSelect: () => void;
          renderButton: (
            element: HTMLElement,
            config: {
              theme?: string;
              size?: string;
              text?: string;
              shape?: string;
              logo_alignment?: string;
              width?: string;
              locale?: string;
              click_listener?: () => void;
            }
          ) => void;
        };
      };
    };
  }
}
