# 01 — 保護者マイ枠（欠席連絡・振替希望）

**Feature:** lesson-studio-scheduling

**PBI:** PBI-0002（`pbl/items/PBI-0002-lesson-studio-scheduling.md`）

**作るもの:** 保護者／受講生が S3 マイ枠で在籍枠を確認し、期限内欠席連絡（WF-1）と振替希望申出（WF-2 申請側）を画面完結できる。他生徒の氏名・出欠は表示しない。

**参照:** sector-brief OP-1/OP-2、actor-split S3、demo-seeded（初級A・石橋型期限）、design-call J1/J2、attention stack S3

**Blocked by:** なし

**Status:** completed

**Triage:** ready-for-agent

- [x] S3 に在籍固定枠カードと今週の回次ステータスが表示される（demo-seeded: 初級A火曜・3級準備土曜）
- [x] 「欠席を連絡する」で WF-1 が完了しステータスが「欠席連絡済」になる（design-call J1）
- [x] 「振替を希望する」で同レベル空き枠チップを選び WF-2 申請が submitted になる（design-call J2）
- [x] 保護者面に他受講生の氏名・出欠が出ない（actor-split・D11）
- [x] ドメイン単体テストが緑

## Comments

- 2026-08-10: Implement 完了。`product/apps/web` S3、`product/packages/domain` WF-1/WF-2。
