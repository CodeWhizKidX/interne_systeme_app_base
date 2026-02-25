// 契約情報関連の型定義

/**
 * 契約情報のレスポンス型
 */
export interface SubscriptionInfo {
  /** 契約タイプ: 'individual'（個人）または 'corporate'（法人） */
  type: "individual" | "corporate";

  /** プランコード（例: 'free', 'basic', 'premium', 'corporate_standard'） */
  planCode: string;

  /** プラン名（例: 'フリープラン', 'ベーシックプラン'） */
  planName: string;

  /** 契約ステータス: 'trial', 'active', 'past_due', 'cancelled' */
  status: string;

  /** プランの機能設定（JSON） */
  features: Record<string, unknown>;

  /** 最大ユーザー数（法人のみ。-1 または null は無制限） */
  maxUsers: number | null;

  /** 共有プロンプト作成上限数（-1 または null は無制限） */
  maxSharedPrompts: number | null;

  /** 次回請求日（個人契約のみ） */
  nextBillingDate?: string;

  /** 解約予約中かどうか */
  isCancelScheduled: boolean;

  /** 法人名（法人契約の場合） */
  organizationName?: string;
}

