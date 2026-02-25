import { Pool } from "pg";
// ↓envから呼び込むときに必要になる
import dotenv from "dotenv";
dotenv.config();

// Cloud SQL の接続情報
const pool = new Pool({
  user: process.env.DB_USER as string, // DBユーザー
  host: process.env.DB_HOST as string, // Cloud SQLのIPアドレス
  database: process.env.DB_NAME as string, // DB名
  password: process.env.DB_PASS as string, // パスワード
  port: 5432,
  ssl: false,
});
// 直接SQLを実行する場合に利用する
export const query = async (text: string, params?: any[]) => {
  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    return res;
  } finally {
    client.release();
  }
};
