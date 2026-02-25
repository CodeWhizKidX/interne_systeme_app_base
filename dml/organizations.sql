-- ============================================
-- organizations テーブル サンプルデータ
-- ============================================

-- UZUZ法人データ
INSERT INTO organizations (
    name,
    subdomain,
    plan_id,
    subscription_status,
    trial_ends_at,
    subscription_started_at,
    subscription_ends_at,
    max_users,
    max_shared_prompts,
    custom_features,
    contact_email,
    contact_phone,
    notes
) VALUES (
    'UZUZ',                                          -- 法人名
    'uzuz',                                          -- サブドメイン（uzuz.app.com）
    (SELECT id FROM plans WHERE code = 'standard'),  -- Standardプラン
    'active',                                        -- 契約ステータス: 有効
    NULL,                                            -- トライアル終了日（トライアル済みのためNULL）
    '2025-01-01 00:00:00+09',                       -- 契約開始日
    NULL,                                            -- 契約終了日（無期限契約）
    NULL,                                            -- 最大ユーザー数（プランのデフォルト: 150名）
    NULL,                                            -- 共有プロンプト上限（プランのデフォルト: 無制限）
    NULL,                                            -- カスタム機能（プランのデフォルトを使用）
    'admin@uzuz.jp',                                 -- 連絡先メールアドレス
    '03-1234-5678',                                  -- 連絡先電話番号
    'UZUZ株式会社 - 2025年1月より利用開始'            -- 備考
);

-- ============================================
-- 確認用クエリ
-- ============================================
-- SELECT 
--     o.id,
--     o.name,
--     o.subdomain,
--     p.name AS plan_name,
--     o.subscription_status,
--     o.subscription_started_at,
--     o.contact_email
-- FROM organizations o
-- LEFT JOIN plans p ON o.plan_id = p.id;



-- Freeプラン用データ
INSERT INTO organizations (
    name,
    subdomain,
    plan_id,
    subscription_status,
    trial_ends_at,
    subscription_started_at,
    subscription_ends_at,
    max_users,
    max_shared_prompts,
    custom_features,
    contact_email,
    contact_phone,
    notes
) VALUES (
    'public',                                          -- 法人名
    'public',                                          -- サブドメイン
    (SELECT id FROM plans WHERE code = 'free'),  
    'active',                                        -- 契約ステータス: 有効
    NULL,                                            -- トライアル終了日（トライアル済みのためNULL）
    '2025-01-01 00:00:00+09',                       -- 契約開始日
    NULL,                                            -- 契約終了日（無期限契約）
    NULL,                                            -- 最大ユーザー数（プランのデフォルト: 150名）
    NULL,                                            -- 共有プロンプト上限（プランのデフォルト: 無制限）
    NULL,                                            -- カスタム機能（プランのデフォルトを使用）
    'sample@sample.jp',                                 -- 連絡先メールアドレス
    'XXXXX',                                  -- 連絡先電話番号
    '共通利用用'            -- 備考
);

