# Taskboard example

参考実装の縦スライス。コア規約（`specs/L1` 等）はスタック非依存；ここだけ Node/TS スタックを示す。

## スタック

| 項目 | 採用 |
|------|------|
| Web | React + Vite |
| API | Hono |
| Domain | `packages/domain`（純関数） |
| DB | Prisma schema（PostgreSQL）。単体は InMemory |
| 単体 | Vitest |
| E2E | Playwright |
| 認証 | 最小 JWT 例（`apps/api/src/auth.ts`） |
| IaC | Terraform（null provider の最小例） |

## 仕様紐づけ

- 決め事: `specs/L3/tasks/decisions/task-creation.md`（stable）
- PBI: `pbl/items/PBI-0001-create-task.md`

## セットアップ

```bash
cd examples/taskboard
pnpm install
pnpm test
pnpm typecheck
```

API / Web:

```bash
pnpm --filter @taskboard/api dev
pnpm --filter @taskboard/web dev
```

PostgreSQL（任意）:

```bash
docker compose up -d
cp .env.example .env
```

E2E:

```bash
pnpm --filter @taskboard/web test:e2e
```

Terraform validate:

```bash
terraform -chdir=infra init -backend=false
terraform -chdir=infra validate
```

## Audit デモ

`examples/taskboard/AUDIT-DEMO.md` を参照。
