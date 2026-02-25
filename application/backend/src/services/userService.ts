import { TokenPayload } from "google-auth-library";
import { LoginUserCustom } from "../types/express";
import {
  CreateUserRequest,
  CreateUserSuccessResponse,
  UpdateUserRequest,
  UpdateUserSuccessResponse,
  DeleteUserRequest,
  DeleteUserSuccessResponse,
  UpdateDisplayNameRequest,
  UpdateDisplayNameSuccessResponse,
  UpdateProfileRequest,
  UpdateProfileSuccessResponse,
  GetLoginHistoryResponse,
  LoginHistoryMonthlyData,
  LoginHistoryDailyData,
  CheckUserInfoSuccessResponse,
} from "../types/user";
import {
  VALID_AUTHORITIES,
  VALID_STATUSES,
  DEFAULT_USER_STATUS,
} from "../constants/user";
import { getJapanTime } from "../lib/dateUtils";
import { prisma } from "../lib/prisma";
import { isAdminAuthority } from "../middlewares/adminAuthMiddleware";

/**
 * 許可された自動登録ドメイン（Webサービスのドメイン）を取得する
 * 環境変数 ALLOWED_AUTO_REGISTER_DOMAINS からカンマ区切りで取得
 * 例: "https://example.com,https://app.company.co.jp"
 */
function getAllowedAutoRegisterDomains(): string[] {
  const domains = process.env.ALLOWED_AUTO_REGISTER_DOMAINS;
  if (!domains) return [];
  return domains.split(",").map((d) => d.trim().toLowerCase()).filter((d) => d.length > 0);
}

/**
 * リクエスト元のドメインが自動登録許可ドメインかどうかをチェック
 * @param requestOrigin リクエストのOriginまたはRefererヘッダーの値（例: "https://example.com"）
 */
function isAllowedAutoRegisterDomain(requestOrigin: string | null | undefined): boolean {
  if (!requestOrigin) return false;
  
  const allowedDomains = getAllowedAutoRegisterDomains();
  if (allowedDomains.length === 0) return false;
  
  // リクエスト元のURLからドメイン部分を抽出（プロトコル + ホスト）
  let originDomain: string;
  try {
    const url = new URL(requestOrigin);
    originDomain = url.origin.toLowerCase(); // "https://example.com" 形式
  } catch {
    // URLパースに失敗した場合はそのまま比較
    originDomain = requestOrigin.toLowerCase();
  }

  console.log(originDomain);
  console.log(allowedDomains);
  
  // 完全一致またはドメイン部分が一致するかチェック
  return allowedDomains.some((allowedDomain) => {
    // 許可ドメインがプロトコル付きの場合は完全一致
    if (allowedDomain.startsWith("http://") || allowedDomain.startsWith("https://")) {
      return originDomain === allowedDomain || originDomain.startsWith(allowedDomain + "/");
    }
    // プロトコルなしの場合はホスト名で比較
    try {
      const originUrl = new URL(originDomain);
      return originUrl.hostname === allowedDomain || originUrl.hostname.endsWith("." + allowedDomain);
    } catch {
      return false;
    }
  });
}

async function getUsers() {
  const users = await prisma.users.findMany({
    select: {
      id: true, // ユーザーIDを追加
      firstName: true,
      lastName: true,
      firstNameKana: true,
      lastNameKana: true,
      emailAddress: true,
      status: true,
      authority: true,
      registrationDate: true,
      isFirstLoginCompleted: true,
      displayName: true,
    },
  });
  return users;
}

async function checkUser(email: string | undefined) {
  if (!email) return null;
  const user = await prisma.users.findUnique({
    where: {
      emailAddress: email,
    },
  });
  return user;
}

export async function getUserInfoService(email: string | undefined) {
  const user = await checkUser(email);
  if (!email || !user) {
    throw new Error(
      "Access denied: あなたのアカウントは管理者から許可されていません"
    );
  }
  const users = await getUsers();
  // ユーザーIDを文字列に変換
  const formattedUsers = users.map((user) => ({
    id: user.id.toString(), // BigIntを文字列に変換
    firstName: user.firstName,
    lastName: user.lastName,
    firstNameKana: user.firstNameKana,
    lastNameKana: user.lastNameKana,
    emailAddress: user.emailAddress,
    status: user.status,
    authority: user.authority,
    registrationDate: user.registrationDate,
    isFirstLoginCompleted: user.isFirstLoginCompleted,
    displayName: user.displayName,
  }));
  return {
    message: "検索処理成功",
    rsults: { users: formattedUsers },
  };
}

