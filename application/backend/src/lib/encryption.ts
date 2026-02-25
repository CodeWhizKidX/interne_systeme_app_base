/**
 * 暗号化・復号化ユーティリティ
 *
 * 環境変数:
 *   API_KEY_ENCRYPTION_SECRET: 暗号化に使用する秘密鍵
 */

import * as crypto from "crypto";

// 暗号化アルゴリズム
const ALGORITHM = "aes-256-gcm";
// IVのバイト長
const IV_LENGTH = 16;
// 認証タグのバイト長
const AUTH_TAG_LENGTH = 16;

/**
 * 暗号化キーを取得
 */
function getEncryptionKey(): Buffer {
  const secretKey = process.env.API_KEY_ENCRYPTION_SECRET;

  if (!secretKey) {
    throw new Error(
      "環境変数 API_KEY_ENCRYPTION_SECRET が設定されていません。"
    );
  }

  // 秘密鍵を32バイトにハッシュ化（AES-256は32バイトキーが必要）
  return crypto.createHash("sha256").update(secretKey).digest();
}

/**
 * 文字列を暗号化する
 * @param plainText 平文
 * @returns 暗号化された文字列（Base64エンコード）
 */
export function encrypt(plainText: string): string {
  const key = getEncryptionKey();

  // ランダムなIV（初期化ベクトル）を生成
  const iv = crypto.randomBytes(IV_LENGTH);

  // 暗号化
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(plainText, "utf8", "hex");
  encrypted += cipher.final("hex");

  // 認証タグを取得
  const authTag = cipher.getAuthTag();

  // IV + AuthTag + 暗号文 を結合してBase64エンコード
  const combined = Buffer.concat([
    iv,
    authTag,
    Buffer.from(encrypted, "hex"),
  ]);

  return combined.toString("base64");
}

/**
 * 暗号化された文字列を復号する
 * @param encryptedText 暗号化された文字列（Base64エンコード）
 * @returns 復号された平文
 */
export function decrypt(encryptedText: string): string {
  if (!encryptedText) {
    throw new Error("復号対象の文字列が空です。");
  }

  const key = getEncryptionKey();

  // Base64デコード
  const combined = Buffer.from(encryptedText, "base64");

  // IV、AuthTag、暗号文を分離
  const iv = combined.subarray(0, IV_LENGTH);
  const authTag = combined.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const encrypted = combined.subarray(IV_LENGTH + AUTH_TAG_LENGTH);

  // 復号
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted.toString("hex"), "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

/**
 * Gemini APIキーを復号して取得する
 * @param encryptedApiKey 暗号化されたAPIキー
 * @returns 復号されたAPIキー
 */
export function decryptGeminiApiKey(encryptedApiKey: string | null): string | null {
  if (!encryptedApiKey) {
    return null;
  }

  try {
    return decrypt(encryptedApiKey);
  } catch (error) {
    console.error("Gemini APIキーの復号に失敗しました:", error);
    return null;
  }
}

