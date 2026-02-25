// types/express/index.d.ts
import type { GoogleOAuthTokenPayload } from "../../middlewares/auth";

declare module "express-serve-static-core" {
  interface Request {
    user?: GoogleOAuthTokenPayload & LoginUserCustom;
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