export async function checkUserInfoService(
  loginUser: (TokenPayload & LoginUserCustom) | undefined,
  ipAddress?: string | null,
  userAgent?: string | null,
  recordLogin?: boolean,
  requestOrigin?: string | null
): Promise<CheckUserInfoSuccessResponse> {
  const email = loginUser?.email;
  const providerSub = loginUser?.sub ?? "";

  console.log("checkUserInfoService called");
  console.log("email:", email);
  console.log("requestOrigin:", requestOrigin);
  let user = await checkUser(email);
  console.log("user found:", user ? `ID: ${user.id}` : "null (not found)");
  console.log(process.env.ALLOWED_AUTO_REGISTER_DOMAINS)
  console.log(user)
  console.log(isAllowedAutoRegisterDomain(requestOrigin))
  
  /*
  // ユーザーが存在しない場合、自動登録が許可されたドメインかチェック
  if (!email) {
    console.log(
      '"Access denied: あなたのアカウントは管理者から許可されていません"'
    );
    throw new Error(
      "Access denied: あなたのアカウントは管理者から許可されていません"
    );
  }
    */
  
  if (!user) {
    // 自動登録が許可されたドメイン（環境変数 ALLOWED_AUTO_REGISTER_DOMAINS で設定）かチェック
    if (isAllowedAutoRegisterDomain(requestOrigin)) {
      console.log(`自動登録許可ドメインからのアクセス: ${requestOrigin}, email: ${email}`);
      try {
        // Google認証から取得した情報を使ってユーザーを自動作成
        // given_name: 名, family_name: 姓（日本語の場合は逆の場合もある）
        const firstName = loginUser?.given_name || "";
        const lastName = loginUser?.family_name || "";
        // フリガナは取得できないので空文字として登録
        const firstNameKana = "";
        const lastNameKana = "";
        
        const newUser = await prisma.users.create({
          data: {
            firstName: firstName.trim() || "未設定",
            lastName: lastName.trim() || "未設定",
            firstNameKana: firstNameKana,
            lastNameKana: lastNameKana,
            emailAddress: email ? email.trim() : '',
            authority: "user", // デフォルトは一般ユーザー
            status: DEFAULT_USER_STATUS,
            registrationDate: getJapanTime(),
          },
        });
        
        console.log(`新規ユーザーを自動登録しました: ${email}, ID: ${newUser.id}`);
        user = newUser;
      } catch (error) {
        console.error("ユーザーの自動登録に失敗しました:", error);
        throw new Error(
          "Access denied: ユーザーの自動登録に失敗しました"
        );
      }
    } else {

      
      console.log(
        '"Access denied: あなたのアカウントは管理者から許可されていません"'
      );
      throw new Error(
        "Access denied: あなたのアカウントは管理者から許可されていません"
      );
    }
  }

  // 2. user_authentications テーブルに認証情報が既に存在するか確認
  //    (provider と provider_sub の複合ユニークキーで検索)
  const existingAuth = await prisma.userAuthentications.findUnique({
    where: {
      provider_providerSub: {
        provider: loginUser ? loginUser.provider : 'undefined',
        providerSub: providerSub,
      },
    },
  });

  // 3. 認証情報が存在しない場合、新規に登録(INSERT)する
  //    この時が実際のログイン時（Google認証成功時）なので、ログイン履歴も記録する
  if (!existingAuth) {
    console.log(
      `認証情報が見つかりません。ユーザーID: ${user.id} の新規認証情報を作成します。`
    );
    try {
      await prisma.userAuthentications.create({
        data: {
          userId: user.id, // usersテーブルのID
          provider: loginUser ? loginUser.provider : 'undefined',
          providerSub: providerSub,
        },
      });
      console.log("認証情報の作成に成功しました。");

      // 4. ログイン日時を更新（実際のログイン時のみ）
      try {
        const now = new Date();
        // usersテーブルのlastLoginAtを更新
        await prisma.users.update({
          where: {
            id: user.id,
          },
          data: {
            lastLoginAt: now,
          },
        });
      } catch (error) {
        // ログイン日時の更新に失敗してもログイン処理は続行
        console.error("ログイン日時の更新に失敗しました:", error);
      }
    } catch (error) {
      console.error("認証情報の作成に失敗しました:", error);
      // emailAddress の UNIQUE 制約違反などで失敗する可能性も考慮
      throw new Error("認証情報を保存できませんでした。");
    }
  } else {
    console.log("認証情報は既に存在します。");
    // 既存の認証情報がある場合、recordLoginフラグがtrueの場合のみログイン日時を更新
    // （ページリロード時などの認証チェックでは更新しない）
    if (recordLogin) {
      try {
        const now = new Date();
        // usersテーブルのlastLoginAtを更新
        await prisma.users.update({
          where: {
            id: user.id,
          },
          data: {
            lastLoginAt: now,
          },
        });
      } catch (error) {
        // ログイン日時の更新に失敗してもログイン処理は続行
        console.error("ログイン日時の更新に失敗しました:", error);
      }
    }
  }

  // user オブジェクトから 'id' プロパティを除外した新しいオブジェクトを作成
  const { id, ...userWithoutId } = user;

  // 5. 認証成功としてユーザー情報を返す
  return {
    message: "認証成功",
    user: {
      ...userWithoutId,
      provider: loginUser?.provider || "unknown",
    },
  };
}

