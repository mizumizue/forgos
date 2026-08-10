# Product — 店舗予約管理（デモ版）

L3 `reservations` に紐づく正式プロダクトのデモ版。

## Quickstart

```bash
cd product
pnpm install
pnpm test
pnpm --filter @shop-reservation/web dev
```

- 単体: `@shop-reservation/domain`（Vitest）
- 画面: `@shop-reservation/web`（Vite + React、ドメインを直接利用）
