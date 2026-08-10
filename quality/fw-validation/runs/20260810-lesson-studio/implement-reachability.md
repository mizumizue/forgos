# Implement reachability — 20260810-lesson-studio（overlay v3）

**Run:** `quality/fw-validation/runs/20260810-lesson-studio/`  
**正本:** `scope.md` §implementation manifest  
**検証日:** 2026-08-10  
**product:** `product/apps/web/src/App.tsx` + `product/packages/domain/src/lessonStudio.ts`（`createDemoStudioState`）

manifest `implement` 行 **14** 件すべてを UI 操作パスで証明する。`cold_start=Yes` は `createDemoStudioState()` 直後の画面で到達・表示できること。

## Manifest 到達証明

| Manifest ID | status | cold_start | 操作パス（役→表面→操作→結果） | 証拠（UI 手順） | シード根拠 |
|-------------|--------|------------|------------------------------|-----------------|------------|
| A-teacher | implement | Yes | 講師→ヘッダ「講師」タブ→S1/S2 ナビ→レッスン帳／振替キュー到達 | ①起動 ②「講師」タブ ③S1/S2 切替確認 | `createDemoStudioState()` + `App.tsx` actor-nav |
| A-parent | implement | Yes | 保護者（鈴木家）→ヘッダタブ→S3 マイ枠→在籍カード2件 | ①起動（既定タブ）②S3 表示 ③児童2名カード | `household-suzuki` enrollments `enr-hana`/`enr-sota` |
| A-student | implement | Yes | 受講生（中村涼）→ヘッダタブ→S3→本人枠1件 | ①「受講生（中村涼）」タブ ②S3 ③1カード | `household-nakamura` / `stu-ryo` |
| B-uc-view-enrollment | implement | Yes | 保護者→S3→在籍固定枠＋今週ステータス行を閲覧 | ①保護者タブ ②各 enrollment-card ③ステータス行 | `listParentEnrollments` seed mixed statuses |
| B-uc-report-absence | implement | Yes | 保護者→S3→「欠席を連絡する」→チャネル→送信→欠席連絡済 | ①鈴木はなカード ②CTA ③シート送信 | `stu-hana` `scheduled` + `canReportAbsence`（月曜17:00基準） |
| B-uc-request-makeup | implement | Yes | 保護者→S3→「振替を希望する」→チップ→申請 | ①鈴木颯太カード ②CTA ③申請 | `stu-sota` `abs-sota-tue` + `makeup_pending` |
| B-uc-process-makeup | implement | Yes | 講師→S2→申請カード確定→処理済み＋S3反映 | ①講師 S2 ②`req-sota-pending` ③確定 | `makeupRequests[req-sota-pending]` status `submitted` |
| B-uc-confirm-attendance | implement | Yes | 講師→S1→枠タップ→座席トグル→「レッスンを確定」 | ①S1 火曜枠 ②座席シート ③確定 | `occ-tue-0811` seats + `confirmLesson` |
| C-late-absence | implement | Yes | 講師→S2→期限後欠席ブロック→override 受理／却下 | ①S2 ②`late-absence-block` ③受理ダイアログ | `abs-hana-late-thu` `pending_teacher_review` |
| C-makeup-reject | implement | Yes | 講師→S2→申請カード「却下」→S3「振替不可」 | ①S2 pending card ②却下 ③保護者S3確認 | `rejectMakeup` on `req-sota-pending` |
| C-override-makeup | implement | Yes | 講師→S2→「override 受理」→理由→確定 | ①S2 card ②override ③確定 | `MakeupQueueSurface` override dialog |
| C-all-absent | implement | Yes | 講師→S1→全員欠席トグル→「レッスンを確定」 | ①S1 枠 ②全員欠席 ③確定 | `confirmLesson` present=0 → `cancelled_no_show` |
| D-runtime-duration | implement | Yes | 講師→S1→座席トグル→♩=バッジ 20/45/60 連動 | ①S1 火曜枠 ②トグル ③バッジ更新 | `deriveRuntimeMinutes` / `occ-tue-0811` seats |
| D-contact-channel | implement | Yes | 保護者→S3→欠席シート→WEB_FORM/LINE/電話選択 | ①欠席シート ②select ③3選択肢 | `ContactChannel` + absence sheet select |

## ジャーニー ID 操作手順（I7）

| ジャーニー | 手順（5ステップ以内） |
|------------|----------------------|
| J1 | ①保護者タブ ②S3「欠席を連絡する」 ③チャネル選択 ④送信 ⑤S3「欠席連絡済」 |
| J2 | ①保護者 S3「振替を希望する」 ②チップ選択 ③申請 ④講師 S2 確定 ⑤S3「振替確定」 |
| J3 | ①講師 S1 枠タップ ②座席トグル ③バッジ更新確認 ④「レッスンを確定」 ⑤ロック表示 |
| J4 | ①講師 S1「振替 N 件」リンク ②S2 該当カード ③処理 ④「レッスン帳で確認」 ⑤S1 振替先週 |

## 検証メモ

- 単体テスト: `product/packages/domain` vitest **15 passed**
- tier: 全 `implement` 行 **ui**
- `deferred` 6 行（D のシード固定境界）は UI 到達不要
- **DEMO_NOW:** `2026-08-10T17:00:00`（月曜・火曜枠の欠席期限前）