/**
 * 全ユーザー一覧を取得する（管理者用）
 * @param loginUser ログインユーザー情報
 */
export async function getAllUsersService(
  loginUser: (TokenPayload & LoginUserCustom) | undefined
): Promise<{ message: string; users: any[] }> {
  // 管理者権限チェック（ミドルウェアで確認済みだが防御的チェック）
  if (!loginUser) {
    throw new Error("Access denied: ユーザー情報が正しく取得できません。");
  }

  const isAdmin = isAdminAuthority(loginUser.authority);
  if (!isAdmin) {
    throw new Error("Access denied: 管理者権限が必要です。");
  }

  try {
    const users = await prisma.users.findMany({
      orderBy: {
        registrationDate: "desc",
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        firstNameKana: true,
        lastNameKana: true,
        emailAddress: true,
        displayName: true,
        authority: true,
        status: true,
        registrationDate: true,
      },
    });

    const formattedUsers = users.map((user) => ({
      id: Number(user.id),
      firstName: user.firstName,
      lastName: user.lastName,
      firstNameKana: user.firstNameKana,
      lastNameKana: user.lastNameKana,
      email: user.emailAddress,
      customDisplayName: user.displayName,
      authority: user.authority,
      status: user.status,
      createdAt: user.registrationDate,
    }));

    return {
      message: "ユーザー一覧を取得しました。",
      users: formattedUsers,
    };
  } catch (error) {
    console.error("getAllUsersService error:", error);
    throw new Error("ユーザー一覧の取得に失敗しました。");
  }
}

/**
 * 新しいユーザーを作成する
 * @param requestBody 作成するユーザーの詳細データ
 */
