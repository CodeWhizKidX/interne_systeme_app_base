-- ============================================
-- plans テーブル マスタデータ
-- ============================================
-- 料金は全て税抜価格
-- max_users, max_shared_prompts: -1 は無制限を意味する
-- ============================================

-- 既存データを削除（必要に応じてコメントアウト）
-- TRUNCATE TABLE plans RESTART IDENTITY CASCADE;

INSERT INTO plans (
    code,
    name,
    description,
    plan_type,
    monthly_price,
    annual_price,
    max_users,
    max_shared_prompts,
    features,
    display_order,
    is_active
) VALUES

-- ============================================
-- Starter（スターター）- 小規模チーム向け
-- ============================================
(
    'starter',
    'Starter（スターター）',
    '小規模チーム向け',
    'corporate',
    19800,          -- ¥19,800/月（税抜）
    NULL,           -- 年額は別途設定
    10,             -- 最大10名
    50,             -- 共有プロンプト: 50個まで
    '{
        "folder_permission": false,
        "sso_google": false,
        "sso_saml": false,
        "ai_prompt_generation": 0,
        "operation_log": false,
        "admin_role_detail": false,
        "security_guarantee": false,
        "dedicated_support": false,
        "custom_development": false,
        "support_level": "standard"
    }'::jsonb,
    1,
    TRUE
),

-- ============================================
-- Standard（スタンダード）- 中規模チーム向け
-- ============================================
(
    'standard',
    'Standard（スタンダード）',
    '中規模チーム向け',
    'corporate',
    39800,          -- ¥39,800/月（税抜）
    NULL,           -- 年額は別途設定
    150,            -- 最大150名
    -1,             -- 共有プロンプト: 無制限
    '{
        "folder_permission": true,
        "sso_google": true,
        "sso_saml": false,
        "ai_prompt_generation": 0,
        "operation_log": false,
        "admin_role_detail": false,
        "security_guarantee": false,
        "dedicated_support": false,
        "custom_development": false,
        "support_level": "priority"
    }'::jsonb,
    2,
    TRUE
),

-- ============================================
-- Business（ビジネス）- 大規模組織向け【おすすめ】
-- ============================================
(
    'business',
    'Business（ビジネス）',
    '大規模組織向け',
    'corporate',
    98000,          -- ¥98,000/月（税抜）
    NULL,           -- 年額は別途設定
    500,            -- 最大500名
    -1,             -- 共有プロンプト: 無制限
    '{
        "folder_permission": true,
        "sso_google": true,
        "sso_saml": true,
        "ai_prompt_generation": 1500,
        "operation_log": true,
        "admin_role_detail": true,
        "security_guarantee": false,
        "dedicated_support": false,
        "custom_development": false,
        "support_level": "priority",
        "is_recommended": true
    }'::jsonb,
    3,
    TRUE
),

-- ============================================
-- Enterprise（エンタープライズ）- 全社導入向け
-- ============================================
(
    'enterprise',
    'Enterprise（エンタープライズ）',
    '全社導入向け',
    'corporate',
    NULL,           -- 別途見積
    NULL,           -- 別途見積
    -1,             -- ユーザー数: 無制限（500名〜）
    -1,             -- 共有プロンプト: 無制限
    '{
        "folder_permission": true,
        "sso_google": true,
        "sso_saml": true,
        "ai_prompt_generation": -1,
        "operation_log": true,
        "admin_role_detail": true,
        "security_guarantee": true,
        "dedicated_support": true,
        "custom_development": true,
        "support_level": "dedicated",
        "min_users": 500
    }'::jsonb,
    4,
    TRUE
);

-- ============================================
-- 確認用クエリ
-- ============================================
-- SELECT 
--     code,
--     name,
--     monthly_price,
--     max_users,
--     max_shared_prompts,
--     features
-- FROM plans
-- ORDER BY display_order;

