# 02 — 空き確認から申込・店舗確定・ステータス追跡

**Feature:** shop-reservation

**PBI:** PBI-0002（`pbl/items/PBI-0002-shop-reservation.md`）

**作るもの:** 利用者が日時・人数・提供リソースの空きを確認して申し込み、店舗スタッフが確定／却下／保留し、一覧・詳細で受付 → 確定 → 来店／完了／キャンセルを追える。キャンセル後は当該枠の空きが復帰する。申込時点では確定扱いにしない。

**Blocked by:** shop-reservation-01-hours-and-slots.md

**Status:** completed

**Triage:** ready-for-agent

- [x] 日時・人数・提供リソースを指定して空き可否が分かる（空き無し／定員超過では申込へ進めない）
- [x] 空きのある枠に氏名・連絡先など最小顧客情報で申し込め、予約は受付状態になる
- [x] 申込時点で定員超過・枠消失・顧客情報不足なら受け付けない
- [x] 店舗スタッフが受付中の申込を開き、確定／却下／保留できる（操作不能状態には適用しない）
- [x] 予約一覧・詳細で日時・人数・顧客・割当リソース・予約ステータスを確認できる
- [x] 来店／完了／キャンセルへ遷移でき、一覧と詳細の表示が一致する
- [x] キャンセル後、当該予約が占めていた枠の空きが再利用できる

## Comments

- cut: 主要 UC `check-availability` / `apply-reservation` / `shop-confirm-reservation` / `track-reservation-status`。決め事 D2（定員）・D3–D9。公開境界の主経路。
- implement: `product/packages/domain` + `product/apps/web`。単体 `pnpm test` 緑。
