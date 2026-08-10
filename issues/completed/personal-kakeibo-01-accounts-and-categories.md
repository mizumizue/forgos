# 01 — 口座・カテゴリを画面から用意する

**Feature:** personal-kakeibo

**PBI:** PBI-0002（`pbl/items/PBI-0002-accounts-and-categories.md`）

**作るもの:** 個人利用者が画面から口座とカテゴリを登録でき、取引の土台として使える。空名称は拒否される。

**Blocked by:** なし

**Status:** completed

**Triage:** ready-for-agent

- [x] 名称付き口座を画面から登録できる
- [x] 空（前後空白のみ含む）名称の口座登録は拒否され、利用者に分かる
- [x] 名称と収入／支出の向き付きカテゴリを画面から登録できる
- [x] 空名称のカテゴリ登録は拒否される
- [x] 登録済み口座・カテゴリのみを取引の土台として参照できる（未登録紐づけは拒否）
- [x] 口座・カテゴリ操作へ同一アプリ内から辿れる（D15 の当該部分）

## Comments

- cut: EPIC-0002 / PBI-0002 から切出し。決め事 D1–D3、UC1。
- implement: `product/apps/kakeibo`（ドメイン＋画面）。単体 `npm test` 緑。
