import {
  Controller,
  Get,
  Put,
  Route,
  Tags,
  Request,
  SuccessResponse,
  Response,
  Body,
  Query,
  Post,
} from "tsoa";
import {
  getUserInfoService,
  checkUserInfoService,
  completeFirstLoginService,
  updateDisplayNameService,
  updateProfileService,
} from "../services/userService";
import {
  CompleteFirstLoginRequest,
  CompleteFirstLoginSuccessResponse,
  UpdateDisplayNameRequest,
  UpdateDisplayNameSuccessResponse,
  UpdateProfileRequest,
  UpdateProfileSuccessResponse,
  CheckUserInfoSuccessResponse,
} from "../types/user";
import { Request as ExRequest } from "express";
import { ErrorResponse } from "../types/api";

interface UserResponse {
  message: string;
  users?: any[];
  user?: any;
}

@Route("api")
@Tags("User")
export class UserController extends Controller {
  /**
   * ユーザー情報を取得
   */
  @Get("/userinfo")
  @SuccessResponse("200", "OK")
  @Response("403", "Access Denied")
  public async getUserInfo(@Request() req: ExRequest): Promise<UserResponse> {
    try {
      const email = req.user?.email; // auth.ts でセットされている user 情報を取得
      return await getUserInfoService(email);
    } catch (error) {
      this.setStatus(403);
      return { message: (error as Error).message };
    }
  }

  /**
   * ユーザー情報のチェック
   * @param recordLogin ログイン履歴を記録するかどうか（ログイン時のみtrue）
   */
  @Get("/check-user-info")
  @SuccessResponse("200", "OK")
  @Response<ErrorResponse>("403", "Access Denied")
  public async checkUserInfo(
    @Request() req: ExRequest,
    @Query() recordLogin?: boolean
  ): Promise<CheckUserInfoSuccessResponse | ErrorResponse> {
    try {
      // IPアドレスを取得（プロキシ経由の場合は x-forwarded-for ヘッダーを確認）
      const ipAddress =
        (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
        req.ip ||
        req.socket.remoteAddress ||
        null;

      // ユーザーエージェントを取得
      const userAgent = (req.headers["user-agent"] as string) || null;

      // リクエスト元ドメインを取得（Origin または Referer ヘッダーから）
      const requestOrigin = (req.headers["origin"] as string) || (req.headers["referer"] as string) || null;

      return await checkUserInfoService(req.user, ipAddress, userAgent, recordLogin, requestOrigin);
    } catch (error) {
      this.setStatus(403);
      console.log("bbb");
      console.log((error as Error).message);
      return { message: (error as Error).message };
    }
  }

  /**
   * 初回ログイン完了処理
   * @param requestBody 表示名
   */
  @Put("/first-login")
  @SuccessResponse("200", "OK")
  @Response<ErrorResponse>("400", "Bad Request")
  @Response<ErrorResponse>("403", "Access Denied")
  public async completeFirstLogin(
    @Body() requestBody: CompleteFirstLoginRequest,
    @Request() req: ExRequest
  ): Promise<CompleteFirstLoginSuccessResponse | ErrorResponse> {
    try {
      if (!req.user) {
        this.setStatus(403);
        return { message: "認証情報が見つかりません。" };
      }

      const result = await completeFirstLoginService(requestBody, req.user);
      this.setStatus(200);
      return result;
    } catch (error) {
      const errorMessage = (error as Error).message;
      if (errorMessage.includes("Validation")) {
        this.setStatus(400);
      } else {
        this.setStatus(403);
      }
      return { message: errorMessage };
    }
  }

  /**
   * 表示名を更新する
   * @param requestBody 表示名
   */
  @Put("/display-name")
  @SuccessResponse("200", "OK")
  @Response<ErrorResponse>("400", "Bad Request")
  @Response<ErrorResponse>("403", "Access Denied")
  public async updateDisplayName(
    @Body() requestBody: UpdateDisplayNameRequest,
    @Request() req: ExRequest
  ): Promise<UpdateDisplayNameSuccessResponse | ErrorResponse> {
    try {
      if (!req.user) {
        this.setStatus(403);
        return { message: "認証情報が見つかりません。" };
      }

      const result = await updateDisplayNameService(requestBody, req.user);
      this.setStatus(200);
      return result;
    } catch (error) {
      const errorMessage = (error as Error).message;
      if (errorMessage.includes("Validation")) {
        this.setStatus(400);
      } else {
        this.setStatus(403);
      }
      return { message: errorMessage };
    }
  }

  /**
   * プロフィール情報を更新する（姓名・フリガナ・表示名）
   * @param requestBody プロフィール情報
   */
  @Put("/profile")
  @SuccessResponse("200", "OK")
  @Response<ErrorResponse>("400", "Bad Request")
  @Response<ErrorResponse>("403", "Access Denied")
  public async updateProfile(
    @Body() requestBody: UpdateProfileRequest,
    @Request() req: ExRequest
  ): Promise<UpdateProfileSuccessResponse | ErrorResponse> {
    try {
      if (!req.user) {
        this.setStatus(403);
        return { message: "認証情報が見つかりません。" };
      }

      const result = await updateProfileService(requestBody, req.user);
      this.setStatus(200);
      return result;
    } catch (error) {
      const errorMessage = (error as Error).message;
      if (errorMessage.includes("Validation")) {
        this.setStatus(400);
      } else {
        this.setStatus(403);
      }
      return { message: errorMessage };
    }
  }

}
