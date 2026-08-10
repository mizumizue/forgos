# 01 — 保護者マイ枠（欠席連絡・振替希望）

**Feature:** lesson-studio-scheduling

**PBI:** PBI-0002（`pbl/items/PBI-0002-lesson-studio-scheduling.md`）

**Manifest:** A-parent, A-student, B-uc-view-enrollment, B-uc-report-absence, B-uc-request-makeup, D-contact-channel

**作るもの:** 保護者／受講生が S3 マイ枠で在籍枠を確認し、期限内欠席連絡（WF-1）と振替希望申出（WF-2 申請側）を画面完結できる。他生徒の氏名・出欠は表示しない。

**参照:** sector-brief OP-1/OP-2、actor-split S3、demo-seeded（初級A・石橋型期限）、design-call J1/J2、attention stack S3

**Blocked by:** なし

**Status:** completed

**Triage:** ready-for-agent

- [x] S3 に在籍固定枠カードと今週の回次ステータスが表示される（demo-seeded: 初級A火曜・3級準備土曜）（Manifest: B-uc-view-enrollment, A-parent, A-student）
- [x] 「欠席を連絡する」で WF-1 が完了しステータスが「欠席連絡済」になる（design-call J1）（Manifest: B-uc-report-absence, D-contact-channel）
- [x] 「振替を希望する」で同レベル空き枠チップを選び WF-2 申請が submitted になる（design-call J2）（Manifest: B-uc-request-makeup）
- [x] 保護者面に他受講生の氏名・出欠が出ない（actor-split・D11）（Manifest: B-uc-view-enrollment）
- [x] cold start でヘッダ「保護者（鈴木家）」タブから S3 に入り、鈴木家の在籍情報のみが見える（V-a-parent）（Manifest: A-parent, B-uc-view-enrollment）
- [x] cold start でヘッダ「受講生（中村涼）」タブから S3 に入り、本人の在籍枠のみが見える（V-a-student）（Manifest: A-student, B-uc-view-enrollment）
- [x] cold start で保護者 S3 に児童 2 名分の在籍固定枠カード（曜日・時刻・クラス名・レベル帯）が見える（V-s3-parent-enrollment）（Manifest: B-uc-view-enrollment）
- [x] cold start で受講生 S3 に「3級準備・土曜」の在籍固定枠カードが見える（V-s3-student-enrollment）（Manifest: B-uc-view-enrollment）
- [x] cold start で鈴木家児童の今週回次が「予定」1 行で見え、「欠席を連絡する」CTA が活性（V-s3-status-scheduled）（Manifest: B-uc-view-enrollment, B-uc-report-absence）
- [x] cold start で鈴木家児童の今週回次が「欠席連絡済・振替申請中」1 行で見え、「振替を希望する」CTA が活性（V-s3-status-absence-pending）（Manifest: B-uc-view-enrollment, B-uc-request-makeup）
- [x] cold start で中村涼の今週回次が「振替確定」＋新しい日時 1 行で見える（V-s3-status-makeup-done）（Manifest: B-uc-view-enrollment, B-uc-process-makeup）
- [x] cold start で欠席連絡シートに `WEB_FORM`／`LINE`／`PHONE` の連絡チャネル選択肢が見える（V-s3-contact-channel）（Manifest: D-contact-channel, B-uc-report-absence）
- [x] cold start で保護者 S3 の在籍枠に他生徒の氏名は出ず、空き席数のみ共有表示される（V-s3-privacy-empty-seat）（Manifest: B-uc-view-enrollment）
- [x] ドメイン単体テストが緑

## Comments

- 2026-08-10: Implement 完了。`product/apps/web` S3、`product/packages/domain` WF-1/WF-2。
