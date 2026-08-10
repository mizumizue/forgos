# 01 — 営業時間・休業と予約枠の把握

**Feature:** shop-reservation

**PBI:** PBI-0002（`pbl/items/PBI-0002-shop-reservation.md`）

**作るもの:** 店舗スタッフが画面で営業時間・休業を確認／設定し、それを前提に日付・提供リソース単位の予約枠と定員を把握できる。休業日には受付可能な枠が出ない。

**Blocked by:** なし

**Status:** completed

**Triage:** ready-for-agent

- [x] 営業時間・休業の現状を画面で確認できる
- [x] 営業時間または休業日を設定でき、枠把握の前提として参照できる
- [x] 対象日・提供リソース単位で受付可能な時間帯と定員を画面で把握できる
- [x] 既存予約がある場合、枠上の占有として把握できる
- [x] 休業日を選んだ場合、受付可能な予約枠は表示されない（D1）

## Comments

- cut: 主要 UC `manage-business-hours` / `view-slots`。決め事 D1・D2（枠側）・D8（副次の空き前提）。
- implement: `product/packages/domain` + `product/apps/web`。単体 `pnpm test` 緑。
