-- (1-2) user_authenticationsテーブルに登録
-- [注意] 以下の '1' の部分は、上記(1-1)で発行された users.id を指定してください。
INSERT INTO user_authentications (user_id, provider, provider_sub)
VALUES (1, 'google', '100000000000000000001');

-- (2-2) user_authenticationsテーブルに登録
-- [注意] 以下の '2' の部分は、上記(2-1)で発行された users.id を指定してください。
INSERT INTO user_authentications (user_id, provider, provider_sub)
VALUES (2, 'google', '100000000000000000002');

-- (3-2) user_authenticationsテーブルに登録
-- [注意] 以下の '3' の部分は、上記(3-1)で発行された users.id を指定してください。
INSERT INTO user_authentications (user_id, provider, provider_sub)
VALUES (3, 'apple', '001234.a1b2c3d4e5.6789');