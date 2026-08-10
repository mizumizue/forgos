# 02 — 講師レッスン帳・振替キュー

**Feature:** lesson-studio-scheduling

**PBI:** PBI-0002（`pbl/items/PBI-0002-lesson-studio-scheduling.md`）

**作るもの:** 講師が S1 週ストリップで座席リング・人数連動実施時間バッジを操作し出欠確定（WF-3）でき、S2 振替キューで申請を残時間昇順に処理・確定できる。S1 に振替確定ボタンは置かない。

**参照:** sector-brief OP-1/OP-4、actor-split S1/S2、demo-seeded（座席リング・20/45/60分）、design-call G1–G5・J3/J4、attention stack S1/S2

**Blocked by:** lesson-studio-scheduling-01-parent-enrollment

**Status:** completed

**Triage:** ready-for-agent

- [x] S1 週ストリップに今日の縦帯・座席リング・実施時間バッジ（G1–G3）が表示される
- [x] 座席トグルで人数連動時間が更新され「レッスンを確定」で WF-3 がロックされる（design-call J3）
- [x] S2 で期限切れ間近バッジ付き申請を残時間昇順表示し、同レベル空き枠チップで確定できる（design-call J2/J4）
- [x] ウォームスタジオパレット・規約インラインラベル（G4–G5）が適用される
- [x] ドメイン単体テストが緑

## Comments

- 2026-08-10: Implement 完了。`product/apps/web` S1/S2、`product/packages/domain` WF-3。
