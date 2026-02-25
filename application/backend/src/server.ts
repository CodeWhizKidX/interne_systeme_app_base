// src/server.ts
// dotenvを最初に読み込む（他のインポートより前に環境変数を設定）
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { verifyToken } from "./middlewares/auth";
import type { GoogleOAuthTokenPayload } from "./middlewares/auth";
import type { LoginUserCustom } from "./types/express";
import path from "path";
import swaggerUi from "swagger-ui-express";
import fs from "fs";


// 管理者権限チェックミドルウェア
import { requireAdmin } from "./middlewares/adminAuthMiddleware";

// Prismaクライアント（Graceful shutdown用）
import { disconnectAllPrismaClients } from "./lib/prisma";

// tsoa が生成したファイル（生成後に存在するはず）
import { RegisterRoutes } from "./generated/tsoa/routes";
const app = express();

app.use(express.json());
const PORT = process.env.PORT || 3000;

// CORS設定（React開発環境用）
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "http://localhost:5173", // ローカル
        "http://public.localhost:5173",
        "http://uzuz.localhost:5173",
        "https://prompt-manager-frontend-dev.web.app", // 開発環境
        "https://prompt-manager-4eef0.web.app", // 本番環境
        "https://public.mana-pro.jp",
        "https://uzuz.mana-pro.jp"
      ];

      // origin が undefined（例: curl や同一オリジン）なら許可
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`🚫 CORS blocked for origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// --- Swaggerドキュメントを読み込み（json優先、なければyaml） ---
const swaggerJsonPath = path.join(__dirname, "generated/tsoa/swagger.json");

let swaggerDocument: any = null;

if (fs.existsSync(swaggerJsonPath)) {
  swaggerDocument = JSON.parse(fs.readFileSync(swaggerJsonPath, "utf8"));
  console.log("Loaded swagger.json");
} else {
  console.warn(
    "No swagger.json or swagger.yaml found in build/. Run `npx tsoa spec` first."
  );
}

// Swagger UI を /api-docs にマウント（存在する場合）
if (swaggerDocument) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log(`Swagger UI available`);
}

// --- 型拡張：ExpressのRequestにuserプロパティを追加 ---
declare global {
  namespace Express {
    interface Request {
      user?: GoogleOAuthTokenPayload & LoginUserCustom;
    }
  }
}



// --- 認証ミドルウェアを /api に対して登録 ---
// 重要: RegisterRoutes が "/api/..." を生成している前提（tsoa.json の basePath = "/api"）
// /api/auth/* は認証不要なので、認証ミドルウェアで除外する
app.use("/api", (req, res, next) => {
  // /api/auth/* は認証不要
  if (req.path.startsWith("/auth")) {
    return next();
  }
  return verifyToken(req, res, next);
});

// --- 管理者権限チェックミドルウェアを /api/admin に対して登録 ---
// /api/admin/* へのアクセスは管理者（globalAdmin, serviceAdmin, readonlyAdmin）のみ許可
// 注意: 認証ミドルウェア（verifyToken）の後に登録すること
app.use("/api/admin", requireAdmin);

// ルートを登録（認証ミドルウェアの後に登録）
RegisterRoutes(app);

// --- エラーハンドリングミドルウェア（TSOAのバリデーションエラーなどをJSONで返す） ---
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    // 詳細なエラー情報をログに出力
    console.error("=== Error Handler ===");
    console.error("Error status:", err.status || err.statusCode);
    console.error("Error message:", err.message);
    console.error("Error stack:", err.stack);
    console.error("Request path:", req.path);
    console.error("Request method:", req.method);
    console.error("Request body:", req.body);
    console.error(
      "Full error object:",
      JSON.stringify(err, Object.getOwnPropertyNames(err), 2)
    );
    console.error("====================");

    // TSOAのバリデーションエラーなど
    if (err.status || err.statusCode) {
      const status = err.status || err.statusCode;
      res.status(status).json({
        message: err.message || "リクエストの処理中にエラーが発生しました。",
      });
      return;
    }

    // その他のエラー
    res.status(500).json({
      message: err.message || "サーバー内部エラーが発生しました。",
    });
  }
);

// --- サーバー起動 ---
const server = app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

// --- Graceful Shutdown ---
// アプリケーション終了時にPrismaクライアントを切断
async function gracefulShutdown(signal: string) {
  console.log(`\n📴 ${signal} received. Shutting down gracefully...`);

  server.close(async () => {
    console.log("🔌 HTTP server closed");

    try {
      await disconnectAllPrismaClients();
      console.log("✅ All database connections closed");
      process.exit(0);
    } catch (error) {
      console.error("❌ Error during shutdown:", error);
      process.exit(1);
    }
  });

  // 30秒後に強制終了
  setTimeout(() => {
    console.error("⚠️ Forced shutdown after timeout");
    process.exit(1);
  }, 30000);
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