export async function createUserService(
  requestBody: CreateUserRequest
): Promise<CreateUserSuccessResponse> {
  const {
    firstName,
    lastName,
    firstNameKana,
    lastNameKana,
    email,
    authority,
    status = DEFAULT_USER_STATUS,
  } = requestBody;

  // バリデーション
  if (!firstName || !lastName || !firstNameKana || !lastNameKana || !email) {
    throw new Error(
      "Validation: 姓、名、姓（フリガナ）、名（フリガナ）、メールアドレスは必須です。"
    );
  }

  // メールアドレスの形式チェック
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Validation: 無効なメールアドレス形式です。");
  }

  // 権限の値チェック
  if (!VALID_AUTHORITIES.includes(authority)) {
    throw new Error("Validation: 無効な権限値です。");
  }

  // ステータスの値チェック
  if (!VALID_STATUSES.includes(status)) {
    throw new Error("Validation: 無効なステータス値です。");
  }

  try {
    // メールアドレスの重複チェック
    const existingUser = await prisma.users.findUnique({
      where: {
        emailAddress: email,
      },
    });

    if (existingUser) {
      throw new Error("このメールアドレスは既に登録されています。");
    }

    // ユーザーを作成
    const newUser = await prisma.users.create({
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        firstNameKana: firstNameKana.trim(),
        lastNameKana: lastNameKana.trim(),
        emailAddress: email.trim(),
        authority: authority,
        status: status,
        registrationDate: getJapanTime(), // 日本時間の現在日時を明示的に設定
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        firstNameKana: true,
        lastNameKana: true,
        emailAddress: true,
        status: true,
        authority: true,
        registrationDate: true,
        isFirstLoginCompleted: true,
        displayName: true,
      },
    });

    return {
      message: "ユーザーの作成に成功しました。",
      user: {
        id: newUser.id.toString(),
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        firstNameKana: newUser.firstNameKana,
        lastNameKana: newUser.lastNameKana,
        emailAddress: newUser.emailAddress,
        status: newUser.status,
        authority: newUser.authority,
        registrationDate: newUser.registrationDate.toISOString(),
        isFirstLoginCompleted: newUser.isFirstLoginCompleted,
        displayName: newUser.displayName,
      },
    };
  } catch (error) {
    // Prismaのエラーを処理
    console.error("=== createUserService Error ===");
    console.error("Error type:", error?.constructor?.name);
    console.error(
      "Error message:",
      error instanceof Error ? error.message : String(error)
    );
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack"
    );
    if (error && typeof error === "object") {
      console.error(
        "Error details:",
        JSON.stringify(error, Object.getOwnPropertyNames(error), 2)
      );
    }
    console.error("==============================");

    if (error instanceof Error) {
      // 既にエラーメッセージが設定されている場合はそのまま投げる
      if (error.message.includes("既に登録されています")) {
        throw error;
      }
      // UNIQUE制約違反の場合
      if (
        error.message.includes("Unique constraint") ||
        error.message.includes("Unique")
      ) {
        throw new Error("このメールアドレスは既に登録されています。");
      }
      // Prismaのフィールドエラー（存在しないフィールドなど）
      if (
        error.message.includes("Unknown argument") ||
        error.message.includes("Unknown field")
      ) {
        throw new Error(
          `データベーススキーマエラー: ${error.message}. Prismaクライアントを再生成してください。`
        );
      }
    }
    throw new Error(
      `ユーザーの作成に失敗しました: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

/**
 * 既存のユーザーを更新する
 * @param requestBody 更新するユーザーの詳細データ
 */
export async function updateUserService(
  requestBody: UpdateUserRequest
): Promise<UpdateUserSuccessResponse> {
  const {
    originalEmail,
    firstName,
    lastName,
    firstNameKana,
    lastNameKana,
    email,
    authority,
    status = DEFAULT_USER_STATUS,
  } = requestBody;

  // バリデーション
  if (!originalEmail) {
    throw new Error("Validation: 元のメールアドレスは必須です。");
  }
  if (!firstName || !lastName || !firstNameKana || !lastNameKana || !email) {
    throw new Error(
      "Validation: 姓、名、姓（フリガナ）、名（フリガナ）、メールアドレスは必須です。"
    );
  }

  // メールアドレスの形式チェック
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Validation: 無効なメールアドレス形式です。");
  }
  if (!emailRegex.test(originalEmail)) {
    throw new Error("Validation: 無効な元のメールアドレス形式です。");
  }

  // 権限の値チェック
  if (!VALID_AUTHORITIES.includes(authority)) {
    throw new Error("Validation: 無効な権限値です。");
  }

  // ステータスの値チェック
  if (!VALID_STATUSES.includes(status)) {
    throw new Error("Validation: 無効なステータス値です。");
  }

  try {
    // 元のメールアドレスでユーザーを検索
    const existingUser = await prisma.users.findUnique({
      where: {
        emailAddress: originalEmail,
      },
    });

    if (!existingUser) {
      throw new Error("ユーザーが見つかりません。");
    }

    // グローバル管理者が0人にならないかチェック
    // 既存のユーザーがglobalAdminで、新しい権限がglobalAdminでない場合
    if (existingUser.authority === "globalAdmin" && authority !== "globalAdmin") {
      // 他にglobalAdminがいるかどうかを確認
      const otherGlobalAdmins = await prisma.users.count({
        where: {
          authority: "globalAdmin",
          emailAddress: {
            not: originalEmail,
          },
        },
      });

      if (otherGlobalAdmins === 0) {
        throw new Error(
          "Validation: グローバル管理者は最低1人必要です。権限を変更する前に別のグローバル管理者を設定してください。"
        );
      }
    }

    // メールアドレスの重複チェック（自分自身を除く）
    if (email !== originalEmail) {
      const userWithSameEmail = await prisma.users.findUnique({
        where: {
          emailAddress: email,
        },
      });

      if (userWithSameEmail) {
        throw new Error("このメールアドレスは既に登録されています。");
      }
    }

    // ユーザーを更新
    const updatedUser = await prisma.users.update({
      where: {
        emailAddress: originalEmail,
      },
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        firstNameKana: firstNameKana.trim(),
        lastNameKana: lastNameKana.trim(),
        emailAddress: email.trim(),
        authority: authority,
        status: status,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        firstNameKana: true,
        lastNameKana: true,
        emailAddress: true,
        status: true,
        authority: true,
        registrationDate: true,
        isFirstLoginCompleted: true,
        displayName: true,
      },
    });

    return {
      message: "ユーザーの更新に成功しました。",
      user: {
        id: updatedUser.id.toString(),
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        firstNameKana: updatedUser.firstNameKana,
        lastNameKana: updatedUser.lastNameKana,
        emailAddress: updatedUser.emailAddress,
        status: updatedUser.status,
        authority: updatedUser.authority,
        registrationDate: updatedUser.registrationDate.toISOString(),
        isFirstLoginCompleted: updatedUser.isFirstLoginCompleted,
        displayName: updatedUser.displayName,
      },
    };
  } catch (error) {
    console.error("=== updateUserService Error ===");
    console.error("Error type:", error?.constructor?.name);
    console.error(
      "Error message:",
      error instanceof Error ? error.message : String(error)
    );
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack"
    );
    if (error && typeof error === "object") {
      console.error(
        "Error details:",
        JSON.stringify(error, Object.getOwnPropertyNames(error), 2)
      );
    }
    console.error("==============================");

    if (error instanceof Error) {
      // 既にエラーメッセージが設定されている場合はそのまま投げる
      if (
        error.message.includes("既に登録されています") ||
        error.message.includes("見つかりません") ||
        error.message.includes("グローバル管理者は最低1人必要です")
      ) {
        throw error;
      }
      // UNIQUE制約違反の場合
      if (
        error.message.includes("Unique constraint") ||
        error.message.includes("Unique")
      ) {
        throw new Error("このメールアドレスは既に登録されています。");
      }
      // Prismaのフィールドエラー（存在しないフィールドなど）
      if (
        error.message.includes("Unknown argument") ||
        error.message.includes("Unknown field")
      ) {
        throw new Error(
          `データベーススキーマエラー: ${error.message}. Prismaクライアントを再生成してください。`
        );
      }
    }
    throw new Error(
      `ユーザーの更新に失敗しました: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

/**
 * ユーザーとその関連データを全て削除する
 * @param requestBody 削除するユーザーのメールアドレス
 * @param loginUser ログインユーザー情報（権限チェック用）
 */
export async function deleteUserService(
  requestBody: DeleteUserRequest,
  loginUser: (TokenPayload & LoginUserCustom) | undefined
): Promise<DeleteUserSuccessResponse> {
  const { email } = requestBody;

  // バリデーション
  if (!email) {
    throw new Error("Validation: メールアドレスは必須です。");
  }

  // メールアドレスの形式チェック
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Validation: 無効なメールアドレス形式です。");
  }

  // ログインユーザーの権限チェック
  if (!loginUser) {
    throw new Error("Access denied: ユーザー情報が正しく取得できません。");
  }

  // 管理者権限チェック（globalAdminまたはserviceAdminのみ削除可能）
  const isAdmin =
    loginUser.authority === "globalAdmin" ||
    loginUser.authority === "serviceAdmin";

  if (!isAdmin) {
    throw new Error("Access denied: 管理者権限が必要です。");
  }

  try {
    // メールアドレスでユーザーを検索
    const existingUser = await prisma.users.findUnique({
      where: {
        emailAddress: email,
      },
      include: {
        userAuthentications: true,
      },
    });

    if (!existingUser) {
      throw new Error("ユーザーが見つかりません。");
    }

    // 削除対象ユーザーの権限チェック
    // 一般管理者（serviceAdmin）はグローバル管理者（globalAdmin）を削除できない
    if (
      loginUser.authority === "serviceAdmin" &&
      existingUser.authority === "globalAdmin"
    ) {
      throw new Error(
        "Access denied: 一般管理者はグローバル管理者を削除することはできません。"
      );
    }

    // 自分自身を削除しようとしている場合のチェック（オプション）
    if (existingUser.emailAddress === loginUser.email) {
      throw new Error("Access denied: 自分自身を削除することはできません。");
    }

    // グローバル管理者が0人にならないかチェック
    if (existingUser.authority === "globalAdmin") {
      // 他にglobalAdminがいるかどうかを確認
      const otherGlobalAdmins = await prisma.users.count({
        where: {
          authority: "globalAdmin",
          emailAddress: {
            not: email,
          },
        },
      });

      if (otherGlobalAdmins === 0) {
        throw new Error(
          "Validation: グローバル管理者は最低1人必要です。削除する前に別のグローバル管理者を設定してください。"
        );
      }
    }

    // トランザクションでユーザーと関連データを削除
    // PrismaのCASCADE設定により、関連データは自動的に削除されますが、
    // 明示的にトランザクションで処理することで安全性を確保します
    await prisma.$transaction(async (tx) => {
      const userId = existingUser.id;

      // 1. 認証情報を削除（CASCADEで自動削除されますが、明示的に削除）
      await tx.userAuthentications.deleteMany({
        where: {
          userId: userId,
        },
      });

      // 2. ユーザーを削除（これによりCASCADEで残りの関連データも削除される）
      await tx.users.delete({
        where: {
          id: userId,
        },
      });
    });

    return {
      message: "ユーザーとその関連データを削除しました。",
    };
  } catch (error) {
    console.error("=== deleteUserService Error ===");
    console.error("Error type:", error?.constructor?.name);
    console.error(
      "Error message:",
      error instanceof Error ? error.message : String(error)
    );
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack"
    );
    if (error && typeof error === "object") {
      console.error(
        "Error details:",
        JSON.stringify(error, Object.getOwnPropertyNames(error), 2)
      );
    }
    console.error("==============================");

    if (error instanceof Error) {
      // 既にエラーメッセージが設定されている場合はそのまま投げる
      if (
        error.message.includes("見つかりません") ||
        error.message.includes("グローバル管理者は最低1人必要です") ||
        error.message.includes("Access denied")
      ) {
        throw error;
      }
      // Prismaのフィールドエラー
      if (
        error.message.includes("Unknown argument") ||
        error.message.includes("Unknown field")
      ) {
        throw new Error(
          `データベーススキーマエラー: ${error.message}. Prismaクライアントを再生成してください。`
        );
      }
    }
    throw new Error(
      `ユーザーの削除に失敗しました: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

/**
 * 初回ログインを完了する
 * @param requestBody 表示名を含むリクエストボディ
 * @param loginUser ログインユーザー情報
 */
export async function completeFirstLoginService(
  requestBody: { 
    displayName: string;
    firstName?: string;
    lastName?: string;
    firstNameKana?: string;
    lastNameKana?: string;
  },
  loginUser: (TokenPayload & LoginUserCustom) | undefined
) {
  const { displayName, firstName, lastName, firstNameKana, lastNameKana } = requestBody;

  if (!loginUser) {
    throw new Error("Access denied: ユーザー情報が正しく取得できません。");
  }

  if (!displayName) {
    throw new Error("Validation: 表示名は必須です。");
  }

  if (displayName.length > 16) {
    throw new Error("Validation: 表示名は16文字以内で入力してください。");
  }

    // 表示名の重複チェック
    const existingUserWithDisplayName = await prisma.users.findFirst({
    where: {
      displayName: displayName,
    },
  });

  if (existingUserWithDisplayName) {
    throw new Error("Validation: その表示名は既に使用されています。");
  }

  try {
    // 更新データを構築（追加情報がある場合は含める）
    const updateData: {
      displayName: string;
      isFirstLoginCompleted: boolean;
      firstName?: string;
      lastName?: string;
      firstNameKana?: string;
      lastNameKana?: string;
    } = {
      displayName: displayName,
      isFirstLoginCompleted: true,
    };

    // 追加情報がある場合（publicサブドメインからのリクエスト）
    if (firstName !== undefined && firstName.trim()) {
      updateData.firstName = firstName.trim();
    }
    if (lastName !== undefined && lastName.trim()) {
      updateData.lastName = lastName.trim();
    }
    if (firstNameKana !== undefined) {
      updateData.firstNameKana = firstNameKana.trim();
    }
    if (lastNameKana !== undefined) {
      updateData.lastNameKana = lastNameKana.trim();
    }

    const updatedUser = await prisma.users.update({
      where: {
        id: BigInt(loginUser.userId),
      },
      data: updateData,
      select: {
        id: true,
        displayName: true,
        isFirstLoginCompleted: true,
      },
    });

    return {
      message: "初回ログイン設定が完了しました。",
      user: {
        id: updatedUser.id.toString(),
        displayName: updatedUser.displayName!,
        isFirstLoginCompleted: updatedUser.isFirstLoginCompleted,
      },
    };
  } catch (error) {
    console.error("=== completeFirstLoginService Error ===");
    console.error(error);
    throw new Error("初回ログイン設定の更新に失敗しました。");
  }
}

/**
 * 表示名を更新する
 * @param requestBody 表示名を含むリクエストボディ
 * @param loginUser ログインユーザー情報
 */
export async function updateDisplayNameService(
  requestBody: UpdateDisplayNameRequest,
  loginUser: (TokenPayload & LoginUserCustom) | undefined
): Promise<UpdateDisplayNameSuccessResponse> {
  const { displayName } = requestBody;

  if (!loginUser) {
    throw new Error("Access denied: ユーザー情報が正しく取得できません。");
  }

  if (!displayName || !displayName.trim()) {
    throw new Error("Validation: 表示名は必須です。");
  }

  const trimmedDisplayName = displayName.trim();

  if (trimmedDisplayName.length > 16) {
    throw new Error("Validation: 表示名は16文字以内で入力してください。");
  }

  try {
    // 現在のユーザー情報を取得
    const currentUser = await prisma.users.findUnique({
      where: {
        id: BigInt(loginUser.userId),
      },
      select: {
        id: true,
        displayName: true,
      },
    });

    if (!currentUser) {
      throw new Error("ユーザーが見つかりません。");
    }

    // 表示名が変更されていない場合はそのまま返す
    if (currentUser.displayName === trimmedDisplayName) {
      return {
        message: "表示名を更新しました。",
        user: {
          id: currentUser.id.toString(),
          displayName: trimmedDisplayName,
        },
      };
    }

    // 表示名の重複チェック（現在のユーザー自身を除外）
    const existingUserWithDisplayName = await prisma.users.findFirst({
      where: {
        displayName: trimmedDisplayName,
        id: {
          not: BigInt(loginUser.userId),
        },
      },
    });

    if (existingUserWithDisplayName) {
      throw new Error("Validation: その表示名は既に使用されています。");
    }

    // 表示名を更新
    const updatedUser = await prisma.users.update({
      where: {
        id: BigInt(loginUser.userId),
      },
      data: {
        displayName: trimmedDisplayName,
      },
      select: {
        id: true,
        displayName: true,
      },
    });

    return {
      message: "表示名を更新しました。",
      user: {
        id: updatedUser.id.toString(),
        displayName: updatedUser.displayName!,
      },
    };
  } catch (error) {
    console.error("=== updateDisplayNameService Error ===");
    console.error("Error type:", error?.constructor?.name);
    console.error(
      "Error message:",
      error instanceof Error ? error.message : String(error)
    );
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack"
    );
    console.error("==============================");

    if (error instanceof Error) {
      // 既にエラーメッセージが設定されている場合はそのまま投げる
      if (
        error.message.includes("既に使用されています") ||
        error.message.includes("見つかりません") ||
        error.message.includes("必須です") ||
        error.message.includes("16文字以内")
      ) {
        throw error;
      }
    }
    throw new Error(
      `表示名の更新に失敗しました: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

/**
 * ユーザー自身がプロフィール情報を更新する
 * @param requestBody プロフィール更新データ
 * @param loginUser ログインユーザー情報
 */
export async function updateProfileService(
  requestBody: UpdateProfileRequest,
  loginUser: (TokenPayload & LoginUserCustom) | undefined
): Promise<UpdateProfileSuccessResponse> {
  const { firstName, lastName, firstNameKana, lastNameKana, displayName } =
    requestBody;

  if (!loginUser) {
    throw new Error("Access denied: ユーザー情報が正しく取得できません。");
  }

  // バリデーション
  if (!firstName || !firstName.trim()) {
    throw new Error("Validation: 名は必須です。");
  }
  if (!lastName || !lastName.trim()) {
    throw new Error("Validation: 姓は必須です。");
  }
  if (!firstNameKana || !firstNameKana.trim()) {
    throw new Error("Validation: 名（フリガナ）は必須です。");
  }
  if (!lastNameKana || !lastNameKana.trim()) {
    throw new Error("Validation: 姓（フリガナ）は必須です。");
  }
  if (!displayName || !displayName.trim()) {
    throw new Error("Validation: 表示名は必須です。");
  }

  const trimmedDisplayName = displayName.trim();
  if (trimmedDisplayName.length > 16) {
    throw new Error("Validation: 表示名は16文字以内で入力してください。");
  }

  try {
    // 現在のユーザー情報を取得
    const currentUser = await prisma.users.findUnique({
      where: {
        id: BigInt(loginUser.userId),
      },
      select: {
        id: true,
        displayName: true,
      },
    });

    if (!currentUser) {
      throw new Error("ユーザーが見つかりません。");
    }

    // 表示名の重複チェック（現在のユーザー自身を除外）
    if (currentUser.displayName !== trimmedDisplayName) {
      const existingUserWithDisplayName = await prisma.users.findFirst({
        where: {
          displayName: trimmedDisplayName,
          id: {
            not: BigInt(loginUser.userId),
          },
        },
      });

      if (existingUserWithDisplayName) {
        throw new Error("Validation: その表示名は既に使用されています。");
      }
    }

    // プロフィールを更新
    const updatedUser = await prisma.users.update({
      where: {
        id: BigInt(loginUser.userId),
      },
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        firstNameKana: firstNameKana.trim(),
        lastNameKana: lastNameKana.trim(),
        displayName: trimmedDisplayName,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        firstNameKana: true,
        lastNameKana: true,
        displayName: true,
      },
    });

    return {
      message: "プロフィールを更新しました。",
      user: {
        id: updatedUser.id.toString(),
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        firstNameKana: updatedUser.firstNameKana,
        lastNameKana: updatedUser.lastNameKana,
        displayName: updatedUser.displayName!,
      },
    };
  } catch (error) {
    console.error("=== updateProfileService Error ===");
    console.error("Error type:", error?.constructor?.name);
    console.error(
      "Error message:",
      error instanceof Error ? error.message : String(error)
    );
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack"
    );
    console.error("==============================");

    if (error instanceof Error) {
      // 既にエラーメッセージが設定されている場合はそのまま投げる
      if (
        error.message.includes("既に使用されています") ||
        error.message.includes("見つかりません") ||
        error.message.includes("必須です") ||
        error.message.includes("16文字以内")
      ) {
        throw error;
      }
    }
    throw new Error(
      `プロフィールの更新に失敗しました: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

