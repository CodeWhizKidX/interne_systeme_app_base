// types/express/index.d.ts
import type { FirebaseTokenPayload } from "../../middlewares/auth";

declare module "express-serve-static-core" {
  interface Request {
    user?: FirebaseTokenPayload & LoginUserCustom;
  }
}

/**
 * ログインユーザーのカスタムプロパティ
 */
export interface LoginUserCustom {
  provider: string;
  userId: string;
  authority: string;
  isFirstLoginCompleted: boolean;
}
