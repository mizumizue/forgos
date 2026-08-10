# Solo salon reservation（デモ版）

1人運営の個人美容室向け予約デモ。L3 `specs/L3/reservations/`（draft）に紐づく。

- `packages/domain` — メニュー所要・空き枠・状態遷移の公開 IF（単体テスト）
- `apps/web` — 来店客の申込面／店主の本日台帳面／店設定面（surface ≤3）

```bash
cd product
npx pnpm@9.15.0 install
npx pnpm@9.15.0 test
npx pnpm@9.15.0 --filter @solo-salon/web dev
```
