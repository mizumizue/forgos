# Implement reachability — 20260810-lesson-studio

**Run:** `quality/fw-validation/runs/20260810-lesson-studio/`  
**正本:** `scope.md` §implementation manifest  
**検証日:** 2026-08-10  
**product:** `product/apps/web/src/App.tsx`（actor タブ + S1/S2/S3）

manifest `implement` 行 **14** 件すべてを UI 操作パスで証明する。

## Manifest 到達証明

| Manifest ID | status | 操作パス（役→表面→操作→結果） | 証拠（UI: ファイル・手順） |
|-------------|--------|------------------------------|---------------------------|
| A-teacher | implement | 講師→ヘッダ「講師」タブ→S1/S2 ナビ表示→レッスン帳／振替キュー到達 | `App.tsx` actor-nav「講師」、`surface-nav` S1/S2 |
| A-parent | implement | 保護者（鈴木家）→ヘッダ「保護者（鈴木家）」タブ→S3 マイ枠表示→在籍カード2件 | `App.tsx` actor-nav「保護者（鈴木家）」、`ParentSurface` |
| A-student | implement | 受講生（中村涼）→ヘッダ「受講生（中村涼）」タブ→S3 マイ枠表示→本人枠1件 | `App.tsx` actor-nav「受講生（中村涼）」、`listParentEnrollments(household-nakamura)` |
| B-uc-view-enrollment | implement | 保護者→S3→在籍固定枠カード＋今週ステータス行を閲覧 | `ParentSurface` enrollment-cards, session-status |
| B-uc-report-absence | implement | 保護者→S3→「欠席を連絡する」→チャネル選択→送信→「欠席連絡済」 | `ParentSurface` primary CTA, absence sheet, `reportAbsence` |
| B-uc-request-makeup | implement | 保護者→S3→「振替を希望する」→空き枠チップ選択→申請→「振替申請中」 | `ParentSurface` makeup sheet, `requestMakeup` |
| B-uc-process-makeup | implement | 講師→S2→申請カード「この枠で確定」→確認→処理済み＋保護者 S3「振替確定」 | `MakeupQueueSurface` confirm-dialog, `approveMakeup` |
| B-uc-confirm-attendance | implement | 講師→S1→枠カードタップ→座席トグル→「レッスンを確定」→ロック | `TeacherLedger` seat-sheet, `confirmLesson` |
| C-late-absence | implement | 講師→S2→「期限後欠席」ブロック→override 受理→理由入力→受理 | `MakeupQueueSurface` late-absence-block, `reviewLateAbsence` |
| C-makeup-reject | implement | 講師→S2→申請カード「却下」→保護者 S3「振替不可」 | `MakeupQueueSurface` onReject, `rejectMakeup` |
| C-override-makeup | implement | 講師→S2→申請カード「override 受理」→理由入力→override 確定 | `MakeupQueueSurface` override dialog, `approveMakeup(overrideReason)` |
| C-all-absent | implement | 講師→S1→全員欠席トグル→「レッスンを確定」→cancelled_no_show 記録 | `TeacherLedger` att-toggle absent×N, `confirmLesson` present=0 |
| D-runtime-duration | implement | 講師→S1→座席出席トグル変更→♩=バッジが20/45/60に連動更新 | `TeacherLedger` duration-badge, `deriveRuntimeMinutes` |
| D-contact-channel | implement | 保護者→S3→欠席シート→連絡チャネル select（WEB_FORM/LINE/電話）→送信記録 | `ParentSurface` absence sheet select, `reportAbsence(channel)` |

## ジャーニー ID 操作手順（I7）

| ジャーニー | 手順（5ステップ以内） |
|------------|----------------------|
| J1 | ①保護者タブ ②S3「欠席を連絡する」 ③チャネル選択 ④送信 ⑤S3「欠席連絡済」 |
| J2 | ①保護者 S3「振替を希望する」 ②チップ選択 ③申請 ④講師 S2 確定 ⑤S3「振替確定」 |
| J3 | ①講師 S1 枠タップ ②座席トグル ③バッジ更新確認 ④「レッスンを確定」 ⑤ロック表示 |
| J4 | ①講師 S1「振替 N 件」リンク ②S2 該当カード ③処理 ④「レッスン帳で確認」 ⑤S1 振替先週 |

## 検証メモ

- 単体テスト: `product/packages/domain` vitest **14 passed**
- tier: 全 `implement` 行 **ui**（PBI 対応表と一致）
- `deferred` 6 行（D のシード固定境界）は UI 到達不要
