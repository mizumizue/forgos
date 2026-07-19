# bootstrap-product リファレンス

## Default example

- 正本: `examples/README.md` が指す default。未記載かつ1本だけならそのディレクトリ。
- 現行: `examples/taskboard`（React / Hono / Vitest / Playwright / Prisma schema / Terraform 最小）

## 展開マップ

ソース: `examples/<default>/` → 宛先: `product/`

| ソース | 宛先 |
|--------|------|
| `apps/` | `product/apps/` |
| `packages/` | `product/packages/` |
| `infra/` | `product/infra/` |
| `package.json`, `pnpm-workspace.yaml`, `pnpm-lock.yaml`, `tsconfig*.json`, `.npmrc`, `.env.example`, `docker-compose.yml` 等のモノレポ根 | `product/` 直下 |
| （なし） | `product/sandbox/` は既存のまま残す |

コピー後、ソース側の README で「example / taskboard / 参考実装」と書いている文言はプロダクト向けに直すか削除する。

## 削除リスト

セットアップ完了時に存在してはならないもの:

- `examples/`（ディレクトリ全体）
- `specs/L3/tasks/`（デモドメイン）
- `pbl/epics/EPIC-0001-taskboard.md`
- `pbl/items/PBI-0001-create-task.md`
- `docs/examples-verify-demo.md`
- `.github/workflows/examples-taskboard.yml`（または `product/` 向けに書き換え）

残す:

- `specs/L1/`
- `specs/L2/`
- `specs/L3/_template/`
- `specs/L3/infrastructure/`（プレースホルダ）
- `docs/modes.md` 等の工程ガイド
- `.cursor/skills/`（本スキル含む）
- `product/sandbox/`

## 検索チェック（剥がし確認）

`product/` とルート案内から、次が残っていないこと:

- `taskboard`（パッケージ名・パス・文言）
- `@taskboard/`
- `examples/taskboard`
- デモ決め事パス `specs/L3/tasks/`

許容: `adr/` や本スキル内の「かつて example だった」という経緯記述。
