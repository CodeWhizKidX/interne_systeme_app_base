// src/middlewares/adminAuthMiddleware.ts
/**
 * 管理者権限チェックミドルウェア
 * 
 * /api/admin/* パスへのアクセスを管理者のみに制限する
 * 権限レベル:
 * - globalAdmin: グローバル管理者（全権限）
 * - serviceAdmin: サービス管理者（ユーザー管理、チーム管理など）
 * - readonlyAdmin: 読み取り専用管理者（参照のみ）
 * - user: 一般ユーザー（管理者機能へのアクセス不可）
 */

import { Request, Response, NextFunction } from "express";

/**
 * 管理者権限の種類
 */
export type AdminAuthority = "globalAdmin" | "serviceAdmin" | "readonlyAdmin";

/**
 * 管理者権限かどうかをチェック
 */
export function isAdminAuthority(authority: string | undefined): authority is AdminAuthority {
  return (
    authority === "globalAdmin" ||
    authority === "serviceAdmin" ||
    authority === "readonlyAdmin"
  );
}

/**
 * 更新権限を持つ管理者かどうかをチェック
 * readonlyAdminは除外
 */
export function hasWritePermission(authority: string | undefined): boolean {
  return authority === "globalAdmin" || authority === "serviceAdmin";
}

/**
 * グローバル管理者かどうかをチェック
 */
export function isGlobalAdmin(authority: string | undefined): boolean {
  return authority === "globalAdmin";
}

/**
 * 管理者権限チェックミドルウェア
 * 管理者（globalAdmin, serviceAdmin, readonlyAdmin）のみアクセス可能
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    console.warn("[AdminAuth] 認証情報なし:", req.path);
    return res.status(403).json({ message: "認証情報が見つかりません。" });
  }

  if (!isAdminAuthority(req.user.authority)) {
    console.warn("[AdminAuth] 管理者権限なし:", {
      path: req.path,
      userId: req.user.userId,
      authority: req.user.authority,
    });
    return res.status(403).json({ message: "管理者権限が必要です。" });
  }

  console.log("[AdminAuth] 管理者アクセス許可:", {
    path: req.path,
    userId: req.user.userId,
    authority: req.user.authority,
  });

  next();
}

/**
 * 更新権限チェックミドルウェア
 * globalAdmin, serviceAdminのみアクセス可能（readonlyAdminは除外）
 */
export function requireWriteAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    console.warn("[AdminAuth] 認証情報なし:", req.path);
    return res.status(403).json({ message: "認証情報が見つかりません。" });
  }

  if (!hasWritePermission(req.user.authority)) {
    console.warn("[AdminAuth] 更新権限なし:", {
      path: req.path,
      userId: req.user.userId,
      authority: req.user.authority,
    });
    return res.status(403).json({ 
      message: "この操作には管理者（globalAdmin または serviceAdmin）権限が必要です。" 
    });
  }

  next();
}

/**
 * グローバル管理者権限チェックミドルウェア
 * globalAdminのみアクセス可能
 */
export function requireGlobalAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    console.warn("[AdminAuth] 認証情報なし:", req.path);
    return res.status(403).json({ message: "認証情報が見つかりません。" });
  }

  if (!isGlobalAdmin(req.user.authority)) {
    console.warn("[AdminAuth] グローバル管理者権限なし:", {
      path: req.path,
      userId: req.user.userId,
      authority: req.user.authority,
    });
    return res.status(403).json({ 
      message: "この操作にはグローバル管理者権限が必要です。" 
    });
  }

  next();
}

