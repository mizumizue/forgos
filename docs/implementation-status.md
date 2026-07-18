---
status: in-progress
updated: 2026-07-19
head: c05ebdd
---

# 実装状況

新 Workspace で続きを行うときの入口。詳細仕様・スキル本文はここに複製しない。

## リポ状態

- 名称: **ForgOS**（slug: `forgos`）
- リモート: https://github.com/mizumizue/forgos （private）
- ブランチ: `main`
- 由来草案: 隣接 `my-skills/idea/2026-07-19-ai-dev-framework-draft.md`（Grill 合意 2026-07-19）
- レイアウト: `product/{apps,infra,sandbox}`（ADR 0002、L1 0.1.1）
- 命名: ADR 0003

## 段階進捗（草案 §13）

| 段階 | 状態 | 入口 |
|------|------|------|
| 1 憲法 | 完了 | `specs/L1/`（0.1.1）, `docs/`, `docs/templates/` |
| 2 OS | 完了 | `.cursor/skills/modes/`, `.cursor/rules/`, `/tdd` |
| 3 Template | 完了 | `product/apps/`, `product/infra/`, `product/sandbox/`, `input/` |
| 4 Examples | 完了（縦スライス最小） | `examples/taskboard/` |
| 5 配布 | 未着手 | README「配布について」 |

## 検証（2026-07-19）

- `cd examples/taskboard && pnpm test` — domain 3 + api 6 = 9 green
- `pnpm typecheck` — OK
- `terraform -chdir=product/infra validate` — OK（レイアウト変更後）

## 既知ギャップ（続きの候補）

1. Prisma: schema あり、実行は `InMemoryTaskRepository`（`docs/examples-verify-demo.md`）
2. JWT: `examples/taskboard/apps/api/src/auth.ts` は単体テストあり、HTTP 未配線
3. infra 先出し検証（policy / 契約テスト）は文書レベル
4. versioned 配布（Stage 5）

## デモ紐づけ

- 決め事: `specs/L3/tasks/decisions/task-creation.md`（stable）
- PBI: `pbl/items/PBI-0001-create-task.md`（status: review）
- Verify 例: `docs/examples-verify-demo.md`

## 次セッションの進め方

1. モードを選ぶ（通常は `/build` または `/verify`）
2. `AGENTS.md` / `CONTEXT.md` / `specs/L1/constitution.md` を読む
3. 上記ギャップからスコープを切る
