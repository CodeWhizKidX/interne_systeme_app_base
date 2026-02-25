import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Route,
  Tags,
  Request,
  SuccessResponse,
  Response,
  Body,
  Query,
} from "tsoa";
import {
  createUserService,
  updateUserService,
  deleteUserService,
  getAllUsersService,
} from "../services/userService";
import {
  CreateUserRequest,
  CreateUserSuccessResponse,
  UpdateUserRequest,
  UpdateUserSuccessResponse,
  DeleteUserRequest,
  DeleteUserSuccessResponse,
} from "../types/user";
import { Request as ExRequest } from "express";
import { ErrorResponse } from "../types/api";

/**
 * 管理者用ユーザー管理API
 * /api/admin/users 配下のエンドポイント
 * ※ server.ts で requireAdmin ミドルウェアにより保護済み
 */
@Route("api/admin/users")
@Tags("Admin - User Management")
export class UserAdminController extends Controller {
  /**
   * 全ユーザー一覧を取得する（管理者用）
   */
  @Get("/")
  @SuccessResponse("200", "OK")
  @Response<ErrorResponse>("403", "Access Denied")
  public async getAllUsers(
    @Request() req: ExRequest
  ): Promise<{ message: string; users: any[] } | ErrorResponse> {
    try {
      // ミドルウェアでreq.userと管理者権限は確認済み
      const result = await getAllUsersService(req.user!);
      return result;
    } catch (error) {
      const errorMessage = (error as Error).message;
      if (errorMessage.includes("Access denied")) {
        this.setStatus(403);
      } else {
        this.setStatus(500);
      }
      return { message: errorMessage };
    }
  }

  /**
   * 新しいユーザーを作成する（管理者用）
   * @param requestBody 作成するユーザーの詳細データ
   */
  @Post("/")
  @SuccessResponse("201", "Created")
  @Response<ErrorResponse>("400", "Bad Request")
  @Response<ErrorResponse>("403", "Access Denied")
  public async createUser(
    @Body() requestBody: CreateUserRequest,
    @Request() req: ExRequest
  ): Promise<CreateUserSuccessResponse | ErrorResponse> {
    try {
      // ミドルウェアでreq.userと管理者権限は確認済み
      const result = await createUserService(requestBody);
      this.setStatus(201);
      return result;
    } catch (error) {
      console.error("=== UserAdminController.createUser Error ===");
      console.error("Error type:", error?.constructor?.name);
      console.error(
        "Error message:",
        error instanceof Error ? error.message : String(error)
      );
      console.error(
        "Error stack:",
        error instanceof Error ? error.stack : "No stack"
      );
      console.error("Request body:", requestBody);
      console.error("=============================================");

      const errorMessage = (error as Error).message;

      if (
        errorMessage.includes("Validation") ||
        errorMessage.includes("無効な") ||
        errorMessage.includes("既に登録されています") ||
        errorMessage.includes("データベーススキーマエラー")
      ) {
        this.setStatus(400);
      } else {
        this.setStatus(403);
      }

      return { message: errorMessage };
    }
  }

  /**
   * 既存のユーザーを更新する（管理者用）
   * @param requestBody 更新するユーザーの詳細データ（originalEmailでユーザーを特定）
   */
  @Put("/")
  @SuccessResponse("200", "OK")
  @Response<ErrorResponse>("400", "Bad Request")
  @Response<ErrorResponse>("403", "Access Denied")
  @Response<ErrorResponse>("404", "Not Found")
  public async updateUser(
    @Body() requestBody: UpdateUserRequest,
    @Request() req: ExRequest
  ): Promise<UpdateUserSuccessResponse | ErrorResponse> {
    try {
      // ミドルウェアでreq.userと管理者権限は確認済み
      const result = await updateUserService(requestBody);
      this.setStatus(200);
      return result;
    } catch (error) {
      console.error("=== UserAdminController.updateUser Error ===");
      console.error("Error type:", error?.constructor?.name);
      console.error(
        "Error message:",
        error instanceof Error ? error.message : String(error)
      );
      console.error(
        "Error stack:",
        error instanceof Error ? error.stack : "No stack"
      );
      console.error("Request body:", requestBody);
      console.error("=============================================");

      const errorMessage = (error as Error).message;

      if (
        errorMessage.includes("見つかりません") ||
        errorMessage.includes("not found")
      ) {
        this.setStatus(404);
      } else if (
        errorMessage.includes("Validation") ||
        errorMessage.includes("無効な") ||
        errorMessage.includes("既に登録されています") ||
        errorMessage.includes("データベーススキーマエラー")
      ) {
        this.setStatus(400);
      } else {
        this.setStatus(403);
      }

      return { message: errorMessage };
    }
  }

  /**
   * ユーザーとその関連データを全て削除する（管理者用）
   * @param requestBody 削除するユーザーのメールアドレス
   */
  @Delete("/")
  @SuccessResponse("200", "OK")
  @Response<ErrorResponse>("400", "Bad Request")
  @Response<ErrorResponse>("403", "Access Denied")
  @Response<ErrorResponse>("404", "Not Found")
  public async deleteUser(
    @Body() requestBody: DeleteUserRequest,
    @Request() req: ExRequest
  ): Promise<DeleteUserSuccessResponse | ErrorResponse> {
    try {
      // ミドルウェアでreq.userと管理者権限は確認済み
      const result = await deleteUserService(requestBody, req.user!);
      this.setStatus(200);
      return result;
    } catch (error) {
      console.error("=== UserAdminController.deleteUser Error ===");
      console.error("Error type:", error?.constructor?.name);
      console.error(
        "Error message:",
        error instanceof Error ? error.message : String(error)
      );
      console.error(
        "Error stack:",
        error instanceof Error ? error.stack : "No stack"
      );
      console.error("Request body:", requestBody);
      console.error("=============================================");

      const errorMessage = (error as Error).message;

      if (
        errorMessage.includes("見つかりません") ||
        errorMessage.includes("not found")
      ) {
        this.setStatus(404);
      } else if (
        errorMessage.includes("Validation") ||
        errorMessage.includes("無効な") ||
        errorMessage.includes("データベーススキーマエラー")
      ) {
        this.setStatus(400);
      } else {
        this.setStatus(403);
      }

      return { message: errorMessage };
    }
  }

}

