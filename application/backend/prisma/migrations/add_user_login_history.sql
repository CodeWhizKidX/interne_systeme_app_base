-- ログイン履歴テーブルの作成
CREATE TABLE IF NOT EXISTS user_login_history (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    login_at TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),
    CONSTRAINT fk_user_login_history_user_id 
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE 
        ON UPDATE NO ACTION
);

-- インデックスの作成
CREATE INDEX IF NOT EXISTS idx_user_login_history_user_id 
    ON user_login_history(user_id);

CREATE INDEX IF NOT EXISTS idx_user_login_history_login_at 
    ON user_login_history(login_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_login_history_user_login_at 
    ON user_login_history(user_id, login_at DESC);

-- usersテーブルにlastLoginAtカラムを追加
ALTER TABLE users 
    ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ(6);

-- lastLoginAt用のインデックス（オプション：最終ログイン日時でソートする場合に有効）
CREATE INDEX IF NOT EXISTS idx_users_last_login_at 
    ON users(last_login_at DESC);

-- コメントの追加（テーブル説明）
COMMENT ON TABLE user_login_history IS 'ユーザーのログイン履歴を記録するテーブル';
COMMENT ON COLUMN user_login_history.id IS 'ログイン履歴ID（主キー）';
COMMENT ON COLUMN user_login_history.user_id IS 'ユーザーID（外部キー：users.id）';
COMMENT ON COLUMN user_login_history.login_at IS 'ログイン日時';
COMMENT ON COLUMN user_login_history.ip_address IS 'ログイン時のIPアドレス（IPv4/IPv6対応）';
COMMENT ON COLUMN user_login_history.user_agent IS 'ログイン時のユーザーエージェント（ブラウザ情報）';
COMMENT ON COLUMN users.last_login_at IS '最終ログイン日時';

