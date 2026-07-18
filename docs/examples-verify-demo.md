# Verify デモ（taskboard）

`/verify` の練習用。範囲: `specs/L3/tasks/` と `examples/taskboard/`。

## 期待される空に近い結果（実装が仕様に沿う場合）

### Gap

- （なし）D1–D4 は domain / API テストと実装で満たされている

### Conform

- [ ] JWT ヘルパ（`auth.ts`）は決め事に無い — スコープ外の例示。プロダクト採用時は決め事を追加するか削除する
- [ ] Prisma schema は決め事に「PostgreSQL 必須」と書いていない — 永続化手段の先行例

### 次アクション

- Conform の JWT / Prisma を仕様に昇格するか、examples 限定と注記したまま残すか人間が判断する
