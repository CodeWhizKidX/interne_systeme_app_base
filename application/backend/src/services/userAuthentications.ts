import { prisma } from "../lib/prisma";

/**
 * 認証情報 (provider と provider_sub) に紐づく
 * user_id と users テーブルの権限 (authority) を取得します。
 *
 * @param provider - 認証プロバイダ (例: 'google')
 * @param providerSub - プロバイダが発行した一意のID (sub)
 * @returns 存在するなら { userId: bigint, authority: string, isFirstLoginCompleted: boolean }, 存在しないなら null
 */
export async function getUserAuthInfo(
  provider: string,
  providerSub: string
): Promise<{
  userId: bigint;
  authority: string;
  isFirstLoginCompleted: boolean;
} | null> {
  if (!provider || !providerSub) {
    return null;
  }

  try {
    const authentication = await prisma.userAuthentications.findUnique({
      where: {
        // DDLの UNIQUE (provider, provider_sub) に基づく
        // Prismaの複合キー名 (スネークケースと仮定)
        provider_providerSub: {
          provider: provider,
          providerSub: providerSub,
        },
      },
      select: {
        userId: true, // (A) user_authentications から user_id を取得
        users: {
          // (B) 関連する users テーブルを取得
          select: {
            authority: true, // (C) users テーブルから authority を取得
            isFirstLoginCompleted: true,
          },
        },
      },
    });

    // 認証情報が存在し、かつ関連するユーザー情報も存在する場合
    if (authentication && authentication.users) {
      return {
        userId: authentication.userId,
        authority: authentication.users.authority,
        isFirstLoginCompleted: authentication.users.isFirstLoginCompleted,
      };
    }

    // 該当データが見つからない場合
    return null;
  } catch (error) {
    console.error("認証・権限情報の検索中にエラーが発生しました:", error);
    return null;
  }
}

// --- 使い方 (呼び出し側の例) ---

/*
async function someExternalService() {
  const provider = "google";
  const sub = "google-sub-123456789";

  const authInfo = await getUserAuthInfo(provider, sub);

  if (authInfo) {
    console.log(`User ID: ${authInfo.userId}`);       // BigInt
    console.log(`Authority: ${authInfo.authority}`); // 'admin' や 'user'
  } else {
    console.log("該当するユーザーは見つかりませんでした。");
  }
}
*/
