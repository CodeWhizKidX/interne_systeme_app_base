/**
 * 日時関連のユーティリティ関数
 */

/**
 * 日本時間（JST）の現在日時を取得する
 * @returns 日本時間の現在日時（Dateオブジェクト）
 */
export function getJapanTime(): Date {
  const now = new Date();
  // 現在のUTC時刻を取得
  const utcTime = now.getTime();
  // 日本時間（UTC+9）に変換（ミリ秒単位で9時間を加算）
  const japanTime = new Date(utcTime + 9 * 60 * 60 * 1000);
  return japanTime;
}
