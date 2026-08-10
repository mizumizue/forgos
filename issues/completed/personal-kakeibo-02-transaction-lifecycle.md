# 02 — 取引を下書き登録し確定・取消する

**Feature:** personal-kakeibo

**PBI:** PBI-0003（`pbl/items/PBI-0003-transaction-lifecycle.md`）

**作るもの:** 個人利用者が画面で取引を下書き登録し、確定して実績に含め、必要なら取消できる。状態は画面上で区別できる。

**Blocked by:** personal-kakeibo-01-accounts-and-categories.md

**Status:** completed

**Triage:** ready-for-agent

- [x] 収入／支出・正の金額・発生日・口座・カテゴリで下書き登録できる
- [x] 必須不足・金額不正・口座／カテゴリ不一致（向き不一致含む）は拒否される
- [x] 下書き→確定、下書き→取消、確定→取消のみ可能（禁止遷移はできない）
- [x] 確定のみが家計実績・予算消化の対象になり、下書き・取消は対象外
- [x] 画面で下書き登録・確定・取消ができ、状態が区別できる
- [x] 取引一覧で日付・カテゴリ・口座・金額が分かり、収入と支出に視覚差がある（D14 の当該部分）

## Comments

- cut: EPIC-0002 / PBI-0003 から切出し。決め事 D4–D7、UC2。01 完了後に着手。
- implement: `product/apps/kakeibo`。ライフサイクルと一覧の収支視覚差を実装。単体緑。
